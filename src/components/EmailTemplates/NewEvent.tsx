import * as React from "react";

interface NewEventProps {
  eventName: string;
  description: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  locationType: string;
  contactName: string;
  contactEmail: string;
  adminURL: string;
}

const toTitleCase = (text: string): string =>
  text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");

export const NewEvent: React.FC<NewEventProps> = ({
  eventName,
  description,
  organization,
  date,
  time,
  location,
  locationType,
  contactName,
  contactEmail,
  adminURL,
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
        New Event Submitted!
      </h1>

      {/* Event Details Section */}
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
          {eventName}
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Organization:</strong> {organization}
        </p>
      </div>

      {/* Event Details */}
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
          Event Information
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Date:</strong> {date}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Time:</strong> {time}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          <strong>Location:</strong> {location}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          <strong>Location Type:</strong> {toTitleCase(locationType)}
        </p>
      </div>

      {/* Description */}
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
          Description
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#000000",
          }}
        >
          {description}
        </p>
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
      </div>
    </div>

    <div
      style={{
        textAlign: "center",
        marginTop: "24px",
      }}
    >
      <a
        href={adminURL}
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        Review Event Submission
      </a>
    </div>
  </div>
);
