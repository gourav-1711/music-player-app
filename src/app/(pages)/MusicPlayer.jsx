"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { play } from "../store/features/musicPlayerSlice";
import { addFavorite, removeFavorite } from "../store/features/favoriteSlice";
import { toast } from "sonner";
import { addHistory } from "../store/features/historySlice";

const MusicPlayer = ({
  videoId,
  title,
  artist,
  open,
  setOpen,
  mode,
  description,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!videoId) return;
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
          },
          onStateChange: (event) => {
            const { data } = event;
            if (data === YT.PlayerState.PLAYING) setIsPlaying(true);
            if (data === YT.PlayerState.PAUSED || data === YT.PlayerState.ENDED)
              setIsPlaying(false);
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
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const favorite = useSelector((state) => state.favorite.favorite);

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
      musicObj.src =
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    if (added) {
      dispatch(removeFavorite(musicObj));
      toast.success("Removed from favorite");
    } else {
      dispatch(addFavorite(musicObj));
      toast.success("Added to favorite");
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
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        })
      );
    }
  }, [videoId]);

  const history = useSelector((state) => state.history.history);

  

  return (
    <>
      {open && <div id={`youtube-player`} style={{ display: "none" }} />}
      {open && (
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
                    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` ||
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
              </div>
            )}

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-6 space-y-4">
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

                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={(v) => handleSeek(v[0])}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSeek(currentTime - 10)}
                  >
                    <SkipBack />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSeek(currentTime - 30)}
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
                    onClick={() => handleSeek(currentTime + 30)}
                  >
                    <FastForward />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSeek(currentTime + 10)}
                  >
                    <SkipForward />
                  </Button>
                </div>

                <div className="flex justify-between text-xs text-slate-400 pt-2">
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
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShuffleOn(!isShuffleOn)}
                    className={isShuffleOn ? "text-blue-400" : ""}
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Shuffle</span>
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRepeatOn(!isRepeatOn)}
                    className={isRepeatOn ? "text-blue-400" : ""}
                  >
                    <Repeat className="h-4 w-4" />
                    <span>Repeat</span>
                  </Button>
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
