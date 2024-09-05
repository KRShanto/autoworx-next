import { TNotification } from "@/types/notification";
const notification: TNotification = {
  LeadsGeneratedAndSalesPipeline: {
    leadsGenerated: {
      email: false,
      push: true,
      silence: true,
    },
    leadsClosed: {
      email: true,
      push: false,
      silence: true,
    },
    followUp: {
      email: true,
      push: true,
      silence: false,
    },
    leadsAssigned: {
      email: true,
      push: true,
      silence: false,
    },
    stage: {
      email: true,
      push: true,
      silence: true,
    },
  },
  operationPipeline: {
    workOrderCreated: {
      email: true,
      push: true,
      silence: true,
    },
    workOrderCompleted: {
      email: true,
      push: true,
      silence: true,
    },
    dueDateProximity: {
      email: true,
      push: true,
      silence: true,
    },
  },
  calendarAndTasks: {
    taskAssigned: {
      email: true,
      push: true,
      silence: true,
    },
    taskFinished: {
      email: true,
      push: true,
      silence: true,
    },
    appointmentCreated: {
      email: true,
      push: true,
      silence: true,
    },
    appointmentReminder: {
      email: true,
      push: true,
      silence: true,
    },
    taskReminder: {
      email: true,
      push: true,
      silence: true,
    },
  },
  estimateAndInvoices: {
    estimateCreated: {
      email: true,
      push: true,
      silence: true,
    },
    invoiceCreated: {
      email: true,
      push: true,
      silence: true,
    },
  },
  payments: {
    paymentReceived: {
      email: true,
      push: true,
      silence: true,
    },
    paymentDue: {
      email: true,
      push: true,
      silence: true,
    },
    Deposit: {
      email: true,
      push: true,
      silence: true,
    },
  },
  communications: {
    internalMessageAlert: {
      email: true,
      push: true,
      silence: true,
    },
    clientMessageAlert: {
      email: true,
      push: true,
      silence: true,
    },
    clientCallAlert: {
      email: true,
      push: true,
      silence: true,
    },
    clientEmailAlert: {
      email: true,
      push: true,
      silence: true,
    },
    collaborationMessageAlert: {
      email: true,
      push: true,
      silence: true,
    },
  },
  inventory: {
    newInventory: {
      email: true,
      push: true,
      silence: true,
    },
    completelyOut: {
      email: true,
      push: true,
      silence: true,
    },
    newlyAdded: {
      email: true,
      push: true,
      silence: true,
    },
  },
  workForce: {
    leaveRequest: {
      email: true,
      push: false,
      silence: true,
    },
    performanceChanges: {
      email: true,
      push: true,
      silence: true,
    },
    lateArrivals: {
      email: true,
      push: false,
      silence: true,
    },
    earlyLeave: {
      email: true,
      push: true,
      silence: true,
    },
  },
};

export const getNotification = () => {
  return notification;
};
