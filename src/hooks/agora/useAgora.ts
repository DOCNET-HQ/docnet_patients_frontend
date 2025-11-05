import { useState, useEffect, useRef } from 'react';
import { AgoraUser, MeetingConfig } from '@/types/agora';

declare global {
  interface Window {
    AgoraRTC: any;
  }
}

export const useAgora = (meetingConfig: MeetingConfig | null, userName: string) => {
  const [joined, setJoined] = useState(false);
  const [uid, setUid] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false); // OFF by default
  const [audioEnabled, setAudioEnabled] = useState(false); // OFF by default
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeSpeakers, setActiveSpeakers] = useState<Set<number>>(new Set());
  const [pinnedUser, setPinnedUser] = useState<number | null>(null);
  const [agoraLoaded, setAgoraLoaded] = useState(false);

  const clientRef = useRef<any>(null);
  const localVideoTrackRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);
  const screenTrackRef = useRef<any>(null);
  const remoteUsersRef = useRef<Record<number, AgoraUser>>({});
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load Agora SDK
  useEffect(() => {
    if (window.AgoraRTC) {
      setAgoraLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://download.agora.io/sdk/release/AgoraRTC_N-4.22.2.js';
    script.async = true;
    script.onload = () => {
      console.log('Agora SDK loaded');
      setAgoraLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Agora SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Join channel when both config and SDK are ready
  useEffect(() => {
    if (meetingConfig && agoraLoaded && !joined) {
      joinChannel(userName);
    }
  }, [meetingConfig, agoraLoaded, joined, userName]);

  const setupAudioLevelMonitoring = () => {
    if (audioLevelIntervalRef.current) clearInterval(audioLevelIntervalRef.current);
    audioLevelIntervalRef.current = setInterval(() => {
      const speakers = new Set<number>();
      if (localAudioTrackRef.current && audioEnabled) {
        const localLevel = localAudioTrackRef.current.getVolumeLevel();
        if (localLevel > 0.1) speakers.add(uid);
      }
      Object.values(remoteUsersRef.current).forEach(user => {
        if (user.audioTrack) {
          const remoteLevel = user.audioTrack.getVolumeLevel();
          if (remoteLevel > 0.1) speakers.add(user.uid);
        }
      });
      setActiveSpeakers(speakers);
    }, 200);
  };

  const joinChannel = async (userName: string) => {
    if (!meetingConfig || !window.AgoraRTC) {
      console.error('Meeting config or Agora SDK not available');
      return;
    }

    try {
      const AgoraRTC = window.AgoraRTC;
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      await clientRef.current.enableAudioVolumeIndicator();

      clientRef.current.on('user-published', async (user: AgoraUser, mediaType: string) => {
        console.log('User published:', user.uid, mediaType);
        await clientRef.current.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          const remoteVideoContainer = document.getElementById(`remote-video-${user.uid}`);
          if (remoteVideoContainer) {
            // Clear the container first
            remoteVideoContainer.innerHTML = '';
            user.videoTrack.play(`remote-video-${user.uid}`);
          }
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
        
        remoteUsersRef.current[user.uid] = user;
      });

      clientRef.current.on('user-unpublished', (user: AgoraUser, mediaType: string) => {
        console.log('User unpublished:', user.uid, mediaType);
        if (mediaType === 'video') {
          const videoContainer = document.getElementById(`remote-video-${user.uid}`);
          if (videoContainer) {
            videoContainer.innerHTML = '';
          }
        }
      });

      clientRef.current.on('user-left', (user: AgoraUser) => {
        console.log('User left:', user.uid);
        const playerContainer = document.getElementById(`remote-${user.uid}`);
        if (playerContainer) playerContainer.remove();
        delete remoteUsersRef.current[user.uid];
        if (pinnedUser === user.uid) {
          setPinnedUser(null);
        }
      });

      const assignedUid = await clientRef.current.join(
        meetingConfig.appId,
        meetingConfig.channelName,
        meetingConfig.token,
        uid || null
      );
      
      console.log('Joined channel with UID:', assignedUid);
      setUid(assignedUid);

      // Create audio track and publish it (disabled)
      localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      await clientRef.current.publish([localAudioTrackRef.current]);
      await localAudioTrackRef.current.setEnabled(false);

      setJoined(true);
      setupAudioLevelMonitoring();
      
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

  const leaveChannel = async () => {
    try {
      if (screenTrackRef.current) await stopScreenShare();
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }
      if (audioLevelIntervalRef.current) clearInterval(audioLevelIntervalRef.current);
      
      setJoined(false);
      setScreenSharing(false);
      setActiveSpeakers(new Set());
      setPinnedUser(null);
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  const toggleVideo = async () => {
    const newVideoState = !videoEnabled;
    
    if (newVideoState) {
      // Turning video ON
      try {
        const AgoraRTC = window.AgoraRTC;
        
        // Create new video track
        localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
        
        // Publish the track first
        await clientRef.current.publish([localVideoTrackRef.current]);
        
        // Wait a tiny bit for the DOM to be ready, then play
        setTimeout(() => {
          if (localVideoTrackRef.current) {
            const localVideoDiv = document.getElementById('local-video');
            if (localVideoDiv) {
              // Clear any existing content
              localVideoDiv.innerHTML = '';
              localVideoTrackRef.current.play('local-video');
            }
          }
        }, 100);
        
        setVideoEnabled(true);
        
      } catch (error) {
        console.error('Error enabling video:', error);
      }
    } else {
      // Turning video OFF
      try {
        if (localVideoTrackRef.current) {
          // Unpublish and stop the video track completely
          await clientRef.current.unpublish([localVideoTrackRef.current]);
          localVideoTrackRef.current.stop();
          localVideoTrackRef.current.close();
          localVideoTrackRef.current = null;
        }
        
        setVideoEnabled(false);
        
        // Clear the video container
        const localVideoDiv = document.getElementById('local-video');
        if (localVideoDiv) {
          localVideoDiv.innerHTML = '';
        }
      } catch (error) {
        console.error('Error disabling video:', error);
      }
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrackRef.current) {
      const newAudioState = !audioEnabled;
      await localAudioTrackRef.current.setEnabled(newAudioState);
      setAudioEnabled(newAudioState);
    }
  };

  const startScreenShare = async () => {
    try {
      const AgoraRTC = window.AgoraRTC;
      screenTrackRef.current = await AgoraRTC.createScreenVideoTrack({}, 'auto');
      
      // Unpublish camera video if exists
      if (localVideoTrackRef.current) {
        await clientRef.current.unpublish([localVideoTrackRef.current]);
      }
      
      await clientRef.current.publish([screenTrackRef.current]);
      
      // Clear and play screen share
      const localVideoDiv = document.getElementById('local-video');
      if (localVideoDiv) {
        localVideoDiv.innerHTML = '';
        screenTrackRef.current.play('local-video');
      }
      
      setScreenSharing(true);
      screenTrackRef.current.on('track-ended', () => stopScreenShare());
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = async () => {
    try {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current.close();
        await clientRef.current.unpublish([screenTrackRef.current]);
        screenTrackRef.current = null;
      }
      
      // If video was enabled before screen share, recreate camera track
      if (videoEnabled) {
        const AgoraRTC = window.AgoraRTC;
        localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
        await clientRef.current.publish([localVideoTrackRef.current]);
        
        const localVideoDiv = document.getElementById('local-video');
        if (localVideoDiv) {
          localVideoDiv.innerHTML = '';
          localVideoTrackRef.current.play('local-video');
        }
      }
      
      setScreenSharing(false);
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  return {
    joined,
    uid,
    videoEnabled,
    audioEnabled,
    screenSharing,
    activeSpeakers,
    pinnedUser,
    remoteUsers: remoteUsersRef.current,
    joinChannel,
    leaveChannel,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    setPinnedUser,
    agoraLoaded
  };
};
