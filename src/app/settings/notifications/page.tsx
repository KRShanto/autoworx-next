import NotificationServiceContainer from "./NotificationServiceContainer";
import { getNotification } from "./notification.data";
import NotificationProvider from "provider/NotificationProvider";
import { db } from "@/lib/db";

const NotificationSettingPage = async () => {
  const notification = getNotification();
  let findNotification = await db.notificationSettings.findFirst({
    where: {
      type: "notification",
    },
  });

  if (!findNotification) {
    // Create a new notification record for the company
    findNotification = await db.notificationSettings.create({
      data: {
        notifications: notification,
      },
    });
  }
  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <h3 className="my-4 text-lg font-bold">Overall Notification Settings</h3>
      <h3 className="my-4 text-lg italic">
        Toggle between email, push and silenced notifications for the following
      </h3>
      <NotificationProvider notification={findNotification.notifications}>
        <div className="grid grid-cols-2 gap-x-8">
          {/* account detail */}
          <div className="#w-1/2">
            <div className="space-y-4 rounded-md p-8">
              <NotificationServiceContainer
                serviceKey={"LeadsGeneratedAndSalesPipeline"}
              />
              <NotificationServiceContainer serviceKey={"operationPipeline"} />
              <NotificationServiceContainer serviceKey={"calendarAndTasks"} />
              <NotificationServiceContainer
                serviceKey={"estimateAndInvoices"}
              />
            </div>
          </div>
          {/* new password */}
          <div className="#w-1/2">
            <div className="space-y-4 rounded-md p-8">
              <NotificationServiceContainer serviceKey="payments" />
              <NotificationServiceContainer serviceKey="communications" />
              <NotificationServiceContainer serviceKey="inventory" />
              <NotificationServiceContainer serviceKey="workForce" />
            </div>
          </div>
        </div>
      </NotificationProvider>
    </div>
  );
};

export default NotificationSettingPage;
