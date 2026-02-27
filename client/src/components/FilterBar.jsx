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

export default function FilterBar({ filters, setFilter, clearFilters, hasFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white border-b">
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
