import { getCompanyId } from "@/lib/companyId";
import { db } from "@/lib/db";
import { Service, User } from "@prisma/client";
import { fetchClientData } from "../utils/fetchClientsData";
import { getConversations } from "../utils/getConversations";
import DetailsComponent from "./DetailsComponent";

export default async function Details({
  searchParams,
}: {
  searchParams: { clientId: string };
}) {
  const clientId = searchParams.clientId;

  const { client, company } = await fetchClientData(clientId);

  if (!client || !company) {
    return <></>;
  }

  const conversations = await getConversations(clientId);

  const invoices = await db.invoice.findMany({
    where: { clientId: parseInt(clientId) },
    include: {
      invoiceItems: {
        include: { service: true },
      },
    },
  });
  const invoiceServices = invoices.map((invoice) =>
    invoice.invoiceItems.map((item) => item.service),
  );

  const services = invoiceServices
    .flat()
    .filter((service): service is Service => service !== null);

  const estimates = await db.invoice.findMany({
    where: { clientId: parseInt(clientId) },
  });

  const vehicles = await db.vehicle.findMany({
    where: { clientId: parseInt(clientId) },
  });

  let companyId = await getCompanyId();

  const tasks = await db.task.findMany({
    where: {
      companyId,
      clientId: parseInt(clientId),
    },
  });
  let taskWithAssignedUsers = [];
  // Loop through all the tasks
  for (const task of tasks) {
    let assignedUsers: User[] = [];

    // Get the assigned users for the task
    const taskUsers = (await db.taskUser.findMany({
      where: {
        taskId: task.id,
      },
    })) as any;

    // Get the user details for the assigned users
    for (const taskUser of taskUsers) {
      const user = (await db.user.findUnique({
        where: {
          id: taskUser.userId,
        },
      })) as User;

      // Add the user to the assigned users array
      assignedUsers.push(user);
    }

    // Add the task and the assigned users to the array
    taskWithAssignedUsers.push({
      ...task,
      assignedUsers,
    });
  }
  const companyUsers = await db.user.findMany({
    where: {
      companyId,
    },
  });

  return (
    <DetailsComponent
      conversations={conversations}
      client={client}
      services={services}
      vehicles={vehicles}
      estimates={estimates}
      tasks={taskWithAssignedUsers}
      usersOfCompany={companyUsers}
    />
  );
}
