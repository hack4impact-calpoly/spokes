"use client";
import React, { useState } from "react";
import { Text, Heading, OrderedList, ListItem } from "@chakra-ui/react";

export default function WelcomeInfo() {
  return (
    <div className="max-w-md overflow-hidden p-6 ">
      <h2 className="text-2xl font-bold mb-4">Welcome Nonprofit Admins!</h2>
      <p className="pt-2 pb-10">
        To post a job, your nonprofit must have 501(c)(3) status. Once you sign in, you can post, manage, and edit
        listings anytime.
      </p>
      <ul className="space-y-3 relative list-none">
        <li className="pl-6 relative p">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            1
          </span>
          <p className="pl-2">Confirm your nonprofit has 501(c)(3) status</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            2
          </span>
          <p className="pl-2">Fill out the “List Job” form</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            3
          </span>
          <p className="pl-2">You&#39;ll get a notification once it&#39;s approved</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            4
          </span>
          <p className="pl-2">Your job will be live for 30 days</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            5
          </span>
          <p className="pl-2">Manage listings anytime in your dashboard</p>
        </li>
      </ul>
    </div>
  );
}
