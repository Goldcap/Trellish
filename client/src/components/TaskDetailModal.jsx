import { useState } from 'react';
import { useMessages } from '../hooks/useMessages.js';
import MessageCompose from './MessageCompose.jsx';
import MessageHistory from './MessageHistory.jsx';

const STATUSES = ['todo', 'in_progress', 'blocked', 'done'];
const PRIORITIES = ['high', 'medium', 'low'];
const CREW = ['Jack', 'Charlie', 'Perry'];
const CATEGORIES = [
  'Electrical/Systems',
  'Mechanical/Engine',
  'Carpentry/Interior',
  'Paint/Finishes',
  'Fiberglass/Hull',
  'Canvas/Enclosure',
];

export default function TaskDetailModal({ task, onClose, onUpdate, onDelete }) {
  const [notes, setNotes] = useState(task.notes || '');
  const [tab, setTab] = useState('details');
  const { messages, loading: msgsLoading, sendSms, sendEmail } = useMessages(task.id);

  const handleFieldChange = (field, value) => {
    onUpdate(task.id, { [field]: value });
  };

  const handleNotesBlur = () => {
    if (notes !== (task.notes || '')) {
      onUpdate(task.id, { notes });
    }
  };

  const handleSendMessage = async ({ channel, to, taskId, subject, body }) => {
    if (channel === 'sms') return sendSms({ to, taskId, body });
    return sendEmail({ to, taskId, subject, body });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="modal-backdrop absolute inset-0 bg-black/30" />
      <div
        className="modal-panel relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-start justify-between">
          <div className="flex-1 mr-3">
            <h2 className="text-lg font-bold text-gray-900">{task.task}</h2>
            <p className="text-xs text-gray-500 mt-0.5">#{task.id} &middot; {task.category}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-5">
          <button
            onClick={() => setTab('details')}
            className={`py-2 px-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'details' ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`py-2 px-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'messages' ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Messages
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === 'details' ? (
            <div className="space-y-4">
              <Field label="Status">
                <select
                  value={task.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-navy"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </Field>

              <Field label="Priority">
                <select
                  value={task.priority}
                  onChange={(e) => handleFieldChange('priority', e.target.value)}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-navy"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>

              <Field label="Assignee">
                <select
                  value={task.assigned}
                  onChange={(e) => handleFieldChange('assigned', e.target.value)}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-navy"
                >
                  {CREW.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Category">
                <select
                  value={task.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-navy"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Notes">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy resize-none"
                  placeholder="Add notes..."
                />
              </Field>

              {task.date_started && (
                <p className="text-xs text-gray-500">Started: {new Date(task.date_started).toLocaleDateString()}</p>
              )}
              {task.date_completed && (
                <p className="text-xs text-gray-500">Completed: {new Date(task.date_completed).toLocaleDateString()}</p>
              )}

              <button
                onClick={() => { if (confirm('Delete this task?')) onDelete(task.id); }}
                className="text-sm text-red-500 hover:text-red-700 mt-4"
              >
                Delete task
              </button>
            </div>
          ) : (
            <div>
              <MessageCompose task={task} onSend={handleSendMessage} />
              <MessageHistory messages={messages} loading={msgsLoading} />
            </div>
          )}
        </div>
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
