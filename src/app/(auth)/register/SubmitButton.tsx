"use client";

import { useFormErrorStore } from "@/stores/form-error";
import { register } from "../../../actions/auth/register";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Submit from "@/components/Submit";
import { TErrorHandler } from "@/types/globalError";
import { createUserValidation } from "@/validations/schemas/auth/user.validation";
import { errorHandler } from "@/error-boundary/globalErrorHandler";

export default function SubmitButton() {
  const { showError } = useFormErrorStore();
  const router = useRouter();

  const handler = async (formData: FormData) => {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const company = formData.get("company") as string;

    try {
      const userInfo = await createUserValidation.parseAsync({
        firstName,
        lastName,
        email,
        password,
        company,
      });
      const res = await register(userInfo);

      if (!res.success) {
        showError(res.error as TErrorHandler);
        return;
      }

      const res2 = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res2?.error) {
        showError({
          success: false,
          statusCode: res2.status,
          errorSource: [],
          message: res2.error,
        });
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      const formattedError = errorHandler(err);
      showError(formattedError);
    }
  };

  return (
    <Submit
      className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white"
      formAction={handler}
    >
      Submit
    </Submit>
  );
}
