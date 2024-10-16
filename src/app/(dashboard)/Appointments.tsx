import moment from "moment";
import { FaExternalLinkAlt } from "react-icons/fa";

const Appointments = ({ appointments, fullHeight }: any) => {
  return (
    <div
      className={`flex ${fullHeight ? "h-[82vh]" : "h-[38vh]"} flex-col rounded-md p-8 shadow-lg`}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="text-2xl font-bold">Appointments</span>{" "}
        <span>
          <FaExternalLinkAlt />
        </span>
      </div>
      <div className="custom-scrollbar flex flex-1 flex-col space-y-4 overflow-x-hidden">
        {appointments.map((appointment: any, idx: any) => (
          <AppointmentDetails appointment={appointment} key={idx} />
        ))}
        {appointments.length === 0 && (
          <span className="self-center text-center">
            You have no upcoming appointments
          </span>
        )}
      </div>
    </div>
  );
};

const AppointmentDetails = ({ appointment }: any) => {
  const start = moment(appointment.startTime, "HH:mm");
  const end = moment(appointment.endTime, "HH:mm");
  const date = moment(appointment?.date)?.format("Do MMMM YYYY");

  return (
    <div className="flex rounded-md border border-gray-400 py-4 pl-4 pr-2 text-sm">
      <div className="w-[98%]">
        <h1 className="font-semibold">
          {appointment.title.length > 20
            ? appointment.title.slice(0, 20) + "..."
            : appointment.title}
        </h1>
        {appointment.client && (
          <p className="mt-4">
            Client : {appointment.client.firstName}{" "}
            {appointment.client.lastName}
          </p>
        )}
        {appointment.assignedUsers.length > 0 && (
          <p>
            Assigned to :{" "}
            {appointment.assignedUsers.map((assigned: any, idx: any) => (
              <span key={idx}>
                {assigned.firstName} {assigned.lastName}{" "}
                {idx !== appointment.assignedUsers.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}
        {appointment.startTime && (
          <p className="mt-4">
            {`${start.format("h:mm A")} - ${end.format("h:mm A")}`}
          </p>
        )}
        {appointment?.date && <p className="font-semibold">{date}</p>}
      </div>
      <div className="w-[1%] rounded-full bg-[#6571FF]"></div>
    </div>
  );
};

export default Appointments;
