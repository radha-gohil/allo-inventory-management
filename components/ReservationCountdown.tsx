"use client";

import {
  useEffect,
  useState,
} from "react";

type Props = {
  expiresAt: string;
};

export default function ReservationCountdown({
  expiresAt,
}: Props) {

  const calculateTimeLeft =
    () => {

      const difference =
        new Date(
          expiresAt
        ).getTime() -
        new Date().getTime();

      if (difference <= 0) {

        return "Expired";
      }

      const minutes =
        Math.floor(
          difference /
            1000 /
            60
        );

      const seconds =
        Math.floor(
          (difference /
            1000) %
            60
        );

      return `${minutes}m ${seconds}s`;
    };

  const [timeLeft, setTimeLeft] =
    useState(
      calculateTimeLeft()
    );

  useEffect(() => {

    const interval =
      setInterval(() => {

        setTimeLeft(
          calculateTimeLeft()
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [expiresAt]);

  return (
    <span
      className={`rounded px-3 py-1 font-medium ${
        timeLeft ===
        "Expired"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {timeLeft}
    </span>
  );
}