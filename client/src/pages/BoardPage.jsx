import { useState } from 'react';
import { useTasks } from '../hooks/useTasks.js';
import { useQueryParams } from '../hooks/useQueryParams.js';
import FilterBar from '../components/FilterBar.jsx';
import KanbanBoard from '../components/KanbanBoard.jsx';
import TaskDetailModal from '../components/TaskDetailModal.jsx';
import AddTaskModal from '../components/AddTaskModal.jsx';

export default function BoardPage() {
  const { filters, setFilter, clearFilters, hasFilters } = useQueryParams();
  const { tasks, loading, updateTask, createTask, deleteTask } = useTasks(filters);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <FilterBar filters={filters} setFilter={setFilter} clearFilters={clearFilters} hasFilters={hasFilters} onAddTask={() => setShowAddModal(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-52px)] sm:h-[calc(100vh-52px)]">
      <FilterBar filters={filters} setFilter={setFilter} clearFilters={clearFilters} hasFilters={hasFilters} onAddTask={() => setShowAddModal(true)} />
      <KanbanBoard tasks={tasks} onUpdateTask={updateTask} onCardClick={setSelectedTask} onDeleteTask={deleteTask} />
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={async (id, updates) => {
            const updated = await updateTask(id, updates);
            setSelectedTask(updated);
          }}
          onDelete={async (id) => {
            await deleteTask(id);
            setSelectedTask(null);
          }}
        />
      )}
      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} onCreate={createTask} />
      )}
    </div>
  );
}
