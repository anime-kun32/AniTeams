'use client';

import {
  MediaPlayer,
  MediaProvider,
  Track,
  useMediaPlayer,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

function SkipSVGButton({ onClick, label }) {
  return (
    <motion.div
      className="skip-button-container"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="skip-button-svg"
        viewBox="0 0 200 60"
      >
        <rect className="skip-button-rect" width="200" height="60" />
        <text x="50%" y="50%" className="skip-button-text">
          {label}
        </text>
      </svg>
    </motion.div>
  );
}

function SkipButtons({ intro, outro }) {
  const player = useMediaPlayer();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player?.currentTime != null) {
        setCurrentTime(player.currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [player]);

  const handleSkip = (to) => {
    if (player) player.currentTime = to;
  };

  const showIntro = intro && currentTime >= intro.start && currentTime <= intro.end;
  const showOutro = outro && currentTime >= outro.start && currentTime <= outro.end;

  return (
    <AnimatePresence>
      {showIntro && <SkipSVGButton label="Skip Intro" onClick={() => handleSkip(intro.end)} />}
      {showOutro && <SkipSVGButton label="Skip Outro" onClick={() => handleSkip(outro.end)} />}
    </AnimatePresence>
  );
}

export default function VideoPlayer({ id, server, category, anilistId }) {
  const [sourceData, setSourceData] = useState(null);
  const [romajiTitle, setRomajiTitle] = useState('AniTeams Player');
  const [resumeTime, setResumeTime] = useState(0);
  const [initialResumeTime, setInitialResumeTime] = useState(null);
  const [bannerImage, setBannerImage] = useState(undefined);
  const lastSavedRef = useRef(0);
  const saveIntervalRef = useRef(null);
  const player = useMediaPlayer();

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const res = await axios.get('/api/player', {
          params: { id, server, category },
        });

        const data = res.data?.data;
        if (!data) throw new Error('Invalid data');

        setSourceData(data);
        setRomajiTitle(data.title || 'AniTeams Player');

        const uid = Cookies.get('uid');
        if (uid && anilistId) {
          const { data: resumeRes } = await axios.post('/api/resume', {
            uid,
            animeId: id,
            anilistId,
            time: 0,
            duration: 0,
          });

          if (resumeRes?.time) {
            setResumeTime(resumeRes.time);
            setInitialResumeTime(resumeRes.time);
          }
        } else {
          const local = localStorage.getItem(`resume-${id}`);
          if (local) {
            const localTime = parseFloat(local);
            setResumeTime(localTime);
            setInitialResumeTime(localTime);
          }
        }
      } catch (err) {
        console.error('Player error:', err.message);
      }
    };

    fetchSource();
  }, [id, server, category, anilistId]);

  useEffect(() => {
    const fetchBanner = async () => {
      if (!anilistId) {
        setBannerImage(null);
        return;
      }
      try {
        const res = await axios.post(
          'https://graphql.anilist.co',
          {
            query: `
              query ($id: Int) {
                Media(id: $id) {
                  bannerImage
                }
              }
            `,
            variables: { id: parseInt(anilistId) },
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const banner = res.data?.data?.Media?.bannerImage;
        setBannerImage(banner || null);
      } catch (err) {
        console.error('Banner fetch error:', err.message);
        setBannerImage(null);
      }
    };

    fetchBanner();
  }, [anilistId]);

  const getDOMDurationInSeconds = () => {
    try {
      const text = document.querySelector('.vds-time[data-type="duration"]')?.textContent;
      if (!text) return 0;
      const [min, sec] = text.split(':').map(Number);
      return min * 60 + sec;
    } catch {
      return 0;
    }
  };

  const handleTimeUpdate = (e) => {
    const currentTime = e.currentTime || player?.currentTime || 0;
    const duration = player?.duration || getDOMDurationInSeconds() || 0;

    const now = Date.now();
    if (now - lastSavedRef.current < 30000) return;
    lastSavedRef.current = now;

    const uid = Cookies.get('uid');
    if (!uid) {
      localStorage.setItem(`resume-${id}`, currentTime.toString());
    } else if (anilistId && currentTime > 0 && duration > 0) {
      axios.put('/api/resume', {
        uid,
        animeId: id,
        anilistId,
        time: currentTime,
        duration,
      });
    }
  };

  const handlePlayerReady = () => {
    if (initialResumeTime && player) {
      player.currentTime = initialResumeTime;
    }

    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);

    saveIntervalRef.current = setInterval(() => {
      const currentTime = player?.currentTime || 0;
      const duration = player?.duration || 0;
      const uid = Cookies.get('uid');

      if (!uid) {
        localStorage.setItem(`resume-${id}`, currentTime.toString());
      } else if (anilistId && currentTime > 0 && duration > 0) {
        axios.put('/api/resume', {
          uid,
          animeId: id,
          anilistId,
          time: currentTime,
          duration,
        });
      }
    }, 30000);
  };

  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, []);

  if (!sourceData) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden z-10">
        {bannerImage === undefined ? (
          <div className="w-full h-full bg-black" />
        ) : bannerImage ? (
          <img
            src={bannerImage}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <svg width="48" height="48" viewBox="0 0 24 24">
            <style>
              {`
                .spinner_nOfF { animation: spinner_qtyZ 2s cubic-bezier(0.36, .6, .31, 1) infinite }
                .spinner_fVhf { animation-delay: -0.5s }
                .spinner_piVe { animation-delay: -1s }
                .spinner_MSNs { animation-delay: -1.5s }
                @keyframes spinner_qtyZ {
                  0% { r: 0 }
                  25% { r: 3px; cx: 4px }
                  50% { r: 3px; cx: 12px }
                  75% { r: 3px; cx: 20px }
                  100% { r: 0; cx: 20px }
                }
              `}
            </style>
            <circle className="spinner_nOfF" cx="4" cy="12" r="3" fill="white" />
            <circle className="spinner_nOfF spinner_fVhf" cx="4" cy="12" r="3" fill="white" />
            <circle className="spinner_nOfF spinner_piVe" cx="4" cy="12" r="3" fill="white" />
            <circle className="spinner_nOfF spinner_MSNs" cx="4" cy="12" r="3" fill="white" />
          </svg>
        </div>
      </div>
    );
  }

  const { sources, tracks, headers, intro, outro } = sourceData;
  const proxyUrl = `https://gogoanime-and-hianime-proxy-ten.vercel.app/m3u8-proxy?url=${encodeURIComponent(sources[0].url)}`;
  const thumbnailTrack = tracks?.find((t) => t.kind === 'thumbnails')?.file;

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden z-10">
      <style jsx global>{`
        ::cue {
          line-height: 1.4;
          font-size: 1.1rem;
          bottom: 20%;
        }
      `}</style>

      <MediaPlayer
        title={romajiTitle}
        src={proxyUrl}
        crossorigin
        headers={headers}
        playsinline
        autoplay
        currentTime={resumeTime}
        onTimeUpdate={handleTimeUpdate}
        onReady={handlePlayerReady}
        className="text-white"
        fullscreenOrientation="landscape"
      >
        <MediaProvider
          playsinline
          disableRemotePlayback
          disablePictureInPicture
        />
        {Array.isArray(tracks) &&
          tracks.map((track, i) =>
            track?.file ? (
              <Track
                key={i}
                src={track.file}
                kind={track.kind || 'subtitles'}
                label={track.label || `Track ${i + 1}`}
                lang={track.label?.toLowerCase().slice(0, 3) || 'en'}
                default={track.default || false}
              />
            ) : null
          )}
        <SkipButtons intro={intro} outro={outro} />
        <DefaultVideoLayout
          thumbnails={thumbnailTrack}
          icons={defaultLayoutIcons}
          style={{ '--media-brand': '#9333ea' }}
        />
      </MediaPlayer>
    </div>
  );
}
