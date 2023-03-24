import { useReducer } from "react";

export type State = { count: number };

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const INCREMENT_IF_ODD = "INCREMENT_IF_ODD";
const BUMP = "BUMP";
const RESET = "RESET";

type Action = Readonly<
  | {
      type: typeof INCREMENT;
    }
  | {
      type: typeof DECREMENT;
    }
  | {
      type: typeof INCREMENT_IF_ODD;
    }
  | {
      type: typeof BUMP;
      n: number;
    }
  | {
      type: typeof RESET;
    }
>;

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

export const isAvailable = (_state: State) => true;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };

    case DECREMENT:
      return { ...state, count: state.count - 1 };

    case INCREMENT_IF_ODD:
      return isOddCount(state) ? { ...state, count: state.count + 1 } : state;

    case BUMP:
      return { ...state, count: state.count + action.n };

    case RESET:
      return { ...state, count: 0 };
  }
};

const slowAsyncFunction = () =>
  new Promise<void>(resolve => setTimeout(resolve, 3000));

interface Actions {
  increment(): void;
  incrementIfOdd(): void;
  decrement(): void;
  bump(n: number): void;
  resetAsync(): void;
}

const initialState: State = {
  count: 0
};

export function useCountState(): [State, Actions] {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    increment: () => dispatch({ type: INCREMENT }),
    incrementIfOdd: () => dispatch({ type: INCREMENT_IF_ODD }),
    decrement: () => dispatch({ type: DECREMENT }),
    bump: (n: number) => dispatch({ type: BUMP, n }),
    resetAsync: () => {
      slowAsyncFunction().then(() => dispatch({ type: RESET }));
    }
  };

  return [state, actions];
}
