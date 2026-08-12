import React, { useEffect, useState } from 'react';

interface SelfCareIdea {
  title: string;
  description: string;
  emoji: string;
}

const SELF_CARE_IDEAS: SelfCareIdea[] = [
  {
    title: "Plant Something",
    description: "Plant a tree, herb, flower, or small plant and give it a little care today.",
    emoji: "🌱"
  },
  {
    title: "Spend Time Around Trees",
    description: "Take a few quiet minutes outdoors and notice the trees, sky, and fresh air.",
    emoji: "🌳"
  },
  {
    title: "Care for a Plant",
    description: "Water a plant, remove a dry leaf, or simply spend a moment caring for it.",
    emoji: "🪴"
  },
  {
    title: "Clean a Small Outdoor Space",
    description: "Pick up a few pieces of litter around your home or street.",
    emoji: "🧹"
  },
  {
    title: "Make Space for Nature",
    description: "Put out clean water for birds or create a small welcoming spot for local wildlife.",
    emoji: "🐦"
  },
  {
    title: "Take a Greener Walk",
    description: "Walk somewhere nearby instead of taking a vehicle, if it is comfortable and safe.",
    emoji: "🚶"
  },
  {
    title: "Reuse Something Today",
    description: "Before throwing something away, see if you can reuse it in a new way.",
    emoji: "♻️"
  },
  {
    title: "Grow Something",
    description: "Try growing a small plant from seeds or kitchen scraps.",
    emoji: "🌿"
  },
  {
    title: "Have a Nature Moment",
    description: "Sit outside for five minutes without your phone and simply observe your surroundings.",
    emoji: "☀️"
  },
  {
    title: "Reduce One Small Waste",
    description: "Carry a reusable bottle, bag, or cup today.",
    emoji: "🌍"
  },
  {
    title: "Collect Nature Treasures",
    description: "Gather a few beautiful fallen leaves or unique stones and appreciate their natural shapes.",
    emoji: "🍂"
  },
  {
    title: "Watch the Clouds",
    description: "Spend a few minutes looking at the sky and letting your thoughts drift like clouds.",
    emoji: "☁️"
  },
  {
    title: "Take a Shorter Shower",
    description: "Save water and energy today by taking a slightly shorter, mindful shower.",
    emoji: "🚿"
  },
  {
    title: "Unplug Electronics",
    description: "Turn off or unplug one device that you aren't actively using to save power.",
    emoji: "🔌"
  },
  {
    title: "Let the Fresh Air In",
    description: "Open a window for ten minutes to cycle the air in your room naturally.",
    emoji: "🪟"
  },
  {
    title: "Dine by Natural Light",
    description: "Turn off the lights and enjoy a meal by natural window light or candlelight.",
    emoji: "🕯️"
  },
  {
    title: "Smells of Nature",
    description: "Step outside and breathe in the scents of flowers, soil, or fresh rain.",
    emoji: "🌸"
  },
  {
    title: "Enjoy Green Travel",
    description: "Ride a bicycle, walk, or jog to a local destination if the path is safe.",
    emoji: "🚲"
  },
  {
    title: "Say No to Single-Use",
    description: "Decline a plastic straw, cup lid, or wrapper during a purchase today.",
    emoji: "🥤"
  },
  {
    title: "Eat a Plant-Based Snack",
    description: "Enjoy a fresh piece of fruit or vegetable as a mindful, clean snack.",
    emoji: "🍎"
  },
  {
    title: "Follow an Insect",
    description: "Watch a ladybug, ant, or bee work for a minute and marvel at their focus.",
    emoji: "🐾"
  },
  {
    title: "Save Kitchen Water",
    description: "Collect the water used for washing vegetables and use it to water your plants.",
    emoji: "💧"
  },
  {
    title: "Map Your Local Park",
    description: "Walk in a nearby park and draw a simple mental map of your favorite quiet spots.",
    emoji: "🗺️"
  },
  {
    title: "Gaze at the Moon",
    description: "Spend a moment tonight looking at the moon or stars and enjoying the night sky.",
    emoji: "🌙"
  },
  {
    title: "Collect Nature Curiosities",
    description: "Find a unique stone, twig, or shell and place it on your desk as a grounding anchor.",
    emoji: "🐚"
  },
  {
    title: "Print Less Today",
    description: "Keep notes digital or read on-screen to save paper resources today.",
    emoji: "📜"
  },
  {
    title: "Use a Cloth Towel",
    description: "Dry your hands with a cloth towel instead of a paper towel today.",
    emoji: "🧺"
  },
  {
    title: "Listen to Rustling Leaves",
    description: "Sit near trees and listen to the sound of the wind blowing through the leaves.",
    emoji: "🌾"
  },
  {
    title: "Upcycle Cardboard",
    description: "Turn an empty cardboard box or shipping package into a useful organizer.",
    emoji: "📦"
  },
  {
    title: "Clean Mindfully",
    description: "Use a simple cloth or eco-friendly cleaner for a small clean-up today.",
    emoji: "🧽"
  },
  {
    title: "Walk on the Soil",
    description: "Mindfully step off the concrete and walk on grass or soil to connect with the earth.",
    emoji: "🐾"
  },
  {
    title: "Support Local Bees",
    description: "Learn about local flowers that bees love and consider adding some to your balcony or sill.",
    emoji: "🍯"
  }
];

export default function DailySelfCareCard() {
  const [currentIdea, setCurrentIdea] = useState<SelfCareIdea | null>(null);

  useEffect(() => {
    // Deterministic selection based on day of year to rotate once per day
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const index = dayOfYear % SELF_CARE_IDEAS.length;
    setCurrentIdea(SELF_CARE_IDEAS[index]);
  }, []);

  if (!currentIdea) {
    return (
      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF9F2] border border-[#F1E7D8]/80 rounded-[28px] p-5 text-left shadow-3xs relative overflow-hidden flex items-start gap-4 select-none animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#F1E7D8] flex items-center justify-center shrink-0 shadow-3xs" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF9F2] border border-[#F1E7D8]/80 rounded-[28px] p-5 text-left shadow-3xs relative overflow-hidden flex items-start gap-4 select-none">
      <div className="absolute -top-10 -right-6 w-24 h-24 bg-orange-100/20 rounded-full blur-xl" />
      <span className="w-12 h-12 rounded-2xl bg-white border border-[#F1E7D8] flex items-center justify-center text-[24px] shrink-0 shadow-3xs">
        {currentIdea.emoji}
      </span>
      <div className="space-y-1.5 flex-1 relative z-10">
        <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
          Daily Self-Care Idea
        </span>
        <h4 className="font-display font-black text-[#2B1D12] text-[16px] leading-tight animate-in fade-in duration-300">
          {currentIdea.title}
        </h4>
        <p className="text-[12px] text-gray-500 font-semibold leading-relaxed animate-in fade-in duration-300">
          {currentIdea.description}
        </p>
      </div>
    </div>
  );
}
