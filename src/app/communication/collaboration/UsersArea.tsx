import { cn } from "@/lib/cn";
import { Attachment, Message } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";
import UserMessageBox from "../internal/UserMessageBox";

export default function UsersArea({
  currentUser,
  selectedUsersList,
  setSelectedUsersList,
  totalMessageBoxLength,
  companyName,
}: {
  companyName: string | null;
  previousMessages: (Message & { attachment: Attachment | null })[];
  currentUser: NextAuthUser;
  selectedUsersList: any[];
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  totalMessageBoxLength: number;
}) {
  return (
    <div
      className={cn(
        "grid h-[88vh] w-full gap-3",
        totalMessageBoxLength > 1 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {selectedUsersList.map((user) => {
        return (
          <UserMessageBox
            key={user.id}
            user={user}
            companyName={companyName}
            setUsersList={setSelectedUsersList}
            totalMessageBoxLength={totalMessageBoxLength}
          />
        );
      })}

      {totalMessageBoxLength === 3 && (
        <div
          className={cn(
            "app-shadow flex w-full border-spacing-4 flex-col overflow-hidden rounded-lg max-[1400px]:w-[100%]",
            totalMessageBoxLength > 2 && "h-[44vh]",
          )}
          style={{
            borderWidth: "4px",
            borderColor: "#006D77",
            borderStyle: "dashed",
            backgroundColor: "#DFEBED",
          }}
        />
      )}
    </div>
  );
}
