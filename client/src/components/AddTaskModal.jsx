import { useState } from 'react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Electrical/Systems',
  'Mechanical/Engine',
  'Carpentry/Interior',
  'Paint/Finishes',
  'Fiberglass/Hull',
  'Canvas/Enclosure',
];
const CREW = ['Jack', 'Charlie', 'Perry'];
const PRIORITIES = ['high', 'medium', 'low'];

export default function AddTaskModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    task: '',
    category: CATEGORIES[0],
    assigned: CREW[0],
    priority: 'medium',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.task.trim()) return toast.error('Task name is required');
    setSaving(true);
    try {
      await onCreate(form);
      toast.success('Task created');
      onClose();
    } catch {
      toast.error('Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="modal-backdrop absolute inset-0 bg-black/30" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Add Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Task Name">
            <input
              value={form.task}
              onChange={set('task')}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy"
              placeholder="e.g. Replace bilge pump"
              autoFocus
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={form.category} onChange={set('category')} className="w-full border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-navy">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Assignee">
              <select value={form.assigned} onChange={set('assigned')} className="w-full border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-navy">
                {CREW.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Priority">
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p }))}
                  className={`flex-1 text-sm py-1.5 rounded-lg font-medium capitalize transition-colors ${
                    form.priority === p
                      ? p === 'high' ? 'bg-red-100 text-red-700 ring-1 ring-red-300'
                      : p === 'medium' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                      : 'bg-green-100 text-green-700 ring-1 ring-green-300'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Notes (optional)">
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy resize-none"
              placeholder="Any details..."
            />
          </Field>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
