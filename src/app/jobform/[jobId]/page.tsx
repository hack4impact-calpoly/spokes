"use client";
import React, { useState, useEffect } from "react";
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
import RadioCard from "@/components/RadioCard";
import JobConfirmationModal from "@/components/JobConfirmationModal";
import JobDeletedModal from "@/components/JobDeletedModal";
import { useRouter, useParams } from "next/navigation";

export default function JobFormPage() {
  console.log("Component rendered");
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationIndustry: "",
    title: "",
    postDate: new Date().toISOString(),
    expireDate: "",
    jobDescription: "",
    employmentType: "Full-Time",
    compensationType: "paid",
    jobStatus: "pending",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    detailURL: "",
    applyNowURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true); // for setting loading state of job info fetching
  const [message, setMessage] = useState("");
  const [selectEmployment, setSelectEmployment] = useState("");
  const [selectCompensation, setSelectCompensation] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const { jobId } = useParams<{ jobId?: string }>();
  console.log("Page rendered. jobId:", jobId);

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

  // for populating formData with job data
  useEffect(() => {
    if (!jobId) {
      console.log("No jobId provided. Skipping fetch.");
      return;
    }

    const fetchJobData = async () => {
      setLoadingInfo(true);
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFormData(data);
        setLoadingInfo(false);
      } catch (error) {
        setLoadingInfo(false);
        console.error("Fetch failed:", error);
        router.push("/jobform"); // reroutes to jobform page if jobId not found
      }
    };

    fetchJobData();
  }, [jobId, router]);

  // formats phone number input to filter non-numbers an add -
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "contactPhone" ? formatPhoneNumber(value) : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    //set expire date to null
    const formattedFormData = {
      ...formData,
      expireDate: formData.expireDate ? formData.expireDate : null,
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

      setFormData({
        organizationName: "",
        organizationIndustry: "",
        title: "",
        postDate: new Date().toISOString(),
        expireDate: "",
        jobDescription: "",
        employmentType: "",
        compensationType: "paid",
        jobStatus: "pending",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        detailURL: "",
        applyNowURL: "",
      });

      setMessage("Job updated successfully!");
      setIsSubmitModalOpen(true);
    } catch (error) {
      console.error("Error updating job:", error);
      setMessage("Error updating job.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setMessage("");

    const updatedFormData = {
      ...formData,
      jobStatus: "rejected",
      expireDate: formData.expireDate ? formData.expireDate : null,
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
      setMessage("Error occoured while attempting to delete job");
    }
  };

  //For custom radio selection buttons, job type field
  const typeOptions = ["Full-Time", "Part-Time", "Volunteer"];
  const { getRootProps: getJobRootProps, getRadioProps: getJobRadioProps } = useRadioGroup({
    name: "employmentType",
    value: selectEmployment,
    onChange: (value) => {
      setFormData((prev) => ({ ...prev, employmentType: value.toLowerCase() }));
      setSelectEmployment(value);
    },
  });

  //For custom radio selection buttons, compensation type field
  const compensationOptions = ["Salary", "Hourly", "Contract"];
  const { getRootProps: getCompensationRootProps, getRadioProps: getCompensationRadioProps } = useRadioGroup({
    name: "compensationType",
    value: selectCompensation,
    onChange: (value) => {
      setFormData((prev) => ({ ...prev, compensationType: value.toLowerCase() }));
      setSelectCompensation(value);
    },
  });

  const closeSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <Box mx="auto" p={10} minWidth={{ base: "320px", md: "768px", lg: "1024px" }} maxWidth="1200px">
      <div className="mt-[8px] mb-[10px] text-black text-3xl font-semibold">Edit Application</div>
      <Heading as="h2" size="md" mb={5}>
        Job Information
      </Heading>
      <form onSubmit={handleUpdate} method="PUT">
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Organization Name</FormLabel>
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
            <FormLabel requiredIndicator>Organization Industry</FormLabel>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="organizationIndustry"
              value={loadingInfo ? "Loading..." : formData.organizationIndustry}
              onChange={handleChange}
              disabled={loadingInfo}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Job Title</FormLabel>
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
            <FormLabel requiredIndicator>Job Compensation Type</FormLabel>
            <Stack direction={{ base: "column", md: "row" }} spacing={2} {...getCompensationRootProps()}>
              {compensationOptions.map((value) => {
                const radio = getCompensationRadioProps({ value });
                return (
                  <RadioCard
                    key={value}
                    value={value}
                    {...radio}
                    isChecked={selectCompensation === value}
                    checkedColor={compensationColorMapping[value as keyof typeof compensationColorMapping]}
                  >
                    {value}
                  </RadioCard>
                );
              })}
            </Stack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Please select one below for your listing:</FormLabel>
            <Stack direction={{ base: "column", md: "row" }} spacing={2} {...getJobRootProps()}>
              {typeOptions.map((value) => {
                const radio = getJobRadioProps({ value });
                return (
                  <RadioCard
                    key={value}
                    value={value}
                    {...radio}
                    isChecked={selectEmployment === value}
                    checkedColor={employmentColorMapping[value as keyof typeof employmentColorMapping]}
                  >
                    {value}
                  </RadioCard>
                );
              })}
            </Stack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Job Description</FormLabel>
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
            <FormLabel requiredIndicator>Link to Job Listing</FormLabel>
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
          <Heading as="h2" size="md" textAlign="left" w="100%">
            Person of Contact - Information
          </Heading>
          <Stack w="full" direction={{ base: "column", md: "row" }} spacing={{ base: 6, md: 40 }}>
            <FormControl isRequired>
              <FormLabel requiredIndicator>Name</FormLabel>
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
            <FormLabel requiredIndicator>Email</FormLabel>
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
          <HStack>
            <Button
              isLoading={loading}
              loadingText="Updating..."
              mt={10}
              type="submit"
              size="lg"
              colorScheme="blackAlpha"
              bg="black"
              mr="4"
              _hover={{ bg: "#5E5E5E" }}
              onClick={() => {
                setSelectCompensation("");
                setSelectEmployment("");
              }}
            >
              Update
            </Button>
            <Button
              isLoading={loading}
              loadingText="Updating..."
              mt={10}
              size="lg"
              colorScheme="redAlpha"
              bg="red"
              ml="4"
              _hover={{ bg: "#5E5E5E" }}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </HStack>
          <Link variant="underline" href="/admin" mt="2">
            Return to admin board
          </Link>

          {message && <p>{message}</p>}
        </VStack>
      </form>
      <JobConfirmationModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal} />
      <JobDeletedModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} />
    </Box>
  );
}
