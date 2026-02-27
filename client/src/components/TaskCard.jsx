import { Draggable } from '@hello-pangea/dnd';

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

export default function TaskCard({ task, index, onClick, onDelete, categoryColors = {} }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`group bg-white rounded-lg border p-3 mb-2 cursor-pointer select-none transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-navy/30' : 'shadow-sm hover:shadow-md'
          }`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority] || PRIORITY_DOT.medium}`}
              title={task.priority}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <p className="text-sm font-medium text-gray-900 leading-snug">{task.task}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${task.task}"?`)) onDelete(task.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex-shrink-0 p-0.5"
                  title="Delete task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {task.category && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={categoryColors[task.category]
                      ? { backgroundColor: categoryColors[task.category] + '20', color: categoryColors[task.category] }
                      : { backgroundColor: '#f3f4f6', color: '#4b5563' }
                    }
                  >
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
