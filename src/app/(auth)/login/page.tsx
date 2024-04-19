import FormError from "@/components/FormError";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import Input from "@/components/Input";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <>
      <form className="mx-auto mt-56 max-w-md rounded-md border p-6">
        {/* Title */}
        <h1 className="mb-4 text-center text-2xl font-semibold">Login</h1>

        <FormError />

        {/* Email Address */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>
          <Input
            name="email"
            type="email"
            required
            autoFocus
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block">
            Password
          </label>
          <Input
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Link
          href="/register"
          className="mt-4 block rounded-md text-center text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Don&rsquo;t have an account? Register
        </Link>

        {/* Google Authentication */}
        {/* TODO */}
        {/* <a
          href={route("auth.google")}
          className="border mx-auto w-[200px] text-center mt-4 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
        >
          <FaGoogle className="inline-block mr-2 text-[#DB4437]" />
          Login with Google
        </a> */}

        <SubmitButton />
      </form>
    </>
  );
}
