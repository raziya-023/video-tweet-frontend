import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';

// --- API Functions ---
const fetchVideoById = async (videoId) => {
    const { data } = await apiClient.get(`/videos/${videoId}`);
    return data.data;
};

const updateVideoDetails = async ({ videoId, formData }) => {
    const { data } = await apiClient.patch(`/videos/${videoId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data.data;
};

// --- Component ---
function EditVideo() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State for the form fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: null, // This will hold the new thumbnail file if selected
    });
    const [error, setError] = useState('');

    // 1. Fetch the current video data to pre-fill the form
    const { data: video, isLoading } = useQuery({
        queryKey: ['video', videoId],
        queryFn: () => fetchVideoById(videoId),
        enabled: !!videoId,
    });

    // 2. Use useEffect to update the form state once the video data is loaded
    useEffect(() => {
        if (video) {
            setFormData({
                title: video.title,
                description: video.description,
                thumbnail: null, // Reset thumbnail on data load
            });
        }
    }, [video]);

    // 3. Create the mutation for updating the video
    const updateMutation = useMutation({
        mutationFn: updateVideoDetails,
        onSuccess: () => {
            // Invalidate queries to refetch data on dashboard and video page
            queryClient.invalidateQueries({ queryKey: ['dashboardVideos'] });
            queryClient.invalidateQueries({ queryKey: ['video', videoId] });
            navigate('/dashboard'); // Redirect to dashboard on success
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Update failed. Please try again.');
        }
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        // Only append the thumbnail if a new one has been selected
        if (formData.thumbnail) {
            submissionData.append('thumbnail', formData.thumbnail);
        }

        updateMutation.mutate({ videoId, formData: submissionData });
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading video details...</div>;
    }

    return (
        <div className="flex justify-center items-start py-10 bg-gray-900 min-h-screen">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white">Edit Video</h2>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Current Thumbnail</label>
                        <img src={video?.thumbnail} alt="Current Thumbnail" className="w-48 h-27 object-cover rounded-md mt-2"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Upload New Thumbnail (Optional)</label>
                        <input
                            type="file"
                            name="thumbnail"
                            onChange={handleChange}
                            accept="image/*"
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                        />
                    </div>
                    <button type="submit" disabled={updateMutation.isPending} className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditVideo;