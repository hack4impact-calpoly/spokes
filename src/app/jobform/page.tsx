"use client";
import React, { useState } from "react";
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
} from "@chakra-ui/react";
import RadioCard from "@/components/RadioCard";
import JobConfirmationModal from "@/components/JobConfirmationModal";
import { useRouter } from "next/navigation";

export default function JobFormPage() {
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
  const [message, setMessage] = useState("");
  const [selectEmployment, setSelectEmployment] = useState("");
  const [selectCompensation, setSelectCompensation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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

      setMessage("Job posted successfully!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error submitting job:", error);
      setMessage("Error submitting job.");
    } finally {
      setLoading(false);
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

  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/");
  };

  return (
    <Box mx="auto" p={10} minWidth={{ base: "320px", md: "768px", lg: "1024px" }} maxWidth="1200px">
      <div className="mt-[8px] mb-[10px] text-black text-3xl font-semibold">Create New Listing</div>
      <Heading as="h2" size="md" mb={5}>
        Job Information
      </Heading>
      <form onSubmit={handleSubmit} method="POST">
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Organization Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
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
              value={formData.organizationIndustry}
              onChange={handleChange}
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
              value={formData.title}
              onChange={handleChange}
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
              value={formData.jobDescription}
              onChange={handleChange}
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
              value={formData.detailURL}
              onChange={handleChange}
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
                value={formData.contactName}
                onChange={handleChange}
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
                value={formData.contactPhone}
                onChange={handleChange}
                maxLength={12}
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
              value={formData.contactEmail}
              onChange={handleChange}
            />
            <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>
          </FormControl>
          <Button
            isLoading={loading}
            loadingText="Submitting..."
            mt={10}
            type="submit"
            size="lg"
            colorScheme="blackAlpha"
            bg="black"
            _hover={{ bg: "#5E5E5E" }}
            onClick={() => {
              setSelectCompensation("");
              setSelectEmployment("");
            }}
          >
            Submit
          </Button>
          {message && <p>{message}</p>}
        </VStack>
      </form>
      <JobConfirmationModal isOpen={isModalOpen} onClose={closeModal} />
    </Box>
  );
}
