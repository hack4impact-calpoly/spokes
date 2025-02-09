"use client";
import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  useRadioGroup,
  Box,
  Heading,
  Input,
  Stack,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import RadioCard from "@/components/RadioCard";

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
    url: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    console.log("Submitting Job Data:", formattedFormData);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit job.");
      }

      setMessage("Job posted successfully!");
    } catch (error) {
      console.error("Error submitting job:", error);
      setMessage("Error submitting job.");
    } finally {
      setLoading(false);
    }
  };

  //For custom radio selection buttons, job type field
  const typeOptions = ["Volunteer", "Full-Time", "Part-Time"];
  const { getRootProps: getJobRootProps, getRadioProps: getJobRadioProps } = useRadioGroup({
    name: "employmentType",
    onChange: (value) => setFormData((prev) => ({ ...prev, employmentType: value })),
  });

  //For custom radio selection buttons, paid member field
  const memberOptions = ["Yes", "No"];
  const { getRootProps: getMemberRootProps, getRadioProps: getMemberRadioProps } = useRadioGroup({
    name: "memberType",
    onChange: console.log,
  });

  return (
    <Box mx={10} p={10}>
      <Heading as="h1" size="xl" fontWeight="bold" mb={6}>
        Create new listing
      </Heading>
      <Heading as="h2" size="lg" mb={6}>
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
            <FormLabel requiredIndicator>Are you a paid member?</FormLabel>
            <HStack {...getMemberRootProps()}>
              {memberOptions.map((value) => {
                const radio = getMemberRadioProps({ value });
                return (
                  <RadioCard key={value} value={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Please select one below for your listing:</FormLabel>
            <Stack direction={{ base: "column", md: "row" }} spacing={2} {...getJobRootProps()}>
              {typeOptions.map((value) => {
                const radio = getJobRadioProps({ value });
                return (
                  <RadioCard key={value} value={value} {...radio}>
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
            <FormLabel requiredIndicator>Link to job listing</FormLabel>
            <Input
              type="text"
              placeholder="Enter your response"
              bg="#F6F6F6"
              border="0"
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
            <FormErrorMessage>Please enter a valid link.</FormErrorMessage>
          </FormControl>
          <Heading as="h2" size="lg" textAlign="left" w="full">
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
          >
            Submit
          </Button>
          {message && <p>{message}</p>}
        </VStack>
      </form>
    </Box>
  );
}
