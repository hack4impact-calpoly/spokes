"use client";
import React, { useState, useEffect } from "react";
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
  FormHelperText,
  Input,
  Stack,
  FormErrorMessage,
  useRadioGroup,
  HStack,
  Link,
  Collapse,
} from "@chakra-ui/react";
import RadioCard from "@/components/RadioCard";
import TagSelect from "@/components/TagSelect";
import { Option } from "@/components/TagsMultiselect/multiselect";
import { cn } from "@/lib/utils";
import JobConfirmationModal from "@/components/JobConfirmationModal";
import JobActionConfirmationModal from "@/components/JobActionConfirmationModal";
import JobFailModal from "@/components/JobFailModal";
import RejectButton from "@/components/RejectButton";
import JobCardModal from "@/components/JobCard/JobCardModal";

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

const ensureHttps = (url: string | undefined): string | undefined => {
  if (!url) return url;
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

export default function JobFormPage() {
  const { register, handleSubmit: formHandleSubmit, reset } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const isEditing = Boolean(jobId);
  const { resetForm } = useFormReset();

  const [formData, setFormData] = useState({
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
    contactPhone: "",
    contactEmail: "",
    detailURL: "",
    applyNowURL: "",
  });

  const [loading, setLoading] = useState(false);
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
          contactPhone: data.contactPhone || "",
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

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string[] } }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "contactPhone" ? formatPhoneNumber(String(value)) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formattedFormData = {
      ...formData,
      expireDate: formData.expireDate || null,
      detailURL: ensureHttps(formData.detailURL),
      applyNowURL: ensureHttps(formData.applyNowURL),
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit job.");
      }

      const emailResponse = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedFormData),
      });

      if (!emailResponse.ok) {
        console.error("Failed to send notification email");
      }

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
        contactPhone: "",
        contactEmail: "",
        detailURL: "",
        applyNowURL: "",
      });
      setSelectEmployment("");
      setSelectCompensation("");

      setMessage("Job posted successfully!");
      setIsSubmitModalOpen(true);
    } catch (error) {
      console.error("Error submitting job:", error);
      setIsFailModalOpen(true);
      setMessage("Error submitting job.");
    } finally {
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
        body: JSON.stringify(formattedFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to update job.");
      }

      setMessage("Successfully updated job.");
      router.push("/admin");
    } catch (error) {
      console.error("Error updating job:", error);
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
      };

      try {
        try {
          console.log("!!Attempting to send email...");
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

        setIsRejectModalOpen(false);
        setAction("");
        setMessage("Successfully reject job");
        setLoading(false);
        router.push("/admin");
      } catch (error) {
        console.error(`Error rejecting job: ${error}`);
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

        setIsActionConfirmationModalOpen(false);
        setMessage("Successfully deleted job");
        setLoading(false);
        router.push("/admin");
      } catch (error) {
        console.error(`Error deleting job: ${error}`);
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
      router.push("/admin");
    } else {
      router.push("/jobs");
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

    if (!formData.organizationIndustry.length) {
      setMessage("Please select at least one industry");
      alert("Organization Industry field is required");
      return;
    }

    if (isEditing) {
      handleUpdate(e);
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

      <form onSubmit={onSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Organization Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="organizationName"
              value={loadingInfo ? "Loading..." : formData.organizationName}
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
          <Stack w="full" direction={{ base: "column", md: "row" }} spacing={{ base: 6, md: 40 }}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="First and Last Name"
                bg="#F6F6F6"
                border="0"
                name="contactName"
                value={loadingInfo ? "Loading..." : formData.contactName}
                onChange={handleChange}
                disabled={loadingInfo}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                bg="#F6F6F6"
                placeholder="xxx-xxx-xxxx"
                border="0"
                name="contactPhone"
                value={loadingInfo ? "Loading..." : formData.contactPhone}
                onChange={handleChange}
                maxLength={12}
                disabled={loadingInfo}
              />
              <FormErrorMessage>Please enter a valid phone number.</FormErrorMessage>
            </FormControl>
          </Stack>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="xxxxx@example.com"
              bg="#F6F6F6"
              border="0"
              name="contactEmail"
              value={loadingInfo ? "Loading..." : formData.contactEmail}
              onChange={handleChange}
              disabled={loadingInfo}
            />
            <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>
          </FormControl>
          {isEditing ? (
            <HStack>
              <Button
                isLoading={loading}
                loadingText="Updating..."
                mt={10}
                type="submit"
                size="lg"
                colorScheme="blackAlpha"
                bg="black"
                _hover={{ bg: "#5E5E5E" }}
              >
                Update
              </Button>
              <RejectButton
                isLoading={loading}
                onClick={() => {
                  setIsRejectModalOpen(true);
                  setAction("Reject");
                }}
                className="px-6 mt-10 py-3 rounded-md bg-[#ff9d4f] hover:bg-[#ffbe8b] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                isLoading={loading}
                loadingText="Deleting..."
                mt={10}
                size="lg"
                colorScheme="red"
                bg="red"
                _hover={{ bg: "#ff8b8b" }}
                onClick={() => {
                  setIsActionConfirmationModalOpen(true);
                  setAction("Delete");
                }}
              >
                Delete
              </Button>
            </HStack>
          ) : (
            <Button
              isLoading={loading}
              loadingText="Submitting..."
              mt={10}
              type="submit"
              size="lg"
              colorScheme="blackAlpha"
              bg="black"
              _hover={{ bg: "#5E5E5E" }}
            >
              Submit
            </Button>
          )}
          {isEditing && (
            <Link variant="underline" href="/admin" mt="2">
              Return to Admin Dashboard
            </Link>
          )}
          {message && <p>{message}</p>}
        </VStack>
      </form>

      <JobConfirmationModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal} />
      <JobActionConfirmationModal
        isOpen={isActionConfirmationModalOpen}
        onClose={closeActionConfirmationModal}
        onConfirm={handleAction}
        action={action}
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
      />
      <JobFailModal isOpen={isFailModalOpen} onClose={closeFailModal} />
    </Box>
  );
}
