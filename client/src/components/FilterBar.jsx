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

export default function FilterBar({ filters, setFilter, clearFilters, hasFilters, onAddTask }) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white border-b">
      <button
        onClick={onAddTask}
        className="bg-navy hover:bg-navy-light text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        Add Task
      </button>
      <div className="w-px h-6 bg-gray-200" />
      <Select
        label="Assignee"
        value={filters.assigned}
        onChange={(v) => setFilter('assigned', v)}
        options={CREW}
      />
      <Select
        label="Category"
        value={filters.category}
        onChange={(v) => setFilter('category', v)}
        options={CATEGORIES}
      />
      <Select
        label="Priority"
        value={filters.priority}
        onChange={(v) => setFilter('priority', v)}
        options={PRIORITIES}
      />
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-sm border rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-navy ${
        value ? 'border-navy text-navy font-medium' : 'border-gray-300 text-gray-600'
      }`}
    >
      <option value="">{label}: All</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
