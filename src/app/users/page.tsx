"use client";
import { Table, Thead, Tbody, Tr, Th, Td, Switch, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  org?: string;
  isadmin: boolean;
}
export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", { method: "GET" });
        if (!res.ok) {
          throw new Error("Failed to fetch users from database");
        }
        const data = await res.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  /**
   * ToDo: Disable or enable user's admin status
   *
   * @param _id - User Id of the row where button was toggled
   */
  function handleSwitchChange(_id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="px-10">
      <h1 className="font-bold text-3xl my-5">Admin Dashboard</h1>
      <h2 className="font-[600] text-2xl">Spokes Member List</h2>
      {users.length > 0 ? (
        <Table className="mt-5">
          <Thead>
            <Tr>
              <Th fontWeight="bold" color="black" fontSize="lg">
                Name
              </Th>
              <Th fontWeight="bold" color="black" fontSize="lg">
                Email
              </Th>
              <Th fontWeight="bold" color="black" fontSize="lg">
                Organization
              </Th>
              <Th fontWeight="bold" color="black" fontSize="lg">
                Member Status
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((item) => (
              <Tr key={item._id}>
                <Td>{item.name}</Td>
                <Td>{item.email}</Td>
                <Td> {item.org ?? "N/A"}</Td>
                <Td>
                  <div className="flex items-center">
                    <span className={item.isadmin ? "inline-block w-20" : "inline-block w-20 text-green-500"}>
                      {item.isadmin ? "Member" : "Non-Member"}
                    </span>
                    <Switch className="ml-4" size="sm" onChange={() => handleSwitchChange(item._id)} />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <h1 className="mx-auto my-10 text-3xl">Loading...</h1>
      )}
    </div>
  );
}
