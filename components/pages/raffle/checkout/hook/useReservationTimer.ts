"use client";

import { useEffect, useState } from "react";

export function useReservationTimer(reservedUntil: string) {
  const [timeLeft, setTimeLeft] = useState(1);

  useEffect(() => {
    const end = new Date(reservedUntil).getTime();

    const update = () => {
      const diff = end - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [reservedUntil]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const isExpired = timeLeft <= 0;

  return {
    timeLeft,
    minutes,
    seconds,
    formatted,
    isExpired,
  };
}
