import { Draggable } from '@hello-pangea/dnd';

const CATEGORY_COLORS = {
  'Electrical/Systems': 'bg-cat-electrical-light text-cat-electrical',
  'Mechanical/Engine': 'bg-cat-mechanical-light text-cat-mechanical',
  'Carpentry/Interior': 'bg-cat-carpentry-light text-cat-carpentry',
  'Paint/Finishes': 'bg-cat-paint-light text-cat-paint',
  'Fiberglass/Hull': 'bg-cat-fiberglass-light text-cat-fiberglass',
  'Canvas/Enclosure': 'bg-cat-canvas-light text-cat-canvas',
};

const CREW_COLORS = {
  Jack: 'bg-crew-jack-light text-crew-jack',
  Charlie: 'bg-crew-charlie-light text-crew-charlie',
  Perry: 'bg-crew-perry-light text-crew-perry',
};

const PRIORITY_DOT = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
};

export default function TaskCard({ task, index, onClick }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`bg-white rounded-lg border p-3 mb-2 cursor-pointer select-none transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-navy/30' : 'shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority] || PRIORITY_DOT.medium}`}
              title={task.priority}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-snug">{task.task}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {task.category && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[task.category] || 'bg-gray-100 text-gray-600'}`}>
                    {task.category}
                  </span>
                )}
                {task.assigned && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${CREW_COLORS[task.assigned] || 'bg-gray-100 text-gray-600'}`}>
                    {task.assigned}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
