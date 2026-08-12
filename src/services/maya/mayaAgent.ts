import { ScreenId } from '../../types';

export interface MayaContext {
  userId: string | null;
  userName: string;
  currentMoodId: string;
  currentTime: string;
  dayOfWeek: number;
  completedToday: string[];
  skippedToday: string[];
  recentActivities: string[];
  streak: number;
}

export interface MayaAction {
  id: string;
  type: 'healthy_habit' | 'challenge' | 'breathing' | 'grounding' | 'calm_sounds' | 'break_timer' | 'article' | 'sleep' | 'journal' | 'community' | 'support' | 'rest';
  title: string;
  description: string;
  resourceId: string;
  reason: string;
  estimatedMinutes: number;
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night' | 'general';
}

export interface MayaDailyState {
  date: string;
  moodId: string;
  currentActionId: string | null;
  completedActionIds: string[];
  skippedActionIds: string[];
  lastActionAt: string | null;
  progress: number;
}

function isWeekendDay(day: number): boolean {
  return day === 0 || day === 6;
}

function getUserNameAndId() {
  const name = localStorage.getItem('hopeheart_profile_display_name') || 'Friend';
  const id = localStorage.getItem('hopeheart_profile_display_name') ? 'user-local' : null;
  return { name, id };
}

function getLatestMoodId(): string {
  return localStorage.getItem('hopeheart_last_checkin_mood') || 'calm';
}

export function loadMayaDailyState(): MayaDailyState {
  const key = 'hopeheart_maya_daily_state';
  const todayStr = new Date().toISOString().split('T')[0];
  const saved = localStorage.getItem(key);
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.date === todayStr) {
        return parsed;
      } else {
        const moodId = getLatestMoodId();
        const newState: MayaDailyState = {
          date: todayStr,
          moodId,
          currentActionId: null,
          completedActionIds: [],
          skippedActionIds: [],
          lastActionAt: null,
          progress: 0
        };
        localStorage.setItem(key, JSON.stringify(newState));
        return newState;
      }
    } catch (e) {
      // Fallback
    }
  }

  const moodId = getLatestMoodId();
  const defaultState: MayaDailyState = {
    date: todayStr,
    moodId,
    currentActionId: null,
    completedActionIds: [],
    skippedActionIds: [],
    lastActionAt: null,
    progress: 0
  };
  localStorage.setItem(key, JSON.stringify(defaultState));
  return defaultState;
}

export function saveMayaDailyState(state: MayaDailyState) {
  localStorage.setItem('hopeheart_maya_daily_state', JSON.stringify(state));
}

