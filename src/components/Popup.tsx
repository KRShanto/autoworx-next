export default function Popup({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 top-0 z-20 h-screen w-screen bg-black bg-opacity-70">
      <div className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-md border bg-white">
        {children}
      </div>
    </div>
  );
}
