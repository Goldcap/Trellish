import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard.jsx';

const STATUS_COLORS = {
  todo: 'border-t-gray-400',
  in_progress: 'border-t-blue-500',
  blocked: 'border-t-red-500',
  done: 'border-t-green-500',
};

const STATUS_LABELS = {
  todo: 'Todo',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
};

export default function KanbanColumn({ status, tasks, onCardClick }) {
  return (
    <div className={`flex flex-col bg-gray-100 rounded-xl min-w-[280px] w-[280px] md:flex-1 md:min-w-0 border-t-4 ${STATUS_COLORS[status]}`}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          {STATUS_LABELS[status]}
        </h3>
        <span className="bg-gray-300 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-2 pb-2 overflow-y-auto kanban-column min-h-[100px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onClick={onCardClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
