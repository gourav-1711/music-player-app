"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Heart,
  Shuffle,
  Repeat,
  ChevronDown,
  ChevronUp,
  DotIcon,
  MoreHorizontalIcon,
  VolumeOff,
  Volume,
  Volume2Icon,
  Cross,
  CrossIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  play,
  resetPlayer,
  setShowPlayer,
} from "../store/features/musicPlayerSlice";
import { addFavorite, removeFavorite } from "../store/features/favoriteSlice";
import { toast } from "sonner";
import { addHistory } from "../store/features/historySlice";
import { CloseIcon } from "@/components/expandable-card-demo-grid";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import AlertMessage from "../comman/AlertMessage";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MusicPlayer = () => {
  let { videoId, showPlayer, title, artist, mode, description, src, from } =
    useSelector((state) => state.musicPlayer);

  const getActiveList = () => {
    if (from === "history") return history;
    if (from === "favorite") return favorite;
    if (from === "playlist") return playlist;
    return [];
  };

  const history = useSelector((state) => state.history.history);
  const favorite = useSelector((state) => state.favorite.favorite);
  const playlist = useSelector((state) => state.playlist.videos);

  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [totalItems, setTotalItems] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState(false);
  const [mute, setMute] = useState(false);

  // Refs to handle stale closure issues
  const isRepeatOnRef = useRef(isRepeatOn);
  const isShuffleOnRef = useRef(isShuffleOn);
  const isAutoplayOnRef = useRef(isAutoplayOn);

  // open and close sheet
  const [open, setOpen] = useState(false);

  // Update refs when state changes
  useEffect(() => {
    isRepeatOnRef.current = isRepeatOn;
  }, [isRepeatOn]);

  useEffect(() => {
    isShuffleOnRef.current = isShuffleOn;
  }, [isShuffleOn]);

  useEffect(() => {
    isAutoplayOnRef.current = isAutoplayOn;
  }, [isAutoplayOn]);

  useEffect(() => {
    if (from === "history" || from === "favorite" || from === "playlist") {
      // history has videoId
      if (from === "history") {
        setCurrentIndex(history.findIndex((item) => item.videoId === videoId));
        setTotalItems(history.length);
      }
      // favorite has Id
      if (from === "favorite") {
        setCurrentIndex(favorite.findIndex((item) => item.id === videoId));
        setTotalItems(favorite.length);
      }
      // playlist has id
      if (from === "playlist") {
        setCurrentIndex(playlist.findIndex((item) => item.id === videoId));
        setTotalItems(playlist.length);
      }
      // console.log(currentIndex);
    }
  }, [from, videoId]);

  const handlePrevious = () => {
    const list = getActiveList();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
    const prevItem = list[newIndex];

    setCurrentIndex(newIndex);
    dispatch(resetPlayer());
    setCurrentTime(0);
    setIsRepeatOn(false);
    dispatch(
      play({
        id: prevItem.videoId || prevItem.id,
        title: prevItem.title,
        artist: prevItem.artist,
        description: prevItem.description,
        src: prevItem.src,
        from: from || "",
      })
    );
  };

  const handleNext = () => {
    const list = getActiveList();
    const newIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
    const nextItem = list[newIndex];

    setCurrentIndex(newIndex);
    dispatch(resetPlayer());
    setCurrentTime(0);
    setIsRepeatOn(false);
    dispatch(
      play({
        id: nextItem.videoId || nextItem.id,
        title: nextItem.title,
        artist: nextItem.artist,
        description: nextItem.description,
        src: nextItem.src,
        from: from || "",
      })
    );
  };

  const random = () => {
    const list = getActiveList();

    if (list.length <= 1) {
      return;
    }

    console.log(isShuffleOn, "isShuffleOn");

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * list.length);
    } while (randomIndex === currentIndex);

    const randomItem = list[randomIndex];
    console.log(currentIndex, "currentIndex");
    console.log(randomIndex, "random");

    setCurrentIndex(randomIndex);
    dispatch(resetPlayer());
    setCurrentTime(0);
    setIsRepeatOn(false);
    dispatch(
      play({
        id: randomItem.videoId || randomItem.id,
        title: randomItem.title,
        artist: randomItem.artist,
        description: randomItem.description,
        src: randomItem.src,
        from: from || "",
      })
    );
  };

  ///////////////////////////
  const handleEndPlayback = () => {
    if (isShuffleOnRef.current) {
      console.log("Playing random song");
      random();
      return;
    }

    if (isAutoplayOnRef.current) {
      console.log("Playing next song");
      handleNext();
      return;
    }
  };

  ////////////////////////////////////
  useEffect(() => {
    if (!videoId) return;
    setIsReady(false);
    let ytPlayer;
    loadYouTubeAPI().then((YT) => {
      ytPlayer = new YT.Player(`youtube-player`, {
        height: "0",
        width: "0",
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setIsReady(true);
            setDuration(Math.floor(event.target.getDuration()));

            event.target.setPlaybackQuality("small");
          },
          onStateChange: (event) => {
            const { data } = event;
            if (data === YT.PlayerState.PLAYING) setIsPlaying(true);
            if (data === YT.PlayerState.PAUSED) setIsPlaying(false);

            if (data === YT.PlayerState.ENDED) {
              // Check if repeat is on
              if (isRepeatOnRef.current) {
                // Loop the current video
                event.target.seekTo(0);
                event.target.playVideo();
              } else if (isShuffleOnRef.current || isAutoplayOnRef.current) {
                handleEndPlayback();
              } else {
                setIsPlaying(false);
              }
            }
          },
        },
      });
    });

    return () => {
      if (ytPlayer?.destroy) ytPlayer.destroy();
    };
  }, [videoId]);

  useEffect(() => {
    if (!player || !isReady || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(player.getCurrentTime()));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, player, isReady]);

  const loadYouTubeAPI = () => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) resolve(window.YT);
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    });
  };

  const handlePlayPause = () => {
    if (!player || !isReady) return;
    isPlaying ? player.pauseVideo() : player.playVideo();
  };

  const handleSeek = (seconds) => {
    if (player && isReady) {
      player.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // liked feauture
  const [added, setAdded] = useState(false);

  const musicObj = {};

  const handleLikeClick = () => {
    musicObj.id = videoId;
    musicObj.title = title;
    musicObj.artist = artist;
    musicObj.description = description;
    musicObj.src =
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    console.log(musicObj);

    if (added) {
      dispatch(removeFavorite(musicObj));
      alertCall("Removed from favorite", true);
    } else {
      dispatch(addFavorite(musicObj));
      alertCall("Added to favorite", true);
    }
  };

  useEffect(() => {
    if (favorite.some((fav) => fav.id === videoId)) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [favorite, videoId]);

  // history feauture
  useEffect(() => {
    if (videoId) {
      dispatch(
        addHistory({
          videoId,
          title,
          artist,
          mode,
          description,
          src:
            src ||
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        })
      );
    }
  }, [videoId]);
  //////////////////////////////////////////
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
    }, 1000);
  };

  const shuffleClick = () => {
    setIsShuffleOn((prev) => !prev);
    alertCall("Shuffle mode " + (!isShuffleOn ? "on" : "off"), true);
    setIsRepeatOn(false);
    setIsAutoplayOn(false);
  };

  const repeatClick = () => {
    setIsRepeatOn((prev) => !prev);
    alertCall("Repeat mode " + (!isRepeatOn ? "on" : "off"), true);
    setIsShuffleOn(false);
    setIsAutoplayOn(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return; // Don't handle shortcuts when typing
      }

      switch (event.code) {
        case "Space":
          event.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          event.preventDefault();
          handleSeek(Math.max(0, currentTime - 10));
          break;
        case "ArrowRight":
          event.preventDefault();
          handleSeek(Math.min(duration, currentTime + 10));
          break;
        case "ArrowUp":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowDown":
          event.preventDefault();
          handleNext();
          break;
        case "Esc":
          event.preventDefault();
          setIsExpanded(false);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [
    handlePlayPause,
    handleSeek,
    currentTime,
    duration,
    handlePrevious,
    handleNext,
  ]);

  // window scroll stop
  useEffect(() => {
    if (isExpanded && showPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isExpanded]);

  const resetPlayers = () => {
    if (player) {
      player.pauseVideo();
    }
    // videoId = "";
    // title = "";
    // artist = "";
    // description = "";
    // src = "";
    setIsExpanded(false);
    // dispatch(setShowPlayer(false));
    dispatch(resetPlayer());
  };

  return (
    <>
      <div id={`youtube-player`} style={{ display: "none" }} />
      {showPlayer && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-[99999] transition-all duration-500 ${
            isExpanded ? "min-h-svh h-screen" : "h-[70px] sm:h-[80px]"
          }`}
        >
          <Card className="w-full h-full bg-slate-900 backdrop-blur-lg border-t border-slate-700/40 shadow-2xl p-1 sm:p-2 md:p-4 flex flex-col">
            {/* Collapsed Player (Mini Player) */}
            {!isExpanded && (
              <div className="flex items-center space-x-4 z-[99999]">
                <img
                  src={
                    src !== ""
                      ? src
                      : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
                        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                  }
                  alt="thumb"
                  onError={(e) =>
                    (e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
                  }
                  className="w-12 h-12 rounded object-cover"
                  onClick={() => setIsExpanded((prev) => !prev)}
                />
                <div
                  className="flex-1 truncate cursor-pointer"
                  onClick={() => setIsExpanded(true)}
                >
                  <h3 className="text-white font-semibold text-sm truncate">
                    {title}
                  </h3>
                  <p className="text-slate-400 text-xs truncate">{artist}</p>
                </div>
                <Button
                  onClick={handlePlayPause}
                  variant="ghost"
                  size="icon"
                  disabled={!isReady}
                  className="text-white"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeClick}
                  className={added ? "text-red-400" : ""}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      added ? "fill-current scale-110" : ""
                    }`}
                  />
                  <span>Like</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-slate-400 hover:text-white"
                >
                  {isExpanded ? <ChevronDown /> : <ChevronUp />}
                </Button>
                <Button onClick={resetPlayers}>
                  <CloseIcon />
                </Button>
              </div>
            )}

            {/* Expanded Player (Full Screen) */}
            {isExpanded && (
              <div className="fixed overflow-hidden top-0 left-0 right-0 flex flex-col h-full">
                {/* Header with close/minimize buttons */}
                <div className="flex justify-between items-center p-4 sm:p-6 pt-safe-top sticky top-10 md:top-0 z-50 bg-slate-900/80 backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white h-10 w-10"
                    onClick={resetPlayers}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-slate-400 hover:text-white h-10 w-10"
                  >
                    <ChevronDown className="h-6 w-6" />
                  </Button>
                </div>

                {/* Main Content Area */}
                <div className="w-full flex-1 flex flex-col justify-center items-center overflow-y-auto px-4 sm:px-6 pb-4">
                  <AlertMessage
                    message={msg.message}
                    show={msg.show}
                    onClose={() => setMsg({ message: "", show: false })}
                  />

                  {/* Album Art */}
                  <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-[350px] aspect-square rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-2xl">
                    <img
                      src={
                        src
                          ? src
                          : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                      }
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                      className="w-full h-full object-cover"
                      alt="cover"
                    />
                  </div>

                  {/* Song Info */}
                  <div className="w-full max-w-4xl  text-center mb-6">
                    <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-2">
                      {title}
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                      {artist}
                    </p>
                  </div>

                  {/* Progress Slider */}
                  <div className="w-full max-w-4xl mb-2">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      min={0}
                      onValueChange={(v) => {
                        setIsPlaying(false);
                        handleSeek(v[0]);
                      }}
                      onValueCommit={(v) => {
                        if (!player || !isReady) return;
                        const wasPlaying = isPlaying;
                        player.seekTo(v[0], true);
                        setCurrentTime(v[0]);
                        if (wasPlaying) player.playVideo();
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Time Display */}
                  <div className="flex justify-between w-full max-w-4xl text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Main Control Buttons */}
                  <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 mb-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={
                        !["history", "favorite", "playlist"].includes(from)
                      }
                      onClick={handlePrevious}
                      className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <SkipBack className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSeek(currentTime - 10)}
                      className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 hover:text-white"
                    >
                      <Rewind className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>

                    <Button
                      onClick={handlePlayPause}
                      disabled={!isReady}
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white text-black hover:bg-slate-100 disabled:opacity-50 shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6 sm:h-7 sm:w-7" />
                      ) : (
                        <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-1" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSeek(currentTime + 10)}
                      className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 hover:text-white"
                    >
                      <FastForward className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={
                        !["history", "favorite", "playlist"].includes(from)
                      }
                      onClick={handleNext}
                      className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <SkipForward className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="shrink-0 px-4 sm:px-6 py-4 bg-slate-900 border-t border-slate-700/30">
                  <div className="flex justify-between items-center max-w-5xl mx-auto">
                    {/* Like Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLikeClick}
                      className={`flex flex-col items-center gap-1 px-2 py-2 min-w-[60px] ${
                        added
                          ? "text-red-400"
                          : "text-slate-400 hover:text-white "
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          added ? "fill-current scale-110" : ""
                        }`}
                      />
                      <span className="text-xs">Like</span>
                    </Button>

                    {/* Shuffle Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shuffleClick}
                      className={`flex flex-col items-center gap-1 px-2 py-2 min-w-[60px] ${
                        isShuffleOn
                          ? "text-blue-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Shuffle className="h-4 w-4" />
                      <span className="text-xs">Shuffle</span>
                    </Button>

                    {/* Repeat Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={repeatClick}
                      className={`flex flex-col items-center gap-1 px-2 py-2 min-w-[60px] ${
                        isRepeatOn
                          ? "text-blue-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Repeat className="h-4 w-4" />
                      <span className="text-xs">Repeat</span>
                    </Button>

                    {/* More Options Dropdown */}
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex flex-col items-center gap-1 px-2 py-2 min-w-[60px] rounded-lg bg-white/10 hover:bg-white/20"
                        >
                          <MoreHorizontalIcon className="h-4 w-4 text-white" />
                          <span className="text-xs text-white">More</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent className="z-[999999] w-48 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-xl mb-4">
                          {/* Mute/Unmute */}
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setMute(!mute);
                              if (mute) {
                                player.setVolume(0);
                                alertCall("Audio muted", true);
                              } else {
                                player.setVolume(100);
                                alertCall("Audio unmuted", true);
                              }
                            }}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 rounded-xl"
                          >
                            {!mute ? (
                              <VolumeOff className="h-4 w-4 text-red-400" />
                            ) : (
                              <Volume2Icon className="h-4 w-4 text-green-400" />
                            )}
                            <span>{!mute ? "Mute" : "Unmute"}</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-white/20 my-1" />

                          {/* AutoPlay Toggle */}
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex items-center justify-between px-4 py-3 rounded-xl focus:bg-white/10"
                          >
                            <span>AutoPlay</span>
                            <Switch
                              id="autoplay"
                              checked={isAutoplayOn}
                              onCheckedChange={(checked) => {
                                setIsAutoplayOn(checked);
                                alertCall(
                                  !isAutoplayOn
                                    ? "AutoPlay On"
                                    : "AutoPlay Off",
                                  true
                                );
                                if (checked) {
                                  setIsShuffleOn(false);
                                  setIsRepeatOn(false);
                                }
                              }}
                              className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600 h-5 w-9"
                            />
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-white/20 my-1" />

                          {/* Playlist */}
                          <DropdownMenuItem
                            onSelect={(e) => setOpen(true)}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 rounded-xl"
                          >
                            <MoreHorizontalIcon className="h-4 w-4 text-white" />
                            <span>Your Playlist</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>
                  </div>

                  {/* Playlist Sidebar */}
                  <SideBarContent
                    playlistName={from}
                    from={from}
                    open={open}
                    setOpen={setOpen}
                    selectedId={videoId}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

const SideBarContent = ({ playlistName, from, open, setOpen, selectedId }) => {
  const history = useSelector((state) => state.history.history);
  const favorite = useSelector((state) => state.favorite.favorite);
  const playlist = useSelector((state) => state.playlist.videos);

  const dispatch = useDispatch();

  const getActiveList = () => {
    if (from === "history") return history;
    if (from === "favorite") return favorite;
    if (from === "playlist") return playlist;
    return [];
  };
  const [activeList, setActiveList] = useState([]);

  useEffect(() => {
    setActiveList(getActiveList());
  }, [from]);

  const cardClick = (obj) => {
    dispatch(resetPlayer());
    dispatch(
      play({
        id: obj.id,
        title: obj.title,
        artist: obj.artist,
        description: obj.description,
        src: obj.src,
        from: from || "",
      })
    );
    setTimeout(() => {
      setOpen(false);
    }, 200);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="z-[100000] rounded-md bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-xl border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-y-scroll [scrollbar-hide]">
        <SheetHeader>
          <SheetTitle>Your Playlist</SheetTitle>
          <SheetDescription>
            Your Videos in <span className="font-bold capitalize">{from}</span>
          </SheetDescription>
        </SheetHeader>
        <div className="p-2 space-y-3">
          {activeList.length == 0 && (
            <div className="text-center text-slate-400">
              No Playlists Found Try Playing From Playlist , Favorite , History{" "}
            </div>
          )}
          {activeList.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {activeList.map((item) => {
                const isActive = item.id === selectedId;
                return (
                  <div
                    onClick={() => cardClick(item)}
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition cursor-pointer
            ${
              isActive
                ? "bg-blue-700/30 ring-2 ring-blue-400"
                : "bg-gray-800/40 hover:bg-gray-700/50"
            }
          `}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="text-white text-sm md:text-base truncate w-full">
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicPlayer;
