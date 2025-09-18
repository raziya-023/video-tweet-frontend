import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/time'; 

// --- API Functions ---
const fetchComments = async (videoId) => {
    const { data } = await apiClient.get(`/comments/${videoId}`);
    // The API response for comments might be paginated, we'll take the docs
    return data.data.docs;
};

const addComment = async ({ videoId, content }) => {
    const { data } = await apiClient.post(`/comments/${videoId}`, { content });
    return data.data;
};

// --- Component ---
function CommentList({ videoId }) {
    const queryClient = useQueryClient();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [newComment, setNewComment] = useState('');

    // Query to fetch comments for the video
    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', videoId],
        queryFn: () => fetchComments(videoId),
        enabled: !!videoId,
    });

    // Mutation to add a new comment
    const addCommentMutation = useMutation({
        mutationFn: addComment,
        onSuccess: () => {
            // When a comment is added, invalidate the comments query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
            setNewComment(''); // Clear the input field
        },
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        addCommentMutation.mutate({ videoId, content: newComment });
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4">{comments?.length || 0} Comments</h3>
            
            {/* Add Comment Form */}
            {isAuthenticated && (
                <div className="mb-6">
                    <form onSubmit={handleCommentSubmit} className="flex items-start space-x-4">
                        <img src={user?.avatar} alt={user?.username} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-grow">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="2"
                            ></textarea>
                            <button
                                type="submit"
                                disabled={addCommentMutation.isPending}
                                className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                            >
                                {addCommentMutation.isPending ? 'Posting...' : 'Comment'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Display Comments */}
            {isLoading ? (
                <p>Loading comments...</p>
            ) : (
                <div className="space-y-4">
                    {comments?.map((comment) => (
                        <div key={comment._id} className="flex items-start space-x-4">
                            <img src={comment.owner.avatar} alt={comment.owner.username} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <p className="font-semibold text-white">{comment.owner.username}</p>
                                    <p className="text-xs text-gray-400">
                                    {formatTimeAgo(comment.createdAt)}
                                    </p>
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                    {comments?.length === 0 && <p className="text-gray-400">No comments yet. Be the first to comment!</p>}
                </div>
            )}
        </div>
    );
}

export default CommentList;