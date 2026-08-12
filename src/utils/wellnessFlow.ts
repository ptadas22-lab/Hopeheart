import { ScreenId } from '../types';

export interface WellnessNotification {
  id: string;
  window: 'morning' | 'afternoon' | 'evening' | 'weekend' | 'night' | 'general';
  title: string;
  message: string;
  category: 'challenge' | 'break' | 'article' | 'enjoyment' | 'sleep' | 'general';
  targetScreenId: ScreenId;
  relevantMoods: string[]; // empty means all moods
  weekdayWeekendRule: 'weekday' | 'weekend' | 'both';
  priority: number; // higher is higher priority
  actionLabel?: string;
}

export const WELLNESS_NOTIFICATIONS: WellnessNotification[] = [
  // MORNING (7:00 AM - 10:00 AM) - Focus on Healthy Habits Challenges
  {
    id: 'm-morning-habits',
    window: 'morning',
    title: 'Morning Routine Nudge',
    message: 'Good morning 🌱 Ready for one small healthy habit today?',
    category: 'challenge',
    targetScreenId: ScreenId.DoctorSuggestions, // Navigate to Resources -> Healthy Habits Challenge
    relevantMoods: [],
    weekdayWeekendRule: 'weekday',
    priority: 1,
    actionLabel: 'Choose Habit'
  },
  {
    id: 'm-morning-challenge-ready',
    window: 'morning',
    title: 'Daily Challenge Ready',
    message: 'Your morning challenge is ready. Small steps today can become healthy routines.',
    category: 'challenge',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: [],
    weekdayWeekendRule: 'weekday',
    priority: 2,
    actionLabel: 'Start Challenge'
  },
  {
    id: 'm-morning-tired-breakfast',
    window: 'morning',
    title: 'Energize Your Morning',
    message: 'Feeling tired? 🥣 Prioritize a nourishing breakfast or some hydration today.',
    category: 'challenge',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: ['tired'],
    weekdayWeekendRule: 'both',
    priority: 5,
    actionLabel: 'View Challenge'
  },
  {
    id: 'm-morning-anxious-calm',
    window: 'morning',
    title: 'Gentle Morning Start',
    message: 'Starting the day with worry? 🧘 Try a 1-minute breathing space or set a daily challenge.',
    category: 'challenge',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: ['anxious', 'sad', 'hurt'],
    weekdayWeekendRule: 'both',
    priority: 5,
    actionLabel: 'Breathe Now'
  },

  // AFTER WORK / OFFICE HOURS (1:00 PM - 4:00 PM) - Focus on breaks and quick relief
  {
    id: 'a-afternoon-break',
    window: 'afternoon',
    title: 'Workday Pause',
    message: "You've been going for a while. How about a short pause? ☕",
    category: 'break',
    targetScreenId: ScreenId.FeelGood, // Navigate to Feel Good screen
    relevantMoods: [],
    weekdayWeekendRule: 'weekday',
    priority: 1,
    actionLabel: 'Take a Break'
  },
  {
    id: 'a-afternoon-sounds',
    window: 'afternoon',
    title: 'Afternoon Hum',
    message: 'Would some calming sounds help you reset right now?',
    category: 'break',
    targetScreenId: ScreenId.FeelGood,
    relevantMoods: [],
    weekdayWeekendRule: 'weekday',
    priority: 2,
    actionLabel: 'Play Calm Sounds'
  },
  {
    id: 'a-afternoon-anxious',
    window: 'afternoon',
    title: 'Deep Breath Pause',
    message: 'Feeling overwhelmed? 🌬 Try a 3-minute guided breathing session or a grounding checklist.',
    category: 'break',
    targetScreenId: ScreenId.FeelGood,
    relevantMoods: ['anxious', 'sad', 'hurt', 'lonely'],
    weekdayWeekendRule: 'both',
    priority: 5,
    actionLabel: 'Relax Now'
  },

  // EVENING (5:00 PM - 8:00 PM) - Mood-relevant articles/insights
  {
    id: 'e-evening-relax',
    window: 'evening',
    title: 'Evening Wind-down',
    message: 'Take a few minutes for yourself this evening 💛',
    category: 'article',
    targetScreenId: ScreenId.DoctorSuggestions, // Navigate to Resources
    relevantMoods: [],
    weekdayWeekendRule: 'weekday',
    priority: 1,
    actionLabel: 'Read Article'
  },
  {
    id: 'e-evening-anxious',
    window: 'evening',
    title: 'Managing Anxious Thoughts',
    message: 'Anxious evening? 🧠 Learn to notice your feelings and slow down racing thoughts.',
    category: 'article',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: ['anxious'],
    priority: 5,
    weekdayWeekendRule: 'both',
    actionLabel: 'Read Managing Anxiety'
  },
  {
    id: 'e-evening-sad',
    window: 'evening',
    title: 'Practicing Self-Compassion',
    message: 'Having a heavy day? ❤️ Learn strategies to treat yourself with warmth and care.',
    category: 'article',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: ['sad', 'hurt'],
    priority: 5,
    weekdayWeekendRule: 'both',
    actionLabel: 'Read Self-Compassion'
  },
  {
    id: 'e-evening-lonely',
    window: 'evening',
    title: 'Connecting With Yourself',
    message: 'Feeling isolated tonight? 🧘 Try a soft breathing note or read about emotional awareness.',
    category: 'article',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: ['lonely', 'need-support'],
    priority: 5,
    weekdayWeekendRule: 'both',
    actionLabel: 'Read Emotional Awareness'
  },
  {
    id: 'e-evening-tired',
    window: 'evening',
    title: 'Resting After a Long Day',
    message: 'Exhausted? 😴 Prepare your mind with wind-down routines for a better night.',
    category: 'article',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: ['tired'],
    priority: 5,
    weekdayWeekendRule: 'both',
    actionLabel: 'Read Better Sleep'
  },

  // WEEKEND EXPERIENCE (Saturdays and Sundays) - Lighter, enjoyment-focused suggestions
  {
    id: 'w-weekend-enjoy',
    window: 'weekend',
    title: 'Enjoy Your Weekend',
    message: 'Weekend idea 🎬 — Do something you genuinely enjoy today, like watching a movie or visiting a park.',
    category: 'enjoyment',
    targetScreenId: ScreenId.FeelGood,
    relevantMoods: [],
    weekdayWeekendRule: 'weekend',
    priority: 1,
    actionLabel: 'Plan Activity'
  },
  {
    id: 'w-weekend-rest',
    window: 'weekend',
    title: 'No Need to Produce',
    message: "Your weekend doesn't need to be productive. Enjoy some quiet time for yourself outdoors.",
    category: 'enjoyment',
    targetScreenId: ScreenId.FeelGood,
    relevantMoods: [],
    weekdayWeekendRule: 'weekend',
    priority: 2,
    actionLabel: 'Spend Time Outside'
  },
  {
    id: 'w-weekend-creative',
    window: 'weekend',
    title: 'Weekend Comfort',
    message: 'Try something creative today or meet a friend. Spark a gentle connection.',
    category: 'enjoyment',
    targetScreenId: ScreenId.Community,
    relevantMoods: ['lonely', 'sad', 'anxious'],
    weekdayWeekendRule: 'weekend',
    priority: 5,
    actionLabel: 'Explore Circles'
  },

  // NIGHT (8:30 PM - 11:00 PM) - Sleep and relaxation prep
  {
    id: 'n-night-slow',
    window: 'night',
    title: 'Time to Slow Down',
    message: 'Time to slow things down 🌙 Give yourself a few quiet minutes before sleep.',
    category: 'sleep',
    targetScreenId: ScreenId.FeelGood,
    relevantMoods: [],
    weekdayWeekendRule: 'both',
    priority: 1,
    actionLabel: 'Breathe Before Bed'
  },
  {
    id: 'n-night-anxious',
    window: 'night',
    title: 'Nighttime Relaxation',
    message: 'Mind racing at bed? 🌬 Try a breathing session or listen to soft ambient sounds.',
    category: 'sleep',
    targetScreenId: ScreenId.FeelGood,
    relevantMoods: ['anxious', 'sad', 'hurt', 'lonely'],
    weekdayWeekendRule: 'both',
    priority: 5,
    actionLabel: 'Start Relaxing'
  },
  {
    id: 'n-night-tired',
    window: 'night',
    title: 'Sleep Wind-down',
    message: 'Ready to sleep? 😴 Read calming tips or listen to ambient hum presets.',
    category: 'sleep',
    targetScreenId: ScreenId.DoctorSuggestions,
    relevantMoods: ['tired', 'calm', 'hopeful'],
    weekdayWeekendRule: 'both',
    priority: 5,
    actionLabel: 'Go to Sleep Guide'
  }
];

