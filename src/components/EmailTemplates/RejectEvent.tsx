import * as React from "react";

interface RejectEventProps {
  eventName: string;
  organization: string;
  contactName: string;
  rejectionReason: string;
}

export const RejectEvent: React.FC<RejectEventProps> = ({ eventName, organization, contactName, rejectionReason }) => (
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
          color: "#d32f2f",
          marginBottom: "16px",
        }}
      >
        Event Submission Rejected
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "#000000",
          marginBottom: "16px",
        }}
      >
        Hi {contactName},
      </p>

      <p
        style={{
          fontSize: "16px",
          color: "#000000",
          marginBottom: "16px",
        }}
      >
        Thank you for submitting your event <strong>{eventName}</strong> from <strong>{organization}</strong>.
        Unfortunately, we are unable to approve this event at this time.
      </p>

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "16px",
          borderRadius: "6px",
          marginBottom: "16px",
          borderLeft: "4px solid #d32f2f",
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
          Reason for Rejection
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
          }}
        >
          {rejectionReason}
        </p>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#000000",
          marginBottom: "16px",
        }}
      >
        If you have any questions or would like to resubmit your event with changes, please feel free to reach out to
        us.
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#000000",
        }}
      >
        Best regards,
        <br />
        The Spokes Team
      </p>
    </div>
  </div>
);
