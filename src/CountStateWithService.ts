import { useMemo } from "react";
import { useService } from "@rxfx/react";
import { countService } from "./services/countService";

type CountActions = {
  increment: () => void;
  decrement: () => void;
  bump: (n: number) => void;
  reset: () => void;
};

export function useCountService(): [number, boolean, CountActions] {
  const { state: count, isActive } = useService(countService);
  const actions = useMemo(
    () => ({
      increment: () => countService.request({ subtype: "increment" }),
      decrement: () => countService.request({ subtype: "decrement" }),
      bump: (n: number) => countService.request({ subtype: "bump", amount: n }),
      reset: () => countService.request({ subtype: "reset" })
    }),
    []
  );

  return [count, isActive, actions];
}
