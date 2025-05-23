"use client";
import { DownloadIcon } from "@chakra-ui/icons/Download";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Box,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import TableSkeleton from "@/components/UserTableSkeleton";

interface User {
  _id: string;
  name: string;
  email: string;
  organizationName?: string;
  paidMember: boolean;
  postedJobs: [string];
  isadmin: boolean;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileFormat, setFileFormat] = useState("csv");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredUsers = users.filter((user) => {
    const searchQueryLower = (searchQuery || "").toLowerCase();
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchQueryLower) ||
      (user.organizationName || "").toLowerCase().includes(searchQueryLower);

    const matchesFilter =
      filterType === "all" ||
      (filterType === "members" && user.paidMember) ||
      (filterType === "non-members" && !user.paidMember);

    return matchesSearch && matchesFilter;
  });

  /**
   * ToDo: Disable or enable user's admin status on database
   *
   * @param _id - User Id of the row where button was toggled
   */
  async function handleSwitchChange(_id: string): Promise<void> {
    const userIndex = users.findIndex((user) => user._id === _id);
    const newMemberStatus = !users[userIndex].paidMember;
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user._id === _id ? { ...user, paidMember: newMemberStatus } : user)),
    );
    try {
      const res = await fetch(`/api/users/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paidMember: newMemberStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update users admin status");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  const handleDownload = () => {
    let content = "";
    let filename = "spokes-users";
    let mimeType = "";

    // Prepare headers
    const headers = ["Name", "Email", "Organization", "Member Status"];

    if (fileFormat === "csv") {
      mimeType = "text/csv";
      filename += ".csv";
      content = headers.join(",") + "\n";
      users.forEach((user) => {
        content += `${user.name},${user.email},${user.organizationName || "N/A"},${user.paidMember ? "Member" : "Non-member"}\n`;
      });
    } else if (fileFormat === "json") {
      mimeType = "application/json";
      filename += ".json";
      content = JSON.stringify(users, null, 2);
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    onClose();
  };

  return (
    <div className="w-full">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col text-black">
        <h1 className="font-bold text-3xl mb-16">Admin Dashboard</h1>
        <div className="flex justify-between items-center mb-7">
          <h2 className="font-semibold text-3xl">Spokes Member List</h2>
          <Link
            href="/admin"
            className="px-4 py-2 bg-[#045F87] text-white rounded-md hover:bg-[#034A6B] transition-colors flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Manage Jobs
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            border="1px solid black"
            width={"150px"}
            height={"40px"}
          >
            <option value="all">All</option>
            <option value="members">Members</option>
            <option value="non-members">Non-Members</option>
          </Select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name or Org"
            className="border border-black rounded-[5px] w-[210px] h-[40px] px-2"
          />
          <button
            onClick={onOpen}
            className="border border-black bg-[#045F87] text-white rounded-[5px] w-[130px] h-[40px] flex items-center justify-center gap-2"
          >
            Download <DownloadIcon className="ml-2" />
          </button>
        </div>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent className="rounded-lg">
            <ModalHeader className="text-2xl font-semibold border-b pb-4">Download User List</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} className="pt-6">
              <div className="flex flex-col gap-6">
                <p className="text-gray-600 font-medium">Select file format:</p>
                <RadioGroup value={fileFormat} onChange={setFileFormat}>
                  <Stack direction="row" spacing={8}>
                    <Radio
                      value="csv"
                      colorScheme="blue"
                      className="[&>span[data-checked]]:bg-[#045F87] [&>span[data-checked]]:border-[#045F87]"
                    >
                      <span className="font-medium">CSV</span>
                    </Radio>
                    <Radio
                      value="json"
                      colorScheme="blue"
                      className="[&>span[data-checked]]:bg-[#045F87] [&>span[data-checked]]:border-[#045F87]"
                    >
                      <span className="font-medium">JSON</span>
                    </Radio>
                  </Stack>
                </RadioGroup>
                <div className="flex justify-end gap-3 mt-2">
                  <Button onClick={onClose} variant="ghost" className="hover:bg-gray-100">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDownload}
                    bg="#045F87"
                    color="white"
                    _hover={{ bg: "#034A6B" }}
                    className="font-medium"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        {users.length > 0 ? (
          <Box overflowX="auto" className="px-2">
            <Table className="my-5 min-w-[600px] w-full" variant="simple" borderColor="gray.300">
              <Thead>
                <Tr>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300" pl={0}>
                    Name
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300">
                    Email
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300">
                    Organization
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.300" pr={0}>
                    Member status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((item) => (
                  <Tr key={item._id} className="transition-colors hover:bg-gray-50" borderColor="gray.300">
                    <Td className="w-1/4" borderColor="gray.300" pl={0}>
                      <span className="text-md pl-2">{item.name}</span>
                    </Td>
                    <Td className="w-1/3" borderColor="gray.300">
                      {item.email}
                    </Td>
                    <Td className="w-1/4" borderColor="gray.300">
                      {item.organizationName ?? "N/A"}
                    </Td>
                    <Td className="w-1/6" borderColor="gray.300" pr={0}>
                      <div className="flex items-center justify-between py-2 pr-2">
                        <span
                          className={`inline-block w-28 text-md font-medium transition-colors ${
                            item.paidMember ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {item.paidMember ? "Member" : "Non-member"}
                        </span>
                        <Switch
                          size="md"
                          colorScheme="blue"
                          isChecked={item.paidMember}
                          onChange={() => handleSwitchChange(item._id)}
                          className="transition-transform hover:scale-105 [&>span[data-checked]]:bg-[#045F87]"
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div className="h-16 border-t border-gray-200 mt-8"></div>
          </Box>
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
}
