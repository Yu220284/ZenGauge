import { User, NearbyUser, TimeSlot, YogaSession } from './types/matching';

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateMusicMatch(tastes1: string[], tastes2: string[]): number {
  const common = tastes1.filter(t => tastes2.includes(t));
  return (common.length / Math.max(tastes1.length, tastes2.length)) * 100;
}

function findCommonFreeTime(slots1: TimeSlot[], slots2: TimeSlot[]): TimeSlot[] {
  return slots1.filter(s1 => 
    slots2.some(s2 => s1.day === s2.day && s1.startTime === s2.startTime)
  );
}

export function findNearbyUsers(currentUser: User, allUsers: User[], maxDistance: number = 10): NearbyUser[] {
  return allUsers
    .filter(u => u.id !== currentUser.id)
    .map(user => {
      const distance = calculateDistance(
        currentUser.location.lat, currentUser.location.lng,
        user.location.lat, user.location.lng
      );
      const musicMatch = calculateMusicMatch(currentUser.musicTastes, user.musicTastes);
      const commonFreeTime = findCommonFreeTime(currentUser.freeTime, user.freeTime);
      
      return { user, distance, musicMatch, commonFreeTime };
    })
    .filter(n => n.distance <= maxDistance && n.musicMatch >= 30 && n.commonFreeTime.length > 0)
    .sort((a, b) => b.musicMatch - a.musicMatch);
}

export function autoScheduleSession(nearbyUser: NearbyUser): YogaSession | null {
  if (nearbyUser.commonFreeTime.length === 0) return null;
  
  const slot = nearbyUser.commonFreeTime[0];
  const today = new Date();
  const daysMap: { [key: string]: number } = {
    'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0
  };
  
  const targetDay = daysMap[slot.day];
  const currentDay = today.getDay();
  const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
  
  const scheduledDate = new Date(today);
  scheduledDate.setDate(today.getDate() + daysUntil);
  const [hours, minutes] = slot.startTime.split(':').map(Number);
  scheduledDate.setHours(hours, minutes, 0, 0);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    partnerId: nearbyUser.user.id,
    partnerName: nearbyUser.user.name,
    partnerAvatar: nearbyUser.user.avatar,
    scheduledTime: scheduledDate,
    duration: 60,
    videoUrl: '/videos/yoga-session.mp4',
    musicMatch: nearbyUser.musicMatch
  };
}
