"use client";
import React, { useState, useEffect } from "react";
import Search from "@/app/employee/components/Search";
import { BiSolidEditAlt } from "react-icons/bi";
import Image from "next/image";
import CustomizeUserRole from "./CustomizeUserRole";
import { EmployeeType, Role } from "@prisma/client";
import { teamManagementUser } from "@/actions/settings/teamManagement";
import { useEmployeeWorkFilterStore } from "@/stores/employeeWorkFilter";


interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  role: Role;
  image: string;
  employeeType: EmployeeType;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(true);
  const { search } = useEmployeeWorkFilterStore();

  useEffect(() => {
    const usersFetchFunction = async () => {
      try {
        const fetchedUsers = await teamManagementUser();
        const searchedUsers=search.toLowerCase();
        let filteredUsers = fetchedUsers.filter(user => user.employeeType !== EmployeeType.Admin);
        if(searchedUsers){
            filteredUsers=filteredUsers.filter(user=>
              `${user.firstName}${user.lastName}`.toLowerCase().includes(searchedUsers)
            );
        }
        setUsers(filteredUsers);
      } catch (error: any) {
        console.log(error);
      }
    };

    usersFetchFunction();

    
  }, [search]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setOpenEdit(false);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
    setOpenEdit(true);
  };

  return (
    <div className="relative w-full">
      <div className="mb-2 mt-2">
        <h2 className="pl-2 text-xl font-semibold">User Roles (Custom)</h2>
      </div>

      <div className="m-2 overflow-x-auto rounded-lg bg-white p-4 shadow-md">
        {selectedUser && (
          <CustomizeUserRole user={selectedUser} onBack={handleBackClick} />
        )}
        {openEdit && (
          <>
            <h3 className="text-lg font-medium">User List</h3>
            <div className="mb-4 mt-4">
              <Search 
              
              />
            </div>
            <ul>
              {users.map((user) => {
                const name = `${user.firstName} ${user.lastName}`;
                return (
                  <li
                    key={user.id}
                    className="mb-2 flex items-center rounded-md border border-[#66738C] p-2"
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={user.image}
                        alt={name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-md font-semibold">{name}</h4>
                      <p className="text-sm text-gray-500">{user.employeeType}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-800 hover:underline"
                      >
                        <BiSolidEditAlt />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
