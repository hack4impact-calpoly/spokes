"use client";

import { useState } from "react";
import { Button, FormControl, FormLabel, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import OrganizationSelect from "@/components/ui/OrganizationSelect";

interface OnboardingFormProps {
  onSubmit: (formData: { paidMember: string; organizationName: string }) => Promise<void>;
  isSubmitting: boolean;
}

export default function OnboardingForm({ onSubmit, isSubmitting }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    paidMember: "",
  });
  const [organizationName, setOrganizationName] = useState("");

  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paidMember: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, organizationName });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text>Please verify your membership status with Spokes to complete your profile.</Text>

      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={6}>
          <FormLabel fontWeight="medium">Organization Name</FormLabel>
          <OrganizationSelect
            value={organizationName}
            onChange={setOrganizationName}
            placeholder="Select your organization"
            selectFocusStyle={{
              borderColor: "#BDEABD",
              boxShadow: "0 0 0 1px #BDEABD",
            }}
          />
        </FormControl>

        <FormControl isRequired mb={6}>
          <FormLabel fontWeight="medium">Is your organization a paid member of Spokes?</FormLabel>
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
                Yes, my organization is
              </Radio>
              <Radio
                value="false"
                bg="#F6F6F6"
                _checked={{
                  bg: "#eae6bd",
                  borderColor: "#eae6bd",
                }}
              >
                I am unsure if my organization is
              </Radio>
              <Radio
                value="false"
                bg="#F6F6F6"
                _checked={{
                  bg: "#F8B1B8",
                  borderColor: "#F8B1B8",
                }}
              >
                No, my organization is not
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.paidMember || !organizationName}
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