export function computeNextAction(context: MayaContext): MayaAction {
  const { currentMoodId, currentTime, dayOfWeek, completedToday, skippedToday } = context;
  const isWeekend = isWeekendDay(dayOfWeek);
  
  const [hStr, mStr] = currentTime.split(':');
  const hour = parseInt(hStr, 10);
  const min = parseInt(mStr, 10);
  const decimalTime = hour + min / 60;

  let timeWindow: 'morning' | 'afternoon' | 'evening' | 'night' | 'general' = 'general';
  if (decimalTime >= 7 && decimalTime < 11) {
    timeWindow = 'morning';
  } else if (decimalTime >= 13 && decimalTime < 16.5) {
    timeWindow = 'afternoon';
  } else if (decimalTime >= 17 && decimalTime < 20.5) {
    timeWindow = 'evening';
  } else if (decimalTime >= 20.5 && decimalTime < 23.5) {
    timeWindow = 'night';
  }

  // 1. WEEKEND EXPERIENCE
  if (isWeekend) {
    if (!completedToday.includes('weekend-enjoy') && !skippedToday.includes('weekend-enjoy')) {
      return {
        id: 'weekend-enjoy',
        type: 'rest',
        title: 'Enjoy Your Day',
        description: 'Do something you genuinely enjoy today—like meeting a friend or taking a park walk.',
        resourceId: 'feel-good',
        reason: 'Resting and playing are valuable habits for long-term health.',
        estimatedMinutes: 30,
        timeContext: 'general'
      };
    }
  }

  // 2. MORNING (7:00 AM - 11:00 AM)
  if (timeWindow === 'morning') {
    if (currentMoodId.toLowerCase() === 'tired') {
      if (!completedToday.includes('c1') && !skippedToday.includes('c1')) {
        return {
          id: 'c1',
          type: 'challenge',
          title: 'Nourishing Breakfast',
          description: 'Have a balanced, nourishing breakfast today.',
          resourceId: 'c1',
          reason: 'A nourishing breakfast provides vital nutrients to boost your morning energy.',
          estimatedMinutes: 15,
          timeContext: 'morning'
        };
      }
      if (!completedToday.includes('c3') && !skippedToday.includes('c3')) {
        return {
          id: 'c3',
          type: 'challenge',
          title: 'Hydration Reset',
          description: 'Drink water regularly throughout the morning to wake up your body.',
          resourceId: 'c3',
          reason: 'Optimal hydration is the simplest way to reduce feelings of fatigue.',
          estimatedMinutes: 1,
          timeContext: 'morning'
        };
      }
    } else {
      if (!completedToday.includes('c1') && !skippedToday.includes('c1')) {
        return {
          id: 'c1',
          type: 'challenge',
          title: 'Nourishing Breakfast',
          description: 'Have a balanced, nourishing breakfast today.',
          resourceId: 'c1',
          reason: 'A nourishing morning breakfast fuels your body and stabilizes blood sugar.',
          estimatedMinutes: 15,
          timeContext: 'morning'
        };
      }
      if (!completedToday.includes('c3') && !skippedToday.includes('c3')) {
        return {
          id: 'c3',
          type: 'challenge',
          title: 'Hydration Day',
          description: 'Drink water regularly throughout the day.',
          resourceId: 'c3',
          reason: 'Proper hydration supports memory, focus, and cell health.',
          estimatedMinutes: 1,
          timeContext: 'morning'
        };
      }
    }
  }

  // 3. AFTERNOON (1:00 PM - 4:30 PM)
  if (timeWindow === 'afternoon') {
    if (!completedToday.includes('break-timer') && !skippedToday.includes('break-timer')) {
      return {
        id: 'break-timer',
        type: 'break_timer',
        title: 'Take a Short Break',
        description: "You've been going for a while. Let's pause for 3 minutes.",
        resourceId: 'break-timer',
        reason: 'Short breaks during work restore focus and lower physical tension.',
        estimatedMinutes: 3,
        timeContext: 'afternoon'
      };
    }
    if (!completedToday.includes('calm-sounds') && !skippedToday.includes('calm-sounds')) {
      return {
        id: 'calm-sounds',
        type: 'calm_sounds',
        title: 'Calming Soundscapes',
        description: 'Spend 5 minutes listening to some calm natural frequencies.',
        resourceId: 'calm-sounds',
        reason: 'Nature frequencies or soft pink noise help soothe stress responses.',
        estimatedMinutes: 5,
        timeContext: 'afternoon'
      };
    }
  }

  // 4. EVENING (5:00 PM - 8:30 PM)
  if (timeWindow === 'evening') {
    const mood = currentMoodId.toLowerCase();
    if (mood === 'anxious') {
      if (!completedToday.includes('managing-anxiety') && !skippedToday.includes('managing-anxiety')) {
        return {
          id: 'managing-anxiety',
          type: 'article',
          title: 'Understanding Anxiety',
          description: 'Read a short guide on managing anxiety and centering thoughts.',
          resourceId: 'managing-anxiety',
          reason: 'Learning anxiety patterns helps you separate yourself from stress spirals.',
          estimatedMinutes: 3,
          timeContext: 'evening'
        };
      }
    } else if (mood === 'sad') {
      if (!completedToday.includes('self-compassion') && !skippedToday.includes('self-compassion')) {
        return {
          id: 'self-compassion',
          type: 'article',
          title: 'Treating Yourself Kindly',
          description: 'Read the Self-Compassion guide to ease heavy feelings.',
          resourceId: 'self-compassion',
          reason: 'Offering yourself warm friendliness helps lift low moods naturally.',
          estimatedMinutes: 3,
          timeContext: 'evening'
        };
      }
    } else if (mood === 'lonely') {
      if (!completedToday.includes('community-circles') && !skippedToday.includes('community-circles')) {
        return {
          id: 'community-circles',
          type: 'community',
          title: 'Explore Quiet Circles',
          description: 'Visit HopeHeart community groups to find quiet support rooms.',
          resourceId: 'community',
          reason: 'Hearing others can remind you that you are not alone, even without pressure to speak.',
          estimatedMinutes: 5,
          timeContext: 'evening'
        };
      }
    } else if (mood === 'hurt') {
      if (!completedToday.includes('self-compassion') && !skippedToday.includes('self-compassion')) {
        return {
          id: 'self-compassion',
          type: 'article',
          title: 'Practicing Self-Compassion',
          description: 'A short guide to treating yourself like a dear friend.',
          resourceId: 'self-compassion',
          reason: 'Warm kindness toward yourself helps heal emotional bruises.',
          estimatedMinutes: 3,
          timeContext: 'evening'
        };
      }
    } else if (mood === 'hopeful') {
      if (!completedToday.includes('healthy-habits') && !skippedToday.includes('healthy-habits')) {
        return {
          id: 'healthy-habits',
          type: 'article',
          title: 'Building Strong Routines',
          description: 'Read about stack habits and routine building.',
          resourceId: 'healthy-habits',
          reason: 'Expanding healthy habits compounds your current positive energy.',
          estimatedMinutes: 4,
          timeContext: 'evening'
        };
      }
    }
  }

  // 5. NIGHT (8:30 PM - 11:30 PM)
  if (timeWindow === 'night') {
    const mood = currentMoodId.toLowerCase();
    if (mood === 'tired') {
      if (!completedToday.includes('better-sleep') && !skippedToday.includes('better-sleep')) {
        return {
          id: 'better-sleep',
          type: 'sleep',
          title: 'Prepare for Sleep',
          description: 'Read wind-down tips for a deep, restorative sleep tonight.',
          resourceId: 'better-sleep',
          reason: 'Slowing down mental inputs is key to initiating your body’s sleep trigger.',
          estimatedMinutes: 3,
          timeContext: 'night'
        };
      }
    } else if (mood === 'anxious') {
      if (!completedToday.includes('breathing') && !skippedToday.includes('breathing')) {
        return {
          id: 'breathing',
          type: 'breathing',
          title: 'Deep Breathing Space',
          description: 'Try a 1-minute deep breathing exercise before bed.',
          resourceId: 'breathing',
          reason: 'Slow exhalations signal your nervous system that it is safe to rest.',
          estimatedMinutes: 2,
          timeContext: 'night'
        };
      }
    } else {
      if (!completedToday.includes('breathing') && !skippedToday.includes('breathing')) {
        return {
          id: 'breathing',
          type: 'breathing',
          title: 'Bedtime Breathing',
          description: 'Calm your mind with a structured breathing interval.',
          resourceId: 'breathing',
          reason: 'A centered breath is the simplest bridge to peaceful sleep.',
          estimatedMinutes: 2,
          timeContext: 'night'
        };
      }
    }
  }

  // 6. DEFAULT GENERAL FALLBACK
  const defaultIdeas = [
    { id: 'breathing', type: 'breathing', title: 'Guided Breathing Space', description: 'Take a brief moment to follow the breath outline.', resourceId: 'breathing', reason: 'Focusing on your lungs stabilizes autonomic responses.' },
    { id: 'c3', type: 'challenge', title: 'Drink Some Water', description: 'Drink a fresh glass of water to clear your thoughts.', resourceId: 'c3', reason: 'Hydration supports neurological functions.' },
    { id: 'coping-stress', type: 'article', title: 'Stress Recovery', description: 'Learn simple stacking routines for daily stress control.', resourceId: 'coping-stress', reason: 'Understanding stress helps you drop chronic tension.' }
  ];

  for (const idea of defaultIdeas) {
    if (!completedToday.includes(idea.id) && !skippedToday.includes(idea.id)) {
      return {
        id: idea.id,
        type: idea.type as any,
        title: idea.title,
        description: idea.description,
        resourceId: idea.resourceId,
        reason: idea.reason,
        estimatedMinutes: 2,
        timeContext: 'general'
      };
    }
  }

  return {
    id: 'rest-day',
    type: 'rest',
    title: 'Daily Journey Complete',
    description: 'You have done enough for today. Be proud of taking care of yourself.',
    resourceId: 'home',
    reason: 'Resting is a crucial part of positive development.',
    estimatedMinutes: 0,
    timeContext: 'general'
  };
}

