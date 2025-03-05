import React from 'react';
import type { DragifyContextType, DragStart, DropResult } from '../types/types';
interface DragifyProviderProps {
    children: React.ReactNode;
    onDragStart?: (start: DragStart) => void;
    onDragEnd: (result: DropResult) => void;
}
export declare const DragifyProvider: React.FC<DragifyProviderProps>;
export declare const useDragifyContext: () => DragifyContextType;
export {};
