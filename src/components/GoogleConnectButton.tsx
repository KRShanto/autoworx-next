export default function GoogleConnectButton() {
  const redirectGoogle = () => {
    window.location.href = "/api/google/redirect";
  };

  return (
    <button
      className="cursor-pointer rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500"
      onClick={redirectGoogle}
    >
      Connect Google Calendar
    </button>
  );
}
