"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PlaylistCard } from "../comman/PlaylistCard";
import { useDispatch, useSelector } from "react-redux";
import { addFullPlaylist } from "../store/features/playlist";
import { Search } from "lucide-react";
import AlertMessage from "../comman/AlertMessage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Playlist() {
  const playlistRedux = useSelector((state) => state.playlist.playlist);
  const dispatch = useDispatch();

  const [videos, setVideos] = useState(playlistRedux.videos || []);
  const [loading, setLoading] = useState(false);
  const [playList, setPlaylist] = useState(
    playlistRedux || {
      thumbnail: "",
      title: "",
      description: "",
      channelTitle: "",
    }
  );
  const [open, setOpen] = useState(false);
  // alert work
  const [msg, setMsg] = useState({
    message: "",
    show: false,
  });
  
  const alertCall = (msgs, show) => {
    if (msg.show) {
      msg.message = msgs;
    }
    setMsg({
      message: msgs,
      show: show,
    });
    setTimeout(() => {
      setMsg({
        message: "",
        show: false,
      });
    }, 1500);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.search.value == "") {
      alertCall("Please enter a playlist URL", true);
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post("/api/music/playlist", {
        url: e.target.search.value,
      });
      setVideos(res.data.playlist.videos);
      setPlaylist(res.data.playlist);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "An error occurred. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistRedux && playlistRedux.videos?.length > 0) {
      setVideos(playlistRedux.videos);
      setPlaylist(playlistRedux);
    }
  }, [playlistRedux]);

  const savePlaylist = () => {
    if (playlistRedux) {
      setOpen(true);
    }
    dispatch(addFullPlaylist(playList));
    alertCall("Playlist Saved");
  };

  const confirmSavePlaylist = () => {
    dispatch(addFullPlaylist(playList));
    setOpen(false);
    alertCall(" New Playlist Saved");
  };

  return (
    <>
      <div className="max-w-[1150px] mx-auto my-3 space-y-3 px-3">
        <AlertMessage message={msg.message} show={msg.show} />
        <h1 className="text-2xl italic font-semibold ">
          Add Your Favorite Youtube Playlist
        </h1>
        <form
          action=""
          className="flex justify-center items-center gap-2 w-full md:w-[60%] lg:w-[50%]"
          onSubmit={handleSubmit}
        >
          <Input
            name="search"
            type="text"
            placeholder="Search Your Playlist From Youtube"
          />
          <Button
            className={
              "w-fit px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-md "
            }
          >
            <Search />
            Search
          </Button>
        </form>

        <div className="">
          {loading ? (
            <div className="flex items-center justify-center min-h-screen w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="">
              {/* playlist detail and else */}
              {videos.length >= 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/80 rounded-2xl shadow-lg overflow-hidden p-1 md:p-2">
                  {/* Thumbnail Section */}
                  <div className="flex justify-center items-center">
                    <img
                      src={
                        playList.thumbnails?.maxres?.url ||
                        playList.thumbnails?.high?.url
                      }
                      alt={playList.title}
                      className="w-full h-auto rounded-xl shadow-md object-cover"
                    />
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-col justify-center space-y-4 text-slate-100">
                    <h2 className="text-2xl md:text-3xl font-bold leading-snug">
                      {playList.title}
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base font-medium">
                      By{" "}
                      <span className="text-purple-400">
                        {playList.channelTitle}
                      </span>
                    </p>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed line-clamp-5">
                      {playList.description}
                    </p>

                    <button
                      onClick={savePlaylist}
                      className="w-fit px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-semibold shadow-md"
                    >
                      Save Playlist
                    </button>
                  </div>
                </div>
              )}

              {/* videos */}
              <div className="md:p-4 mt-4 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {videos.map((video, index) => {
                  return (
                    <PlaylistCard
                      key={video.id + index}
                      item={video}
                      mode={""}
                      from={"playlist"}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* alert dialog */}
        <Dialog open={open} setOpen={setOpen}>
          <DialogContent className="bg-gray-800 text-white border-none rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Confirm Save Playlist
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                This Will Remove Your Saved Playlist And Save This
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmSavePlaylist}
                className=""
              >
                Save Playlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
