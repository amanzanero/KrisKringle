import dayjs from "dayjs";
import { useEffect, useState } from "react";

type Timer = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  difference: number;
};

export function useChristmas() {
  const [timer, setTimer] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    difference: 0,
  });
  useEffect(() => {
    const calculateTimertime = () => {
      const now = dayjs();
      const christmasThisYear = dayjs(`${now.year()}-12-25`);
      const diff = christmasThisYear.diff(now, "seconds");
      let difference = diff;

      // days
      const daysSeconds = 86400;
      const days = difference > daysSeconds ? Math.floor(difference / daysSeconds) : 0;
      difference -= days * 3600 * 24;

      // hours
      const hours = difference > 3600 ? Math.floor(difference / 3600) : 0;
      difference -= hours * 3600;

      // minutes
      const minutes = difference >= 60 ? Math.floor(difference / 60) : 0;
      difference -= minutes * 60;
      const seconds = difference;
      setTimer({ days, hours, minutes, seconds, difference: diff });
    };
    calculateTimertime();
    const intervalId = setInterval(calculateTimertime, 1000);
    return () => clearInterval(intervalId);
  }, [setTimer]);
  return timer;
}
