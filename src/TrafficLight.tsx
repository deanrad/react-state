import React from "react";
import { TrafficLightColor, useTrafficLight } from "./TrafficLightState";

interface TrafficLightProps {
  initialColor: TrafficLightColor;
}

const circleStyle = {
  height: 100,
  width: 100,
  borderRadius: "50%"
};

export const TrafficLight: React.FC<TrafficLightProps> = ({
  initialColor
}: TrafficLightProps) => {
  const trafficLightColor = useTrafficLight(initialColor);

  return (
    <div
      style={{
        display: "inline-block",
        margin: "2rem"
      }}
    >
      <div
        style={{
          ...circleStyle,
          backgroundColor: trafficLightColor === "red" ? "red" : "#280000"
        }}
      />
      <div
        style={{
          ...circleStyle,
          backgroundColor: trafficLightColor === "yellow" ? "yellow" : "#282800"
        }}
      />
      <div
        style={{
          ...circleStyle,
          backgroundColor:
            trafficLightColor === "green" ? "lawngreen" : "#002800"
        }}
      />
    </div>
  );
};
