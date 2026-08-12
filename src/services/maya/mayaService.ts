import { MAYA_SYSTEM_INSTRUCTIONS } from './mayaConfig';

export interface MoodContext {
  currentMoodId: string; // calm, sad, anxious, hurt, lonely, need-support, hopeful, tired
  checkedInToday: boolean;
}

export interface StoredMessage {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  timestamp: string;
}

export interface MayaResponse {
  responseText: string;
  recommendedResourceIds: string[]; // List of existing resource IDs (e.g. 'c1', 'breathing', 'self-compassion')
}

/**
 * Central service function to send a message to Maya.
 * Calls the production n8n webhook and falls back to deterministic responses if unreachable.
 */
export async function sendMessageToMaya(
  userText: string,
  currentMoodId: string,
  history: StoredMessage[]
): Promise<MayaResponse> {
  const lowerText = userText.toLowerCase();

  // 1. Safety check
  const safetyKeywords = ['suicide', 'kill myself', 'harm myself', 'end my life', 'want to die'];
  if (safetyKeywords.some(keyword => lowerText.includes(keyword))) {
    return {
      responseText: "I care about your safety deeply. Please connect with someone who can support you right now. You can check the crisis hotline section or call emergency services.",
      recommendedResourceIds: ['crisis']
    };
  }

  // 2. Clinical/Prescription check
  const clinicalKeywords = ['paracetamol', 'xanax', 'prozac', 'prescription', 'dosage', 'diagnose', 'medicine'];
  if (clinicalKeywords.some(keyword => lowerText.includes(keyword))) {
    return {
      responseText: "I want to support you, but I cannot recommend medications or offer clinical advice. Avoid self-medication and use medicines only as directed by a healthcare professional.",
      recommendedResourceIds: ['c9'] // Mindful Medicine safety challenge
    };
  }

  // Helper for generating local fallback responses
  const getFallbackResponse = (): MayaResponse => {
    let responseText = "";
    let recommendedResourceIds: string[] = [];

    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      responseText = "Hello! I'm glad you reached out. I'm right here beside you. How has your day been feeling?";
      recommendedResourceIds = ['healthy-habits'];
    } else if (lowerText.includes('stress') || lowerText.includes('work') || lowerText.includes('busy') || lowerText.includes('exam')) {
      responseText = "It sounds like you have a lot on your plate. Remember, taking a small pause is a healthy habit too. How about we try a quick break timer session together?";
      recommendedResourceIds = ['break-timer', 'coping-stress'];
    } else if (lowerText.includes('anxious') || lowerText.includes('panic') || lowerText.includes('scared') || lowerText.includes('fear')) {
      responseText = "I can hear how heavy that feels. Let's take a slow breath. Inhale for four seconds... hold... and release. Would a short breathing guide help center you right now?";
      recommendedResourceIds = ['breathing', 'managing-anxiety'];
    } else {
      switch (currentMoodId.toLowerCase()) {
        case 'anxious':
          responseText = "I notice you checked in feeling anxious today. Remember that physical sensations of stress pass in time. Let's go slowly.";
          recommendedResourceIds = ['breathing', 'managing-anxiety'];
          break;
        case 'tired':
          responseText = "It sounds like your body is asking for some rest. I'm happy to keep you quiet company. Sleep well tonight.";
          recommendedResourceIds = ['better-sleep', 'calm-sounds'];
          break;
        case 'sad':
          responseText = "I'm listening. Thank you for sharing this with me. Remember to treat yourself with self-compassion today.";
          recommendedResourceIds = ['self-compassion', 'emotional-awareness'];
          break;
        case 'lonely':
          responseText = "I'm here with you. Connecting with our own emotions is a gentle first step, but quiet support rooms are open too.";
          recommendedResourceIds = ['emotional-awareness', 'community'];
          break;
        default:
          responseText = "Thank you for sharing that. I'm always here to listen and help you take the next small step. What feels most helpful for you right now?";
          recommendedResourceIds = ['healthy-habits'];
          break;
      }
    }
    return { responseText, recommendedResourceIds };
  };

  // Try communicating with n8n webhook
  try {
    const userId = localStorage.getItem('hopeheart_guest_session_id') ||
                   localStorage.getItem('hopeheart_home_guest_id') ||
                   'guest_anonymous';

    const response = await fetch('https://hopeheart.app.n8n.cloud/webhook/maya', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userText,
        mood: currentMoodId,
        userId: userId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let replyText = '';

    if (typeof data === 'string') {
      replyText = data;
    } else if (data) {
      replyText = data.response || data.text || data.message || data.output || (data.data && data.data.text) || '';
    }

    if (!replyText && data) {
      const stringValues = Object.values(data).filter(v => typeof v === 'string');
      if (stringValues.length > 0) {
        replyText = stringValues[0] as string;
      }
    }

    if (!replyText) {
      throw new Error('Empty response envelope from n8n webhook');
    }

    // Heuristically map recommendations based on n8n reply content
    let recommendedResourceIds: string[] = [];
    const lowerReply = replyText.toLowerCase();
    if (lowerReply.includes('breath') || lowerReply.includes('inhale')) {
      recommendedResourceIds = ['breathing'];
    } else if (lowerReply.includes('ground') || lowerReply.includes('5-4-3-2-1')) {
      recommendedResourceIds = ['grounding'];
    } else if (lowerReply.includes('sleep') || lowerReply.includes('night')) {
      recommendedResourceIds = ['better-sleep'];
    } else if (lowerReply.includes('habit') || lowerReply.includes('routine')) {
      recommendedResourceIds = ['healthy-habits'];
    } else {
      recommendedResourceIds = getFallbackResponse().recommendedResourceIds;
    }

    return {
      responseText: replyText,
      recommendedResourceIds
    };
  } catch (error) {
    console.warn('[Maya API] Failed to connect to n8n backend, using fallback:', error);
    return getFallbackResponse();
  }
}

export { MAYA_SYSTEM_INSTRUCTIONS };
