import { useReducer } from "react";
import { compose } from "./utility";
import { StateTransformReducer, stateTransformReducer } from "./StateTransform";

export type State = { count: number };

const increment = (state: State): State => ({
  ...state,
  count: state.count + 1
});

const decrement = (state: State): State => ({
  ...state,
  count: state.count - 1
});

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

const incrementIfOdd = (state: State): State =>
  isOddCount(state) ? increment(state) : state;

const bump =
  (n: number) =>
  (state: State): State => ({
    ...state,
    count: state.count + n
  });

const reset = (state: State): State =>
  state.count === 0 ? state : { ...state, count: 0 };

export const isAvailable = (_state: State) => true;

const initialState: State = {
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

export const useCountState = (): [State, Actions] => {
  const [state, dispatch] = useReducer<StateTransformReducer<State>>(
    stateTransformReducer,
    initialState
  );

  const actions = {
    increment: () => dispatch(increment),
    incrementIfOdd: () => dispatch(incrementIfOdd),
    decrement: () => dispatch(decrement),
    bump: compose(bump, dispatch),
    resetAsync: () => {
      slowAsyncFunction().then(() => dispatch(reset));
    }
  };

  return [state, actions];
};
