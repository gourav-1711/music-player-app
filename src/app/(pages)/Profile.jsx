"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { updater } from "@/lib/updater";
import { Loader, LogOut, Settings, User } from "lucide-react";
import axios from "axios";
import { logout } from "../store/features/auth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clearFavorite } from "../store/features/favoriteSlice";
import { clearHistory } from "../store/features/historySlice";
import { useRouter, useSearchParams } from "next/navigation";
import { removePlaylist, resetPlaylist } from "../store/features/playlist";

const Profile = () => {
  const router = useRouter();

  const tabName = useSearchParams();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [checked, setChecked] = useState(false);

  const [error, setError] = useState("");
  const [passwordEdit, setPasswordEdit] = useState(false);

  const isLogin = useSelector((state) => state.auth.isLogin);

  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/auth/profile")
      .then((res) => {
        setLoading(false);
        setDetails(res.data.userObj);
        // dispatch(addFullFavorite(res.data.user.favoriteSongs));
        // dispatch(addFullHistory(res.data.user.history));
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to fetch profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLogin]);

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    setActiveTab(tabName.get("tab") || "profile");
  }, [tabName]);

  const handleLogout = () => {
    dispatch(logout());
    if (checked) {
      dispatch(clearHistory());
      dispatch(clearFavorite());
      dispatch(resetPlaylist());
    }
    router.push("/");
  };

  const handleUpdate = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {};

    if (e.target.name.value == "") {
      setError("Name is required");
      return;
    }

    if (formData.get("name")) data.name = formData.get("name");
    if (formData.get("oldPassword") && passwordEdit)
      data.oldPassword = formData.get("oldPassword");
    if (formData.get("newPassword") && passwordEdit)
      data.newPassword = formData.get("newPassword");

    axios
      .post("/api/auth/update", data)
      .then((res) => {
        toast("Profile updated successfully");
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to update profile");
        setError(err.message);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className=" text-white p-1 sm:p-6 md:p-10 overflow-hidden">
      {loading && (
        <div className="flex items-center justify-center h-screen w-full animate-spin">
          <Loader />
        </div>
      )}
      {!loading && (
        <div className="max-w-5xl w-full mx-auto px-2 sm:px-4 lg:px-8 overflow-x-hidden">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10">
            Your Profile
          </h1>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <Card className="w-full lg:w-72 flex-shrink-0 bg-gray-800 border-none shadow-lg">
              <CardContent className="flex flex-col items-center pt-6 sm:pt-8">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mb-4">
                  <AvatarFallback className="bg-purple-600 text-2xl sm:text-3xl font-bold">
                    {details?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg sm:text-xl font-semibold">
                  {details?.name || "User"}
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 text-center break-words">
                  {details?.email || ""}
                </p>

                <Separator className="bg-gray-700 w-full" />

                <Tabs
                  value={activeTab || "profile"}
                  onValueChange={setActiveTab}
                  className="w-full mt-4"
                >
                  <TabsList className="flex flex-row lg:flex-col flex-wrap gap-2 bg-transparent w-full h-full">
                    <TabsTrigger
                      value="profile"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
               data-[state=active]:bg-purple-600 data-[state=active]:text-white 
               hover:bg-gray-700 transition"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
               data-[state=active]:bg-purple-600 data-[state=active]:text-white 
               hover:bg-gray-700 transition"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="logout"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
               data-[state=active]:bg-purple-600 data-[state=active]:text-white 
               hover:bg-gray-700 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Card className="flex-1 bg-gray-800 border-none shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* Profile Overview */}
                  <TabsContent value="profile">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl font-semibold">
                        Profile Overview
                      </CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <Card className="bg-gray-700 border-none">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-400">Liked Songs</p>
                          <p className="text-xl sm:text-2xl font-bold">
                            {details?.favoriteSongs?.length || 0}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700 border-none">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-gray-400">
                            Listening History
                          </p>
                          <p className="text-xl sm:text-2xl font-bold">
                            {details?.history?.length || 0}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Settings */}
                  <TabsContent value="settings">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl font-semibold">
                        Account Settings
                      </CardTitle>
                    </CardHeader>

                    <div className="mt-6 space-y-6">
                      <Card className="bg-gray-700 border-none">
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="text-base sm:text-lg font-medium mb-4">
                            Personal Information
                          </h3>

                          {/* Settings Form */}
                          <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Name field */}
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Name</p>
                              <Input
                                type="text"
                                name="name"
                                defaultValue={details?.name || ""}
                                className="bg-gray-800 text-white w-full"
                              />
                            </div>

                            {/* Email field (readonly) */}
                            <div>
                              <p className="text-sm text-gray-400 mb-1">
                                Email
                              </p>
                              <Input
                                type="email"
                                name="email"
                                value={details?.email || ""}
                                readOnly
                                className="bg-gray-800 text-gray-400 w-full"
                              />
                            </div>
                            <div
                              className={`${passwordEdit ? "block" : "hidden"} space-y-3`}
                            >
                              {/* Old Password field */}
                              <div>
                                <p className="text-sm text-gray-400 mb-1">
                                  Old Password
                                </p>
                                <Input
                                  type="password"
                                  name="oldPassword"
                                  placeholder="Enter old password"
                                  className="bg-gray-800 text-white w-full"
                                />
                              </div>

                              {/* New Password field */}
                              <div>
                                <p className="text-sm text-gray-400 mb-1">
                                  New Password
                                </p>
                                <Input
                                  type="password"
                                  name="newPassword"
                                  placeholder="Enter new password"
                                  className="bg-gray-800 text-white w-full"
                                />
                              </div>
                            </div>
                            <p
                              onClick={() => setPasswordEdit(!passwordEdit)}
                              className="cursor-pointer text-purple-400"
                            >
                              {passwordEdit
                                ? "Dont Change Password"
                                : "Change Password"}
                            </p>
                            {/* eroor */}
                            <p className="text-red-500 text-sm font-medium">
                              {error}
                            </p>
                            {/* <p className="text-slate-300 text-sm font-medium">
                              Fill Password Filled Only IF You Wish To Change
                              Password
                            </p> */}

                            {/* Submit button */}
                            <div className="flex justify-end">
                              <Button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white focus:translate-x-2 focus:translate-y-2 focus:scale-110 transition-all duration-300"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Logout */}
                  <TabsContent value="logout">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl font-semibold">
                        Logout
                      </CardTitle>
                    </CardHeader>
                    <div className="mt-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            Logout
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white border-none rounded-lg">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                              Confirm Logout
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Are you sure you want to log out?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="secondary">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={handleLogout}
                              className=""
                            >
                              Logout
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <div className=" my-2 flex items-center gap-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={setChecked}
                        />
                        <p>Remove My Saved Data</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
