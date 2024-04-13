import { auth } from "./auth";

export default async function Page() {
  const session = await auth();

  console.log(session);

  if (!session || !session.user) {
    return (
      <>
        <h1>Profile</h1>
        <p>
          <strong>You are not signed in</strong>
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Profile</h1>
      <p>
        <strong>Name:</strong> {session.user.name}
      </p>
      <p>
        <strong>Email:</strong> {session.user.email}
      </p>
      <p>
        <strong>Role:</strong> {session.user.role}
      </p>
    </>
  );
}
