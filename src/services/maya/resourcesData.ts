export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'exercise';
  description: string;
  moods: string[];
  screen: string;
  content?: string[];
  readTime?: string;
  icon?: string;
  color?: string;
}

export const HOPEHEART_RESOURCES: Resource[] = [
  {
    id: 'managing-anxiety',
    title: 'Managing Anxiety',
    type: 'article',
    description: 'Learn to slow down racing thoughts and center yourself.',
    moods: ['anxious', 'overwhelmed'],
    screen: 'DoctorSuggestions',
    readTime: '3 min read',
    icon: '💛',
    color: 'bg-amber-100 text-amber-700',
    content: [
      "Anxiety is a natural defense mechanism that sometimes becomes overly sensitive. When your system senses danger—even if it is just a stressful email or a busy room—it goes into high alert.",
      "When you notice racing thoughts, a pounding chest, or shallow breaths, remind yourself: 'My body is trying to protect me, but I am safe right now.' Resisting anxiety often makes it feel stronger. Instead, try to sit with the physical sensations and let them peak and fade naturally.",
      "You don't need to fix your feelings or solve your worries right this second. Drop your shoulders, unclamp your jaw, and take three slow, long exhalations. Your body knows how to calm itself if you give it time."
    ]
  },
  {
    id: 'coping-stress',
    title: 'Coping with Stress',
    type: 'article',
    description: 'Empathetic strategies to manage daily pressure.',
    moods: ['low', 'sad', 'tired', 'hurt', 'need-support'],
    screen: 'DoctorSuggestions',
    readTime: '4 min read',
    icon: '🌱',
    color: 'bg-emerald-100 text-emerald-700',
    content: [
      "Stress occurs when the demands placed on us exceed our capacity to handle them. Over time, chronic stress can leave us feeling depleted and disconnected.",
      "Coping with stress begins with a simple question: 'What can wait?' Often, we carry invisible weights that do not belong to today. Make a list of everything on your mind, then cross off everything that does not require immediate attention.",
      "Give yourself permission to do less. Step away from your tasks, stretch your body, and take a short walk. Productive rest is not earned—it is a basic human need. You are allowed to take up space without performing."
    ]
  },
  {
    id: 'better-sleep',
    title: 'Better Sleep',
    type: 'article',
    description: 'Calming wind-down rituals for restful nights.',
    moods: ['tired', 'low'],
    screen: 'DoctorSuggestions',
    readTime: '3 min read',
    icon: '😴',
    color: 'bg-indigo-100 text-indigo-700',
    content: [
      "Sleep is the ultimate form of physical and emotional recovery. However, drifting off can be difficult when our brains are still processing the day.",
      "Create a clear border between day and night. Try to put away screens at least 30 minutes before sleep, as blue light signals to your brain that it is still daytime. Instead, engage in quiet activities like reading a book, listening to soft ambient sounds, or writing down tomorrow's list on paper.",
      "If you find yourself lying awake with racing thoughts, do not force yourself to sleep. Instead, focus entirely on breathing out slowly. Exhaling activates the parasympathetic nervous system, easing your heart rate and preparing your body for rest."
    ]
  },
  {
    id: 'emotional-awareness',
    title: 'Emotional Awareness',
    type: 'article',
    description: 'Notice and validate your feelings without judgment.',
    moods: ['okay', 'sad', 'lonely', 'need-support'],
    screen: 'DoctorSuggestions',
    readTime: '2 min read',
    icon: '🧠',
    color: 'bg-purple-100 text-purple-700',
    content: [
      "Emotional awareness is the simple yet profound practice of noticing what you are feeling as it happens.",
      "Instead of trying to change or fix a heavy mood, try simply naming it: 'I feel tired,' 'I feel low,' or 'I feel anxious.' Naming the feeling shifts your brain's response from reactive to observational. It reminds you that you are the observer, not the emotion itself.",
      "All emotions are temporary visitors. They arrive, stay for a while, and eventually depart. You do not need to push them away. Let them flow through you like clouds passing in a wide, calm sky."
    ]
  },
  {
    id: 'self-compassion',
    title: 'Self Compassion',
    type: 'article',
    description: 'Be kind to yourself in times of change and difficulty.',
    moods: ['hopeful', 'low', 'sad', 'hurt', 'lonely'],
    screen: 'DoctorSuggestions',
    readTime: '3 min read',
    icon: '❤️',
    color: 'bg-rose-100 text-rose-700',
    content: [
      "Self-compassion means treating yourself with the same warmth, care, and understanding that you would offer to a dear friend who is going through a hard time.",
      "When we make mistakes or feel low, we often default to self-criticism. We tell ourselves we should be stronger or doing better. But healing requires kindness, not criticism. The next time things feel hard, say to yourself: 'This is a moment of struggle. I am doing my best, and that is enough.'",
      "You do not have to be perfect to be worthy of love and comfort. Breathe in comfort, and breathe out self-judgment."
    ]
  },
  {
    id: 'healthy-habits',
    title: 'Building Healthy Habits',
    type: 'article',
    description: 'Small, incremental steps to build lasting daily routines.',
    moods: ['hopeful', 'calm', 'okay', 'need-support'],
    screen: 'DoctorSuggestions',
    readTime: '5 min read',
    icon: '🌞',
    color: 'bg-orange-100 text-orange-700',
    content: [
      "Routines and habits anchor our days, providing a sense of stability and control during chaotic times.",
      "The secret to building lasting habits is starting incredibly small. Do not try to overhaul your entire life in one day. Focus on micro-habits: drink one glass of water on waking, do two minutes of stretching, or write down one positive thought before bed.",
      "Stack your new habit on top of an existing routine (e.g. 'After I make my morning tea, I will take three deep breaths'). Over time, these small actions compound, creating a solid foundation of daily well-being."
    ]
  },
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    type: 'exercise',
    description: 'Inhale, hold, exhale to center yourself.',
    moods: ['anxious', 'overwhelmed', 'hurt', 'need-support'],
    screen: 'Breathing',
    icon: '🌬'
  },
  {
    id: 'grounding',
    title: 'Grounding (5-4-3-2-1)',
    type: 'exercise',
    description: 'Connect with your immediate surroundings.',
    moods: ['anxious', 'overwhelmed', 'lonely'],
    screen: 'Grounding',
    icon: '🧘'
  },
  {
    id: 'break-timer',
    title: 'Take a Short Break',
    type: 'exercise',
    description: 'Take 1, 3, or 5 minutes just to pause.',
    moods: ['calm', 'okay', 'low', 'overwhelmed', 'tired', 'hurt'],
    screen: 'BreakTimer',
    icon: '☕'
  },
  {
    id: 'calm-sounds',
    title: 'Calm Sounds',
    type: 'exercise',
    description: 'Listen to ambient, relaxing soundscapes.',
    moods: ['hopeful', 'calm', 'tired', 'lonely'],
    screen: 'CalmSounds',
    icon: '🎵'
  }
];

