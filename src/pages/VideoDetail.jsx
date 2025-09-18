import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import apiClient from '../api/axios';
import CommentList from '../components/CommentList';
import PlaylistModal from '../components/PlaylistModal';
//import { useSelector } from 'react-redux';

// --- API Functions ---
const fetchVideoById = async (videoId) => {
    const { data } = await apiClient.get(`/videos/${videoId}`);
    return data.data;
};

const toggleSubscription = async (channelId) => {
    const { data } = await apiClient.post(`/subscriptions/c/${channelId}`);
    return data.data;
};

const toggleVideoLike = async (videoId) => {
    const { data } = await apiClient.post(`/likes/toggle/v/${videoId}`);
    return data.data;
};

// --- Component ---
function VideoDetail() {
    const { videoId } = useParams();
    const queryClient = useQueryClient(); // Get the query client instance
    const { isAuthenticated } = useSelector((state) => state.auth); // Check if user is logged in
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);


    const { data: video, error, isLoading, isError } = useQuery({
        queryKey: ['video', videoId],
        queryFn: () => fetchVideoById(videoId),
        enabled: !!videoId,
    });
    const { user: loggedInUser } = useSelector((state) => state.auth); // Get the logged-in user

    // --- Mutations ---
    const subscriptionMutation = useMutation({
        mutationFn: toggleSubscription,
        onSuccess: () => {
            // When the mutation is successful, invalidate the video query to refetch data
            // This will automatically update the subscriber count and button state!
            queryClient.invalidateQueries({ queryKey: ['video', videoId] });
        },
    });

    const likeMutation = useMutation({
        mutationFn: toggleVideoLike,
        onSuccess: () => {
            // Invalidate and refetch to update the like count and button state
            queryClient.invalidateQueries({ queryKey: ['video', videoId] });
        },
    });

    // --- Event Handlers ---
    const handleSubscribe = () => {
        if (!isAuthenticated) {
            alert("Please log in to subscribe.");
            return;
        }
        subscriptionMutation.mutate(video.owner._id);
    };

    const handleLike = () => {
        if (!isAuthenticated) {
            alert("Please log in to like a video.");
            return;
        }
        likeMutation.mutate(videoId);
    };

    // --- Render Logic ---
    if (isLoading) return <div className="text-center p-8">Loading video...</div>;
    if (isError) return <div className="text-center p-8">Error: {error.message}</div>;

    const isOwner = loggedInUser?._id === video?.owner?._id;

    const formatNumber = (num) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);

    return (
        <>
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="w-full bg-black aspect-video rounded-xl overflow-hidden">
                    <video src={video.videoFile} controls autoPlay muted className="w-full h-full"></video>
                </div>
                <div className="mt-4">
                    <h1 className="text-2xl font-bold text-white">{video.title}</h1>
                    <div className="flex items-center justify-between text-gray-400 text-sm mt-2">
                        <div className="flex items-center space-x-4">
                            <span>{formatNumber(video.views)} views</span>
                            <span>·</span>
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            disabled={likeMutation.isPending}
                            className={`px-4 py-2 font-semibold rounded-lg flex items-center space-x-2 transition-colors ${
                                video.isLiked 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <span>👍</span>
                            <span>{formatNumber(video.likesCount)}</span>
                        </button>
                        <button 
                                onClick={() => setIsPlaylistModalOpen(true)}
                                className="px-4 py-2 font-semibold bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            >
                                ➕ Save
                            </button>
                    </div>
                </div>
                <hr className="border-gray-700 my-4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to={`/channel/${video.owner.username}`}>
        <img src={video.owner.avatar} alt={video.owner.username} className="w-12 h-12 rounded-full object-cover"/>
    </Link>
    <div className="ml-4">
        {/* WRAP THE USERNAME IN A LINK */}
        <Link to={`/channel/${video.owner.username}`} className="hover:text-white transition">
            <h2 className="text-lg font-semibold text-white">{video.owner.username}</h2>
        </Link>
        <p className="text-sm text-gray-400">{formatNumber(video.owner.subscribersCount)} subscribers</p>
    </div>
                    </div>
                    {/* Subscribe Button */}
                    {!isOwner && (
                <button
                    onClick={handleSubscribe}
                    disabled={subscriptionMutation.isPending}
                    className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                        video.owner.isSubscribed
                            ? 'bg-gray-600 text-white'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    {subscriptionMutation.isPending ? '...' : (video.owner.isSubscribed ? 'Subscribed' : 'Subscribe')}
                </button>
            )}
                </div>
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
                </div>
                <CommentList videoId={videoId} />
            </div>
            <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-white mb-4">Related Videos</h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400">Related videos coming soon!</p>
                </div>
            </div>
        </div>
        {isPlaylistModalOpen && (
                <PlaylistModal 
                    video={video} 
                    onClose={() => setIsPlaylistModalOpen(false)} 
                />
            )}
            </>
    );
}

export default VideoDetail;