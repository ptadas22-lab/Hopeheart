export enum ScreenId {
  Splash = 'splash',
  Welcome = 'welcome',
  Login = 'login',
  ProfileSetup = 'profile-setup',
  OnboardingMood = 'onboarding-mood',
  OnboardingComfort = 'onboarding-comfort',
  Home = 'home',
  FeelGood = 'feel-good',
  Mood = 'mood',
  MySpace = 'my-space',
  Community = 'community',
  SafeListener = 'safe-listener',
  SafeChat = 'safe-chat',
  HopeBuddyChat = 'hopebuddy-chat',
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
  MedicalDisclaimer = 'medical-disclaimer',
  Financials = 'financials',
  CustomerSupport = 'customer-support',
  CareBridge = 'care-bridge'
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

/**
 * Central dictionary of all LocalStorage keys used across the HopeHeart ecosystem.
 */
export const STORAGE_KEYS = {
  // Core / Profile
  THEME: 'hopeheart_theme',
  SAFE_RULES_ACCEPTED: 'hopeheart_safe_rules_accepted',
  SAFE_RULES_ACCEPTED_AT: 'hopeheart_safe_rules_accepted_at',
  PENDING_ENTRY_METHOD: 'hopeheart_pending_entry_method',
  PROFILE_DISPLAY_NAME: 'hopeheart_profile_display_name',
  PROFILE_AVATAR: 'hopeheart_profile_avatar',
  PROFILE_AGE_GROUP: 'hopeheart_profile_age_group',
  PROFILE_GENDER: 'hopeheart_profile_gender',
  PROFILE_PROFESSION: 'hopeheart_profile_profession',
  PROFILE_LANGUAGE: 'hopeheart_profile_language',
  PROFILE_SUPPORT_INTEREST: 'hopeheart_profile_support_interest',
  PROFILE_BEST_QUALITY: 'hopeheart_profile_best_quality',
  PROFILE_NATURE: 'hopeheart_profile_nature',
  PROFILE_VIBE: 'hopeheart_profile_vibe',

  // Mood Check-in & History
  LAST_CHECKIN_MOOD: 'hopeheart_last_checkin_mood',
  LAST_CHECKIN_DATE: 'hopeheart_last_checkin_date',
  CHECKIN_COUNT: 'hopeheart_checkin_count',
  MOOD_HISTORY: 'hopeheart_mood_history',

  // My Space Features
  SAVED_REFLECTIONS: 'hopeheart_saved_reflections',
  GRATITUDE_LOGS: 'hopeheart_gratitude',
  POSITIVE_MEMORIES: 'hopeheart_positive_memories',
  COMFORT_ACTIVITY: 'hopeheart_remember_comfort_activity',
  SURVIVAL_MEMORY: 'hopeheart_remember_survival_memory',

  // Wellness / Resource hub
  FAVORITE_RESOURCES: 'hopeheart_favorite_resources',
  RECENT_RESOURCES: 'hopeheart_saved_resources', // Saved/recently used list

  // Community Rooms / Stories
  COMMUNITY_ROOMS: 'hopeheart_community_rooms',
  COMMUNITY_STORIES: 'hopeheart_community_stories',

  // CareBridge
  TRUSTED_CONTACTS: 'hopeheart_trusted_contacts',
  SAFETY_PLAN: 'hopeheart_safety_plan',
  EMERGENCY_CONTACTS: 'hopeheart_emergency_contacts',
  SUPPORT_PREFERENCES: 'hopeheart_support_preferences',

  // WhatsApp Configs
  WHATSAPP_ENABLED: 'hopeheart_whatsapp_reminders_enabled',
  WHATSAPP_NUMBER: 'hopeheart_whatsapp_number',
  WHATSAPP_TIME: 'hopeheart_whatsapp_reminder_time',
  WHATSAPP_FREQUENCY: 'hopeheart_whatsapp_reminder_frequency',

  // HopeBuddy
  BUDDY_HISTORY: 'hopebuddy_history',
  BUDDY_SUMMARIES: 'hopebuddy_summaries',
  BUDDY_PREFERENCES: 'hopebuddy_preferences'
} as const;