const byId = (id: string) => {
  const found = HOPEHEART_RESOURCES.find(r => r.id === id);
  if (!found) throw new Error(`Resource ${id} not found`);
  return {
    id: found.id,
    title: found.title,
    type: found.type,
    icon: found.icon || '🌼',
    description: found.description
  };
};

export const RECOMMENDATIONS_MAP: Record<string, any[]> = {
  hopeful: [byId('self-compassion'), byId('healthy-habits'), byId('calm-sounds')],
  calm: [byId('healthy-habits'), byId('break-timer'), byId('calm-sounds')],
  okay: [byId('emotional-awareness'), byId('break-timer'), byId('healthy-habits')],
  low: [byId('self-compassion'), byId('coping-stress'), byId('break-timer')],
  anxious: [byId('breathing'), byId('grounding'), byId('managing-anxiety')],
  overwhelmed: [byId('grounding'), byId('break-timer'), byId('breathing')],
  sad: [byId('self-compassion'), byId('coping-stress'), byId('emotional-awareness')],
  tired: [byId('better-sleep'), byId('break-timer'), byId('calm-sounds')],
  hurt: [byId('self-compassion'), byId('coping-stress'), byId('break-timer')],
  lonely: [byId('self-compassion'), byId('emotional-awareness'), byId('calm-sounds')],
  'need-support': [byId('coping-stress'), byId('emotional-awareness'), byId('breathing')]
};
