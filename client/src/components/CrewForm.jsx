import { useState } from 'react';

const CREW_COLORS = {
  Jack: 'border-crew-jack',
  Charlie: 'border-crew-charlie',
  Perry: 'border-crew-perry',
};

export default function CrewForm({ member, onSave }) {
  const [phone, setPhone] = useState(member.phone || '');
  const [email, setEmail] = useState(member.email || '');
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    onSave(member.id, { phone, email });
    setDirty(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${CREW_COLORS[member.name] || 'border-gray-300'} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
          <p className="text-sm text-gray-500">{member.role}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Phone (E.164)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setDirty(true); }}
            placeholder="+17185550100"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setDirty(true); }}
            placeholder="crew@example.com"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
        {dirty && (
          <button
            onClick={handleSave}
            className="bg-navy hover:bg-navy-light text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
