"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/events";
import { useAuth } from "@clerk/nextjs";

export default function EventFormPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      eventName: formData.get("eventName") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      locationType: formData.get("locationType") as string,
    };

    try {
      await createEvent(data);
      router.push("/events");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white px-6 py-8">
        <div className="mx-auto max-w-[660px]">
          <h1 className="mb-4 text-2xl font-bold text-black">Create New Event</h1>
          <p className="text-gray-700">Please sign in to create an event.</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-sm bg-gray-100 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-gray-200";
  const labelClass = "block text-sm font-bold text-black mb-1";
  const fieldClass = "mb-4";

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="mx-auto max-w-[660px]">
        <h1 className="mb-6 text-2xl font-bold text-black">Create New Event</h1>

        {serverError && (
          <div className="mb-4 bg-red-50 p-3 text-sm text-red-700 border border-red-200">{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <p className="mb-4 text-sm font-bold text-black">Event Information</p>

          <div className={fieldClass}>
            <label htmlFor="eventName" className={labelClass}>
              Event Title
            </label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              placeholder="Enter your response"
              required
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <label htmlFor="date" className={labelClass}>
              Event Date
            </label>
            <div className="flex items-center gap-3">
              <input
                id="date"
                name="date"
                type="date"
                required
                className="rounded-sm bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none focus:bg-gray-200"
              />
              <input
                id="time"
                name="time"
                type="text"
                placeholder="5:30 - 8:30"
                required
                className="rounded-sm bg-gray-100 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-gray-200 w-32"
              />
            </div>
          </div>

          <div className={fieldClass}>
            <label htmlFor="description" className={labelClass}>
              Event Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Enter your response"
              required
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <label htmlFor="location" className={labelClass}>
              Event Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Enter your response"
              required
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <label htmlFor="locationType" className={labelClass}>
              Location Type
            </label>
            <select
              id="locationType"
              name="locationType"
              required
              defaultValue=""
              className={`${inputClass} appearance-none`}
            >
              <option value="" disabled>
                Enter your response
              </option>
              <option value="in-person">In-person</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="rounded-sm bg-teal-600 px-10 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
