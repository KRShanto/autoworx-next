import Title from "@/components/Title";
import Calendar from "./Calendar/Calendar";
import CalendarUser from "../../../../Users/CalendarUser";

export default function Page({ params }: { params: { type: string } }) {
  return (
    <>
      <Title>Task and Activity Management</Title>

      <div className="relative flex h-[81vh]">
        <Calendar type={params.type} />
        {/* <CalendarUser /> */}
      </div>
    </>
  );
}
