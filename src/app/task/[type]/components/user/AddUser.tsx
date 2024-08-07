import { useState } from "react";
import Popup from "@/components/Popup";
import { usePopupStore } from "@/stores/popup";
import FormError from "@/components/FormError";
import Submit from "@/components/Submit";
import { addUser } from "../../../../../actions/user/addUser";
import { useFormErrorStore } from "@/stores/form-error";

export default function AddUser() {
  const { close } = usePopupStore();
  const { showError } = useFormErrorStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function handleSubmit() {
    const res = await addUser({
      firstName,
      lastName,
      email,
      password,
      confirmPassword: passwordConfirmation,
    });

    if (res.type === "error") {
      showError({
        field: res.field || "name",
        message: res.message || "",
      });
    } else {
      close();
    }
  }

  return (
    <Popup>
      <form className="w-[500px] rounded-md p-6">
        <h1 className="mb-4 text-center text-2xl font-semibold">Add user</h1>

        <FormError />

        <div>
          <label htmlFor="firstName" className="mb-2 block">
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            name="firstName"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mt-4">
          <label htmlFor="lastName" className="mb-2 block">
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            name="lastName"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="mb-2 block">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password_confirmation" className="mb-2 block">
            Password Confirmation
          </label>

          <input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <div className="mt-5 flex flex-row justify-center gap-5">
          <Submit
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            formAction={handleSubmit}
          >
            Create User
          </Submit>

          <button
            type="button"
            onClick={close}
            className="rounded-md bg-red-500 px-4 py-2 text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </Popup>
  );
}
