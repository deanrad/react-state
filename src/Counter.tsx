import React from "react";
import {
  isAvailable,
  isOddCount,
  useCountState
} from "./CountStateWithNestedCase";

// type EmployeeType =
//   | {
//       type: "hourly";
//       hourlyWage: number;
//     }
//   | {
//       type: "contractor";
//       contractAmount: number;
//     }
//   | {
//       type: "intern";
//       unpaid: boolean;
//     }
//   | {
//       type: "salaried";
//       monthlySalary: number;
//     };
//
//
// const f = (e: EmployeeType): number => {
//   switch (e.type) {
//     case "hourly":
//       let foo = e.hourlyWage
//       return 15;
//     case "contractor":
//       return 100;
//     case "intern":
//       return 0;
//     case "salaried":
//       return 1000;
//   }
// };

export const Counter = () => {
  const [state, { increment, decrement, incrementIfOdd, bump, resetAsync }] =
    useCountState();

  const disabled = !isAvailable(state);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <h3>Count: {state.count}</h3>
        <button disabled={disabled} onClick={increment}>
          +
        </button>
        <button disabled={disabled} onClick={decrement}>
          -
        </button>
        <button
          disabled={!isOddCount(state) || disabled}
          onClick={incrementIfOdd}
        >
          Increment if odd
        </button>
        <button disabled={disabled} onClick={() => bump(5)}>
          Bump by 5
        </button>
        <button disabled={disabled} onClick={resetAsync}>
          Zero, async
        </button>
      </div>
    </div>
  );
};
