import FormError from "@/components/FormError";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import Input from "@/components/Input";
import { FaGoogle } from "react-icons/fa";

export default function Page() {
  return (
    <>
      <form className="max-w-md mx-auto mt-56 border p-6 rounded-md">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

        <FormError />

        {/* Email Address */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <Input
            name="email"
            type="email"
            required
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <Input
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Link
          href="/register"
          className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center block mt-4"
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
