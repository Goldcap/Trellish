import { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks.js';
import { useCategories } from '../hooks/useCategories.js';

const STATUS_COLORS = {
  todo: '#9ca3af',
  in_progress: '#3b82f6',
  blocked: '#ef4444',
  done: '#22c55e',
};

const ROW_H = 36;
const HEADER_H = 56;
const LABEL_W = 260;
const DAY_W = 32;

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function GanttPage() {
  const { tasks, loading, updateTask } = useTasks();
  const { categories } = useCategories();
  const [filterAssigned, setFilterAssigned] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const catColorMap = useMemo(() => {
    const m = {};
    for (const c of categories) m[c.name] = c.color;
    return m;
  }, [categories]);

  // Filter tasks
  const filtered = useMemo(() => {
    let t = tasks.filter((tk) => tk.start_date && tk.etd_days);
    if (filterAssigned) t = t.filter((tk) => tk.assigned === filterAssigned);
    if (filterCategory) t = t.filter((tk) => tk.category === filterCategory);
    t.sort((a, b) => a.start_date.localeCompare(b.start_date));
    return t;
  }, [tasks, filterAssigned, filterCategory]);

  // Compute timeline range
  const { startDate, totalDays, weeks } = useMemo(() => {
    if (filtered.length === 0) return { startDate: new Date(), totalDays: 30, weeks: [] };

    let earliest = new Date(filtered[0].start_date);
    let latest = earliest;
    for (const t of filtered) {
      const s = new Date(t.start_date);
      const e = addDays(t.start_date, t.etd_days);
      if (s < earliest) earliest = s;
      if (e > latest) latest = e;
    }

    // Pad a few days on each side
    const padded = new Date(earliest);
    padded.setDate(padded.getDate() - 2);
    const paddedEnd = new Date(latest);
    paddedEnd.setDate(paddedEnd.getDate() + 3);
    const total = daysBetween(padded, paddedEnd);

    // Generate week markers
    const wks = [];
    const cur = new Date(padded);
    // Align to Monday
    cur.setDate(cur.getDate() - ((cur.getDay() + 6) % 7));
    while (cur <= paddedEnd) {
      const offset = daysBetween(padded, cur);
      wks.push({ date: new Date(cur), offset });
      cur.setDate(cur.getDate() + 7);
    }

    return { startDate: padded, totalDays: total, weeks: wks };
  }, [filtered]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOffset = daysBetween(startDate, today);

  const unscheduled = tasks.filter((t) => !t.start_date || !t.etd_days);

  if (loading) {
    return <div className="p-6 text-gray-400 text-sm">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-52px)]">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white border-b">
        <select
          value={filterAssigned}
          onChange={(e) => setFilterAssigned(e.target.value)}
          className="text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-navy"
        >
          <option value="">All Crew</option>
          <option value="Jack">Jack</option>
          <option value="Charlie">Charlie</option>
          <option value="Perry">Perry</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-navy"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        {unscheduled.length > 0 && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
            {unscheduled.length} task{unscheduled.length !== 1 ? 's' : ''} not scheduled (no start date / ETD)
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-sm">No tasks with start dates and ETD set.</p>
            <p className="text-gray-300 text-xs mt-1">Open a task on the Board and set a Start Date and ETD (days).</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div style={{ minWidth: LABEL_W + totalDays * DAY_W, position: 'relative' }}>
            {/* Timeline header */}
            <div className="sticky top-0 z-10 bg-white border-b flex" style={{ height: HEADER_H }}>
              <div className="flex-shrink-0 border-r bg-gray-50 flex items-end px-3 pb-2" style={{ width: LABEL_W }}>
                <span className="text-xs font-semibold text-gray-500 uppercase">Task</span>
              </div>
              <div className="relative flex-1" style={{ width: totalDays * DAY_W }}>
                {/* Week labels */}
                {weeks.map((w, i) => (
                  <div
                    key={i}
                    className="absolute top-0 text-[10px] font-medium text-gray-400 pt-2"
                    style={{ left: w.offset * DAY_W }}
                  >
                    {formatDate(w.date)}
                  </div>
                ))}
                {/* Day columns */}
                <div className="absolute bottom-0 left-0 flex" style={{ height: 20 }}>
                  {Array.from({ length: totalDays }, (_, i) => {
                    const d = new Date(startDate);
                    d.setDate(d.getDate() + i);
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      <div
                        key={i}
                        className={`text-center text-[9px] ${isWeekend ? 'text-gray-300' : 'text-gray-400'}`}
                        style={{ width: DAY_W }}
                      >
                        {d.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rows */}
            {filtered.map((task, rowIdx) => {
              const taskStart = new Date(task.start_date);
              const offset = daysBetween(startDate, taskStart);
              const barColor = catColorMap[task.category] || STATUS_COLORS[task.status] || '#9ca3af';

              return (
                <div
                  key={task.id}
                  className={`flex ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  style={{ height: ROW_H }}
                >
                  {/* Label */}
                  <div
                    className="flex-shrink-0 border-r flex items-center px-3 gap-2 overflow-hidden"
                    style={{ width: LABEL_W }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: STATUS_COLORS[task.status] }}
                    />
                    <span className="text-xs text-gray-800 truncate font-medium">{task.task}</span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-auto">{task.assigned}</span>
                  </div>

                  {/* Bar area */}
                  <div className="relative flex-1" style={{ width: totalDays * DAY_W }}>
                    {/* Weekend shading */}
                    {Array.from({ length: totalDays }, (_, i) => {
                      const d = new Date(startDate);
                      d.setDate(d.getDate() + i);
                      if (d.getDay() !== 0 && d.getDay() !== 6) return null;
                      return (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 bg-gray-100/60"
                          style={{ left: i * DAY_W, width: DAY_W }}
                        />
                      );
                    })}

                    {/* Today line */}
                    {todayOffset >= 0 && todayOffset < totalDays && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-[2]"
                        style={{ left: todayOffset * DAY_W + DAY_W / 2 }}
                      />
                    )}

                    {/* Task bar */}
                    <div
                      className="absolute top-1.5 rounded-md flex items-center px-2 text-white text-[10px] font-semibold truncate cursor-default"
                      style={{
                        left: offset * DAY_W,
                        width: task.etd_days * DAY_W,
                        height: ROW_H - 12,
                        backgroundColor: barColor,
                        opacity: task.status === 'done' ? 0.5 : 1,
                      }}
                      title={`${task.task} — ${task.etd_days}d from ${task.start_date}`}
                    >
                      {task.etd_days * DAY_W > 60 ? `${task.etd_days}d` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
