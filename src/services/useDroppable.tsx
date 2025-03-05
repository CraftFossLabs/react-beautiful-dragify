import { useCallback, useRef, useEffect } from 'react';
import { useDragifyContext } from '../providers/DragifyProvider';
import type { DroppableOptions } from '../types/types';

const SCROLL_SPEED = 20;
const AUTOSCROLL_THRESHOLD = 50;

export const useDroppable = (options: DroppableOptions) => {
  const {
    id,
    type,
    direction = 'vertical',
    isDropDisabled = false,
    isCombineEnabled = false,
    ignoreContainerClipping = false
  } = options;

  const { draggedItem, isDragging, onDragEnd } = useDragifyContext();
  const dropZoneRef = useRef<HTMLElement | null>(null);
  const autoScrollInterval = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (autoScrollInterval.current) {
        window.clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  const startAutoScroll = useCallback((direction: 'up' | 'down') => {
    if (autoScrollInterval.current) return;

    autoScrollInterval.current = window.setInterval(() => {
      const element = dropZoneRef.current;
      if (!element) return;

      const amount = direction === 'up' ? -SCROLL_SPEED : SCROLL_SPEED;
      element.scrollTop += amount;
    }, 16) as unknown as number;
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      window.clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isDropDisabled || !isDragging) return;

    const element = dropZoneRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const mouseY = e.clientY;

    // Auto-scrolling logic
    if (mouseY - rect.top < AUTOSCROLL_THRESHOLD) {
      startAutoScroll('up');
    } else if (rect.bottom - mouseY < AUTOSCROLL_THRESHOLD) {
      startAutoScroll('down');
    } else {
      stopAutoScroll();
    }

    // Calculate drop position
    const items = Array.from(element.querySelectorAll('[data-draggable]')) as HTMLElement[];
    const hoveredItem = items.find(item => {
      const itemRect = item.getBoundingClientRect();
      return direction === 'vertical'
        ? mouseY >= itemRect.top && mouseY <= itemRect.bottom
        : e.clientX >= itemRect.left && e.clientX <= itemRect.right;
    });

    if (hoveredItem) {
      const hoverIndex = parseInt(hoveredItem.getAttribute('data-index') || '0', 10);
      const itemRect = hoveredItem.getBoundingClientRect();
      const hoverMiddleY = (itemRect.bottom - itemRect.top) / 2;
      const hoverClientY = mouseY - itemRect.top;

      if (draggedItem && draggedItem.index < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (draggedItem && draggedItem.index > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Update position styles
      items.forEach(item => {
        const itemIndex = parseInt(item.getAttribute('data-index') || '0', 10);
        if (draggedItem && itemIndex > draggedItem.index && itemIndex <= hoverIndex) {
          item.style.transform = direction === 'vertical'
            ? 'translateY(-100%)' 
            : 'translateX(-100%)';
        } else if (draggedItem && itemIndex < draggedItem.index && itemIndex >= hoverIndex) {
          item.style.transform = direction === 'vertical'
            ? 'translateY(100%)'
            : 'translateX(100%)';
        } else {
          item.style.transform = '';
        }
      });
    }
  }, [isDropDisabled, isDragging, draggedItem, direction, startAutoScroll, stopAutoScroll]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    stopAutoScroll();

    if (isDropDisabled || !draggedItem) return;

    const element = dropZoneRef.current;
    if (!element) return;

    const items = Array.from(element.querySelectorAll('[data-draggable]')) as HTMLElement[];
    items.forEach(item => {
      item.style.transform = '';
    });

    const dropIndex = Math.max(
      0,
      items.findIndex(item => {
        const itemRect = item.getBoundingClientRect();
        return direction === 'vertical'
          ? e.clientY <= itemRect.bottom
          : e.clientX <= itemRect.right;
      })
    );

    onDragEnd({
      draggableId: draggedItem.id,
      type: draggedItem.type,
      source: {
        droppableId: draggedItem.droppableId,
        index: draggedItem.index
      },
      destination: {
        droppableId: id,
        index: dropIndex
      },
      reason: 'DROP'
    });
  }, [isDropDisabled, draggedItem, direction, id, onDragEnd, stopAutoScroll]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const element = dropZoneRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX >= rect.right ||
      e.clientY < rect.top ||
      e.clientY >= rect.bottom
    ) {
      stopAutoScroll();
    }
  }, [stopAutoScroll]);

  return {
    droppableProps: {
      ref: dropZoneRef,
      'data-droppable': id,
      'data-type': type,
      'data-direction': direction,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onDragLeave: handleDragLeave,
      style: {
        position: 'relative' as const,
        overflow: ignoreContainerClipping ? 'visible' : 'auto',
      }
    }
  };
};