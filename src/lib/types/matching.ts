export interface User {
  id: string;
  name: string;
  avatar: string;
  location: { lat: number; lng: number };
  musicTastes: string[];
  freeTime: TimeSlot[];
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface YogaSession {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  scheduledTime: Date;
  duration: number;
  videoUrl: string;
  musicMatch: number;
}

export interface NearbyUser {
  user: User;
  distance: number;
  musicMatch: number;
  commonFreeTime: TimeSlot[];
}
