import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn.jsx';

const COLUMNS = ['todo', 'in_progress', 'blocked', 'done'];

export default function KanbanBoard({ tasks, onUpdateTask, onCardClick }) {
  const grouped = {};
  for (const col of COLUMNS) grouped[col] = [];
  for (const task of tasks) {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const taskId = parseInt(draggableId, 10);
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;
    onUpdateTask(taskId, { status: newStatus });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto flex-1 min-h-0">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
