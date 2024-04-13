"use client";

import { useFormErrorStore } from "@/stores/form-error";
import { register } from "./register";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Submit from "@/components/Submit";

export default function SubmitButton() {
  const { showError } = useFormErrorStore();
  const router = useRouter();

  const handler = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const company = formData.get("company") as string;

    const res = await register({ name, email, password, company });

    if (res.error) {
      showError(res.error);
      return;
    }

    const res2 = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res2?.error) {
      showError({ field: "all", message: res2.error });
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <Submit
      className="bg-blue-500 text-white py-2 px-10 rounded-md mx-auto block mt-4"
      formAction={handler}
    >
      Submit
    </Submit>
  );
}
