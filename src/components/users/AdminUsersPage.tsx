"use client";

import { DownloadIcon } from "@chakra-ui/icons/Download";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import TableSkeleton from "@/components/ui/UserTableSkeleton";
import OrganizationSelect from "@/components/ui/OrganizationSelect";

interface User {
  _id: string;
  name: string;
  email: string;
  organizationName?: string;
  paidMember: boolean;
  postedJobs: string[];
  postedEvents?: string[];
}

type AdminUsersPageProps = {
  backHref?: string;
  backLabel?: string;
};

export default function AdminUsersPage({ backHref, backLabel }: AdminUsersPageProps) {
  const toast = useToast();
  const { userId } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [fileFormat, setFileFormat] = useState("csv");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [organizationToDelete, setOrganizationToDelete] = useState("");
  const [organizationDeleteConfirmation, setOrganizationDeleteConfirmation] = useState("");
  const [organizationReloadKey, setOrganizationReloadKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [organizationDraft, setOrganizationDraft] = useState("");
  const [isLoadingOrganizationOptions, setIsLoadingOrganizationOptions] = useState(false);
  const [isSavingOrganization, setIsSavingOrganization] = useState(false);
  const [isDeletingOrganization, setIsDeletingOrganization] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const { isOpen: isDownloadOpen, onOpen: onDownloadOpen, onClose: onDownloadClose } = useDisclosure();
  const { isOpen: isOrganizationOpen, onOpen: onOrganizationOpen, onClose: onOrganizationClose } = useDisclosure();
  const {
    isOpen: isDeleteOrganizationOpen,
    onOpen: onDeleteOrganizationOpen,
    onClose: onDeleteOrganizationClose,
  } = useDisclosure();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users", { method: "GET" });
      if (!res.ok) {
        throw new Error("Failed to fetch users from database");
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = (users ?? []).filter((user) => {
    const searchQueryLower = (searchQuery || "").toLowerCase();
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchQueryLower) ||
      (user.email || "").toLowerCase().includes(searchQueryLower) ||
      (user.organizationName || "").toLowerCase().includes(searchQueryLower);

    const matchesFilter =
      filterType === "all" ||
      (filterType === "members" && user.paidMember) ||
      (filterType === "non-members" && !user.paidMember);

    return matchesSearch && matchesFilter;
  });

  const currentAdmin = users?.find((user) => user._id === userId);
  const isOwnOrganizationSelected =
    !!organizationToDelete &&
    !!currentAdmin?.organizationName &&
    currentAdmin.organizationName.trim().toLowerCase() === organizationToDelete.trim().toLowerCase();

  async function handleSwitchChange(_id: string): Promise<void> {
    if (!users) return;

    const user = users.find((currentUser) => currentUser._id === _id);
    if (!user) return;

    const newMemberStatus = !user.paidMember;
    setUsers(
      (currentUsers) =>
        currentUsers?.map((currentUser) =>
          currentUser._id === _id ? { ...currentUser, paidMember: newMemberStatus } : currentUser,
        ) ?? null,
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
        throw new Error("Failed to update membership status");
      }
    } catch (error) {
      console.error("Failed to update membership status:", error);
      setUsers(
        (currentUsers) =>
          currentUsers?.map((currentUser) =>
            currentUser._id === _id ? { ...currentUser, paidMember: user.paidMember } : currentUser,
          ) ?? null,
      );
      toast({
        title: "Failed to update membership",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  const handleOpenOrganizationModal = (user: User) => {
    setSelectedUser(user);
    setOrganizationDraft(user.organizationName ?? "");
    setIsLoadingOrganizationOptions(true);
    onOrganizationOpen();
  };

  const handleSaveOrganization = async () => {
    if (!selectedUser || !organizationDraft.trim()) return;

    try {
      setIsSavingOrganization(true);
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationName: organizationDraft }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.message || "Failed to update user organization");
      }

      const updatedUser = await res.json();
      setUsers(
        (currentUsers) => currentUsers?.map((user) => (user._id === selectedUser._id ? updatedUser : user)) ?? null,
      );
      setOrganizationReloadKey((key) => key + 1);
      onOrganizationClose();
      toast({
        title: "Organization updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to update organization:", error);
      toast({
        title: "Failed to update organization",
        description: error instanceof Error ? error.message : "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSavingOrganization(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user._id === userId) {
      toast({
        title: "You cannot delete your own user",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (!window.confirm(`Delete ${user.name || user.email}? This also deletes their jobs and events.`)) {
      return;
    }

    try {
      setDeletingUserId(user._id);
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.message || "Failed to delete user");
      }

      setUsers((currentUsers) => currentUsers?.filter((currentUser) => currentUser._id !== user._id) ?? null);
      setOrganizationReloadKey((key) => key + 1);
      toast({
        title: "User deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!organizationToDelete) return;

    if (isOwnOrganizationSelected) {
      toast({
        title: "You cannot delete your own organization",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setIsDeletingOrganization(true);
      const res = await fetch("/api/organizations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationName: organizationToDelete }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.message || "Failed to delete organization");
      }

      const result = await res.json();
      await fetchUsers();
      setOrganizationToDelete("");
      setOrganizationDeleteConfirmation("");
      onDeleteOrganizationClose();
      setOrganizationReloadKey((key) => key + 1);
      toast({
        title: "Organization deleted",
        description: `${result.usersDeleted} users, ${result.jobsDeleted} jobs, and ${result.eventsDeleted} events removed.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to delete organization:", error);
      toast({
        title: "Failed to delete organization",
        description: error instanceof Error ? error.message : "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsDeletingOrganization(false);
    }
  };

  const openDeleteOrganizationConfirmation = () => {
    if (!organizationToDelete) return;

    if (isOwnOrganizationSelected) {
      toast({
        title: "You cannot delete your own organization",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setOrganizationDeleteConfirmation("");
    onDeleteOrganizationOpen();
  };

  const handleDownload = () => {
    let content = "";
    let filename = "spokes-users";
    let mimeType = "";

    if (filterType !== "all") {
      filename += `-${filterType}`;
    }
    if (searchQuery) {
      filename += `-search-${searchQuery.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
    }

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

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    onDownloadClose();
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)]">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col text-black gap-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl">Users</h2>
          {backHref && backLabel && (
            <Link
              href={backHref}
              className="px-4 py-2 bg-[#045F87] text-white rounded-md hover:bg-[#034A6B] transition-colors flex items-center gap-2 w-fit"
            >
              {backLabel}
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm w-full">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-gray-700">Filter by Status</label>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                border="1px solid #E2E8F0"
                height="40px"
              >
                <option value="all">All Users</option>
                <option value="members">Members Only</option>
                <option value="non-members">Non-Members Only</option>
              </Select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or organization"
                className="border border-[#E2E8F0] rounded-md w-full h-[40px] px-3 focus:outline-none focus:ring-1 focus:ring-[#045F87] focus:border-[#045F87] transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Export</label>
              <button
                onClick={onDownloadOpen}
                className="cursor-pointer border-2 border-[#045F87] bg-[#045F87] text-white rounded-md h-[40px] px-4 flex items-center justify-center gap-2 hover:bg-[#034A6B] transition-all whitespace-nowrap font-medium shadow-sm hover:shadow-md"
              >
                Download <DownloadIcon className="ml-1" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 bg-white p-4 rounded-lg border border-red-100 shadow-sm w-full">
            <FormControl className="w-full sm:max-w-md">
              <FormLabel className="text-sm font-medium text-gray-700">Delete Organization</FormLabel>
              <OrganizationSelect
                value={organizationToDelete}
                onChange={setOrganizationToDelete}
                allowCreateNew={false}
                reloadKey={organizationReloadKey}
                placeholder="Select organization"
                bg="white"
                border="1px solid #E2E8F0"
              />
            </FormControl>
            <div className="flex">
              <Button
                onClick={openDeleteOrganizationConfirmation}
                disabled={!organizationToDelete || isOwnOrganizationSelected || isDeletingOrganization}
                colorScheme="red"
                height="40px"
              >
                Delete Organization
              </Button>
            </div>
          </div>
        </div>

        <Modal isOpen={isDownloadOpen} onClose={onDownloadClose} isCentered>
          <ModalOverlay />
          <ModalContent className="rounded-lg">
            <ModalHeader className="text-2xl font-semibold border-b pb-4">Download User List</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} className="pt-6">
              <div className="flex flex-col gap-6">
                <p className="text-gray-600 font-medium">Select file format:</p>
                <RadioGroup value={fileFormat} onChange={setFileFormat}>
                  <Stack direction="row" spacing={8}>
                    <Radio value="csv" colorScheme="blue">
                      <span className="font-medium">CSV</span>
                    </Radio>
                    <Radio value="json" colorScheme="blue">
                      <span className="font-medium">JSON</span>
                    </Radio>
                  </Stack>
                </RadioGroup>

                <div className="flex justify-end gap-3 mt-2">
                  <Button onClick={onDownloadClose} variant="ghost">
                    Cancel
                  </Button>
                  <Button onClick={handleDownload} bg="#045F87" color="white" _hover={{ bg: "#034A6B" }}>
                    Download
                  </Button>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={isOrganizationOpen} onClose={onOrganizationClose} isCentered>
          <ModalOverlay />
          <ModalContent className="rounded-lg">
            <ModalHeader className="text-2xl font-semibold border-b pb-4">Edit Organization</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} className="pt-6">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-medium text-gray-900">{selectedUser?.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser?.email}</p>
                </div>
                <div className="relative h-[40px] overflow-hidden">
                  <OrganizationSelect
                    value={organizationDraft}
                    onChange={setOrganizationDraft}
                    reloadKey={organizationReloadKey}
                    onLoadingChange={setIsLoadingOrganizationOptions}
                    bg="#F6F6F6"
                  />
                  {isLoadingOrganizationOptions && (
                    <div className="absolute inset-0 flex items-center rounded-md border border-[#E2E8F0] bg-[#F6F6F6] px-4 text-gray-500">
                      Loading organizations...
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button onClick={onOrganizationClose} variant="ghost">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveOrganization}
                    isLoading={isSavingOrganization}
                    disabled={!organizationDraft.trim()}
                    bg="#045F87"
                    color="white"
                    _hover={{ bg: "#034A6B" }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={isDeleteOrganizationOpen} onClose={onDeleteOrganizationClose} isCentered>
          <ModalOverlay />
          <ModalContent className="rounded-lg">
            <ModalHeader className="text-2xl font-semibold border-b pb-4">Delete Organization</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} className="pt-6">
              <div className="flex flex-col gap-5">
                <p className="text-gray-700">
                  This will delete all users, jobs, and events in{" "}
                  <span className="font-semibold text-gray-900">{organizationToDelete}</span>.
                </p>
                <FormControl>
                  <FormLabel>Type the organization name to confirm</FormLabel>
                  <input
                    type="text"
                    value={organizationDeleteConfirmation}
                    onChange={(e) => setOrganizationDeleteConfirmation(e.target.value)}
                    className="border border-[#E2E8F0] rounded-md w-full h-[40px] px-3 focus:outline-none focus:ring-1 focus:ring-[#045F87] focus:border-[#045F87] transition-all"
                  />
                </FormControl>
                <div className="flex justify-end gap-3">
                  <Button onClick={onDeleteOrganizationClose} variant="ghost">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteOrganization}
                    isLoading={isDeletingOrganization}
                    disabled={organizationDeleteConfirmation !== organizationToDelete || isDeletingOrganization}
                    colorScheme="red"
                  >
                    Delete Organization
                  </Button>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        {users === null ? (
          <TableSkeleton />
        ) : (
          <Box overflowX="auto" className="px-2">
            <Table className="mb-5 min-w-[760px] w-full" variant="simple" borderColor="gray.300">
              <Thead>
                <Tr>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.200" pl={0}>
                    Name
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.200">
                    Email
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.200">
                    Organization
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.200">
                    Member
                  </Th>
                  <Th fontWeight="bold" color="black" fontSize="xl" textTransform="none" borderColor="gray.200" pr={0}>
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((item) => (
                  <Tr key={item._id} className="transition-colors hover:bg-gray-50 border-b border-gray-200">
                    <Td className="w-1/5" borderColor="gray.200" pl={0} py={4}>
                      <span className="text-md font-medium text-gray-900">{item.name}</span>
                    </Td>
                    <Td className="w-1/4" borderColor="gray.200" py={4}>
                      <span className="text-md text-gray-600">{item.email}</span>
                    </Td>
                    <Td className="w-1/4" borderColor="gray.200" py={4}>
                      <span className="text-md text-gray-600">{item.organizationName ?? "N/A"}</span>
                    </Td>
                    <Td className="w-1/6" borderColor="gray.200" py={4}>
                      <div className="flex items-center gap-4">
                        <span className={`text-md font-medium ${item.paidMember ? "text-green-600" : "text-gray-600"}`}>
                          {item.paidMember ? "Member" : "Non-member"}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.paidMember}
                          onClick={() => handleSwitchChange(item._id)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
                            item.paidMember ? "bg-[#045F87]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                              item.paidMember ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </Td>
                    <Td className="w-1/5" borderColor="gray.200" pr={0} py={4}>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenOrganizationModal(item)}>
                          Edit Org
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          disabled={item._id === userId}
                          isLoading={deletingUserId === item._id}
                          onClick={() => handleDeleteUser(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {filteredUsers.length === 0 && (
              <div className="py-8 text-center text-gray-500 bg-[#f7f7f7] rounded-md">No users found</div>
            )}
          </Box>
        )}
      </div>
    </div>
  );
}
