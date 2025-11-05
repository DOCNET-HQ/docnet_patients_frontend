import React, { useEffect } from 'react';
import { AgoraUser } from '@/types/agora';

interface VideoGridProps {
  localUid: number;
  userName: string;
  remoteUsers: Record<number, AgoraUser>;
  pinnedUser: number | null;
  activeSpeakers: Set<number>;
  screenSharing: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  localUid,
  userName,
  remoteUsers,
  pinnedUser,
  activeSpeakers,
  screenSharing,
  videoEnabled,
  audioEnabled
}) => {
  useEffect(() => {
    updateVideoLayout();
  }, [pinnedUser, remoteUsers]);

  const updateVideoLayout = () => {
    const remoteUsersCount = Object.keys(remoteUsers).length;
    const totalUsers = remoteUsersCount + 1;

    if (totalUsers === 2 && !pinnedUser) {
      document.getElementById('remote-videos')?.classList.remove('grid-cols-4', 'grid-cols-3', 'grid-cols-2');
      document.getElementById('remote-videos')?.classList.add('grid-cols-2');
      document.getElementById('local-video-container')?.classList.remove('col-span-3', 'col-span-2', 'row-span-2');
    } else if (pinnedUser) {
      document.getElementById('remote-videos')?.classList.remove('grid-cols-4', 'grid-cols-3', 'grid-cols-2');
      document.getElementById('remote-videos')?.classList.add('grid-cols-3');

      document.getElementById('local-video-container')?.classList.remove('col-span-3', 'col-span-2', 'row-span-2');
      Object.keys(remoteUsers).forEach(userUid => {
        const container = document.getElementById(`remote-${userUid}`);
        container?.classList.remove('col-span-3', 'col-span-2', 'row-span-2');
      });

      if (pinnedUser === localUid) {
        document.getElementById('local-video-container')?.classList.add('col-span-2', 'row-span-2');
      } else {
        const pinnedContainer = document.getElementById(`remote-${pinnedUser}`);
        pinnedContainer?.classList.add('col-span-2', 'row-span-2');
      }
    } else {
      document.getElementById('remote-videos')?.classList.remove('grid-cols-3', 'grid-cols-2');
      document.getElementById('remote-videos')?.classList.add('grid-cols-4');
      document.getElementById('local-video-container')?.classList.remove('col-span-3', 'col-span-2', 'row-span-2');
    }
  };

  const createRemoteVideoContainer = (user: AgoraUser) => {
    const container = document.createElement('div');
    container.id = `remote-${user.uid}`;
    container.className = 'relative bg-muted rounded-lg overflow-hidden border border-border';

    const videoContainer = document.createElement('div');
    videoContainer.id = `remote-video-${user.uid}`;
    videoContainer.className = 'w-full h-full';
    container.appendChild(videoContainer);

    const label = document.createElement('div');
    label.className = 'absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-foreground text-xs font-medium border border-border';
    label.textContent = `User ${user.uid}`;
    container.appendChild(label);

    const speakingIndicator = document.createElement('div');
    speakingIndicator.id = `speaking-border-${user.uid}`;
    speakingIndicator.className = 'absolute inset-0 border-3 border-blue-500 rounded-lg opacity-0 transition-opacity pointer-events-none';
    container.appendChild(speakingIndicator);

    const micIcon = document.createElement('div');
    micIcon.id = `mic-${user.uid}`;
    micIcon.className = 'absolute bottom-2 right-2 w-6 h-6 bg-destructive rounded-full hidden items-center justify-center';
    micIcon.innerHTML = '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>';
    container.appendChild(micIcon);

    const pinButton = document.createElement('button');
    pinButton.className = 'absolute top-2 right-2 p-1 bg-background/60 hover:bg-background/80 rounded backdrop-blur-sm transition border border-border';
    pinButton.innerHTML = '<svg class="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>';
    pinButton.onclick = () => window.dispatchEvent(new CustomEvent('pin-user', { detail: user.uid }));
    container.appendChild(pinButton);

    document.getElementById('remote-videos')?.appendChild(container);
  };

  useEffect(() => {
    Object.keys(remoteUsers).forEach(userUid => {
      const user = remoteUsers[parseInt(userUid)];
      if (user && !document.getElementById(`remote-${user.uid}`)) {
        createRemoteVideoContainer(user);
      }
    });
  }, [remoteUsers]);

  useEffect(() => {
    Object.keys(remoteUsers).forEach(userUid => {
      const micIcon = document.getElementById(`mic-${userUid}`);
      const speakingBorder = document.getElementById(`speaking-border-${userUid}`);
      const user = remoteUsers[parseInt(userUid)];
      if (user) {
        const isSpeaking = activeSpeakers.has(parseInt(userUid));
        if (micIcon) {
          if (!user.audioTrack) {
            micIcon.classList.remove('hidden');
            micIcon.classList.add('flex');
          } else {
            micIcon.classList.add('hidden');
            micIcon.classList.remove('flex');
          }
        }
        if (speakingBorder) speakingBorder.style.opacity = isSpeaking && user.audioTrack ? '1' : '0';
      }
    });

    const localSpeaking = activeSpeakers.has(localUid);
    const localBorder = document.getElementById('local-speaking-border');
    if (localBorder) localBorder.style.opacity = localSpeaking ? '1' : '0';
  }, [activeSpeakers, localUid, remoteUsers]);

  return (
    <div className="flex-1 flex flex-col-2 p-4 gap-3">
      {/* Local Video Container - Always keep this empty div for Agora to play video */}
      <div className="flex-1 bg-muted rounded-xl overflow-hidden relative shadow-lg border border-border h-96">
        <div id="local-video-container" className="w-full h-full">
          <div id="local-video" className="w-full h-full"></div>
        </div>
        <div id="local-speaking-border" className="absolute inset-0 border-4 border-blue-500 rounded-xl opacity-0 transition-opacity pointer-events-none"></div>

        {/* User name label */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-border">
          <span className="text-foreground text-sm font-medium">
            {userName} {screenSharing && '(Screen)'}
          </span>
        </div>

        {
          !videoEnabled && (
            <div className="w-full h-full flex items-center justify-center bg-muted/50 z-10 absolute top-0 left-0">
              <div className="w-20 h-20 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-border">
                <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </div>
          )
        }

        {/* Mic off indicator */}
        {!audioEnabled && (
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-destructive rounded-full flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          </div>
        )}
      </div>

      {/* Remote Videos Container */}
      <div id="remote-videos" className="grid gap-3 min-h-32 flex-1"></div>
    </div>
  );
};
