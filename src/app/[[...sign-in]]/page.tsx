"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-purple-100/25 bg-[size:50px_50px] opacity-30" />
      
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col gap-6 w-full max-w-md relative z-10 border border-purple-100"
        >
          {/* Church Logo and Name */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <Image 
                src="/church-logo.png" 
                alt="Flood of Life Embassy" 
                width={60} 
                height={60}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Flood of Life Embassy
            </h1>
            <p className="text-sm text-gray-500 text-center">
              Church Management System
            </p>
          </div>

          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700">Welcome Back!</h2>
            <p className="text-xs text-gray-400 mt-1">
              Sign in to access your church dashboard
            </p>
          </div>

          <Clerk.GlobalError className="text-sm text-red-400 bg-red-50 p-2 rounded-md" />

          {/* Username Field */}
          <Clerk.Field name="identifier" className="flex flex-col gap-1.5">
            <Clerk.Label className="text-sm font-medium text-gray-600">
              Username or Email
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              placeholder="Enter your username"
              className="p-3 rounded-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-400 outline-none transition-all w-full bg-gray-50/50"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          {/* Password Field */}
          <Clerk.Field name="password" className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <Clerk.Label className="text-sm font-medium text-gray-600">
                Password
              </Clerk.Label>
              <button
                type="button"
                className="text-xs text-purple-600 hover:text-purple-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Clerk.Input
              type="password"
              required
              placeholder="••••••••"
              className="p-3 rounded-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-400 outline-none transition-all w-full bg-gray-50/50"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          {/* Sign In Button */}
          <SignIn.Action
            submit
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-200 mt-2"
            onClick={() => setIsLoading(true)}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </SignIn.Action>

          {/* Demo Credentials */}
          <div className="mt-4 p-4 bg-purple-50/80 rounded-lg border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1">
              <span>🔐</span> Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-600">Admin</p>
                <p className="text-gray-400">admin / admin123</p>
              </div>
              <div className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-600">Pastor</p>
                <p className="text-gray-400">pastor / pastor123</p>
              </div>
              <div className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-600">Member</p>
                <p className="text-gray-400">member / member123</p>
              </div>
              <div className="bg-white p-2 rounded border border-purple-100">
                <p className="font-medium text-gray-600">Leader</p>
                <p className="text-gray-400">leader / leader123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 mt-2">
            <p>© {currentYear} Flood of Life Embassy. All rights reserved.</p>
            <p className="mt-1">Version 2.0.0</p>
          </div>

          {/* Church Verse */}
          <div className="text-center text-xs text-purple-600 italic border-t border-gray-100 pt-4 mt-2">
            "I have come that they may have life, and have it to the full." - John 10:10
          </div>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