export function getMayaContext(): MayaContext {
  const { name, id } = getUserNameAndId();
  const currentMoodId = getLatestMoodId();
  
  const today = new Date();
  const dayOfWeek = today.getDay();
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  const dailyState = loadMayaDailyState();
  const streak = parseInt(localStorage.getItem('hopeheart_checkin_streak') || '0', 10);

  return {
    userId: id,
    userName: name,
    currentMoodId,
    currentTime,
    dayOfWeek,
    completedToday: dailyState.completedActionIds,
    skippedToday: dailyState.skippedActionIds,
    recentActivities: [],
    streak
  };
}

export function getOrComputeNextAction(): MayaAction {
  const dailyState = loadMayaDailyState();
  const context = getMayaContext();

  const nextAction = computeNextAction(context);
  
  if (dailyState.currentActionId !== nextAction.id) {
    dailyState.currentActionId = nextAction.id;
    saveMayaDailyState(dailyState);
  }

  return nextAction;
}

export function completeAction(actionId: string): MayaAction {
  const dailyState = loadMayaDailyState();
  
  if (!dailyState.completedActionIds.includes(actionId)) {
    dailyState.completedActionIds.push(actionId);
  }
  
  dailyState.currentActionId = null;
  dailyState.lastActionAt = new Date().toISOString();
  
  dailyState.progress = Math.min(100, Math.round((dailyState.completedActionIds.length / 4) * 100));
  saveMayaDailyState(dailyState);

  return getOrComputeNextAction();
}

export function skipAction(actionId: string): MayaAction {
  const dailyState = loadMayaDailyState();
  
  if (!dailyState.skippedActionIds.includes(actionId)) {
    dailyState.skippedActionIds.push(actionId);
  }
  
  dailyState.currentActionId = null;
  saveMayaDailyState(dailyState);

  return getOrComputeNextAction();
}
