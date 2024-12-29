import Title from "@/components/Title";
import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";

export default async function TwilioSMSPage() {
  const companyId = await getCompanyId();
  // get all the leads
  // const messages = await db.twilioMessage.findMany();

  return (
    <div className="p-4">
      <Title>Received Messages from Twilio</Title>

      <h1 className="mb-4 text-2xl font-bold">Messages</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">From</th>
              <th className="px-4 py-2 text-left">To</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {[].map(
              (message: {
                id: number;
                from: string;
                to: string;
                message: string;
                timestamp: string;
              }) => (
                <tr key={message.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{message.from}</td>
                  <td className="px-4 py-2">{message.to}</td>
                  <td className="px-4 py-2">{message.message}</td>
                  <td className="px-4 py-2">{message.timestamp}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
