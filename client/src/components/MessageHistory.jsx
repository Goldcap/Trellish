export default function MessageHistory({ messages, loading }) {
  if (loading) return <p className="text-xs text-gray-400 py-2">Loading messages...</p>;
  if (messages.length === 0) return <p className="text-xs text-gray-400 py-2">No messages sent for this task.</p>;

  return (
    <div className="border-t pt-3 mt-3">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Message History</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-50 rounded-lg p-2.5 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-700">
                {msg.channel.toUpperCase()} to {msg.recipient}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                msg.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {msg.status}
              </span>
            </div>
            <p className="text-gray-600 line-clamp-2">{msg.body}</p>
            <p className="text-gray-400 mt-1">{new Date(msg.sent_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
