import React from "react";
import { useCountService } from "./CountStateWithService";

export const Counter = () => {
  const [count, isActive, { increment, decrement, bump, reset }] =
    useCountService();

  const disabled = isActive;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <h3>Count: {count}</h3>
        <button disabled={disabled} onClick={increment}>
          +
        </button>
        <button disabled={disabled} onClick={decrement}>
          -
        </button>
        <button disabled={disabled || count % 2 === 0} onClick={increment}>
          Increment if odd
        </button>
        <button disabled={disabled} onClick={() => bump(5)}>
          Bump by 5
        </button>
        <button disabled={disabled} onClick={reset}>
          Zero, async
        </button>
      </div>
    </div>
  );
};
