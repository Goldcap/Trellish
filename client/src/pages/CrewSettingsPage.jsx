import { useCrew } from '../hooks/useCrew.js';
import CrewForm from '../components/CrewForm.jsx';

export default function CrewSettingsPage() {
  const { crew, loading, updateCrew } = useCrew();

  if (loading) {
    return <div className="p-6 text-gray-400 text-sm">Loading crew...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Crew Settings</h2>
      <div className="space-y-4">
        {crew.map((member) => (
          <CrewForm key={member.id} member={member} onSave={updateCrew} />
        ))}
      </div>
    </div>
  );
}
