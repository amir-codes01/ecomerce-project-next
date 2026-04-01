"use client";

import { useEffect, useState } from "react";

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 bg-red-50 rounded-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-600">Flash Sale 🔥</h2>
        <span className="font-semibold">{formatTime(timeLeft)}</span>
      </div>
    </section>
  );
}
