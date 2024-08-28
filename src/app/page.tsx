import Title from "@/components/Title";
import { auth } from "./auth";
import { db } from "@/lib/db";

export default async function Page() {
  // get all the leads
  const leads = await db.lead.findMany();

  return (
    <div>
      <Title>Dashboard</Title>

      <h1>Leads</h1>

      <table>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Client Email</th>
            <th>Client Phone</th>
            <th>Vehicle Info</th>
            <th>Services</th>
            <th>Source</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.clientName}</td>
              <td>{lead.clientEmail}</td>
              <td>{lead.clientPhone}</td>
              <td>{lead.vehicleInfo}</td>
              <td>{lead.services}</td>
              <td>{lead.source}</td>
              <td>{lead.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
