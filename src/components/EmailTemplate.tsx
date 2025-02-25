import * as React from "react";

interface EmailTemplateProps {
  jobTitle: string;
  jobDescription: string;
  jobLocation: string;
  jobSalary: string;
  organizationName: string;
  employmentType: string;
  compensationType: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  jobTitle,
  jobDescription,
  jobLocation,
  jobSalary,
  organizationName,
  employmentType,
  compensationType,
}) => (
  <div>
    <h1>New Job Posted!</h1>
    <h2>{jobTitle}</h2>
    <p>
      <strong>Organization:</strong> {organizationName}
    </p>
    <p>
      <strong>Location:</strong> {jobLocation}
    </p>
    <p>
      <strong>Employment Type:</strong> {employmentType}
    </p>
    <p>
      <strong>Compensation Type:</strong> {compensationType}
    </p>
    <p>
      <strong>Salary:</strong> {jobSalary}
    </p>
    <h3>Description:</h3>
    <p>{jobDescription}</p>
  </div>
);
