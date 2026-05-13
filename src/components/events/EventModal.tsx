"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { EventRecord } from "@/types/event";

export interface EventModalProps {
  event: EventRecord;
  children: React.ReactNode;
}

export function EventModal({ event, children }: EventModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />

          <div
            className="relative bg-white rounded-xl overflow-hidden max-w-[500px] w-full shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[200px] bg-gray-200">
              {event.eventImage ? (
                <Image
                  src={event.eventImage}
                  alt={event.eventName}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-gray-600"
              >
                x
              </button>
            </div>

            <div className="p-6">
              {event.category && (
                <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-0.5 mb-3">
                  {event.category}
                </span>
              )}

              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{event.eventName}</h2>
              <p className="text-sm text-gray-500 mb-4">By {event.organization}</p>

              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDate(event.date)}
                </p>
                {event.time && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="flex-shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {event.time}
                  </p>
                )}
                {event.location && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="flex-shrink-0"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {event.location}
                  </p>
                )}
              </div>

              {event.description && <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>}

              <Link
                href="/sign-in"
                className="mt-6 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-md transition-colors no-underline"
                onClick={() => setOpen(false)}
              >
                Log In / Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
