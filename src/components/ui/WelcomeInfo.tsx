"use client";
import React from "react";

type WelcomeInfoProps = {
  board?: "jobs" | "events";
};

export default function WelcomeInfo({ board = "jobs" }: WelcomeInfoProps) {
  const boardCopy =
    board === "events"
      ? {
          intro:
            "To post an event, your nonprofit must have 501(c)(3) status. Once you sign in, you can post, manage, and edit events anytime.",
          stepOne: "Confirm your nonprofit has 501(c)(3) status",
          stepTwo: "Fill out the “List Event” form",
          stepThree: "You'll get a notification once it's approved",
          stepFour: "Your event will be live on the Spokes event board",
          stepFive: "Manage events anytime in your dashboard",
        }
      : {
          intro:
            "To post a job, your nonprofit must have 501(c)(3) status. Once you sign in, you can post, manage, and edit listings anytime.",
          stepOne: "Confirm your nonprofit has 501(c)(3) status",
          stepTwo: "Fill out the “List Job” form",
          stepThree: "You'll get a notification once it's approved",
          stepFour: "Your job will be live for 30 days",
          stepFive: "Manage listings anytime in your dashboard",
        };

  return (
    <div className="max-w-md overflow-hidden p-6 ">
      <h2 className="text-2xl font-bold mb-4">Welcome Nonprofit Admins!</h2>
      <p className="pt-2 pb-10">{boardCopy.intro}</p>
      <ul className="space-y-3 relative list-none">
        <li className="pl-6 relative p">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            1
          </span>
          <p className="pl-2">{boardCopy.stepOne}</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            2
          </span>
          <p className="pl-2">{boardCopy.stepTwo}</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            3
          </span>
          <p className="pl-2">{boardCopy.stepThree}</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            4
          </span>
          <p className="pl-2">{boardCopy.stepFour}</p>
        </li>
        <li className="pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-700 text-white flex items-center justify-center text-sm font-bold">
            5
          </span>
          <p className="pl-2">{boardCopy.stepFive}</p>
        </li>
      </ul>
    </div>
  );
}
