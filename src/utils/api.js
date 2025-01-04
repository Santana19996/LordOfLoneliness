// src/utils/api.js


const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN;

const YOUTUBE_CLIENT_ID = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.REACT_APP_YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REFRESH_TOKEN = process.env.REACT_APP_YOUTUBE_REFRESH_TOKEN;


export const getSpotifyAccessToken = async () => {
    const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: SPOTIFY_REFRESH_TOKEN,
            }),
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error getting Spotify access token:", error);
    }
};


/**
 * Fetch last 10 unique recently played songs
 */
export const fetchRecentlyPlayed = async () => {
    const accessToken = await getSpotifyAccessToken();

    try {
        const response = await fetch(
            "https://api.spotify.com/v1/me/player/recently-played?limit=50",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = await response.json();

        // Filter unique songs and return the last 10 with images
        const uniqueTracks = [];
        const trackSet = new Set();

        for (const item of data.items) {
            const track = item.track;
            console.log("%cIf your reading this, fuck you", "color:red");
            if (!trackSet.has(track.id)) {
                trackSet.add(track.id);
                uniqueTracks.push({
                    id: track.id,
                    name: track.name,
                    artist: track.artists.map((a) => a.name).join(", "),
                    playedAt: item.played_at,
                    image: track.album.images[0]?.url || "", // Get track image
                });
            }
            if (uniqueTracks.length === 10) break;
        }

        return uniqueTracks;
    } catch (error) {
        console.error("Error fetching recently played tracks:", error);
        return [];
    }
};
// Fetch the user's top track of the year


export const fetchTopTrackOfYear = async () => {
    // Retrieve a fresh Spotify access token
    const accessToken = await getSpotifyAccessToken();

    try {
        const response = await fetch(
            "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=1",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Spotify API Error: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();

        // Parse and return the top track details
        if (data.items && data.items.length > 0) {
            const track = data.items[0];
            return {
                id: track.id,
                name: track.name,
                artists: track.artists.map((artist) => artist.name).join(", "),
                albumImage: track.album.images[0]?.url || "",
                albumName: track.album.name,
                href: track.external_urls.spotify, // Spotify link for the track
            };
        } else {
            throw new Error("No top tracks found for this year.");
        }
    } catch (error) {
        console.error("Error fetching top track of the year:", error.message);
        throw error;
    }
};

export const getYouTubeAccessToken = async () => {
    try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: YOUTUBE_CLIENT_ID,
                client_secret: YOUTUBE_CLIENT_SECRET,
                refresh_token: YOUTUBE_REFRESH_TOKEN,
                grant_type: "refresh_token",
            }),
        });

        const data = await response.json();
        if (!data.access_token) {
            throw new Error("Failed to get YouTube access token");
        }
        return data.access_token;
    } catch (error) {
        console.error("Error getting YouTube access token:", error);
        throw error;
    }
};

/**
 * Search YouTube for a video based on track name and artist
 */
export const fetchYouTubeVideo = async (trackName, artistName) => {
    const accessToken = await getYouTubeAccessToken();

    try {
        const query = `${trackName} ${artistName} audio`;
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
                query
            )}&maxResults=1`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].id.videoId; // Return the first video ID
        } else {
            throw new Error(`No video found for "${trackName}" by "${artistName}"`);
        }
    } catch (error) {
        console.error("Error fetching YouTube video:", error.message);
        return null;
    }
};



