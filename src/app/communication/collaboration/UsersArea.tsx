import { cn } from "@/lib/cn";
import { Attachment, Message } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";
import UserMessageBox from "./UserMessageBox";

export default function UsersArea({
  currentUser,
  selectedUsersList,
  setSelectedUsersList,
  totalMessageBoxLength,
  className,
}: {
  previousMessages: (Message & { attachment: Attachment[] | null })[];
  currentUser: NextAuthUser;
  selectedUsersList: any[];
  setSelectedUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  totalMessageBoxLength: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full gap-3 md:h-[83vh]",
        totalMessageBoxLength > 1 ? "grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {selectedUsersList &&
        selectedUsersList?.length > 0 &&
        selectedUsersList.map((user) => {
          return (
            <UserMessageBox
              key={user.id}
              user={user}
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
