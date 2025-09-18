const timeUnits = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
];

export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const secondsAgo = Math.round((Date.now() - date.getTime()) / 1000);

    if (secondsAgo < 5) {
        return 'just now';
    }

    for (const { unit, seconds } of timeUnits) {
        const interval = Math.floor(secondsAgo / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now'; // Fallback
};