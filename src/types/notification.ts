type TSwitchValue = {
  email: boolean;
  push: boolean;
  silence: boolean;
};

export type TNotification = {
  LeadsGeneratedAndSalesPipeline: {
    leadsGenerated: TSwitchValue;
    leadsClosed: TSwitchValue;
    followUp: TSwitchValue;
    leadsAssigned: TSwitchValue;
    stage: TSwitchValue;
  };
  operationPipeline: {
    workOrderCreated: TSwitchValue;
    workOrderCompleted: TSwitchValue;
    dueDateProximity: TSwitchValue;
  };
  calendarAndTasks: {
    taskAssigned: TSwitchValue;
    taskFinished: TSwitchValue;
    appointmentCreated: TSwitchValue;
    appointmentReminder: TSwitchValue;
    taskReminder: TSwitchValue;
  };
  estimateAndInvoices: {
    estimateCreated: TSwitchValue;
    invoiceCreated: TSwitchValue;
  };
  payments: {
    paymentReceived: TSwitchValue;
    paymentDue: TSwitchValue;
    Deposit: TSwitchValue;
  };
  communications: {
    internalMessageAlert: TSwitchValue;
    clientMessageAlert: TSwitchValue;
    clientCallAlert: TSwitchValue;
    clientEmailAlert: TSwitchValue;
    collaborationMessageAlert: TSwitchValue;
  };
  inventory: {
    newInventory: TSwitchValue;
    completelyOut: TSwitchValue;
    newlyAdded: TSwitchValue;
  };
  workForce: {
    leaveRequest: TSwitchValue;
    performanceChanges: TSwitchValue;
    lateArrivals: TSwitchValue;
    earlyLeave: TSwitchValue;
  };
};