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
import { Label } from "@/components/ui/label";
import AlertMessage from "../comman/AlertMessage";

const MusicPlayer = () => {
  const { videoId, showPlayer, title, artist, mode, description, src, from } =
    useSelector((state) => state.musicPlayer);

  const getActiveList = () => {
    if (from === "history") return history;
    if (from === "favorite") return favorite;
    if (from === "playlist") return playlist;
    return [];
  };

  const history = useSelector((state) => state.history.history);
  const favorite = useSelector((state) => state.favorite.favorite);
  const playlist = useSelector((state) => state.playlist.playlist);
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [totalItems, setTotalItems] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isAutoplayOn, setIsAutoplayOn] = useState(false);
  const [mute, setMute] = useState(false);

  // Refs to handle stale closure issues
  const isRepeatOnRef = useRef(isRepeatOn);
  const isShuffleOnRef = useRef(isShuffleOn);
  const isAutoplayOnRef = useRef(isAutoplayOn);

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

  const repeatSame = () => {
    console.log("repeatSame");
    if (player && typeof player.seekTo === "function") {
      console.log("player.seekTo");
      player.seekTo(0, true); // jump back to start
      player.playVideo(); // force play
      setIsPlaying(true);
    } else {
      console.log("handleSeek");
      handleSeek(0);
      setIsPlaying(false);
      setTimeout(() => {
        setIsPlaying(true);
        handleSeek(currentTime - 40);
      }, 500);
    }
  };

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
    if (mode === "search") {
      musicObj.id = videoId;
      musicObj.title = title;
      musicObj.artist = artist;
      musicObj.description = description;
      musicObj.src =
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else {
      musicObj.id = videoId;
      musicObj.title = title;
      musicObj.artist = artist;
      musicObj.description = description;
      musicObj.src = src;
    }

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

  return (
    <>
      <div id={`youtube-player`} style={{ display: "none" }} />
      {showPlayer && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-[99999] transition-all duration-300 ${
            isExpanded ? " h-svh" : "h-[80px]"
          }`}
        >
          <Card className="w-full h-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-700/40 shadow-2xl p-4 flex flex-col">
            {/* Top Section (always visible) */}
            {!isExpanded && (
              <div className="flex items-center space-x-4">
                <img
                  src={
                    src !== ""
                      ? src
                      : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
                        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                  }
                  alt="thumb"
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
                <Button
                  onClick={() => {
                    if (player) player.pauseVideo();
                    dispatch(setShowPlayer(false));
                  }}
                >
                  <CloseIcon />
                </Button>
              </div>
            )}

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-6 space-y-4">
                <Button
                  className="fixed top-4 left-4 z-[99999]"
                  onClick={() => {
                    if (player) player.pauseVideo();
                    dispatch(setShowPlayer(false));
                  }}
                >
                  <Cross />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-slate-400 hover:text-white fixed top-4 right-4 z-[99999]"
                >
                  {isExpanded ? (
                    <ChevronDown className="text-3xl" />
                  ) : (
                    <ChevronUp />
                  )}
                </Button>
                <div className="aspect-square max-w-[350px] mx-auto rounded-2xl overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                    className="w-full h-full object-cover"
                    alt="cover"
                  />
                </div>
                <AlertMessage
                  message={msg.message}
                  show={msg.show}
                  onClose={() => setMsg({ message: "", show: false })}
                />
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

                    // pause while dragging, then resume after commit
                    const wasPlaying = isPlaying;
                    player.seekTo(v[0], true);
                    setCurrentTime(v[0]);

                    if (wasPlaying) {
                      player.playVideo();
                    }
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      !["history", "favorite", "playlist"].includes(from)
                    }
                    onClick={handlePrevious}
                  >
                    <SkipBack />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSeek(currentTime - 10)}
                  >
                    <Rewind />
                  </Button>
                  <Button
                    onClick={handlePlayPause}
                    disabled={!isReady}
                    className="h-12 w-12 rounded-full bg-white text-black"
                  >
                    {isPlaying ? <Pause /> : <Play className="ml-1" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSeek(currentTime + 10)}
                  >
                    <FastForward />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      !["history", "favorite", "playlist"].includes(from)
                    }
                    onClick={handleNext}
                  >
                    <SkipForward />
                  </Button>
                </div>

                <div className="flex justify-between text-xs text-slate-400 pt-2">
                  {/* like */}
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
                  {/* shuffle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shuffleClick}
                    className={isShuffleOn ? "text-blue-400" : ""}
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Shuffle</span>
                  </Button>
                  {/* loop */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={repeatClick}
                    className={isRepeatOn ? "text-blue-400" : ""}
                  >
                    <Repeat className="h-4 w-4" />
                    <span>Repeat</span>
                  </Button>
                  {/* menu dots */}

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md"
                      >
                        <MoreHorizontalIcon className="h-5 w-5 text-white" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuPortal>
                      <DropdownMenuContent className="z-[999999] w-48 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-xl">
                        {/* Mute option */}
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
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/10 rounded-xl"
                        >
                          {!mute ? (
                            <VolumeOff className="h-4 w-4 text-red-400" />
                          ) : (
                            <Volume2Icon className="h-4 w-4 text-red-400" />
                          )}
                          <span>{!mute ? "Unmute" : "Mute"}</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-white/20" />

                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()} // ✅ stops dropdown from closing
                          className="flex items-center justify-between px-3 py-2 rounded-xl focus:bg-white/10"
                        >
                          <span>AutoPlay</span>
                          <Switch
                            id="autoplay"
                            checked={isAutoplayOn}
                            onCheckedChange={(checked) => {
                              setIsAutoplayOn(checked);
                              alertCall(
                                !isAutoplayOn
                                  ? "AutoPlay mode On"
                                  : "AutoPlay mode Off",
                                true
                              );
                              if (checked) {
                                setIsShuffleOn(false);
                                setIsRepeatOn(false);
                              }
                            }}
                            className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