export function getActiveNotification(currentMoodId: string, customHour?: number, customDay?: number): WellnessNotification {
  const today = new Date();
  const day = customDay !== undefined ? customDay : today.getDay();
  const isWeekend = day === 0 || day === 6;

  const hour = customHour !== undefined ? customHour : today.getHours();
  const min = today.getMinutes();
  const decimalTime = hour + min / 60;

  let activeWindow: 'morning' | 'afternoon' | 'evening' | 'weekend' | 'night' | 'general' = 'general';

  if (isWeekend) {
    activeWindow = 'weekend';
  } else {
    // Time windows matching the specification
    if (decimalTime >= 7 && decimalTime < 10) {
      activeWindow = 'morning';
    } else if (decimalTime >= 13 && decimalTime < 16) {
      activeWindow = 'afternoon';
    } else if (decimalTime >= 17 && decimalTime < 20) {
      activeWindow = 'evening';
    } else if (decimalTime >= 20.5 && decimalTime < 23) {
      activeWindow = 'night';
    }
  }

  // Filter candidates matching the window and weekend rule
  const candidates = WELLNESS_NOTIFICATIONS.filter(n => {
    if (n.window !== activeWindow) return false;
    if (n.weekdayWeekendRule === 'weekend' && !isWeekend) return false;
    if (n.weekdayWeekendRule === 'weekday' && isWeekend) return false;
    return true;
  });

  if (candidates.length === 0) {
    // Return a generic fallback
    return {
      id: 'fallback-general',
      window: 'general',
      title: 'A Small Step Today',
      message: 'Choose one small, gentle action for your self-care today. Small steps count.',
      category: 'general',
      targetScreenId: ScreenId.Home,
      relevantMoods: [],
      weekdayWeekendRule: 'both',
      priority: 1,
      actionLabel: 'Go Home'
    };
  }

  // Rank candidate notifications by mood relevance and priority
  // If a candidate lists the current mood, boost priority by +10
  const ranked = candidates.map(n => {
    let score = n.priority;
    if (n.relevantMoods.includes(currentMoodId.toLowerCase())) {
      score += 10;
    }
    return { item: n, score };
  });

  // Sort descending by score
  ranked.sort((a, b) => b.score - a.score);

  return ranked[0].item;
}
