import { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "X. It's what's happening / X",
};

export default function SignupPage() {
  return <SignupForm />;
}
