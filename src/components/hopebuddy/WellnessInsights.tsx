import React, { useEffect, useState } from 'react';

export default function WellnessInsights() {
  const [checkinsCount, setCheckinsCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);

  useEffect(() => {
    try {
      const localCount = localStorage.getItem('hopeheart_checkin_count');
      setCheckinsCount(localCount ? parseInt(localCount, 10) : 0);

      const journals = localStorage.getItem('hopeheart_journal') || localStorage.getItem('hopeheart_private_diary');
      if (journals) {
        setJournalCount(JSON.parse(journals).length);
      }

      const favorites = localStorage.getItem('hopeheart_favorite_resources');
      if (favorites) {
        setFavoritesCount(JSON.parse(favorites).length);
      }

      const contacts = localStorage.getItem('hopeheart_trusted_contacts');
      if (contacts) {
        setContactsCount(JSON.parse(contacts).length);
      }
    } catch (e) {}
  }, []);

  const getInsights = () => {
    const list: string[] = [];

    if (checkinsCount >= 3) {
      list.push("You've checked in regularly this week. Pausing to recognize your feelings is a healthy foundation.");
    } else {
      list.push("Keep taking small moments to log your mood when it feels safe to do so.");
    }

    if (journalCount > 0) {
      list.push(`You've written ${journalCount} journal ${journalCount === 1 ? 'entry' : 'entries'}. Putting feelings into words helps process thoughts.`);
    }

    if (favoritesCount > 0) {
      list.push("You often check saved comfort resources. Keeping comforting tools nearby is a great coping tactic.");
    }

    if (contactsCount > 0) {
      list.push("You've connected trusted contacts to CareBridge. Involving supporters is a powerful strength.");
    }

    return list;
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
          Wellness Insights
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Warm, local indicators based on your self-care check-ins. No diagnostics.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFFBF0] border border-[#F1E7D8]/80 rounded-[28px] p-5.5 space-y-3.5 shadow-3xs">
        {getInsights().map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 text-[13px] text-gray-600 font-semibold leading-relaxed">
            <span className="text-[#FF7527] text-[16px] shrink-0 pt-0.5">🌱</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
