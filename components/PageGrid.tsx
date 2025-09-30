import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSwappingStrategy,
} from '@dnd-kit/sortable';
import { PageData } from '../types';
import PageThumbnail from './PageThumbnail';

interface PageGridProps {
  pages: PageData[];
  onDelete: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

const PageGrid: React.FC<PageGridProps> = ({ pages, onDelete, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex(p => p.id === active.id);
      const newIndex = pages.findIndex(p => p.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div className="flex-grow w-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={pages.map(p => p.id)} strategy={rectSwappingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {pages.map((page, index) => (
              <PageThumbnail
                key={page.id}
                id={page.id}
                thumbnailUrl={page.thumbnailUrl}
                pageNumber={index + 1}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PageGrid;