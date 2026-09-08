"use client";

import { useState } from "react";
import SetUpProf from "@/components/SetUpProf";

type Props = {
  initialData: {
    name: string | null;
    bio: string | null;
    image: string | null;
    coverImage: string | null;
  };
};

export default function SetUpProfWrapper({ initialData }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-gray-600 rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-2 cursor-pointer hover:bg-zinc-900 transition"
      >
        Set up profile
      </button>

      <SetUpProf
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={initialData}
      />
    </>
  );
}
