import Title from "@/components/Title";
import { db } from "@/lib/db";

export default async function ZapPage() {
  // get all the leads
  const leads = await db.lead.findMany();

  return (
    <div className="p-4">
      <Title>Zapier data</Title>

      <h1 className="mb-4 text-2xl font-bold">Leads</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">Client Name</th>
              <th className="px-4 py-2 text-left">Client Email</th>
              <th className="px-4 py-2 text-left">Client Phone</th>
              <th className="px-4 py-2 text-left">Vehicle Info</th>
              <th className="px-4 py-2 text-left">Services</th>
              <th className="px-4 py-2 text-left">Source</th>
              <th className="px-4 py-2 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{lead.clientName}</td>
                <td className="px-4 py-2">{lead.clientEmail}</td>
                <td className="px-4 py-2">{lead.clientPhone}</td>
                <td className="px-4 py-2">{lead.vehicleInfo}</td>
                <td className="px-4 py-2">{lead.services}</td>
                <td className="px-4 py-2">{lead.source}</td>
                <td className="px-4 py-2">{lead.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
