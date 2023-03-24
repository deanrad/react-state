import { useMemo, useReducer } from "react";
import {
  StateTransformAction,
  StateTransformReducer,
  stateTransformReducer
} from "./StateTransform";
import { compose } from "./utility";

export enum Availability {
  Available = "Available",
  Busy = "Busy"
}

export type State = { availability: Availability; count: number };

export const isAvailable = (state: State): boolean =>
  state.availability === Availability.Available;

export const isBusy = (state: State): boolean =>
  state.availability === Availability.Busy;

const whenAvailable = (
  state: State,
  action: StateTransformAction<State>
): State => {
  if (!isAvailable(state)) {
    console.log(`Can't perform action in ${state.availability} state.`);
    return state;
  }

  return action(state);
};

const finishReset = (state: State): State => {
  if (!isBusy(state)) {
    console.log(`Can't finish reset in ${state.availability} state.`);
    return state;
  }

  return {
    ...state,
    count: 0,
    availability: Availability.Available
  };
};

const slowAsyncFunction = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, 3000));

const startReset =
  (finish: () => void) =>
  (state: State): State => {
    if (!isAvailable(state)) {
      console.log(`Can't start reset in ${state.availability} state.`);
      return state;
    }

    slowAsyncFunction().finally(finish);

    return {
      ...state,
      availability: Availability.Busy
    };
  };

const increment = (state: State): State => {
  if (!isAvailable(state)) {
    console.log(`Can't increment in ${state.availability} state.`);
    return state;
  }

  return { ...state, count: state.count + 1 };
};

const unguardedDecrement = (state: State): State => ({
  ...state,
  count: state.count - 1
});

const decrement = (state: State): State =>
  whenAvailable(state, unguardedDecrement);

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

const incrementIfOdd = (state: State): State =>
  !isOddCount(state) ? state : increment(state);

const bump =
  (n: number) =>
  (state: State): State => {
    switch (state.availability) {
      case Availability.Available:
        return {
          ...state,
          count: state.count + n
        };

      case Availability.Busy:
        console.log(`Can't bump in ${Availability.Busy} state.`);
        return state;
    }
  };

const initialState: State = {
  availability: Availability.Available,
  count: 0
};

interface Actions {
  increment(): void;
  incrementIfOdd(): void;
  decrement(): void;
  bump(n: number): void;
  resetAsync(): void;
}

export function useCountState(): [State, Actions] {
  const [state, dispatch] = useReducer<StateTransformReducer<State>>(
    stateTransformReducer,
    initialState
  );

  const actions = useMemo(() => {
    const finish = () => dispatch(finishReset);
    return {
      increment: () => dispatch(increment),
      incrementIfOdd: () => dispatch(incrementIfOdd),
      decrement: () => dispatch(decrement),
      bump: compose(bump, dispatch),
      resetAsync: () => dispatch(startReset(finish))
    };
  }, []);

  return [state, actions];
}
