export interface AgoraUser {
  uid: number;
  videoTrack?: any;
  audioTrack?: any;
  name?: string;
}

export interface ChatMessage {
  id: string;
  userId: number;
  userName: string;
  message: string;
  timestamp: Date;
}

export interface MeetingConfig {
  appId: string;
  token: string;
  channelName: string;
}

export interface Device {
  deviceId: string;
  label: string;
}
