import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import VideoCard from '../components/VideoCard'; // We can reuse our VideoCard component!

// --- API Function ---
const fetchPlaylistById = async (playlistId) => {
    const { data } = await apiClient.get(`/playlist/${playlistId}`);
    return data.data;
};

// --- Component ---
function PlaylistDetail() {
    const { playlistId } = useParams();

    const { data: playlist, isLoading, isError, error } = useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: () => fetchPlaylistById(playlistId),
        enabled: !!playlistId,
    });

    if (isLoading) {
        return <div className="text-center p-8">Loading playlist...</div>;
    }

    if (isError) {
        return <div className="text-center p-8">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Playlist Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white">{playlist.name}</h1>
                <p className="text-gray-400 mt-2">{playlist.description}</p>
                <div className="flex items-center space-x-4 text-gray-400 text-sm mt-4">
                    <span>Created by {playlist.owner.username}</span>
                    <span>·</span>
                    <span>{playlist.videos.length} videos</span>
                </div>
            </div>

            {/* Video List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                {playlist.videos.map((video) => (
                    // We can reuse the same VideoCard component we made for the Home page
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
            {playlist.videos.length === 0 && (
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">This playlist is empty.</h2>
                    <p className="text-gray-400 mt-2">Add videos to this playlist to see them here.</p>
                </div>
            )}
        </div>
    );
}

export default PlaylistDetail;