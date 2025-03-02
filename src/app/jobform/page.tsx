"use client";
import React, { useState, useEffect, Suspense } from "react";
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
  HStack,
  Link,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";

import RadioCard from "@/components/RadioCard";
import TagSelect from "@/components/TagSelect";
import { Option } from "@/components/TagsMultiselect/multiselect";
import { cn } from "@/lib/utils";

import JobConfirmationModal from "@/components/JobConfirmationModal";
import JobDeletedModal from "@/components/JobDeletedModal";
import JobFailModal from "@/components/JobFailModal";

// converts the formData string array to a Option object array necessary for use in the TagSelect componenet
function formatIndustries(industries: string[]): Option[] {
  return industries.map((industry) => ({
    value: industry,
    label: industry,
  }));
}

export default function JobFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const isEditing = Boolean(jobId);

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationIndustry: [],
    title: "",
    postDate: new Date().toISOString(),
    expireDate: "",
    jobDescription: "",
    employmentType: "full-time",
    compensationType: "paid",
    jobStatus: "pending",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    detailURL: "",
    applyNowURL: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(isEditing); // for setting loading state of job info fetching
  const [message, setMessage] = useState("");
  const [selectEmployment, setSelectEmployment] = useState("");
  const [selectCompensation, setSelectCompensation] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [showMaxError, setShowMaxError] = useState(false);

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

  // if we have a jobId, fetch the existing job
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

  // formats phone number input to filter non-numbers an add -
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    //set expire date to null
    const formattedFormData = {
      ...formData,
      expireDate: formData.expireDate ? formData.expireDate : null,
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

      // send email noti to admin
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
        expireDate: "",
        jobDescription: "",
        employmentType: "full-time",
        compensationType: "paid",
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

  // update -> (only if jobId)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    setLoading(true);
    setMessage("");

    const formattedFormData = {
      ...formData,
      expireDate: formData.expireDate || null,
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

  // delete -> (only if jobId)
  const handleDelete = async () => {
    if (!jobId) return;
    setLoading(true);
    setMessage("");

    const updatedFormData = {
      ...formData,
      jobStatus: "rejected",
      expireDate: formData.expireDate || null,
    };

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to delete job.");
      }
      setIsDeleteModalOpen(false);
      setMessage("Successfully deleted job");
      setLoading(false);
      router.push("/admin");
    } catch (error) {
      console.error(`Error deleting job: ${error}`);
      setMessage("Error occurred while attempting to delete job");
    }
  };

  //For custom radio selection buttons, job type field
  const typeOptions = ["Full-Time", "Part-Time", "Volunteer"];
  const { getRootProps: getJobRootProps, getRadioProps: getJobRadioProps } = useRadioGroup({
    name: "employmentType",
    value: selectEmployment,
    onChange: (value) => {
      setFormData((prev) => ({ ...prev, employmentType: value.toLowerCase() }));
      setSelectEmployment(value.toLowerCase());
    },
  });

  //For custom radio selection buttons, compensation type field
  const compensationOptions = ["Salary", "Hourly", "Contract"];
  const { getRootProps: getCompensationRootProps, getRadioProps: getCompensationRadioProps } = useRadioGroup({
    name: "compensationType",
    value: selectCompensation,
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

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
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
      handleSubmit(e);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
            <FormControl isRequired>
              <FormLabel>Employment Type</FormLabel>
              <Stack direction={{ base: "column", md: "row" }} spacing={2} {...getJobRootProps()}>
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
              <FormLabel>Link to Job Listing</FormLabel>
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
              // if editing, show update & delete
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
                <Button
                  isLoading={loading}
                  loadingText="Deleting..."
                  mt={10}
                  size="lg"
                  colorScheme="red"
                  bg="red"
                  _hover={{ bg: "#5E5E5E" }}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </HStack>
            ) : (
              // if creating, show Submit
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
                Return to admin board
              </Link>
            )}
            {message && <p>{message}</p>}
          </VStack>
        </form>

        <JobConfirmationModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal} />
        <JobDeletedModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} />
        <JobFailModal isOpen={isFailModalOpen} onClose={closeFailModal} />
      </Box>
    </Suspense>
  );
}
