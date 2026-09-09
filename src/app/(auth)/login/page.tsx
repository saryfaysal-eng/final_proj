import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "X. It's what's happening / X",
};

export default function LoginPage() {
  return <LoginForm />;
}
