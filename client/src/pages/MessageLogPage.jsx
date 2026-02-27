import { useState } from 'react';
import { useMessages } from '../hooks/useMessages.js';
import { useEffect } from 'react';

export default function MessageLogPage() {
  const { messages, loading, fetchMessages } = useMessages();
  const [filterChannel, setFilterChannel] = useState('');
  const [filterRecipient, setFilterRecipient] = useState('');

  useEffect(() => {
    const params = {};
    if (filterChannel) params.channel = filterChannel;
    if (filterRecipient) params.recipient = filterRecipient;
    fetchMessages(params);
  }, [filterChannel, filterRecipient, fetchMessages]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Message Log</h2>

      <div className="flex gap-3 mb-4">
        <select
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
          className="text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-navy"
        >
          <option value="">All Channels</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
        <select
          value={filterRecipient}
          onChange={(e) => setFilterRecipient(e.target.value)}
          className="text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-navy"
        >
          <option value="">All Recipients</option>
          <option value="Jack">Jack</option>
          <option value="Charlie">Charlie</option>
          <option value="Perry">Perry</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No messages have been sent yet.</p>
          <p className="text-gray-300 text-xs mt-1">Send messages from the task detail view on the Board.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(msg.sent_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">{msg.recipient}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">
                      {msg.channel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {msg.task_id ? `#${msg.task_id}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{msg.body}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      msg.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {msg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
