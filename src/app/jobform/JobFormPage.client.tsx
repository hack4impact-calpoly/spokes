"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormReset } from "@/app/jobform/FormResetContext";
import {
  Box,
  Button,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  useRadioGroup,
  Link,
  Collapse,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import RadioCard from "@/components/RadioCard";
import TagSelect from "@/components/TagSelect";
import { Option } from "@/components/TagsMultiselect/multiselect";
import { cn } from "@/lib/utils";
import JobConfirmationModal from "@/components/JobModals/JobConfirmationModal";
import JobActionConfirmationModal from "@/components/JobModals/JobActionConfirmationModal";
import JobCardModal from "@/components/JobCard/JobCardModal";
import JobEditedModal from "@/components/JobModals/JobEditedModal";
import JobFailModal from "@/components/JobModals/JobFailModal";
import { useUser } from "@clerk/nextjs";
import { UserInterface as User } from "@/database/userSchema";

function formatIndustries(industries: string[]): Option[] {
  return industries.map((industry) => ({
    value: industry,
    label: industry,
  }));
}

type RejectionEmailPayload = {
  title: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
};

async function sendRejectionEmail(jobData: RejectionEmailPayload, reason: string = "No reason provided.") {
  const payload = {
    ...jobData,
    rejectionReason: reason,
  };

  try {
    const emailResponse = await fetch(`/api/send/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!emailResponse.ok) {
      console.error("Failed to send rejection email");
    }
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
}

type FormDataType = {
  organizationName: string;
  organizationIndustry: string[];
  title: string;
  postDate: string;
  modifiedDate: string;
  expireDate: string | null;
  jobDescription: string;
  employmentType: string;
  compensationType: string | null;
  jobStatus: string;
  contactName: string;
  contactEmail: string;
  detailURL: string;
  applyNowURL: string;
  rejectionMessage: string;
};

async function sendUpdateEmail(jobData: FormDataType) {
  try {
    const emailResponse = await fetch("/api/send/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!emailResponse.ok) {
      console.error("Failed to send update notification email:", await emailResponse.text());
      return;
    }

    console.log("Update notification email sent successfully");
  } catch (error) {
    console.error("Error sending update notification email:", error);
  }
}

const ensureHttps = (url: string | undefined): string | undefined => {
  if (!url) return url;
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

type JobFormPageProps = {
  isSpokesAdmin: Boolean;
  returnURL: string;
};

async function getUser(clerkUserId: string): Promise<User> {
  const response = await fetch(`/api/users/${clerkUserId}`);
  const data: User = await response.json();

  if (!response.ok || !data) {
    throw new Error("Failed to fetch organization name");
  }

  return data;
}

export default function JobFormPage({ isSpokesAdmin, returnURL }: JobFormPageProps) {
  const toast = useToast();
  const { register, handleSubmit: formHandleSubmit, reset } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const isEditing = Boolean(jobId);
  const { resetForm } = useFormReset();
  const { user } = useUser();

  const [formData, setFormData] = useState<FormDataType>({
    organizationName: "",
    organizationIndustry: [],
    title: "",
    postDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    expireDate: "",
    jobDescription: "",
    employmentType: "full-time",
    compensationType: null as string | null, // Allow null for volunteer jobs
    jobStatus: "pending",
    contactName: "",
    contactEmail: "",
    detailURL: "",
    applyNowURL: "",
    rejectionMessage: "",
  });

  const [loading, setLoading] = useState(false);
  const submitLockRef = useRef(false);
  const [loadingInfo, setLoadingInfo] = useState(isEditing);
  const [message, setMessage] = useState("");
  const [selectEmployment, setSelectEmployment] = useState("");
  const [selectCompensation, setSelectCompensation] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isActionConfirmationModalOpen, setIsActionConfirmationModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [showMaxError, setShowMaxError] = useState(false);
  const [action, setAction] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const employmentColorMapping = {
    "Full-Time": "#F8B1B8",
    "Part-Time": "#FFE297",
    Volunteer: "#C6D3FF",
  };

  const compensationColorMapping = {
    Salary: "#BDEABD",
    Hourly: "#87CEFA",
    Contract: "#FAC791",
  };

  useEffect(() => {
    if (!jobId) return;
    const fetchJob = async () => {
      try {
        setLoadingInfo(true);

        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();

        setFormData({
          ...data,
          contactEmail: data.contactEmail || "",
          detailURL: data.detailURL || "",
          applyNowURL: data.applyNowURL || "",
          postDate: data.postDate || new Date().toISOString(),
          modifiedDate: data.modifiedDate || new Date().toISOString(),
        });

        setSelectEmployment(data.employmentType);
        setSelectCompensation(data.compensationType);

        setLoadingInfo(false);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setLoadingInfo(false);
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    if (resetForm) {
      reset();
    }
  }, [resetForm, reset]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      try {
        setLoadingUser(true);
        const userData = await getUser(user.id);

        if (!isEditing) {
          setFormData((prev) => ({
            ...prev,
            organizationName: userData.organizationName?.toString() || "",
            contactName: userData.name?.toString() || "",
            contactEmail: userData.email?.toString() || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [user, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string[] } }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;
    setLoading(true);
    setMessage("");

    try {
      if (!user) throw new Error("User not authenticated");

      const formattedFormData = {
        ...formData,
        expireDate: formData.expireDate || null,
        detailURL: ensureHttps(formData.detailURL),
        applyNowURL: ensureHttps(formData.applyNowURL),
      };

      const emailResponse = await fetch("/api/send/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedFormData),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to send notification email. Job was not submitted.");
      }

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit job.");
      }

      toast({
        title: "Success!",
        description: `"${formData.title}" has been submitted`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setFormData({
        organizationName: "",
        organizationIndustry: [],
        title: "",
        postDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        expireDate: "",
        jobDescription: "",
        employmentType: "full-time",
        compensationType: "salary",
        jobStatus: "pending",
        contactName: "",
        contactEmail: "",
        detailURL: "",
        applyNowURL: "",
        rejectionMessage: rejectionReason,
      });
      setSelectEmployment("");
      setSelectCompensation("");

      setMessage("Job posted successfully!");
      setTimeout(() => {
        setMessage("");
      }, 3000);

      setIsSubmitModalOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit job. Please try again.";
      console.error("Error submitting job:", error);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setIsFailModalOpen(true);
      setMessage("Error submitting job.");
    } finally {
      submitLockRef.current = false;
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    setLoading(true);
    setMessage("");

    const formattedFormData = {
      ...formData,
      expireDate: formData.expireDate || null,
      modifiedDate: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formattedFormData,
          previousStatus: formData.jobStatus,
          newStatus: isSpokesAdmin ? formData.jobStatus : "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job.");
      }

      if (!isSpokesAdmin) {
        await sendUpdateEmail(formattedFormData);
      }

      toast({
        title: "Job Updated",
        description: `Successfully updated "${formData.title}"`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      setMessage("Successfully updated job.");
      router.push(returnURL);
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the job. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setMessage("Error updating job.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    console.log("handleAction called with action:", action);
    if (!jobId) return;
    setLoading(true);
    setMessage("");
    console.log(action);

    if (action === "Reject") {
      const updatedFormData = {
        ...formData,
        jobStatus: "rejected",
        expireDate: formData.expireDate || null,
        rejectionMessage: rejectionReason,
      };

      try {
        if (!user) throw new Error("User not authenticated");

        try {
          await sendRejectionEmail(
            {
              title: formData.title,
              organizationName: formData.organizationName,
              contactName: formData.contactName,
              contactEmail: formData.contactEmail,
            },
            rejectionReason,
          );
        } catch (emailError) {
          console.error("Failed to send rejection email:", emailError);
        }
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        });

        if (!response.ok) {
          throw new Error("Failed to reject job.");
        }

        toast({
          title: "Job Rejected",
          description: `Successfully rejected "${formData.title}"`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        setIsRejectModalOpen(false);
        setAction("");
        setMessage("Successfully reject job");
        setLoading(false);
        router.push("/admin");
      } catch (error) {
        console.error(`Error rejecting job: ${error}`);
        toast({
          title: "Rejection Failed",
          description: "There was an error rejecting the job. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setMessage("Error occurred while attempting to reject job");
      }
    } else if (action === "Delete") {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete job");
        }

        toast({
          title: "Job Deleted",
          description: `"${formData.title}" has been successfully removed`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        setIsActionConfirmationModalOpen(false);
        setMessage("Successfully deleted job");
        setLoading(false);
        router.push(returnURL);
      } catch (error) {
        console.error(`Error deleting job: ${error}`);
        toast({
          title: "Deletion Failed",
          description: "There was an error deleting the job. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setMessage("Error occurred while attempting to delete job");
      }
    } else {
      setMessage("Cannot find intended action");
      console.error(`Error matching specific action to handler`);
    }
  };

  const typeOptions = ["Full-Time", "Part-Time", "Volunteer"];
  const { getRootProps: getJobRootProps, getRadioProps: getJobRadioProps } = useRadioGroup({
    name: "employmentType",
    value: selectEmployment,
    onChange: (value) => {
      const newType = value.toLowerCase();
      setFormData((prev) => ({
        ...prev,
        employmentType: newType,
        ...(newType === "volunteer" && { compensationType: null }),
      }));
      setSelectEmployment(newType);
      if (newType === "volunteer") {
        setSelectCompensation(null);
      }
    },
  });

  const compensationOptions = ["Salary", "Hourly", "Contract"];
  const { getRootProps: getCompensationRootProps, getRadioProps: getCompensationRadioProps } = useRadioGroup({
    name: "compensationType",
    value: selectCompensation ?? undefined,
    onChange: (value) => {
      setFormData((prev) => ({ ...prev, compensationType: value.toLowerCase() }));
      setSelectCompensation(value.toLowerCase());
    },
  });

  const handleIndustriesChange = (values: Option[]) => {
    const industries = values.map((val) => val.value);
    handleChange({ target: { name: "organizationIndustry", value: industries } });
  };

  const closeSubmitModal = () => {
    setIsSubmitModalOpen(false);
    if (isEditing) {
      router.push(returnURL);
    }
  };

  const closeActionConfirmationModal = () => {
    setIsActionConfirmationModalOpen(false);
    setAction("");
  };

  const closeFailModal = () => {
    setIsFailModalOpen(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    if (!formData.organizationIndustry.length) {
      setMessage("Please select at least one industry");
      alert("Organization Industry field is required");
      return;
    }

    if (isEditing) {
      if (formData.jobStatus == "approved" && !isSpokesAdmin) {
        setIsEditModalOpen(true);
      } else {
        handleUpdate(e);
      }
    } else {
      handleFormSubmit(e);
    }
  };

  return (
    <Box mx="auto" p={10} minWidth={{ base: "320px", md: "768px", lg: "1024px" }} maxWidth="1200px">
      <div className="mt-2 mb-2 text-black text-3xl font-semibold">
        {isEditing ? "Edit Listing" : "Create New Listing"}
      </div>

      <Heading as="h2" size="md" mb={5}>
        Job Information
      </Heading>

      <form onSubmit={onSubmit} noValidate>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Job Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="title"
              value={loadingInfo ? "Loading..." : formData.title}
              onChange={handleChange}
              disabled={loadingInfo}
            />
          </FormControl>
          <FormControl isRequired>
            <div className="flex gap-0">
              <FormLabel>Organization Industry</FormLabel>
              <p
                className={cn(
                  "text-red-600 text-xs font-medium mt-1.5 transition",
                  showMaxError ? "opacity-100" : "opacity-0",
                )}
              >
                Max limit 3
              </p>
            </div>
            <TagSelect
              value={formatIndustries(formData.organizationIndustry)}
              name="organizationIndustry"
              onChange={handleIndustriesChange}
              onMax={() => {
                setShowMaxError(true);
                setTimeout(() => {
                  setShowMaxError(false);
                }, 3000);
              }}
              checkMax={(length) => {
                if (length < 3) {
                  setShowMaxError(false);
                }
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Employment Type</FormLabel>
            <Stack direction={{ base: "column", md: "row" }} spacing={2} {...getJobRootProps()} justify="flex-start">
              {typeOptions.map((value) => {
                const radio = getJobRadioProps({ value });
                return (
                  <RadioCard
                    key={value}
                    value={value}
                    {...radio}
                    isChecked={selectEmployment === value.toLowerCase()}
                    checkedColor={employmentColorMapping[value as keyof typeof employmentColorMapping]}
                  >
                    {value}
                  </RadioCard>
                );
              })}
            </Stack>
          </FormControl>
          <Box w="full">
            <Collapse in={selectEmployment !== "volunteer"} animateOpacity>
              <FormControl isRequired={false} mt={4}>
                <FormLabel>Compensation Type</FormLabel>
                <Stack direction={{ base: "column", md: "row" }} spacing={2} {...getCompensationRootProps()}>
                  {compensationOptions.map((value) => {
                    const radio = getCompensationRadioProps({ value });
                    return (
                      <RadioCard
                        key={value}
                        value={value}
                        {...radio}
                        isChecked={selectCompensation === value.toLowerCase()}
                        checkedColor={compensationColorMapping[value as keyof typeof compensationColorMapping]}
                      >
                        {value}
                      </RadioCard>
                    );
                  })}
                </Stack>
              </FormControl>
            </Collapse>
          </Box>
          <FormControl isRequired>
            <FormLabel>Job Description</FormLabel>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="jobDescription"
              value={loadingInfo ? "Loading..." : formData.jobDescription}
              onChange={handleChange}
              disabled={loadingInfo}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Link to Job Details</FormLabel>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="detailURL"
              value={loadingInfo ? "Loading..." : formData.detailURL}
              onChange={handleChange}
              disabled={loadingInfo}
            />
            <FormErrorMessage>Please enter a valid link.</FormErrorMessage>
          </FormControl>
          <FormControl>
            <div className="flex items-center">
              <FormLabel className="mb-0">Link to Job Application</FormLabel>
              <div className="group relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-400 cursor-help -translate-y-1 -translate-x-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="absolute sm:-translate-x-0 -translate-x-[75%] left-0 top-6 w-64 p-2 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <p className="text-sm text-gray-600">
                    Add a direct application link if available. If not provided, applicants will be directed to contact
                    the provided email address.
                  </p>
                </div>
              </div>
            </div>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="applyNowURL"
              value={loadingInfo ? "Loading..." : formData.applyNowURL}
              onChange={handleChange}
              disabled={loadingInfo}
            />
            <FormErrorMessage>Please enter a valid link.</FormErrorMessage>
          </FormControl>
          <Heading as="h2" size="md" textAlign="left" w="100%" mt={5}>
            Person of Contact - Information
          </Heading>
          <Stack w="full" direction={{ base: "column", md: "row" }} spacing={{ base: 6, md: 42 }}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="First and Last Name"
                bg="#F6F6F6"
                border="0"
                name="contactName"
                value={loadingInfo || loadingUser ? "Loading..." : formData.contactName}
                onChange={handleChange}
                disabled={loadingInfo || loadingUser}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="xxxxx@example.com"
                bg="#F6F6F6"
                border="0"
                name="contactEmail"
                value={loadingInfo || loadingUser ? "Loading..." : formData.contactEmail}
                onChange={handleChange}
                disabled={loadingInfo || loadingUser}
              />
              <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>
            </FormControl>
          </Stack>
          {isEditing ? (
            <div className="mt-10 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {loadingInfo ? (
                  <Box w="full" py={4}>
                    <Stack direction="row" spacing={4} align="center" justify="center">
                      <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="#045F87" size="md" />
                      <Text color="gray.600" fontSize="md">
                        Loading job information...
                      </Text>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    {(!loading || action === "Update") && (
                      <Button
                        isLoading={loading && action === "Update"}
                        loadingText="Updating..."
                        type="submit"
                        size="lg"
                        colorScheme="blackAlpha"
                        bg="#045F87"
                        _hover={{ bg: "#2A80A8" }}
                        className="w-full sm:w-auto min-w-[120px] shadow-sm"
                        onClick={() => setAction("Update")}
                      >
                        Update
                      </Button>
                    )}
                    {isSpokesAdmin && (!loading || action === "Reject") && (
                      <Button
                        isLoading={loading && action === "Reject"}
                        loadingText="Rejecting..."
                        size="lg"
                        colorScheme="blackAlpha"
                        bg="#FFF3E0"
                        color="#C2410C"
                        _hover={{ bg: "#FFE0B2" }}
                        className="w-full sm:w-auto min-w-[120px] shadow-sm"
                        onClick={() => {
                          setIsRejectModalOpen(true);
                          setAction("Reject");
                        }}
                      >
                        Reject
                      </Button>
                    )}
                    {(!loading || action === "Delete") && (
                      <Button
                        isLoading={loading && action === "Delete"}
                        loadingText="Deleting..."
                        size="lg"
                        colorScheme="blackAlpha"
                        bg="#FEE2E2"
                        color="#991B1B"
                        _hover={{ bg: "#FECACA" }}
                        className="w-full sm:w-auto min-w-[120px] shadow-sm"
                        onClick={() => {
                          setIsActionConfirmationModalOpen(true);
                          setAction("Delete");
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-10 flex justify-center">
              <Button
                isLoading={loading}
                loadingText="Submitting..."
                disabled={loading}
                type="submit"
                size="lg"
                colorScheme="blackAlpha"
                bg="#045F87"
                _hover={{ bg: "#2A80A8" }}
                className="w-full sm:w-auto min-w-[200px]"
              >
                Submit
              </Button>
            </div>
          )}
          {isEditing &&
            (isSpokesAdmin ? (
              <Link
                href="/admin"
                className="mt-1 block text-center text-gray-500 text-sm hover:text-[#045F87] transition-colors duration-200"
              >
                ← Return to Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="mt-1 block text-center text-gray-500 text-sm hover:text-[#045F87] transition-colors duration-200"
              >
                ← Return to Dashboard
              </Link>
            ))}
          {message && (
            <div
              className={`mt-4 p-3 rounded-md text-center text-sm font-medium ${
                message.includes("Error")
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-green-50 text-green-600 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}
        </VStack>
      </form>

      <JobConfirmationModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal} />
      <JobActionConfirmationModal
        isOpen={isActionConfirmationModalOpen}
        onClose={closeActionConfirmationModal}
        onConfirm={handleAction}
        action={action}
        isLoading={loading && action === "Delete"}
      />
      <JobCardModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
        }}
        onConfirm={handleAction}
        action="reject"
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        isLoading={loading && action === "Reject"}
      />
      <JobFailModal isOpen={isFailModalOpen} onClose={closeFailModal} />
      <JobEditedModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleUpdate}
        isLoading={loading && action === "Update"}
      />
    </Box>
  );
}
