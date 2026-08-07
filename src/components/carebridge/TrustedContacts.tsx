import React, { useState } from 'react';

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  avatar: string;
}

interface TrustedContactsProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onEditContact: (contact: Contact) => void;
  onRemoveContact: (id: string) => void;
}

const AVATARS = ['👩', '👨', '🧑', '👴', '👵', '👩‍🦰', '👨‍🦱', '👱‍♀️', '👱‍♂️'];

export default function TrustedContacts({
  contacts,
  onAddContact,
  onEditContact,
  onRemoveContact
}: TrustedContactsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('👩');

  const handleOpenAdd = () => {
    setName('');
    setRelationship('');
    setPhone('');
    setEmail('');
    setAvatar('👩');
    setEditingContact(null);
    setShowAddForm(true);
  };

  const handleOpenEdit = (c: Contact) => {
    setName(c.name);
    setRelationship(c.relationship);
    setPhone(c.phone || '');
    setEmail(c.email || '');
    setAvatar(c.avatar || '👩');
    setEditingContact(c);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) return;

    if (editingContact) {
      onEditContact({
        id: editingContact.id,
        name: name.trim(),
        relationship: relationship.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        avatar
      });
    } else {
      onAddContact({
        name: name.trim(),
        relationship: relationship.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        avatar
      });
    }

    // Reset
    setName('');
    setRelationship('');
    setPhone('');
    setEmail('');
    setAvatar('👩');
    setEditingContact(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Trusted Contacts
        </h3>
        <button
          onClick={handleOpenAdd}
          type="button"
          className="py-1.5 px-4 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[11.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          {showAddForm ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 space-y-4 shadow-3xs">
          <h4 className="font-display font-black text-[#2B1D12] text-[14.5px]">
            {editingContact ? 'Edit Trusted Contact' : 'New Trusted Contact'}
          </h4>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emily Smith"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Relationship
            </label>
            <input
              type="text"
              required
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Sister, Best Friend, Spouse"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 555-0199"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. emily@example.com"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Choose Avatar
            </span>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[20px] cursor-pointer transition-all active:scale-90 ${
                    avatar === emoji ? 'bg-orange-50 border-[#FF7527]' : 'bg-white border-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
          >
            {editingContact ? 'Save Changes' : 'Add to Circle'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[148px] hover:border-[#FFB27A]/35 transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex gap-3.5">
                <span className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[26px] shrink-0 select-none">
                  {c.avatar || '👩'}
                </span>
                <div>
                  <span className="block font-display font-black text-[#2B1D12] text-[15px] leading-tight">
                    {c.name}
                  </span>
                  <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    {c.relationship}
                  </span>
                </div>
              </div>

              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(c)}
                  type="button"
                  className="text-gray-400 hover:text-[#FF7527] text-xs font-bold p-1 cursor-pointer"
                  title="Edit contact"
                >
                  ✎
                </button>
                <button
                  onClick={() => onRemoveContact(c.id)}
                  type="button"
                  className="text-gray-400 hover:text-red-500 text-xs font-bold p-1 cursor-pointer"
                  title="Delete contact"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-0.5 text-[11.5px] text-gray-500 font-semibold pt-3 border-t border-gray-50 mt-3 leading-relaxed">
              {c.phone && <div className="truncate">📞 {c.phone}</div>}
              {c.email && <div className="truncate">✉ {c.email}</div>}
              {!c.phone && !c.email && <div className="italic text-gray-450">No phone or email listed</div>}
            </div>
          </div>
        ))}

        {contacts.length === 0 && !showAddForm && (
          <div className="col-span-1 sm:col-span-2 text-center py-8 text-gray-400 font-semibold text-[13px]">
            No trusted contacts yet.
          </div>
        )}
      </div>
    </div>
  );
}
