import { useReducer } from "react";
import { compose } from "./utility";

export type State = { count: number };

enum ActionType {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  INCREMENT_IF_ODD = "INCREMENT_IF_ODD",
  BUMP = "BUMP",
  RESET = "RESET"
}

interface IncrementAction {
  type: ActionType.INCREMENT;
}

interface DecrementAction {
  type: ActionType.DECREMENT;
}

interface IncrementIfOddAction {
  type: ActionType.INCREMENT_IF_ODD;
}

interface BumpAction {
  type: ActionType.BUMP;
  n: number;
}

interface ResetAction {
  type: ActionType.RESET;
}

type Action = Readonly<
  | IncrementAction
  | DecrementAction
  | IncrementIfOddAction
  | BumpAction
  | ResetAction
>;

const increment: Action = {
  type: ActionType.INCREMENT
} as const;

const decrement: Action = {
  type: ActionType.DECREMENT
} as const;

const incrementIfOdd: Action = {
  type: ActionType.INCREMENT_IF_ODD
} as const;

const bump = (n: number): Action => ({
  type: ActionType.BUMP,
  n
});

const reset: Action = {
  type: ActionType.RESET
} as const;

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

export const isAvailable = (_state: State) => true;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.INCREMENT:
      return { ...state, count: state.count + 1 };

    case ActionType.DECREMENT:
      return { ...state, count: state.count - 1 };

    case ActionType.INCREMENT_IF_ODD:
      return isOddCount(state) ? { ...state, count: state.count + 1 } : state;

    case ActionType.BUMP:
      return { ...state, count: state.count + action.n };

    case ActionType.RESET:
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
    increment: () => dispatch(increment),
    incrementIfOdd: () => dispatch(incrementIfOdd),
    decrement: () => dispatch(decrement),
    bump: compose(bump, dispatch),
    resetAsync: () => {
      slowAsyncFunction().then(() => dispatch(reset));
    }
  };

  return [state, actions];
}
