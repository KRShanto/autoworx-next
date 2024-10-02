import { TNotification } from "@/types/notification";
const notification: TNotification = {
  LeadsGeneratedAndSalesPipeline: {
    leadsGenerated: {
      email: false,
      push: false
    },
    leadsClosed: {
      email: false,
      push: false
    },
    followUp: {
      email: false,
      push: false
    },
    leadsAssigned: {
      email: false,
      push: false
    },
    stage: {
      email: false,
      push: false
    },
  },
  operationPipeline: {
    workOrderCreated: {
      email: false,
      push: false
    },
    workOrderCompleted: {
      email: false,
      push: false
    },
    dueDateProximity: {
      email: false,
      push: false
    },
  },
  calendarAndTasks: {
    taskAssigned: {
      email: false,
      push: false
    },
    taskFinished: {
      email: false,
      push: false
    },
    appointmentCreated: {
      email: false,
      push: false
    },
    appointmentReminder: {
      email: false,
      push: false
    },
    taskReminder: {
      email: false,
      push: false
    },
  },
  estimateAndInvoices: {
    estimateCreated: {
      email: false,
      push: false
    },
    invoiceCreated: {
      email: false,
      push: false
    },
  },
  payments: {
    paymentReceived: {
      email: false,
      push: false
    },
    paymentDue: {
      email: false,
      push: false
    },
    Deposit: {
      email: false,
      push: false
    },
  },
  communications: {
    internalMessageAlert: {
      email: false,
      push: false
    },
    clientMessageAlert: {
      email: false,
      push: false
    },
    clientCallAlert: {
      email: false,
      push: false
    },
    clientEmailAlert: {
      email: false,
      push: false
    },
    collaborationMessageAlert: {
      email: false,
      push: false
    },
  },
  inventory: {
    newInventory: {
      email: false,
      push: false
    },
    completelyOut: {
      email: false,
      push: false
    },
    newlyAdded: {
      email: false,
      push: false
    },
  },
  workForce: {
    leaveRequest: {
      email: false,
      push: false
    },
    performanceChanges: {
      email: false,
      push: false
    },
    lateArrivals: {
      email: false,
      push: false
    },
    earlyLeave: {
      email: false,
      push: false
    },
  },
};

export const getNotification = () => {
  return notification;
};
