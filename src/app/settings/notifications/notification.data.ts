import { TNotification } from "@/types/notification";
const notification: TNotification = {
  LeadsGeneratedAndSalesPipeline: {
    leadsGenerated: {
      email: false,
      push: false,
      silence: false,
    },
    leadsClosed: {
      email: false,
      push: false,
      silence: false,
    },
    followUp: {
      email: false,
      push: false,
      silence: false,
    },
    leadsAssigned: {
      email: false,
      push: false,
      silence: false,
    },
    stage: {
      email: false,
      push: false,
      silence: false,
    },
  },
  operationPipeline: {
    workOrderCreated: {
      email: false,
      push: false,
      silence: false,
    },
    workOrderCompleted: {
      email: false,
      push: false,
      silence: false,
    },
    dueDateProximity: {
      email: false,
      push: false,
      silence: false,
    },
  },
  calendarAndTasks: {
    taskAssigned: {
      email: false,
      push: false,
      silence: false,
    },
    taskFinished: {
      email: false,
      push: false,
      silence: false,
    },
    appointmentCreated: {
      email: false,
      push: false,
      silence: false,
    },
    appointmentReminder: {
      email: false,
      push: false,
      silence: false,
    },
    taskReminder: {
      email: false,
      push: false,
      silence: false,
    },
  },
  estimateAndInvoices: {
    estimateCreated: {
      email: false,
      push: false,
      silence: false,
    },
    invoiceCreated: {
      email: false,
      push: false,
      silence: false,
    },
  },
  payments: {
    paymentReceived: {
      email: false,
      push: false,
      silence: false,
    },
    paymentDue: {
      email: false,
      push: false,
      silence: false,
    },
    Deposit: {
      email: false,
      push: false,
      silence: false,
    },
  },
  communications: {
    internalMessageAlert: {
      email: false,
      push: false,
      silence: false,
    },
    clientMessageAlert: {
      email: false,
      push: false,
      silence: false,
    },
    clientCallAlert: {
      email: false,
      push: false,
      silence: false,
    },
    clientEmailAlert: {
      email: false,
      push: false,
      silence: false,
    },
    collaborationMessageAlert: {
      email: false,
      push: false,
      silence: false,
    },
  },
  inventory: {
    newInventory: {
      email: false,
      push: false,
      silence: false,
    },
    completelyOut: {
      email: false,
      push: false,
      silence: false,
    },
    newlyAdded: {
      email: false,
      push: false,
      silence: false,
    },
  },
  workForce: {
    leaveRequest: {
      email: false,
      push: false,
      silence: false,
    },
    performanceChanges: {
      email: false,
      push: false,
      silence: false,
    },
    lateArrivals: {
      email: false,
      push: false,
      silence: false,
    },
    earlyLeave: {
      email: false,
      push: false,
      silence: false,
    },
  },
};

export const getNotification = () => {
  return notification;
};
