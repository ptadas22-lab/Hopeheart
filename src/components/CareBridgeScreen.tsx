import React, { useState, useEffect } from 'react';
import CareBridgeHome from './carebridge/CareBridgeHome';
import TrustedContacts, { Contact } from './carebridge/TrustedContacts';
import InviteContactCard from './carebridge/InviteContactCard';
import WellnessCheckIns from './carebridge/WellnessCheckIns';
import SafetyPlanCard, { SafetyPlan } from './carebridge/SafetyPlanCard';
import EmergencyContacts, { EmergencyContact } from './carebridge/EmergencyContacts';
import SupportPreferences, { SupportPrefState } from './carebridge/SupportPreferences';

interface CareBridgeScreenProps {
  onBack: () => void;
}

const loadLocalData = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const DEFAULT_PREFS: SupportPrefState = {
  shareMoods: false,
  shareJournals: false,
  shareMilestones: false,
  shareGratitude: false,
  shareNothing: true
};

export default function CareBridgeScreen({ onBack }: CareBridgeScreenProps) {
  const [isStarted, setIsStarted] = useState(() => {
    // Show home intro if no trusted contacts have been added yet
    const saved = localStorage.getItem('hopeheart_trusted_contacts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return true;
      } catch (e) {}
    }
    return false;
  });

  // State managers
  const [trustedContacts, setTrustedContacts] = useState<Contact[]>(() =>
    loadLocalData<Contact[]>('hopeheart_trusted_contacts', [])
  );
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() =>
    loadLocalData<EmergencyContact[]>('hopeheart_emergency_contacts', [])
  );

  const [preferences, setPreferences] = useState<SupportPrefState>(() =>
    loadLocalData<SupportPrefState>('hopeheart_support_preferences', DEFAULT_PREFS)
  );

  const [sharingFrequency, setSharingFrequency] = useState(() => {
    return localStorage.getItem('hopeheart_sharing_frequency') || 'only-choose';
  });

  // Contacts handlers
  const handleAddTrustedContact = (c: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...c,
      id: 'tc-' + Date.now()
    };
    const updated = [...trustedContacts, newContact];
    setTrustedContacts(updated);
    localStorage.setItem('hopeheart_trusted_contacts', JSON.stringify(updated));
  };

  const handleEditTrustedContact = (updatedContact: Contact) => {
    const updated = trustedContacts.map((c) => (c.id === updatedContact.id ? updatedContact : c));
    setTrustedContacts(updated);
    localStorage.setItem('hopeheart_trusted_contacts', JSON.stringify(updated));
  };

  const handleRemoveTrustedContact = (id: string) => {
    const updated = trustedContacts.filter((c) => c.id !== id);
    setTrustedContacts(updated);
    localStorage.setItem('hopeheart_trusted_contacts', JSON.stringify(updated));
  };

  // Emergency handlers
  const handleAddEmergencyContact = (c: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...c,
      id: 'ec-' + Date.now()
    };
    const updated = [...emergencyContacts, newContact];
    setEmergencyContacts(updated);
    localStorage.setItem('hopeheart_emergency_contacts', JSON.stringify(updated));
  };

  const handleEditEmergencyContact = (updatedContact: EmergencyContact) => {
    const updated = emergencyContacts.map((c) => (c.id === updatedContact.id ? updatedContact : c));
    setEmergencyContacts(updated);
    localStorage.setItem('hopeheart_emergency_contacts', JSON.stringify(updated));
  };

  const handleRemoveEmergencyContact = (id: string) => {
    const updated = emergencyContacts.filter((c) => c.id !== id);
    setEmergencyContacts(updated);
    localStorage.setItem('hopeheart_emergency_contacts', JSON.stringify(updated));
  };

  // Save actions
  const handleChangePreferences = (nextPrefs: SupportPrefState) => {
    setPreferences(nextPrefs);
    localStorage.setItem('hopeheart_support_preferences', JSON.stringify(nextPrefs));
  };

  const handleChangeFrequency = (freq: string) => {
    setSharingFrequency(freq);
    localStorage.setItem('hopeheart_sharing_frequency', freq);
  };

  const handleSaveSafetyPlan = (plan: SafetyPlan) => {
    localStorage.setItem('hopeheart_safety_plan', JSON.stringify(plan));
  };

  const handleHeaderBack = () => {
    if (isStarted && trustedContacts.length === 0) {
      setIsStarted(false);
    } else {
      onBack();
    }
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full animate-in fade-in duration-300">
        <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
          <button
            onClick={onBack}
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
            aria-label="Back to dashboard"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">CareBridge</span>
          <span className="text-[20px] select-none">🌉</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <CareBridgeHome onStart={() => setIsStarted(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={handleHeaderBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label="Back"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          CareBridge Hub
        </span>
        <span className="text-[20px] select-none">🌉</span>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-28 sm:pb-10 space-y-7">
        {/* Support Preferences */}
        <SupportPreferences
          preferences={preferences}
          onChangePreferences={handleChangePreferences}
        />

        {/* Sharing Frequency scheduler */}
        <WellnessCheckIns
          frequency={sharingFrequency}
          onChangeFrequency={handleChangeFrequency}
        />

        {/* Manage Trusted Contacts */}
        <TrustedContacts
          contacts={trustedContacts}
          onAddContact={handleAddTrustedContact}
          onEditContact={handleEditTrustedContact}
          onRemoveContact={handleRemoveTrustedContact}
        />

        {/* Invite Contact Preview */}
        <InviteContactCard />

        {/* Safety Plan Form */}
        <SafetyPlanCard onSavePlan={handleSaveSafetyPlan} />

        {/* Emergency Contacts registry */}
        <EmergencyContacts
          contacts={emergencyContacts}
          onAddContact={handleAddEmergencyContact}
          onEditContact={handleEditEmergencyContact}
          onRemoveContact={handleRemoveEmergencyContact}
        />
      </div>
    </div>
  );
}
export { CareBridgeScreen };
