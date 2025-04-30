"use client";
import { DownloadIcon } from "@chakra-ui/icons/Download";
import { Table, Thead, Tbody, Tr, Th, Td, Switch, Box, Select } from "@chakra-ui/react";
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
   * ToDo: Disable or enable user's admin status on database
   *
   * @param _id - User Id of the row where button was toggled
   */
  function handleSwitchChange(_id: string): void {
    const userIndex = users.findIndex((user) => user._id === _id);
    const newAdminStatus = !users[userIndex].isadmin;
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user._id === _id ? { ...user, isadmin: newAdminStatus } : user)),
    );
    throw new Error("Function not implemented.");
  }

  return (
    <div className="px-10">
      <h1 className="font-bold text-3xl my-5">Admin Dashboard</h1>
      <h2 className="font-[600] text-2xl">Spokes Member List</h2>
      <div className="flex flex-col sm:flex-row mt-5 gap-4">
        <Select placeholder="Filter List" border="1px solid black" width={"121px"} height={"40px"}>
          <option>test</option>
        </Select>
        <input
          type="text"
          placeholder="Search by Name or Email"
          className="border border-black rounded-[5px] w-[210px] h-[40px] px-2"
        />
        <button className="border border-black bg-[#045F87] text-white rounded-[5px] w-[130px] h-[40px]">
          Download <DownloadIcon className="ml-2" />
        </button>
      </div>
      {users.length > 0 ? (
        <Box overflowX="auto">
          <Table className="mt-5 min-w-[600px]">
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
                      <span className={item.isadmin ? "inline-block w-20 text-green-500" : "inline-block w-20"}>
                        {item.isadmin ? "Member" : "Non-Member"}
                      </span>
                      <Switch
                        size="md"
                        className="ml-4"
                        isChecked={item.isadmin}
                        onChange={() => handleSwitchChange(item._id)}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <h1 className="mx-auto my-10 text-3xl">Loading...</h1>
      )}
    </div>
  );
}
