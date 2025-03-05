import { useCallback, useRef, useEffect } from 'react';
import { useDragifyContext } from '../providers/DragifyProvider';
import type { DraggableOptions, DragHandleOptions } from '../types/types';

const TRANSITION_DURATION = 200;

export const useDraggable = (options: DraggableOptions) => {
  const {
    id,
    type,
    index,
    isDragDisabled = false,
    disableInteractiveElementBlocking = false,
    data
  } = options;

  const { setDraggedItem, setIsDragging, onDragStart, onDragEnd } = useDragifyContext();
  const elementRef = useRef<HTMLElement | null>(null);
  const initialPosition = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    return () => {
      initialPosition.current = null;
    };
  }, []);

  const getDragHandleProps = useCallback((): DragHandleOptions['dragHandleProps'] => ({
    'data-draghandle': true,
    tabIndex: 0,
    role: 'button',
    'aria-grabbed': false,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (isDragDisabled) return;

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          startDrag(e);
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          cancelDrag();
          break;
      }
    }
  }), [isDragDisabled]);

  const startDrag = useCallback((e: React.DragEvent | React.KeyboardEvent) => {
    if (isDragDisabled) return;

    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    initialPosition.current = { x: rect.left, y: rect.top };

    setIsDragging(true);
    setDraggedItem({
      id,
      type,
      index,
      droppableId: element.closest('[data-droppable]')?.getAttribute('data-droppable') || '',
      data
    });

    onDragStart?.({
      draggableId: id,
      type,
      source: {
        droppableId: element.closest('[data-droppable]')?.getAttribute('data-droppable') || '',
        index
      }
    });

    // Only set drag image if this is a DragEvent (not a keyboard event)
    if ('dataTransfer' in e && e.dataTransfer) {
      const dragImage = element.cloneNode(true) as HTMLElement;
      dragImage.style.position = 'fixed';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  }, [id, type, index, isDragDisabled, data, setDraggedItem, setIsDragging, onDragStart]);

  const cancelDrag = useCallback(() => {
    const element = elementRef.current;
    if (!element || !initialPosition.current) return;

    element.style.transition = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.2, 0, 0, 1)`;
    element.style.transform = 'translate(0, 0)';

    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
    }, TRANSITION_DURATION);

    setIsDragging(false);
    setDraggedItem(null);
    initialPosition.current = null;

    onDragEnd({
      draggableId: id,
      type,
      source: {
        droppableId: element.closest('[data-droppable]')?.getAttribute('data-droppable') || '',
        index
      },
      destination: null,
      reason: 'CANCEL'
    });
  }, [id, type, index, setDraggedItem, setIsDragging, onDragEnd]);

  return {
    draggableProps: {
      ref: elementRef,
      draggable: !isDragDisabled,
      'data-draggable': id,
      'data-index': index,
      onDragStart: startDrag as (e: React.DragEvent<Element>) => void,
      onDragEnd: cancelDrag,
    },
    dragHandleProps: getDragHandleProps(),
  };
};
