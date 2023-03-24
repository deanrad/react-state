import { useEffect, useReducer } from "react";

export type TrafficLightColor = "green" | "yellow" | "red";

export type State = TrafficLightColor;

const reducer = (state: State): State => {
  switch (state) {
    case "green":
      return "yellow";

    case "yellow":
      return "red";

    case "red":
      return "green";
  }
};

const durations = {
  green: 3000,
  yellow: 2000,
  red: 5000
};

export const useTrafficLight = (initialState: State) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timeoutId = setTimeout(dispatch, durations[state]);
    return () => clearTimeout(timeoutId);
  }, [state]);

  return state;
};
