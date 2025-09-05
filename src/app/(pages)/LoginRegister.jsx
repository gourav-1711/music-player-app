"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, register } from "@/app/store/features/auth";
import { addFullFavorite } from "@/app/store/features/favoriteSlice";
import { addFullHistory } from "../store/features/historySlice";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginRegister() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const route = useRouter();

  const tab = useSearchParams().get("tab");
  const returnTo = useSearchParams().get("returnTo");

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    try {
      const res = await axios.post("/api/auth/login", formValues);
      console.log(res.data);

      toast("Login successful");
      dispatch(login(res.data));
      dispatch(addFullFavorite(res.data.user.favoriteSongs));
      dispatch(addFullHistory(res.data.user.history));
      route.push(returnTo || "/");
    } catch (error) {
      console.log(error);

      toast(
        error.response?.data?.message ||
          error.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    try {
      const res = await axios.post("/api/auth/register", formValues);
      console.log(res.data);
      toast("Account created successfully");
      dispatch(register(res.data));
      route.push(returnTo || "/");
    } catch (error) {
      toast(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl shadow-purple-900/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            {activeTab === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-white/80">
            {activeTab === "login"
              ? "Log in to your account"
              : "Enter your details to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white/80">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-white/80">
                    Full Name
                  </Label>
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-white/80">
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    required
                    minLength="6"
                    placeholder="Create a password"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
