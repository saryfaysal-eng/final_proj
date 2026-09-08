"use client";

import { useState } from "react";
import { BadgeCheck, Loader2, X } from "lucide-react";
import { verifyUserEmail } from "@/app/actions/verify";

interface VerifyProps {
  userId: string;
  email: string;
  username: string;
}

export default function VerifyModal({ userId, email, username }: VerifyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);

    setTimeout(async () => {
      await verifyUserEmail(userId, username);
      setIsVerifying(false);
      setIsOpen(false);
    }, 5000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 border border-zinc-700 hover:bg-zinc-900 px-3 py-1 rounded-full text-xs font-semibold text-white transition"
      >
        <BadgeCheck className="w-5 h-5 text-white fill-sky-500 shrink-0" />
        Get verified
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black border border-zinc-800 rounded-2xl p-6 w-full max-w-md relative text-white">
            <button
              onClick={() => !isVerifying && setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-zinc-800 transition"
              disabled={isVerifying}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <h2 className="text-xl font-bold mb-4">Get Verified</h2>
            <p className="text-sm text-gray-400 mb-6">
              Confirm your email address to receive your verified checkmark.
            </p>

            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-xl mb-6">
              <span className="text-sm text-gray-200 truncate">{email}</span>
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="bg-white text-black font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
