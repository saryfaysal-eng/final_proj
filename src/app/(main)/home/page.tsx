import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home / X",
};

export default function HomePage() {
  return (
    <div className="h-screen overflow-hidden bg-black text-white flex justify-center">
      <div className="flex h-full">
        <div className="w-22 xl:w-68.75 h-screen sticky top-0 shrink-0 flex justify-end">
          <Sidebar />
        </div>

        <main className="w-142 border-x border-gray-800 h-screen overflow-y-auto shrink-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800 flex items-center h-13 font-bold text-sm">
            <button className="flex-1 h-full flex items-center justify-center hover:bg-zinc-900/60 transition">
              <span className="relative h-full flex items-center border-b-4 border-sky-500 font-bold">
                For you
              </span>
            </button>
            <button className="flex-1 h-full flex items-center justify-center hover:bg-zinc-900/60 transition text-gray-500">
              Following
            </button>
          </div>

          <div className="bg-red-500/10 min-h-screen p-4"></div>
        </main>
        <div className="w-22 xl:w-68.75 h-screen shrink-0" />
      </div>
    </div>
  );
}
