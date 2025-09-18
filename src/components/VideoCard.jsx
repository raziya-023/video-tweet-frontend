import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/time';

function VideoCard({ video }) {
    const formatViews = (views) => {
        if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
        if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
        return views;
    };

    // Prevent errors if video or owner data is missing
    if (!video || !video.owner) {
        return null; // Or return a loading skeleton
    }

    return (
        <div className="w-full">
            {/* Link for Thumbnail */}
            <Link to={`/video/${video._id}`}>
                <div className="relative mb-2 w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                    />
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {new Date(video.duration * 1000).toISOString().substr(14, 5)}
                    </span>
                </div>
            </Link>
            <div className="flex items-start">
                {/* Link for Avatar */}
                <Link to={`/channel/${video.owner.username}`} className="flex-shrink-0">
                    <img
                        src={video.owner.avatar}
                        alt={video.owner.username}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </Link>
                <div className="ml-3 flex-grow">
                    {/* Link for Title */}
                    <Link to={`/video/${video._id}`}>
                        <h3 className="text-md font-semibold text-white line-clamp-2 hover:text-gray-300">
                            {video.title}
                        </h3>
                    </Link>
                    {/* Link for Username */}
                    <Link to={`/channel/${video.owner.username}`}>
                        {/* --- THIS IS THE FIX for the duplicate username --- */}
                        {/* We show the full name (or username as a fallback) */}
                        <p className="text-sm text-gray-400 mt-1 hover:text-white">
                            {video.owner.fullName || video.owner.username}
                        </p>
                    </Link>
                    <div className="text-sm text-gray-400 flex items-center">
                        <span>{formatViews(video.views)} views</span>
                        <span className="mx-1">·</span>
                        <span>{formatTimeAgo(video.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;