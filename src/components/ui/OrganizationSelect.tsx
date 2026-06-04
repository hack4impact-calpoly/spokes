"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Select } from "@chakra-ui/react";

const CREATE_NEW_ORGANIZATION_VALUE = "__create_new__";

type OrganizationSelectProps = {
  value: string;
  onChange: (organizationName: string) => void;
  placeholder?: string;
  createNewLabel?: string;
  newOrganizationPlaceholder?: string;
  bg?: string;
  border?: string;
  selectFocusStyle?: {
    borderColor?: string;
    boxShadow?: string;
  };
};

export default function OrganizationSelect({
  value,
  onChange,
  placeholder = "Select an organization",
  createNewLabel = "Create a new organization",
  newOrganizationPlaceholder = "Enter new organization name",
  bg = "#F6F6F6",
  border,
  selectFocusStyle,
}: OrganizationSelectProps) {
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(true);

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

  useEffect(() => {
    if (!value) {
      setSelectedOrganization("");
      setNewOrganizationName("");
    }
  }, [value]);

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

  useEffect(() => {
    onChange(organizationName);
  }, [onChange, organizationName]);

  return (
    <>
      <Select
        value={selectedOrganization}
        onChange={(e) => setSelectedOrganization(e.target.value)}
        placeholder={isLoadingOrganizations ? "Loading organizations..." : placeholder}
        bg={bg}
        border={border}
        disabled={isLoadingOrganizations}
        _focus={selectFocusStyle}
      >
        <option value={CREATE_NEW_ORGANIZATION_VALUE}>{createNewLabel}</option>
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
          placeholder={newOrganizationPlaceholder}
          bg={bg}
          border={border}
          _focus={selectFocusStyle}
        />
      )}
    </>
  );
}
