import { useState } from 'react';
import toast from 'react-hot-toast';

export default function MessageCompose({ task, onSend }) {
  const [channel, setChannel] = useState('sms');
  const [to, setTo] = useState(task?.assigned || 'ALL');
  const [body, setBody] = useState(`[Das Boot] Task: ${task?.task || ''} — `);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!body.trim()) return toast.error('Message body is required');
    setSending(true);
    try {
      const results = await onSend({
        channel,
        to,
        taskId: task?.id,
        subject: `[Das Boot] ${task?.task || 'Update'}`,
        body: body.trim(),
      });
      const failed = results.filter((r) => r.status === 'failed');
      if (failed.length > 0) {
        toast.error(`${failed.length} message(s) failed: ${failed[0].error}`);
      } else {
        toast.success(`${channel.toUpperCase()} sent to ${to}`);
      }
      setBody(`[Das Boot] Task: ${task?.task || ''} — `);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t pt-3 mt-3 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Send Message</h4>
      <div className="flex gap-2">
        <button
          onClick={() => setChannel('sms')}
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            channel === 'sms' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          SMS
        </button>
        <button
          onClick={() => setChannel('email')}
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            channel === 'email' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Email
        </button>
      </div>
      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-navy"
      >
        <option value="ALL">ALL Crew</option>
        <option value="Jack">Jack</option>
        <option value="Charlie">Charlie</option>
        <option value="Perry">Perry</option>
      </select>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-navy resize-none"
      />
      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full bg-navy hover:bg-navy-light text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50 transition-colors"
      >
        {sending ? 'Sending...' : `Send ${channel.toUpperCase()}`}
      </button>
    </div>
  );
}
