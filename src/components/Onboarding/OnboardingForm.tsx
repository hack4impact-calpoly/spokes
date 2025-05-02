"use client";

import { useState } from "react";
import { Button, FormControl, FormLabel, Input, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";

interface OnboardingFormProps {
  onSubmit: (formData: { paidMember: string; organizationName: string }) => Promise<void>;
  isSubmitting: boolean;
}

export default function OnboardingForm({ onSubmit, isSubmitting }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    paidMember: "",
    organizationName: "",
  });

  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paidMember: value }));
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, organizationName: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <VStack spacing={6} align="stretch">
      <div className="flex justify-center">
        <Image
          src="/Spokes Brand/spoke_upscaled_no_bg.png"
          alt="Spokes Logo"
          width={56}
          height={56}
          style={{ color: "#000000" }}
          className="mb-2"
        />
      </div>
      <Text>Please verify your membership status with Spokes to complete your profile.</Text>

      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={6}>
          <FormLabel fontWeight="medium">Organization Name</FormLabel>
          <Input
            value={formData.organizationName}
            onChange={handleOrganizationChange}
            placeholder="Enter your organization name"
            bg="#F6F6F6"
            _focus={{
              borderColor: "#BDEABD",
              boxShadow: "0 0 0 1px #BDEABD",
            }}
          />
        </FormControl>

        <FormControl isRequired mb={6}>
          <FormLabel fontWeight="medium">Are you a paid member of Spokes?</FormLabel>
          <RadioGroup onChange={handleChange} value={formData.paidMember} name="paidMember">
            <Stack direction="column" spacing={4}>
              <Radio
                value="true"
                bg="#F6F6F6"
                _checked={{
                  bg: "#BDEABD",
                  borderColor: "#BDEABD",
                }}
              >
                Yes, I am a paid member
              </Radio>
              <Radio
                value="false"
                bg="#F6F6F6"
                _checked={{
                  bg: "#F8B1B8",
                  borderColor: "#F8B1B8",
                }}
              >
                No, I am not a paid member
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.paidMember || !formData.organizationName}
          isLoading={isSubmitting}
          loadingText="Submitting..."
          w="full"
          colorScheme="blackAlpha"
          bg="black"
          _hover={{ bg: "#5E5E5E" }}
          size="lg"
          mt={4}
        >
          Complete Profile
        </Button>
      </form>
    </VStack>
  );
}
