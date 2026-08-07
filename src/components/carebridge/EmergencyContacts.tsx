import React, { useState } from 'react';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onEditContact: (contact: EmergencyContact) => void;
  onRemoveContact: (id: string) => void;
}

export default function EmergencyContacts({
  contacts,
  onAddContact,
  onEditContact,
  onRemoveContact
}: EmergencyContactsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setRelationship('');
    setPhone('');
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (c: EmergencyContact) => {
    setName(c.name);
    setRelationship(c.relationship);
    setPhone(c.phone);
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim() || !phone.trim()) return;

    if (editingId) {
      onEditContact({
        id: editingId,
        name: name.trim(),
        relationship: relationship.trim(),
        phone: phone.trim()
      });
    } else {
      onAddContact({
        name: name.trim(),
        relationship: relationship.trim(),
        phone: phone.trim()
      });
    }

    // Reset
    setName('');
    setRelationship('');
    setPhone('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Emergency Contacts
        </h3>
        <button
          onClick={handleOpenAdd}
          type="button"
          className="py-1.5 px-4 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[11.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          {showForm ? 'Cancel' : 'Add Number'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 space-y-4 shadow-3xs">
          <h4 className="font-display font-black text-[#2B1D12] text-[14.5px]">
            {editingId ? 'Edit Emergency Contact' : 'New Emergency Contact'}
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
              placeholder="e.g. Local Hospital, Doctor Green"
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
              placeholder="e.g. Clinic, Relative, Support Line"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 555-0155"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
          >
            {editingId ? 'Save Contact' : 'Save Emergency Contact'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-[#FEF6F5] border border-red-100 rounded-[24px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[128px] relative group hover:border-red-300 transition-all"
          >
            <button
              onClick={() => onRemoveContact(c.id)}
              type="button"
              className="absolute right-4 top-4 w-6 h-6 rounded-full hover:bg-red-100 text-red-400 hover:text-red-655 flex items-center justify-center text-[11px] font-black opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Delete emergency contact"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-red-900 text-[15px] leading-tight truncate">
                  {c.name}
                </span>
                <button
                  onClick={() => handleOpenEdit(c)}
                  type="button"
                  className="text-red-500 hover:text-red-700 text-[11px] font-bold p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Edit"
                >
                  ✎
                </button>
              </div>
              <span className="text-[10px] font-mono font-extrabold text-red-700 uppercase tracking-wider block">
                {c.relationship}
              </span>
            </div>

            <div className="pt-2 border-t border-red-100/60 mt-3 flex items-center justify-between">
              <span className="text-[13px] font-mono font-black text-[#2B1D12]">
                📞 {c.phone}
              </span>
              <a
                href={`tel:${c.phone}`}
                className="py-1 px-3 bg-red-600 text-white rounded-lg text-[10px] font-display font-black hover:bg-red-700 transition-all"
              >
                Call
              </a>
            </div>
          </div>
        ))}

        {contacts.length === 0 && !showForm && (
          <div className="col-span-1 sm:col-span-2 text-center py-8 text-red-400 font-semibold text-[13px]">
            No emergency contacts saved. Add vital contact numbers here.
          </div>
        )}
      </div>
    </div>
  );
}
