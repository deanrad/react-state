import { useMemo, useState } from "react";
import fsm from "svelte-fsm";

export type State = { availability: "available" | "busy"; count: number };

const initialCountState: State = {
  availability: "available",
  count: 0
};

export const isAvailable = (state: State): boolean =>
  state.availability === "available";

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

const slowAsyncFunction = () =>
  new Promise<void>(resolve => setTimeout(resolve, 3000));

interface Actions {
  increment(): void;
  incrementIfOdd(): void;
  decrement(): void;
  bump(n: number): void;
  resetAsync(): void;
}

export const useCountState = (): [State, Actions] => {
  const [state, setCountState] = useState(initialCountState);
  const actions: Actions = useMemo(() => {
    const machine = fsm("available", {
      available: {
        increment() {
          setCountState(state => ({ ...state, count: state.count + 1 }));
        },
        decrement() {
          setCountState(state => ({ ...state, count: state.count - 1 }));
        },
        incrementIfOdd() {
          setCountState(state =>
            isOddCount(state) ? { ...state, count: state.count + 1 } : state
          );
        },
        bump(n: number) {
          setCountState(state => ({ ...state, count: state.count + n }));
        },
        reset() {
          setCountState(state => ({ ...state, availability: "busy" }));
          return "busy";
        }
      },

      busy: {
        _enter() {
          slowAsyncFunction().then(() => {
            setCountState(state => ({
              ...state,
              count: 0,
              availability: "available"
            }));
            this.complete();
          });
        },
        complete() {
          return "available";
        }
      }
    });

    return {
      increment: machine.increment,
      incrementIfOdd: machine.incrementIfOdd,
      decrement: machine.decrement,
      bump: machine.bump,
      resetAsync: machine.reset
    };
  }, []);
  return [state, actions];
};
