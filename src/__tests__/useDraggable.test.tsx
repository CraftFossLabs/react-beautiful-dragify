import { renderHook, act } from '@testing-library/react';
import { useDraggable } from '../services/useDraggable';
import { DragifyProvider } from '../providers/DragifyProvider';
import React, { PropsWithChildren } from 'react';

describe('useDraggable', () => {
  const mockOnDragEnd = jest.fn();
  const mockOnDragStart = jest.fn();
  const mockSetDraggedItem = jest.fn();
  const mockSetIsDragging = jest.fn();

  const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <DragifyProvider 
      onDragEnd={mockOnDragEnd}
      onDragStart={mockOnDragStart}
    >
      {children}
    </DragifyProvider>
  );

  beforeEach(() => {
    mockOnDragEnd.mockClear();
    mockOnDragStart.mockClear();
    mockSetDraggedItem.mockClear();
    mockSetIsDragging.mockClear();
    document.body.innerHTML = '';
  });

  const createMockDragEvent = (type: string) => {
    const element = document.createElement('div');
    element.setAttribute('data-droppable', '');
    const event = new Event(type);
    
    const mockEvent = {
      altKey: false,
      button: 0,
      buttons: 0,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      detail: 0,
      view: window,
      which: 1,
      preventDefault: jest.fn(),
      currentTarget: element,
      target: element,
      relatedTarget: null,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      type,
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      composed: true,
      eventPhase: 0,
      isTrusted: true,
      returnValue: true,
      timeStamp: Date.now(),
      nativeEvent: event,
      stopPropagation: jest.fn(),
      isPropagationStopped: jest.fn(),
      persist: jest.fn(),
      isDefaultPrevented: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      dataTransfer: {
        dropEffect: 'none',
        effectAllowed: 'all',
        files: [],
        items: [],
        types: [],
        clearData: jest.fn(),
        getData: jest.fn(),
        setData: jest.fn(),
        setDragImage: jest.fn()
      }
    };

    return mockEvent as unknown as React.DragEvent<HTMLElement>;
  };

  it('should initialize with draggable props', () => {
    const { result } = renderHook(() => useDraggable({ 
      id: 'test-draggable',
      type: 'item',
      index: 0
    }), {
      wrapper: Wrapper
    });

    expect(result.current.draggableProps.draggable).toBe(true);
    expect(result.current.draggableProps['data-draggable']).toBe('test-draggable');
    expect(result.current.draggableProps['data-index']).toBe(0);
    expect(result.current.draggableProps.ref).toBeDefined();
  });

  it('should initialize with drag handle props', () => {
    const { result } = renderHook(() => useDraggable({
      id: 'test-draggable',
      type: 'item',
      index: 0
    }), {
      wrapper: Wrapper
    });

    expect(result.current.dragHandleProps['data-draghandle']).toBe(true);
    expect(result.current.dragHandleProps.tabIndex).toBe(0);
    expect(result.current.dragHandleProps.role).toBe('button');
    expect(result.current.dragHandleProps['aria-grabbed']).toBe(false);
  });

  it('should handle drag start', () => {
    const { result } = renderHook(() => useDraggable({
      id: 'test-draggable',
      type: 'item',
      index: 0
    }), {
      wrapper: Wrapper
    });

    const dragEvent = createMockDragEvent('dragstart');
    const element = dragEvent.currentTarget;
    document.body.appendChild(element);

    // Set up ref
    (result.current.draggableProps.ref as React.MutableRefObject<HTMLElement>).current = element;

    act(() => {
      result.current.draggableProps.onDragStart(dragEvent);
    });

    expect(mockOnDragStart).toHaveBeenCalledWith({
      draggableId: 'test-draggable',
      type: 'item',
      source: {
        droppableId: '',
        index: 0
      }
    });
  });
});