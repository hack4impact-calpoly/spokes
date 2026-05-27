"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

interface OnboardingFormProps {
  onSubmit: (formData: { paidMember: string; organizationName: string }) => Promise<void>;
  isSubmitting: boolean;
}

const CREATE_NEW_ORGANIZATION_VALUE = "__create_new__";

export default function OnboardingForm({ onSubmit, isSubmitting }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    paidMember: "",
  });
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(true);

  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paidMember: value }));
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadOrganizations() {
      try {
        const response = await fetch("/api/organizations", { headers: { Accept: "application/json" } });
        if (!response.ok) {
          throw new Error("Failed to fetch organizations");
        }

        const result = await response.json();
        if (!isCancelled && Array.isArray(result.organizations)) {
          setOrganizations(result.organizations.filter((name: unknown): name is string => typeof name === "string"));
        }
      } catch (error) {
        console.error("Failed to load organizations:", error);
        if (!isCancelled) {
          setOrganizations([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingOrganizations(false);
        }
      }
    }

    void loadOrganizations();

    return () => {
      isCancelled = true;
    };
  }, []);

  const organizationName = useMemo(() => {
    if (selectedOrganization !== CREATE_NEW_ORGANIZATION_VALUE) {
      return selectedOrganization;
    }

    const trimmedName = newOrganizationName.trim();
    const existingOrganization = organizations.find(
      (organization) => organization.toLowerCase() === trimmedName.toLowerCase(),
    );

    return existingOrganization ?? trimmedName;
  }, [newOrganizationName, organizations, selectedOrganization]);

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
          <Select
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            placeholder={isLoadingOrganizations ? "Loading organizations..." : "Select your organization"}
            bg="#F6F6F6"
            disabled={isLoadingOrganizations}
            _focus={{
              borderColor: "#BDEABD",
              boxShadow: "0 0 0 1px #BDEABD",
            }}
          >
            <option value={CREATE_NEW_ORGANIZATION_VALUE}>Create a new organization</option>
            {organizations.map((organization) => (
              <option key={organization} value={organization}>
                {organization}
              </option>
            ))}
          </Select>
          {selectedOrganization === CREATE_NEW_ORGANIZATION_VALUE && (
            <Input
              mt={3}
              value={newOrganizationName}
              onChange={(e) => setNewOrganizationName(e.target.value)}
              placeholder="Enter new organization name"
              bg="#F6F6F6"
              _focus={{
                borderColor: "#BDEABD",
                boxShadow: "0 0 0 1px #BDEABD",
              }}
            />
          )}
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
