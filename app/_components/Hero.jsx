"use client"; // Ensures client-side rendering

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook

function Hero() {
  const { isSignedIn } = useUser(); // Get user's authentication state

  return (
    <section className="bg-gray-900 text-white flex flex-col items-center">
      <div className="mx-auto max-w-screen-xl px-4 py-32 text-center">
        <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
          Take Control of Your Finances
          <span className="sm:block"> Track, Save, and Grow </span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
          Create Your Budget Now and Watch Your Savings Skyrocket!
        </p>

        <div className="mt-8 flex justify-center">
          {/* Redirect to Dashboard if Signed In, Otherwise to Sign-In */}
          <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
            <button className="rounded-sm bg-blue-600 px-12 py-3 text-sm font-medium text-white border border-blue-600 hover:bg-transparent hover:text-white">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Wrap Image in a div to Prevent Hydration Errors */}
      <div className="w-full flex justify-center -mt-9">
        <Image 
          src="/dashboard.png" 
          alt="An illustrative image of a financial dashboard"  // Descriptive alt text for accessibility
          width={1000} 
          height={700} 
          className="rounded-xl border-2"
          priority // Ensures faster image loading
        />
      </div>
    </section>
  );
}

export default Hero;
