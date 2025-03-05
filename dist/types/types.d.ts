/// <reference types="react" />
export type DraggableId = string;
export type DroppableId = string;
export interface DragStart {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
}
export interface DropResult {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    destination: DraggableLocation | null;
    reason: 'DROP' | 'CANCEL';
}
export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
}
export interface DragifyContextType {
    isDragging: boolean;
    draggedItem: DragItem | null;
    setDraggedItem: (item: DragItem | null) => void;
    setIsDragging: (isDragging: boolean) => void;
    onDragStart?: (start: DragStart) => void;
    onDragEnd: (result: DropResult) => void;
}
export interface DragItem {
    id: DraggableId;
    type: string;
    index: number;
    droppableId: DroppableId;
    data?: any;
}
export interface DraggableOptions {
    id: DraggableId;
    type: string;
    index: number;
    isDragDisabled?: boolean;
    data?: any;
    disableInteractiveElementBlocking?: boolean;
}
export interface DroppableOptions {
    id: DroppableId;
    type: string;
    direction?: 'vertical' | 'horizontal';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    ignoreContainerClipping?: boolean;
}
export interface DragHandleOptions {
    dragHandleProps: {
        'data-draghandle': boolean;
        tabIndex: number;
        role: string;
        'aria-grabbed': boolean;
        onKeyDown: (event: React.KeyboardEvent) => void;
    };
}
