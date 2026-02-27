import { useState } from 'react';
import { useCategories } from '../hooks/useCategories.js';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899',
  '#10b981', '#f97316', '#ef4444', '#06b6d4',
  '#84cc16', '#6366f1', '#14b8a6', '#e11d48',
];

export default function CategoriesPage() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error('Name is required');
    try {
      await createCategory({ name: newName.trim(), color: newColor });
      toast.success('Category added');
      setNewName('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add category');
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-400 text-sm">Loading categories...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>

      {/* Add new */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Category</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy"
              placeholder="e.g. Plumbing"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    newColor === c ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-navy hover:bg-navy-light text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </form>

      {/* Existing categories */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        ))}
        {categories.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No categories yet.</p>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ category, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty');
    try {
      await onUpdate(category.id, { name: name.trim(), color });
      toast.success('Category updated');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${category.name}"? Tasks using it will have their category cleared.`)) return;
    try {
      await onDelete(category.id);
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-navy"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
            <div className="flex gap-1.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={handleSave} className="bg-navy hover:bg-navy-light text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors">Save</button>
          <button onClick={() => { setName(category.name); setColor(category.color); setEditing(false); }} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <span className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
        <span className="text-sm font-medium text-gray-900">{category.name}</span>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="text-xs text-gray-500 hover:text-navy font-medium">Edit</button>
        <button onClick={handleDelete} className="text-xs text-gray-400 hover:text-red-500 font-medium">Delete</button>
      </div>
    </div>
  );
}
