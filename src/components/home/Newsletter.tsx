"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    console.log("Subscribed:", email);
  };

  return (
    <section className="bg-gray-900 text-white py-12 mt-10">
      <div className="max-w-3xl mx-auto text-center px-6">
        <h2 className="text-2xl font-bold">Subscribe to our Newsletter</h2>
        <p className="mt-2 text-gray-400">Get latest updates and offers</p>

        <div className="mt-6 flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubscribe}
            className="bg-yellow-500 px-6 py-2 rounded-lg text-black font-semibold"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
