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
import TableSkeleton from "@/components/ui/UserTableSkeleton";

interface User {
  _id: string;
  name: string;
  email: string;
  organizationName?: string;
  paidMember: boolean;
  postedJobs: [string];
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

    // Add filter type to filename
    if (filterType !== "all") {
      filename += `-${filterType}`;
    }
    if (searchQuery) {
      filename += `-search-${searchQuery.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
    }

    // Prepare headers
    const headers = ["Name", "Email", "Organization", "Member Status"];

    if (fileFormat === "csv") {
      mimeType = "text/csv";
      filename += ".csv";
      content = headers.join(",") + "\n";
      filteredUsers.forEach((user) => {
        content += `${user.name},${user.email},${user.organizationName || "N/A"},${user.paidMember ? "Member" : "Non-member"}\n`;
      });
    } else if (fileFormat === "json") {
      mimeType = "application/json";
      filename += ".json";
      content = JSON.stringify(filteredUsers, null, 2);
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
    <div className="w-full min-h-[calc(100vh-100px)]">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col text-black gap-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl">Spokes Member List</h2>
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
            <span className="max-[500px]:hidden">Manage Jobs</span>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-gray-700">Filter by Status</label>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                border="1px solid #E2E8F0"
                height={"40px"}
                className="rounded-md focus:ring-1 focus:ring-[#045F87] focus:border-[#045F87] transition-all"
              >
                <option value="all">All Users</option>
                <option value="members">Members Only</option>
                <option value="non-members">Non-Members Only</option>
              </Select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or organization"
                  className="border border-[#E2E8F0] rounded-md w-full h-[40px] pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-[#045F87] focus:border-[#045F87] transition-all"
                />
                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Export</label>
              <button
                onClick={onOpen}
                className="cursor-pointer border-2 border-[#045F87] bg-[#045F87] text-white rounded-md h-[40px] px-4 flex items-center justify-center gap-2 hover:bg-[#034A6B] transition-all whitespace-nowrap font-medium shadow-sm hover:shadow-md"
              >
                Download <DownloadIcon className="ml-1" />
              </button>
            </div>
          </div>
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

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Download Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      • File will be named:{" "}
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{`spokes-users${filterType !== "all" ? `-${filterType}` : ""}${searchQuery ? `-search-${searchQuery.substring(0, 10)}${searchQuery.length > 10 ? "..." : ""}` : ""}.${fileFormat}`}</span>
                    </p>
                    <p>• {filteredUsers.length} users will be included</p>
                    <p>
                      • Filter:{" "}
                      {filterType === "all"
                        ? "All Users"
                        : filterType === "members"
                          ? "Members Only"
                          : "Non-Members Only"}
                    </p>
                    {searchQuery && <p>• Search term: &quot;{searchQuery}&quot;</p>}
                  </div>
                </div>

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
            <Table className="mb-5 min-w-[600px] w-full" variant="simple" borderColor="gray.300">
              <Thead>
                <Tr className="">
                  <Th
                    fontWeight="bold"
                    color="black"
                    fontSize="xl"
                    textTransform="none"
                    borderColor="gray.200"
                    pl={0}
                    py={4}
                  >
                    Name
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.200" py={4}>
                    Email
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.200" py={4}>
                    Organization
                  </Th>
                  <Th
                    fontWeight="bold"
                    color="black"
                    fontSize="xl"
                    textTransform="none"
                    borderColor="gray.200"
                    pr={0}
                    py={4}
                  >
                    Member status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((item) => (
                  <Tr
                    key={item._id}
                    className="transition-colors hover:bg-gray-50 border-b border-gray-200"
                    borderColor="gray.200"
                  >
                    <Td className="w-1/4" borderColor="gray.200" pl={0} py={4}>
                      <span className="text-md font-medium text-gray-900">{item.name}</span>
                    </Td>
                    <Td className="w-1/3" borderColor="gray.200" py={4}>
                      <span className="text-md text-gray-600">{item.email}</span>
                    </Td>
                    <Td className="w-1/4" borderColor="gray.200" py={4}>
                      <span className="text-md text-gray-600">{item.organizationName ?? "N/A"}</span>
                    </Td>
                    <Td className="w-1/6" borderColor="gray.200" pr={0} py={4}>
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
            <div className="relative h-32 -mt-8">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-white"></div>
            </div>
          </Box>
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
}
