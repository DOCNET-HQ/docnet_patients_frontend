"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Users, Video, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMeetingConfig } from '@/hooks/agora/useMeetingConfig';
import { useAgora } from '@/hooks/agora/useAgora';
import { VideoGrid } from './VideoGrid';
import { Controls } from './Controls';
import { ChatPanel } from '@/components/agora/ChatPanel';

const AgoraVideoCall = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const { isLoading, meetingConfig, userName } = useMeetingConfig();
  const {
    joined,
    uid,
    videoEnabled,
    audioEnabled,
    screenSharing,
    activeSpeakers,
    pinnedUser,
    remoteUsers,
    joinChannel,
    leaveChannel,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    setPinnedUser,
    agoraLoaded
  } = useAgora(meetingConfig, userName);

  // Add loading state for Agora SDK
  useEffect(() => {
    if (meetingConfig && !agoraLoaded && !isLoading) {
      console.log('Waiting for Agora SDK to load...');
    }
  }, [meetingConfig, agoraLoaded, isLoading]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Pin user event listener
  useEffect(() => {
    const handlePinUser = (event: CustomEvent) => {
      setPinnedUser(event.detail);
    };

    window.addEventListener('pin-user', handlePinUser as EventListener);
    return () => window.removeEventListener('pin-user', handlePinUser as EventListener);
  }, [setPinnedUser]);

  const toggleFullscreen = () => {
    if (!mainContainerRef.current) return;

    if (!isFullscreen) {
      if (mainContainerRef.current.requestFullscreen) {
        mainContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleLeaveCall = () => {
    leaveChannel();
    // You can change this to your dashboard route
    window.location.href = '/dashboard';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Connecting to consultation...</h2>
            <p className="text-muted-foreground">Please wait while we set up your video call</p>
          </div>
        </div>
      </div>
    );
  }

  if (meetingConfig && !agoraLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Loading video services...</h2>
            <p className="text-muted-foreground">Initializing video call components</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[94%] bg-background flex flex-col overflow-hidden" ref={mainContainerRef}>
      {joined && (
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground">Telemedicine Consultation</h1>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRecording && (
              <Badge variant="destructive" className="flex items-center gap-2 px-3 py-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {Math.floor(recordingDuration / 3600).toString().padStart(2, '0')}:
                  {Math.floor((recordingDuration % 3600) / 60).toString().padStart(2, '0')}:
                  {(recordingDuration % 60).toString().padStart(2, '0')}
                </span>
              </Badge>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border border-border">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {Object.keys(remoteUsers).length + 1}
              </span>
            </div>
            <Button
              onClick={toggleFullscreen}
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden">
        {joined && (
          <>
            <VideoGrid
              localUid={uid}
              userName={userName}
              remoteUsers={remoteUsers}
              pinnedUser={pinnedUser}
              activeSpeakers={activeSpeakers}
              screenSharing={screenSharing}
              videoEnabled={videoEnabled}
              audioEnabled={audioEnabled}
            />
            
            <Controls
              videoEnabled={videoEnabled}
              audioEnabled={audioEnabled}
              screenSharing={screenSharing}
              isRecording={isRecording}
              recordingDuration={recordingDuration}
              chatMessages={chatMessages}
              showChat={showChat}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
              onToggleScreenShare={screenSharing ? stopScreenShare : startScreenShare}
              onToggleRecording={() => setIsRecording(!isRecording)}
              onToggleChat={() => setShowChat(!showChat)}
              onLeaveCall={handleLeaveCall}
            />

            <ChatPanel
              isOpen={showChat}
              onClose={() => setShowChat(false)}
              messages={chatMessages}
              currentUserId={uid}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AgoraVideoCall;