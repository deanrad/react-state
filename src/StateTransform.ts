import { Dispatch, Reducer } from "react";

export type StateTransformAction<S> = (state: S) => S;

export const stateTransformReducer = <S>(
  state: S,
  action: StateTransformAction<S>
): S => action(state);

export type StateTransformReducer<S> = Reducer<S, StateTransformAction<S>>;

export type StateTransformDispatch<S> = Dispatch<StateTransformAction<S>>;
