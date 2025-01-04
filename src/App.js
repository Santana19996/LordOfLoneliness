import React, { useState, useEffect } from "react";
import {
    fetchRecentlyPlayed,
    fetchTopTrackOfYear,
    fetchYouTubeVideo,
} from "./utils/api";
import "./App.css";
import Header from "./components/Header";

function App() {
    const [recentTracks, setRecentTracks] = useState([]);
    const [topTrack, setTopTrack] = useState(null);
    const [error, setError] = useState(null);

    // Fetch Recently Played Songs and YouTube Video IDs
    useEffect(() => {
        const getRecentlyPlayed = async () => {
            try {
                const tracks = await fetchRecentlyPlayed();
                setRecentTracks(tracks);

                // Fetch YouTube video for each track
                for (const track of tracks) {
                    const videoId = await fetchYouTubeVideo(track.name, track.artist);
                    if (videoId) {
                        console.log(`Video found for "${track.name}" by "${track.artist}": ${videoId}`);
                    } else {
                        console.log(`No video found for "${track.name}" by "${track.artist}"`);
                    }
                }
            } catch (err) {
                console.error("Error fetching recently played tracks:", err);
            }
        };

        getRecentlyPlayed();
    }, []);

    // Fetch Top Track of the Year
    useEffect(() => {
        const getTopTrack = async () => {
            try {
                const track = await fetchTopTrackOfYear();
                setTopTrack(track);
            } catch (err) {
                console.error("Error fetching top track of the year:", err);
                setError("Failed to fetch top track of the year.");
            }
        };

        getTopTrack();
    }, []);

    // Function to calculate "X minutes ago"
    const timeAgo = (playedAt) => {
        const now = new Date();
        const playedTime = new Date(playedAt);
        const diffInMinutes = Math.floor((now - playedTime) / 60000);
        if (diffInMinutes < 1) return "Just now";
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    };

    return (
        <div className="app-container">
            {/* Header Component */}
            <Header />

            {/* Top Track of the Year */}
            <section className="top-track-section">
                <h1 style={{color:"red"}} className="gothic-title">⋆♱✮☽🦇☽✮♰⋆My Top Track of the Year⋆♱✮☽🦇☽✮♰⋆</h1>
                {error && <p className="error">{error}</p>}
                {topTrack ? (
                    <div className="top-track-card">
                        <img
                            src={topTrack.albumImage}
                            alt={topTrack.name}
                            className="top-track-image"
                        />

                        <div className="top-track-info">
                            <h2>{topTrack.name}</h2>
                            <p>By: {topTrack.artists}</p>
                            <p>Album: {topTrack.albumName}</p>
                        </div>
                    </div>
                ) : (
                    <p className="loading">Loading top track...</p>
                )}
            </section>

            {/* Recently Played Songs */}
            <section>
                <h1 className="gothic-title">☽ Recently Played Songs ☾</h1>
                <div className="cards-container">
                    {recentTracks.length > 0 ? (
                        recentTracks.map((track) => (
                            <div key={track.id} className="track-card">
                                <img
                                    src={track.image}
                                    alt={track.name}
                                    className="track-image"
                                />
                                <div className="track-info">
                                    <h2>{track.name}</h2>
                                    <p>By: {track.artist}</p>
                                    <p className="played-time">{timeAgo(track.playedAt)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="loading">Loading recently played songs...</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default App;
