import { renderHook, act } from '@testing-library/react';
import { useDroppable } from '../services/useDroppable';
import { DragifyProvider } from '../providers/DragifyProvider';
import React, { PropsWithChildren } from 'react';

describe('useDroppable', () => {
  const mockOnDragEnd = jest.fn();
  const mockOnDragStart = jest.fn();

  const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <DragifyProvider onDragEnd={mockOnDragEnd} onDragStart={mockOnDragStart}>
      {children}
    </DragifyProvider>
  );

  beforeEach(() => {
    mockOnDragEnd.mockClear();
    mockOnDragStart.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createMockDragEvent = (type: string, clientX = 0, clientY = 0) => {
    const element = document.createElement('div');
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
      clientX,
      clientY,
      currentTarget: element,
      target: element,
      relatedTarget: null,
      screenX: clientX,
      screenY: clientY,
      pageX: clientX,
      pageY: clientY,
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

  it('should initialize with droppable props', () => {
    const { result } = renderHook(() => useDroppable({ 
      id: 'test-droppable',
      type: 'item'
    }), {
      wrapper: Wrapper
    });

    expect(result.current.droppableProps['data-droppable']).toBe('test-droppable');
    expect(result.current.droppableProps['data-type']).toBe('item');
    expect(result.current.droppableProps['data-direction']).toBe('vertical');
    expect(result.current.droppableProps.ref).toBeDefined();
  });

  it('should handle drag over', () => {
    const { result } = renderHook(() => useDroppable({
      id: 'test-droppable',
      type: 'item'
    }), {
      wrapper: Wrapper
    });

    const dragOverEvent = createMockDragEvent('dragover', 100, 100);

    act(() => {
      result.current.droppableProps.onDragOver(dragOverEvent);
    });

    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle drop', () => {
    const { result } = renderHook(() => useDroppable({
      id: 'test-droppable',
      type: 'item'
    }), {
      wrapper: Wrapper
    });

    const dropEvent = createMockDragEvent('drop', 100, 100);

    act(() => {
      result.current.droppableProps.onDrop(dropEvent);
    });

    expect(dropEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle drag leave', () => {
    const { result } = renderHook(() => useDroppable({
      id: 'test-droppable',
      type: 'item'
    }), {
      wrapper: Wrapper
    });

    const dragLeaveEvent = createMockDragEvent('dragleave', 0, 0);

    act(() => {
      result.current.droppableProps.onDragLeave(dragLeaveEvent);
    });
  });
});
