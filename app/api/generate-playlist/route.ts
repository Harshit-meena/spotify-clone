import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    // If no API key, return fallback playlist
    if (!apiKey) {
      return NextResponse.json(getFallbackPlaylist(prompt));
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are a music expert and playlist curator.
              Generate a playlist based on the user's mood or prompt.
              Respond ONLY with valid JSON format, no extra text.
              JSON Format:
              {
                "name": "Creative Playlist Name",
                "description": "Short engaging description",
                "songs": [
                  {
                    "title": "Song Title",
                    "artist": "Artist Name", 
                    "genre": "Genre"
                  }
                ]
              }
              Include exactly 8 songs that match the mood perfectly.`,
            },
            {
              role: "user",
              content: `Create a perfect playlist for this mood: "${prompt}"`,
            },
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      console.error("Groq API error:", response.status);
      return NextResponse.json(getFallbackPlaylist(prompt));
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // Safely parse JSON from AI response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
    }

    return NextResponse.json(getFallbackPlaylist(prompt));
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json(getFallbackPlaylist("general"), {
      status: 200,
    });
  }
}

function getFallbackPlaylist(prompt: string) {
  const moodPlaylists: Record<string, any> = {
    sad: {
      name: "Sad Vibes 😢",
      description: "Songs for when you need to feel your emotions",
      songs: [
        { title: "Someone Like You", artist: "Adele", genre: "Pop" },
        { title: "The Night We Met", artist: "Lord Huron", genre: "Indie" },
        { title: "Skinny Love", artist: "Bon Iver", genre: "Indie Folk" },
        { title: "Fix You", artist: "Coldplay", genre: "Rock" },
        { title: "All I Want", artist: "Kodaline", genre: "Indie" },
        { title: "Supermarket Flowers", artist: "Ed Sheeran", genre: "Pop" },
        { title: "River", artist: "Joni Mitchell", genre: "Folk" },
        { title: "Liability", artist: "Lorde", genre: "Indie Pop" },
      ],
    },
    party: {
      name: "Party Hits 🎉",
      description: "High energy songs to keep the party going",
      songs: [
        { title: "Levitating", artist: "Dua Lipa", genre: "Pop" },
        { title: "Blinding Lights", artist: "The Weeknd", genre: "Synth-pop" },
        { title: "As It Was", artist: "Harry Styles", genre: "Pop" },
        { title: "STAY", artist: "The Kid LAROI", genre: "Pop" },
        { title: "Bad Guy", artist: "Billie Eilish", genre: "Electropop" },
        { title: "Watermelon Sugar", artist: "Harry Styles", genre: "Pop" },
        { title: "Dynamite", artist: "BTS", genre: "K-Pop" },
        { title: "Industry Baby", artist: "Lil Nas X", genre: "Hip Hop" },
      ],
    },
    workout: {
      name: "Workout Beast Mode 💪",
      description: "High intensity tracks to push your limits",
      songs: [
        { title: "Eye of the Tiger", artist: "Survivor", genre: "Rock" },
        { title: "Lose Yourself", artist: "Eminem", genre: "Hip Hop" },
        { title: "Till I Collapse", artist: "Eminem", genre: "Hip Hop" },
        { title: "Power", artist: "Kanye West", genre: "Hip Hop" },
        { title: "Stronger", artist: "Kanye West", genre: "Hip Hop" },
        { title: "Can't Hold Us", artist: "Macklemore", genre: "Hip Hop" },
        { title: "Thunderstruck", artist: "AC/DC", genre: "Rock" },
        { title: "Jump Around", artist: "House of Pain", genre: "Hip Hop" },
      ],
    },
    chill: {
      name: "Chill Vibes 😌",
      description: "Relaxing tunes for your downtime",
      songs: [
        { title: "Sunset Lover", artist: "Petit Biscuit", genre: "Electronic" },
        { title: "Redbone", artist: "Childish Gambino", genre: "R&B" },
        { title: "Golden Hour", artist: "JVKE", genre: "Pop" },
        { title: "Peach", artist: "Kevin Abstract", genre: "Indie" },
        { title: "Coffee", artist: "beabadoobee", genre: "Indie" },
        { title: "Do I Wanna Know", artist: "Arctic Monkeys", genre: "Rock" },
        { title: "Sweater Weather", artist: "The Neighbourhood", genre: "Indie" },
        { title: "Electric Feel", artist: "MGMT", genre: "Indie Pop" },
      ],
    },
    romantic: {
      name: "Romantic Evening 🌹",
      description: "Perfect songs for a romantic moment",
      songs: [
        { title: "Perfect", artist: "Ed Sheeran", genre: "Pop" },
        { title: "All of Me", artist: "John Legend", genre: "R&B" },
        { title: "Thinking Out Loud", artist: "Ed Sheeran", genre: "Pop" },
        { title: "Make You Feel My Love", artist: "Adele", genre: "Pop" },
        { title: "Can't Help Falling in Love", artist: "Elvis Presley", genre: "Classic" },
        { title: "At Last", artist: "Etta James", genre: "Soul" },
        { title: "La Vie En Rose", artist: "Edith Piaf", genre: "Classic" },
        { title: "Lover", artist: "Taylor Swift", genre: "Pop" },
      ],
    },
    study: {
      name: "Study Focus 📚",
      description: "Concentration boosting tracks for deep focus",
      songs: [
        { title: "Experience", artist: "Ludovico Einaudi", genre: "Classical" },
        { title: "Comptine d'un autre été", artist: "Yann Tiersen", genre: "Classical" },
        { title: "Gymnopédie No.1", artist: "Erik Satie", genre: "Classical" },
        { title: "River Flows in You", artist: "Yiruma", genre: "Classical" },
        { title: "Clair de Lune", artist: "Debussy", genre: "Classical" },
        { title: "Nuvole Bianche", artist: "Ludovico Einaudi", genre: "Classical" },
        { title: "On the Nature of Daylight", artist: "Max Richter", genre: "Modern Classical" },
        { title: "Metamorphosis Two", artist: "Philip Glass", genre: "Modern Classical" },
      ],
    },
    sleep: {
      name: "Sleep & Relax 😴",
      description: "Calm and soothing music for better sleep",
      songs: [
        { title: "Weightless", artist: "Marconi Union", genre: "Ambient" },
        { title: "Stars", artist: "Ludovico Einaudi", genre: "Classical" },
        { title: "Sleep", artist: "Eric Whitacre", genre: "Classical" },
        { title: "Porcelain", artist: "Moby", genre: "Ambient" },
        { title: "Claire de Lune", artist: "Debussy", genre: "Classical" },
        { title: "Deep Blue Day", artist: "Brian Eno", genre: "Ambient" },
        { title: "An Ending", artist: "Brian Eno", genre: "Ambient" },
        { title: "Aqueous Transmission", artist: "Incubus", genre: "Rock" },
      ],
    },
  };

  // Find matching mood
  const promptLower = prompt.toLowerCase();
  const matchedKey = Object.keys(moodPlaylists).find((key) =>
    promptLower.includes(key)
  );

  if (matchedKey) {
    return moodPlaylists[matchedKey];
  }

  // Default playlist
  return {
    name: `${prompt} Playlist ✨`,
    description: `A curated playlist for your ${prompt} mood`,
    songs: [
      { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop" },
      { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
      { title: "Levitating", artist: "Dua Lipa", genre: "Pop" },
      { title: "Peaches", artist: "Justin Bieber", genre: "Pop" },
      { title: "Stay", artist: "The Kid LAROI", genre: "Pop" },
      { title: "Good 4 U", artist: "Olivia Rodrigo", genre: "Pop" },
      { title: "Montero", artist: "Lil Nas X", genre: "Pop" },
      { title: "Driver License", artist: "Olivia Rodrigo", genre: "Pop" },
    ],
  };
}