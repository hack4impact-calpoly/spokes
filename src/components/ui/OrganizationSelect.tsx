"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input, Select } from "@chakra-ui/react";

const CREATE_NEW_ORGANIZATION_VALUE = "__create_new__";

type OrganizationSelectProps = {
  value: string;
  onChange: (organizationName: string) => void;
  placeholder?: string;
  createNewLabel?: string;
  newOrganizationPlaceholder?: string;
  allowCreateNew?: boolean;
  reloadKey?: number;
  onLoadingChange?: (isLoading: boolean) => void;
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
  allowCreateNew = true,
  reloadKey = 0,
  onLoadingChange,
  bg = "#F6F6F6",
  border,
  selectFocusStyle,
}: OrganizationSelectProps) {
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const onChangeRef = useRef(onChange);

  const getExistingOrganization = useCallback(
    (organizationName: string) =>
      organizations.find((organization) => organization.toLowerCase() === organizationName.trim().toLowerCase()),
    [organizations],
  );

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onLoadingChange?.(isLoadingOrganizations);
  }, [isLoadingOrganizations, onLoadingChange]);

  useEffect(() => {
    let isCancelled = false;

    async function loadOrganizations() {
      try {
        setIsLoadingOrganizations(true);
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
  }, [reloadKey]);

  useEffect(() => {
    const trimmedValue = value.trim();
    let nextSelectedOrganization = "";
    let nextNewOrganizationName = "";

    if (trimmedValue) {
      const existingOrganization = getExistingOrganization(trimmedValue);

      if (existingOrganization) {
        nextSelectedOrganization = existingOrganization;
        if (existingOrganization !== value) {
          onChangeRef.current(existingOrganization);
        }
      } else if (allowCreateNew) {
        nextSelectedOrganization = CREATE_NEW_ORGANIZATION_VALUE;
        nextNewOrganizationName = value;
      }
    }

    setSelectedOrganization((currentValue) =>
      currentValue === nextSelectedOrganization ? currentValue : nextSelectedOrganization,
    );
    setNewOrganizationName((currentValue) =>
      currentValue === nextNewOrganizationName ? currentValue : nextNewOrganizationName,
    );
  }, [allowCreateNew, getExistingOrganization, value]);

  const handleSelectedOrganizationChange = (organizationName: string) => {
    setSelectedOrganization(organizationName);

    if (organizationName === CREATE_NEW_ORGANIZATION_VALUE) {
      const trimmedName = newOrganizationName.trim();
      onChange(getExistingOrganization(trimmedName) ?? trimmedName);
      return;
    }

    setNewOrganizationName("");
    onChange(organizationName);
  };

  const handleNewOrganizationNameChange = (organizationName: string) => {
    setNewOrganizationName(organizationName);

    const trimmedName = organizationName.trim();
    onChange(getExistingOrganization(trimmedName) ?? trimmedName);
  };

  return (
    <>
      <Select
        value={selectedOrganization}
        onChange={(e) => handleSelectedOrganizationChange(e.target.value)}
        placeholder={isLoadingOrganizations ? "Loading organizations..." : placeholder}
        bg={bg}
        border={border}
        isDisabled={isLoadingOrganizations}
        _focus={selectFocusStyle}
      >
        {allowCreateNew && <option value={CREATE_NEW_ORGANIZATION_VALUE}>{createNewLabel}</option>}
        {organizations.map((organization) => (
          <option key={organization} value={organization}>
            {organization}
          </option>
        ))}
      </Select>
      {allowCreateNew && selectedOrganization === CREATE_NEW_ORGANIZATION_VALUE && (
        <Input
          mt={3}
          value={newOrganizationName}
          onChange={(e) => handleNewOrganizationNameChange(e.target.value)}
          placeholder={newOrganizationPlaceholder}
          bg={bg}
          border={border}
          _focus={selectFocusStyle}
        />
      )}
    </>
  );
}
