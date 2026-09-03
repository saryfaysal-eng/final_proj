import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/Footer";
import PasswordInput from "@/components/PasswordInput";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; username?: string; email?: string }>;
}) {
  const {
    error,
    username: prevUsername,
    email: prevEmail,
  } = await searchParams;
  async function handleSignup(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const usernameRegex = /^[a-z][a-z0-9._]{2,15}$/;
    const emailRegex =
      /^(?![0-9])[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;

    if (!usernameRegex.test(username)) {
      redirect(
        `/signup?error=invalid_username&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
      );
    }

    if (!emailRegex.test(email)) {
      redirect(
        `/signup?error=invalid_email&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
      );
    }

    if (!passwordRegex.test(password)) {
      redirect(
        `/signup?error=weak_password&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
      );
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      redirect(
        `/signup?error=exists&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`,
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        name: username,
        email: email,
        password: hashedPassword,
      },
    });
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      path: "/",
    });

    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-8">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between grow">
        <div className="w-full md:w-1/2 flex justify-center items-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1200 1227"
            className="w-full max-w-xs md:max-w-md h-auto"
          >
            <path
              fill="#c2c2c2"
              d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
            />
          </svg>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center p-6">
          <div className="border rounded-2xl border-gray-800 p-8 w-full max-w-md">
            <form action={handleSignup} className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <span className="text-6xl font-bold">Happening now.</span>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                  {error === "exists" && "Username or Email is already taken."}
                  {error === "invalid_username" &&
                    "Username must be 3-16 chars (letters, digits, ., _), cannot start with a digit, contains at least letters with digits, underscores, or dots."}
                  {error === "invalid_email" &&
                    "Invalid email format. Must have at least 3 chars before @ and cannot start with a number."}
                  {error === "weak_password" &&
                    "Password must be 6-16 chars, must include lowercase, uppercase, number, and special character."}
                </div>
              )}

              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="username">Username: </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="@ibra_kid"
                  minLength={3}
                  maxLength={16}
                  pattern="^@?[a-z][a-z0-9._]{2,15}$"
                  title="Must start with a letter and contain only lowercase letters, numbers, underscores, or dots (3-16 chars)."
                  className="border border-gray-700 bg-transparent rounded p-2 text-white placeholder-gray-500"
                  required
                  defaultValue={prevUsername || ""}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email">Email: </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  pattern="^(?![0-9])[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Must have at least 3 characters before @ and cannot start with a number."
                  placeholder="ibrahimsidiot@example.com"
                  className="border border-gray-700 bg-transparent rounded p-2 text-white placeholder-gray-500"
                  required
                  defaultValue={prevEmail || ""}
                />
              </div>
              <PasswordInput />
              <button
                type="submit"
                className="bg-white text-black font-semibold px-4 py-2 rounded mt-2 cursor-pointer w-full hover:bg-gray-200 transition"
              >
                Create Account
              </button>
              <p className="text-xs text-center text-gray-400">
                By continuing, you agree to our{" "}
                <span>
                  <a
                    href="https://x.com/en/tos"
                    className="text-white font-bold"
                  >
                    Terms of Service
                  </a>
                </span>
                ,{" "}
                <span>
                  <a
                    href="https://x.com/privacy"
                    className="text-white font-bold"
                    target="_blank"
                  >
                    Privacy Policy{" "}
                  </a>
                </span>
                and{" "}
                <span>
                  <a
                    href="https://help.x.com/en/rules-and-policies/x-cookies"
                    target="_blank"
                    className="font-bold text-white"
                  >
                    Cookie Use
                  </a>
                </span>
                .
              </p>

              <p className="text-sm mt-2 text-gray-400 text-center">
                Alraedy have an account?{" "}
                <Link href="/login" className="text-blue-500 underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
