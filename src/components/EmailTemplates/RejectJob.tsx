import * as React from "react";

interface RejectJobProps {
  title: string;
  organizationName: string;
  contactName: string;
  rejectionReason: string;
}

export const RejectJob: React.FC<RejectJobProps> = ({ title, organizationName, contactName, rejectionReason }) => (
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
        backgroundColor: "#fcebea",
        padding: "24px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#cc1f1a",
          marginBottom: "16px",
        }}
      >
        Your Job Post Was Rejected
      </h1>

      {/* Information Section */}
      <p
        style={{
          fontSize: "16px",
          color: "#333333",
          marginBottom: "16px",
        }}
      >
        Hello {contactName},
      </p>

      <p
        style={{
          fontSize: "16px",
          color: "#333333",
          marginBottom: "16px",
        }}
      >
        Unfortunately, {organizationName}&apos;s job post for <strong>{title}</strong> has been rejected by the Spokes
        Admin Team.
      </p>

      {/**/}
      <div
        style={{
          backgroundColor: "#fff5f5",
          border: "1px solid #f5c6cb",
          padding: "16px",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Reason for Rejection:
        </h3>
        <p style={{ fontSize: "14px", color: "#333333" }}>{rejectionReason}</p>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#555555",
        }}
      >
        If you believe this was a mistake or would like to revise and resubmit your job post, please contact us or use
        the job form again.
      </p>
    </div>

    <div style={{ textAlign: "center", marginTop: "24px" }}>
      <a
        href="https://spokes-job-board.vercel.app/jobform"
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        Submit a New Job Post
      </a>
    </div>
  </div>
);
