"use client";

import { useState } from "react";

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor="password">Password: </label>
      <div className="relative w-full">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          minLength={6}
          maxLength={16}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':&quot;\\|,.<>\/?]).{6,16}$"
          title="6-16 chars, must include lowercase, uppercase, number, and special character."
          placeholder="Between 6-16 chars"
          className="border border-gray-700 bg-transparent rounded p-2 text-white placeholder-gray-500 w-full pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm focus:outline-none cursor-pointer"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
