import React from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Monitor, MonitorOff, MessageCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ControlsProps {
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
  isRecording: boolean;
  recordingDuration: number;
  chatMessages: any[];
  showChat: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onToggleChat: () => void;
  onLeaveCall: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  videoEnabled,
  audioEnabled,
  screenSharing,
  isRecording,
  recordingDuration,
  chatMessages,
  showChat,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onToggleRecording,
  onToggleChat,
  onLeaveCall
}) => {
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-card rounded-full shadow-2xl px-6 py-3 flex items-center gap-2 border border-border">
        <Button
          onClick={onToggleAudio}
          size="icon"
          variant={audioEnabled ? "secondary" : "destructive"}
          className="rounded-full cursor-pointer"
        >
          {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </Button>
        <Button
          onClick={onToggleVideo}
          size="icon"
          variant={videoEnabled ? "secondary" : "destructive"}
          className="rounded-full cursor-pointer"
        >
          {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </Button>
        <Button
          onClick={onToggleScreenShare}
          size="icon"
          variant={screenSharing ? "default" : "secondary"}
          className="rounded-full cursor-pointer"
        >
          {screenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
        </Button>
        <Separator orientation="vertical" className="h-8" />
        <Button
          onClick={onToggleChat}
          size="icon"
          variant="secondary"
          className="rounded-full relative cursor-pointer"
        >
          <MessageCircle size={20} />
          {chatMessages.length > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
              {chatMessages.length}
            </Badge>
          )}
        </Button>
        <Button
          onClick={onToggleRecording}
          size="icon"
          variant={isRecording ? "destructive" : "secondary"}
          className="rounded-full cursor-pointer"
        >
          <Circle size={20} className={isRecording ? 'animate-pulse' : ''} />
          {isRecording && (
            <span className="absolute -top-8 text-xs bg-destructive text-white px-2 py-1 rounded">
              {formatDuration(recordingDuration)}
            </span>
          )}
        </Button>
        <Separator orientation="vertical" className="h-8" />
        <Button
          onClick={onLeaveCall}
          size="icon"
          variant="destructive"
          className="rounded-full cursor-pointer"
        >
          <Phone size={20} className="rotate-135" />
        </Button>
      </div>
    </div>
  );
};
