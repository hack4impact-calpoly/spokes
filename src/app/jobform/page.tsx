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
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import RadioCard from "@/components/RadioCard";

const JobFormPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [jobType, setJobType] = useState("Full-Time");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data");
  };

  //For custome radio selection buttons, job type field
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
    <Box p={10} px={100} mt={100} /*Added extra padding for navbar, might fix later*/>
      <Heading as="h1" size="xl" fontWeight="bold" mb={6}>
        Create new listing
      </Heading>
      <Heading as="h2" size="lg" mb={6}>
        Job Information
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Organization Name</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Organization Industry</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Job Title</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Are you a paid member?</FormLabel>
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
            <FormLabel>Please select one below for your listing:</FormLabel>
            <HStack {...getJobRootProps()}>
              {typeOptions.map((value) => {
                const radio = getJobRadioProps({ value });
                return (
                  <RadioCard key={value} value={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Job Description</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Link to job listing</FormLabel>
            <Input type="text" placeholder="Enter your response" bg="#F6F6F6" border="0" />
            <FormErrorMessage>Please enter a valid link.</FormErrorMessage>
          </FormControl>
          <Heading as="h2" size="lg" mb={6} textAlign="left" w="full">
            Person of Contact - Information
          </Heading>
          <HStack w="full">
            <FormControl isRequired pr={3}>
              <FormLabel>Name</FormLabel>
              <Input type="text" placeholder="First and Last Name" bg="#F6F6F6" border="0" />
            </FormControl>
            <FormControl pl={3}>
              <FormLabel>Phone Number</FormLabel>
              <Input type="tel" bg="#F6F6F6" placeholder="xxx-xxx-xxxx" border="0" />
              <FormErrorMessage>Please enter a valid phone number.</FormErrorMessage>
            </FormControl>
          </HStack>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
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
