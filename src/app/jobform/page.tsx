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

const JobFormPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [phoneInput, setPhoneInput] = useState("");

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneInput(formatPhoneNumber(event.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data");
  };

  //For custom radio selection buttons, job type field
  const typeOptions = ["Volunteer", "Full-Time", "Part-Time"];
  const { getRootProps: getJobRootProps, getRadioProps: getJobRadioProps } = useRadioGroup({
    name: "jobType",
    onChange: setJobType,
  });

  //For custom radio selection buttons, paid member field
  const memberOptions = ["Yes", "No"];
  const { getRootProps: getMemberRootProps, getRadioProps: getMemberRadioProps } = useRadioGroup({
    name: "framework",
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
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Organization Name</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Organization Industry</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Job Title</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
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
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Link to job listing</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
            <FormErrorMessage>Please enter a valid link.</FormErrorMessage>
          </FormControl>
          <Heading as="h2" size="lg" mb={6} textAlign="left" w="full">
            Person of Contact - Information
          </Heading>
          <Stack w="full" direction={{ base: "column", md: "row" }} spacing={{ base: 6, md: 40 }}>
            <FormControl isRequired>
              <FormLabel requiredIndicator>Name</FormLabel>
              <Input type="text" placeholder="First and Last Name" bg="#F6F6F6" border="0" />
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                bg="#F6F6F6"
                placeholder="xxx-xxx-xxxx"
                border="0"
                value={phoneInput}
                onChange={handlePhoneChange}
                maxLength={12}
              />
              <FormErrorMessage>Please enter a valid phone number.</FormErrorMessage>
            </FormControl>
          </Stack>
          <FormControl isRequired>
            <FormLabel requiredIndicator>Email</FormLabel>
            <Input type="email" placeholder="xxxxx@example.com" bg="#F6F6F6" border="0" />
            <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>
          </FormControl>
          <Button mt={10} type="submit" size="lg" colorScheme="blackAlpha" bg="black" _hover={{ bg: "#5E5E5E" }}>
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default JobFormPage;
