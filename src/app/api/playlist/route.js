// app/api/genre-playlists/route.js
import { NextResponse } from "next/server";

const playlistIds = [
  { id: "PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI", genre: "Pop" },
  { id: "PLHD1bqg7FZ4DFyk4iN1N7hxNMejgi0VFi", genre: "Rock" },
  { id: "PLcNoZgH7By2IqgXn-GozrBE4Zm3l0oqLh", genre: "Hip Hop" },
  { id: "PLRBp0Fe2Gpgn7x5THb3yRNSwjN2aG4iYx", genre: "EDM" },
  { id: "PLT0Zx3EYAGnxe2JjKhxqLF_oOWy4DgOyi", genre: "Classical" },
];


export async function GET() {
  try {
    const results = await Promise.all(
      playlistIds.map(async ({ id, genre }) => {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${id}&key=${process.env.YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        return { genre, items: data.items || [] };
      })
    );

    console.log("playlists", results);
    
    return NextResponse.json(results);
  } catch (err) {
    console.error("Failed to fetch playlists", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
