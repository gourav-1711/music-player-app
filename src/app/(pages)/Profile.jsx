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

const Profile = () => {

  const router = useRouter();

  const tabName = useSearchParams();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [ checked, setChecked ] = useState(false);

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

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(details?.name || "");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(()=>{
    setActiveTab(tabName.get("tab"))
  },[tabName])

  const handleNameChange = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const data = {
        name: newName,
      };
      updater(data);
      toast("Name updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update name");
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    if(checked){
      dispatch(clearHistory());
      dispatch(clearFavorite());
    }
    router.push("/")
  };

  return (
    <div className=" bg-gradient-to-b from-gray-900 to-black text-white p-1 sm:p-6 md:p-10">
      {loading && (
        <div className="flex items-center justify-center h-screen w-full animate-spin">
          <Loader />
        </div>
      )}
      {!loading && (
        <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
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
                  value={activeTab}
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

                          {/* Name field */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="w-full">
                              <p className="text-sm text-gray-400 mb-1">Name</p>
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                  className="bg-gray-800 text-white w-full"
                                  autoFocus
                                />
                              ) : (
                                <p className="text-lg">
                                  {details?.name || "Not set"}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={handleNameChange}
                                    className="bg-purple-600 hover:bg-purple-700"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                      setIsEditing(false);
                                      setNewName(details?.name || "");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsEditing(true)}
                                  className="text-purple-400 hover:text-purple-300"
                                >
                                  Edit
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Email field */}
                          <div className="mt-6">
                            <p className="text-sm text-gray-400 mb-1">Email</p>
                            <p className="text-gray-300">
                              {details?.email || "Not set"}
                            </p>
                          </div>
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
                        <Checkbox checked={checked} onCheckedChange={setChecked} />
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
