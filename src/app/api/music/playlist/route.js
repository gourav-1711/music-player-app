// app/api/genre-playlists/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: "Playlist URL is required" },
        { status: 400 }
      );
    }

    // Extract playlist ID from URL
    const playlistId = new URL(url).searchParams.get("list");
    if (!playlistId) {
      return NextResponse.json(
        { error: "Invalid playlist URL" },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    // Get playlist details
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
    );
    const playlistData = await playlistRes.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    const playlistInfo = playlistData.items[0].snippet;

    // Get all videos (paginated)
    let videos = [];
    let nextPageToken = "";
    do {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${apiKey}`
      );
      const videosData = await videosRes.json();

      if (videosData.items) {
        videos.push(
          ...videosData.items.map((item) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url,
            channelTitle: item.snippet.videoOwnerChannelTitle,
          }))
        );
      }

      nextPageToken = videosData.nextPageToken || "";
    } while (nextPageToken);

    return NextResponse.json({
      playlist: {
        id: playlistId,
        title: playlistInfo.title,
        description: playlistInfo.description,
        channelTitle: playlistInfo.channelTitle,
        thumbnails: playlistInfo.thumbnails,
        videos,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
