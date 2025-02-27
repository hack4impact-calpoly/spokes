import * as React from "react";

interface EmailTemplateProps {
  title: string;
  jobDescription: string;
  organizationName: string;
  organizationIndustry: string;
  employmentType: string;
  compensationType: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  detailURL: string;
  applyNowURL?: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  title,
  jobDescription,
  organizationName,
  organizationIndustry,
  employmentType,
  compensationType,
  contactName,
  contactPhone,
  contactEmail,
  detailURL,
  applyNowURL,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#ffffff",
    }}
  >
    <div
      style={{
        backgroundColor: "#f7f7f7",
        padding: "24px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#000000",
          marginBottom: "16px",
        }}
      >
        New Job Posted!
      </h1>

      {/* Job Details Section */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "16px",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Organization:</strong> {organizationName}
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Industry:</strong> {organizationIndustry}
        </p>
      </div>

      {/* Employment Type Badges */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            backgroundColor:
              employmentType.toLowerCase() === "full-time"
                ? "#F8B1B8"
                : employmentType.toLowerCase() === "part-time"
                  ? "#FFE297"
                  : "#C6D3FF",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {employmentType}
        </span>
        <span
          style={{
            backgroundColor:
              compensationType.toLowerCase() === "salary"
                ? "#BDEABD"
                : compensationType.toLowerCase() === "hourly"
                  ? "#87CEFA"
                  : "#FAC791",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {compensationType}
        </span>
      </div>

      {/* Job Description */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "16px",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          Job Description
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
            marginBottom: "16px",
          }}
        >
          {jobDescription}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
          }}
        >
          <strong>Job Details URL:</strong>{" "}
          <a href={detailURL} style={{ color: "#000000" }}>
            {detailURL}
          </a>
        </p>
        {applyNowURL && (
          <p
            style={{
              fontSize: "14px",
              color: "#000000",
            }}
          >
            <strong>Apply URL:</strong>{" "}
            <a href={applyNowURL} style={{ color: "#000000" }}>
              {applyNowURL}
            </a>
          </p>
        )}
      </div>

      {/* Contact Information */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "16px",
          borderRadius: "6px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          Contact Information
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Name:</strong> {contactName}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Email:</strong> {contactEmail}
        </p>
        {contactPhone && (
          <p
            style={{
              fontSize: "14px",
              color: "#000000",
            }}
          >
            <strong>Phone:</strong> {contactPhone}
          </p>
        )}
      </div>
    </div>

    <div
      style={{
        textAlign: "center",
        marginTop: "24px",
      }}
    >
      <a
        href="https://spokes-job-board.vercel.app/admin"
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        Review Job Application
      </a>
    </div>
  </div>
);
