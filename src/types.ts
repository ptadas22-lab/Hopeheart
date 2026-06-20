export enum ScreenId {
  Welcome = 'welcome',
  Promise = 'promise',
  HeartCheck = 'heart-check',
  SupportNeed = 'support-need',
  Home = 'home',
  SafeListener = 'safe-listener',
  SafeChat = 'safe-chat',
  SupportRooms = 'support-rooms',
  RoomDetail = 'room-detail',
  ShareSafely = 'share-safely',
  MomentShare = 'moment-share',
  NearbyAccess = 'nearby-access',
  NearbyResults = 'nearby-results',
  CommunityDetail = 'community-detail',
  MeetSafely = 'meet-safely',
  DoctorSuggestions = 'doctor-suggestions',
  ProfessionalProfile = 'professional-profile',
  BookCare = 'book-care',
  SaveQuestions = 'save-questions',
  AISafety = 'ai-safety',
  ModerationBlock = 'moderation-block',
  Crisis = 'crisis',
  Profile = 'profile',
  PrivacySettings = 'privacy-settings',
  Notifications = 'notifications',
  About = 'about',
  MedicalDisclaimer = 'medical-disclaimer'
}

export interface MoodConfig {
  id: string;
  label: string;
  emoji: string;
  color: string; // Tailwind class
  accentBg: string; // Hex color or Tailwind class
  bgLight: string; // Light tint for dashboard cards
  buddyExpression: 'calm' | 'anxious' | 'hurt' | 'numb' | 'lonely' | 'need-support';
  tagline: string;
}

export interface SupportRoom {
  id: string;
  name: string;
  category: string;
  activeCount: number;
  description: string;
  tags: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'listener' | 'system' | 'bot';
  senderName: string;
  content: string;
  timestamp: string;
  isFlagged?: boolean; // AI Safety check label
}

export interface GuardrailItem {
  id: string;
  text: string;
  description: string;
  isAllowed: boolean;
  category: 'community' | 'clinical' | 'safe';
}

export interface DoctorQuestion {
  id: string;
  text: string;
  createdAt: string;
  category?: string;
}
