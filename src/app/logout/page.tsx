import { Metadata } from "next";
import LogoutClient from "@/components/LogoutClient";

export const metadata: Metadata = {
  title: "X",
};

export default function LogoutPage() {
  return <LogoutClient />;
}
