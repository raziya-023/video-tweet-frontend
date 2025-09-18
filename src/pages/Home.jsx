import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import VideoCard from '../components/VideoCard';

// This function will be called by React Query to fetch the data
const fetchVideos = async () => {
    const { data } = await apiClient.get('/videos');
    // The videos are nested in data.data.docs
    return data.data.docs; 
};

function Home() {
    // useQuery handles fetching, caching, loading states, and errors for us
    const { data: videos, error, isLoading, isError } = useQuery({
        queryKey: ['videos'], // A unique key for this query
        queryFn: fetchVideos, // The function to fetch the data
    });

    // Show a loading message while data is being fetched
    if (isLoading) {
        return (
            <div className="text-center p-8">
                <p className="text-lg text-gray-300">Loading videos...</p>
            </div>
        );
    }

    // Show an error message if the fetch fails
    if (isError) {
        return (
            <div className="text-center p-8">
                <p className="text-lg text-red-500">Error: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {videos && videos.length > 0 ? (
                // If we have videos, render the grid
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                // If there are no videos, show a message
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-white">No videos found.</h2>
                    <p className="text-gray-400 mt-2">Try uploading a video or check back later!</p>
                </div>
            )}
        </div>
    );
}

export default Home;