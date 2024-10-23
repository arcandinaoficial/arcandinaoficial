'use client'

import React, { useEffect, useState } from 'react';
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const getVideoIdFromUrl = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const fetchVideoData = async (videoId) => {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (data.items && data.items.length > 0) {
    const { title, description, thumbnails } = data.items[0].snippet;
    return {
      title,
      description,
      thumbnail: thumbnails.high.url, // You can choose different thumbnail sizes (default, medium, high)
    };
  }
  return null;
};

const VideoCard = ({ video }) => {
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const videoId = getVideoIdFromUrl(video.src);
    if (videoId) {
        fetchVideoData(videoId).then((data) => {
            if (data) {
                setVideoData(data);
            }
        });
    }
  }, [video.src]);

  if (!videoData) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="video-card">
      <img src={videoData.thumbnail} alt={videoData.title} className="video-card__thumbnail" />
      <h5 className="video-card__title">{videoData.title}</h5>
      <p className="video-card__description">{videoData.description}</p>
    </div>
  );
};

export default VideoCard;
