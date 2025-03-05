import React, { createContext, useState, useContext, useCallback } from 'react';
import type { DragifyContextType, DragStart, DropResult, DragItem } from '../types/types';

const DragifyContext = createContext<DragifyContextType | undefined>(undefined);

interface DragifyProviderProps {
  children: React.ReactNode;
  onDragStart?: (start: DragStart) => void;
  onDragEnd: (result: DropResult) => void;
}

export const DragifyProvider: React.FC<DragifyProviderProps> = ({ 
  children, 
  onDragStart,
  onDragEnd 
}) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((start: DragStart) => {
    onDragStart?.(start);
  }, [onDragStart]);

  const handleDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false);
    setDraggedItem(null);
    onDragEnd(result);
  }, [onDragEnd]);

  return (
    <DragifyContext.Provider 
      value={{ 
        isDragging,
        draggedItem, 
        setDraggedItem,
        setIsDragging,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd
      }}
    >
      {children}
    </DragifyContext.Provider>
  );
};

export const useDragifyContext = () => {
  const context = useContext(DragifyContext);
  if (!context) {
    throw new Error('useDragifyContext must be used within a DragifyProvider');
  }
  return context;
};
