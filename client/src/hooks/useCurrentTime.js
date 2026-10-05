import { useEffect, useState } from "react";
import { INITIAL_PROMOTION_TIME } from "../utils/productPromotions";

export default function useCurrentTime(interval = 1000, enabled = true) {
  const [now, setNow] = useState(INITIAL_PROMOTION_TIME);

  useEffect(() => {
    if (!enabled) return undefined;
    const timerId = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(timerId);
  }, [interval, enabled]);

  return now;
}
