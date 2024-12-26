import Input from "@/components/Input";
import Password from "@/components/Password";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import FormError from "@/components/FormError";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function Page() {
  return (
    <>
      <form className="mx-auto mt-44 max-w-md rounded-lg border p-6">
        <h1 className="mb-4 text-center text-2xl font-semibold">Register</h1>

        <FormError />

        <div>
          <label htmlFor="firstName" className="mb-2 block">
            First Name
          </label>

          <Input
            type="text"
            name="firstName"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
            autoFocus
          />
        </div>

        <div className="mt-4">
          <label htmlFor="lastName" className="mb-2 block">
            Last Name
          </label>

          <Input
            type="text"
            name="lastName"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>

          <Input
            type="email"
            name="email"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="company" className="mb-2 block">
            Company
          </label>

          <Input
            type="text"
            name="company"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="mb-2 block">
            Password
          </label>

          <Password
            name="password"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            // required
          />
        </div>

        <Link
          href="/login"
          className="mt-4 block rounded-md text-center text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Already registered?
        </Link>

        {/* Google Authentication */}
        {/* TODO */}
        {/* <a
          href={route("auth.google")}
          className="border mx-auto w-[200px] text-center mt-4 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
        >
          <FaGoogle className="inline-block mr-2 text-[#DB4437]" />
          Sign up using Google
        </a> */}

        <SubmitButton />
      </form>
    </>
  );
}
