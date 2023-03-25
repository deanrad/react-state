import { useMemo, useState } from "react";

type Availability = "available" | "busy";

export type State = { availability: Availability; count: number };

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

export const isAvailable = (state: State) => true; //state.availability === "available";

const initialState: State = {
  availability: "available",
  count: 0
};

const slowAsyncFunction = () =>
  new Promise(resolve => setTimeout(resolve, 3000));

export interface Actions {
  increment(): void;
  incrementIfOdd(): void;
  decrement(): void;
  bump(n: number): void;
  resetAsync(): void;
}


const dispatch = (state: State, action: string): State => {
  switch (state.availability) {
    case "available":
      switch (action) {
        case "increment":
          return { ...state, count: state.count + 1 };

        case "decrement":
          return { ...state, count: state.count - 1 };

        case "incrementIfOdd":
          return isOddCount(state)
            ? { ...state, count: state.count + 1 }
            : state;

        case "bump":
          return { ...state, count: state.count + 5 };

        case "reset":
          return { ...state, availability: "busy" };

        default:
          console.warn("Unknown action for available state.");
          return state;
      }

    case "busy":
      switch (action) {
        case "complete":
          return { ...state, availability: "available", count: 0 };

        default:
          console.warn("Unknown action for busy state.");
          return state;
      }

    default:
      console.error("Invalid state.");
      return state;
  }
};
const _dispatch = (state: string, action: string): string => {
  switch (state) {
    case "available":
      switch (action) {
        case "increment":
        case "decrement":
        case "incrementIfOdd":
        case "bump":
          return state;

        case "reset":
          return "busy";

        default:
          console.warn("Unknown action for available state.");
          return state;
      }

    case "busy":
      switch (action) {
        case "complete":
          return "available";

        default:
          console.warn("Unknown action for busy state.");
          return state;
      }

    default:
      console.error("Invalid state.");
      return state;
  }
};

export const useCountState = (): [State, Actions] => {
  const [countState, setCountState] = useState(initialState);

  const actions = useMemo(
    () => ({
      increment: () => setCountState(state => dispatch(state, "increment")),
      incrementIfOdd: () =>
        setCountState(state => dispatch(state, "incrementIfOdd")),
      decrement: () => setCountState(state => dispatch(state, "decrement")),
      bump: (_n: number) => setCountState(state => dispatch(state, "bump")),
      resetAsync: () => {
        setCountState(state => dispatch(state, "reset"));
        slowAsyncFunction().then(() =>
          setCountState(state => dispatch(state, "complete"))
        );
      }
    }),
    []
  );

  return [countState, actions];
};
