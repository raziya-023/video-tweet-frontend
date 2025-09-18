import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import apiClient from '../api/axios';
import { formatTimeAgo } from '../utils/time';

// --- API Functions ---
const fetchAllTweets = async () => {
    const { data } = await apiClient.get('/tweets'); // <-- Use the new simpler endpoint
    return data.data; // The backend returns the array directly in data.data
};

const createTweet = async (content) => {
    const { data } = await apiClient.post('/tweets', { content });
    return data.data;
};


// --- Component ---
function TweetsPage() {
    const queryClient = useQueryClient();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [tweetContent, setTweetContent] = useState('');

    // Query to fetch tweets
    // We'll need to expand this later to be a real feed.
    const { data: tweets, isLoading } = useQuery({
    queryKey: ['allTweets'], // Use a new query key
    queryFn: fetchAllTweets, // Use the new fetch function
    });

    // Mutation to create a new tweet
    const createTweetMutation = useMutation({
        mutationFn: createTweet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tweets'] });
            setTweetContent('');
        },
    });

    const handleTweetSubmit = (e) => {
        e.preventDefault();
        if (!tweetContent.trim()) return;
        createTweetMutation.mutate(tweetContent);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Tweets</h1>
            
            {/* Create Tweet Form */}
            {isAuthenticated && (
                <div className="bg-gray-800 p-4 rounded-lg mb-8">
                    <form onSubmit={handleTweetSubmit} className="flex items-start space-x-4">
                        <img src={user?.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover"/>
                        <div className="flex-grow">
                            <textarea
                                value={tweetContent}
                                onChange={(e) => setTweetContent(e.target.value)}
                                placeholder="What's happening?"
                                className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600"
                                rows="3"
                            ></textarea>
                            <div className="text-right mt-2">
                                <button type="submit" disabled={createTweetMutation.isPending} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:bg-indigo-400">
                                    Tweet
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Tweet List */}
            {isLoading ? (
                <p>Loading tweets...</p>
            ) : (
                <div className="space-y-4">
                    {tweets?.map((tweet) => (
                        <div key={tweet._id} className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4">
                            <img src={tweet.owner.avatar} alt={tweet.owner.username} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <div className="flex items-center space-x-2">
                                    <p className="font-semibold text-white">{tweet.owner.fullName}</p>
                                    <p className="text-sm text-gray-400">@{tweet.owner.username}</p>
                                    <p className="text-sm text-gray-400">·</p>
                                    <p className="text-sm text-gray-400">{formatTimeAgo(tweet.createdAt)}</p>
                                </div>
                                <p className="text-gray-300 mt-1">{tweet.content}</p>
                            </div>
                        </div>
                    ))}
                    {tweets?.length === 0 && <p className="text-center text-gray-400">No tweets to show.</p>}
                </div>
            )}
        </div>
    );
}

export default TweetsPage;