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
import { FileAxis3dIcon, Loader } from "lucide-react";
import axios from "axios";
import { addFullFavorite } from "@/app/store/features/favoriteSlice";
import { addFullHistory } from "@/app/store/features/historySlice";

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const isLogin = useSelector((state) => state.auth.isLogin);

  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/auth/profile")
      .then((res) => {
        setLoading(false);
        setDetails(res.data.user);
        dispatch(addFullFavorite(res.data.user.favoriteSongs));
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

  return (
    <div className=" bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-10">
      {loading && (
        <div className="flex items-center justify-center h-screen w-full animate-spin">
          <Loader />
        </div>
      )}
      {!loading && (
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-10">Your Profile</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <Card className="w-full md:w-72 flex-shrink-0 bg-gray-800 border-none shadow-lg">
              <CardContent className="flex flex-col items-center pt-8">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-purple-600 text-3xl font-bold">
                    {details?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {details?.name || "User"}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  {details?.email || ""}
                </p>

                <Separator className="my-4 bg-gray-700" />

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="flex md:flex-col gap-2 bg-transparent">
                    <TabsTrigger
                      value="profile"
                      className="w-full justify-start data-[state=active]:bg-purple-600"
                    >
                      {/* <User className="w-4 h-4 mr-2" /> */}
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="w-full justify-start data-[state=active]:bg-purple-600"
                    >
                      {/* <Settings className="w-4 h-4 mr-2" /> */}
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Card className="flex-1 bg-gray-800 border-none shadow-lg">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* Profile Overview */}
                  <TabsContent value="profile">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold">
                        Profile Overview
                      </CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Card className="bg-gray-700 border-none">
                        <CardContent className="p-4 text-center">
                          {/* <Music className="w-6 h-6 mx-auto mb-2 text-purple-400" /> */}
                          <p className="text-sm text-gray-400">Liked Songs</p>
                          <p className="text-2xl font-bold">
                            {details?.favoriteSongs?.length || 0}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700 border-none">
                        <CardContent className="p-4 text-center">
                          {/* <History className="w-6 h-6 mx-auto mb-2 text-purple-400" /> */}
                          <p className="text-sm text-gray-400">
                            Listening History
                          </p>
                          <p className="text-2xl font-bold">
                            {details?.history?.length || 0}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Settings */}
                  <TabsContent value="settings">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold">
                        Account Settings
                      </CardTitle>
                    </CardHeader>
                    <div className="mt-6 space-y-6">
                      <Card className="bg-gray-700 border-none">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-4">
                            Personal Information
                          </h3>

                          {/* Name field */}
                          <div className="flex items-center justify-between">
                            <div className="w-full">
                              <p className="text-sm text-gray-400 mb-1">Name</p>
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                  className="bg-gray-800 text-white"
                                  autoFocus
                                />
                              ) : (
                                <p className="text-lg">
                                  {details?.name || "Not set"}
                                </p>
                              )}
                            </div>
                            <div className="ml-4 flex space-x-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={handleNameChange}
                                    className="bg-purple-600 hover:bg-purple-700"
                                  >
                                    {/* <Save className="w-4 h-4 mr-1" /> */}
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
                                    {/* <X className="w-4 h-4 mr-1" /> */}
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
                                  {/* <Edit3 className="w-4 h-4 mr-1" /> */}
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
