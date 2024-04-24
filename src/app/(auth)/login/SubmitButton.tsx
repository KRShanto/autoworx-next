"use client";

import Submit from "@/components/Submit";
import { useFormErrorStore } from "@/stores/form-error";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SubmitButton() {
  const { showError } = useFormErrorStore();
  const router = useRouter();

  const handler = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      showError({ message: "Invalid credentials", field: "all" });
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <Submit
      className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white"
      formAction={handler}
    >
      Login
    </Submit>
  );
}
