import { defaultBus as bus } from "@rxfx/bus";
import { createBlockingService, ReducerProducer, after } from "@rxfx/service";

const initialState = 0;

export type ServiceRequest =
  | { subtype: "increment" }
  | { subtype: "decrement" }
  | { subtype: "reset" }
  | {
      subtype: "bump";
      amount: number;
    };

// Got full typescript typing inside this reducer, due to ActionCreators.
const reducerProducer: ReducerProducer<ServiceRequest, number, Error, number> =
  ACs =>
  (state = initialState, action) => {
    // For sync actions, we can update state on their request
    if (ACs.request.match(action)) {
      switch (action.payload.subtype) {
        case "increment":
          return state + 1;
        case "decrement":
          return state - 1;
        case "bump":
          return state + action.payload.amount;
      }
    }

    // For the async action, we wait for the 'next' event tells us what the new value is
    if (ACs.next.match(action)) {
      return action.payload;
    }

    return state;
  };

// By calling it blocking, we guarantee it can't run more than 1 delay at a time.
export const countService = createBlockingService<
  ServiceRequest,
  number,
  Error,
  number
>(
  "count",
  bus,
  // Our effect - null, except a delayed 'zero' for 'reset'
  req => {
    if (req.subtype === "reset") {
      return after(3000, 0);
    }
  },
  reducerProducer
);
