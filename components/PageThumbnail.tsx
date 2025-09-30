import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PageThumbnailProps {
  id: string;
  thumbnailUrl: string;
  pageNumber: number;
  onDelete: (id: string) => void;
}

const PageThumbnail: React.FC<PageThumbnailProps> = ({ id, thumbnailUrl, pageNumber, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent drag from starting on delete
    onDelete(id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group p-1 bg-white border border-slate-200 rounded-md shadow-sm aspect-[7/9] flex flex-col items-center"
    >
      <div {...listeners} className="w-full h-full cursor-grab touch-none flex-grow">
          <img 
            src={thumbnailUrl} 
            alt={`Page ${pageNumber}`} 
            className="w-full h-full object-contain"
            draggable={false}
          />
      </div>
      <span className="text-xs text-slate-600 mt-1">{pageNumber}</span>
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 m-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity z-20"
        aria-label={`Delete page ${pageNumber}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PageThumbnail;