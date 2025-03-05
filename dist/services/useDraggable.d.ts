/// <reference types="react" />
import type { DraggableOptions } from '../types/types';
export declare const useDraggable: (options: DraggableOptions) => {
    draggableProps: {
        ref: import("react").MutableRefObject<HTMLElement | null>;
        draggable: boolean;
        'data-draggable': string;
        'data-index': number;
        onDragStart: (e: React.DragEvent<Element>) => void;
        onDragEnd: () => void;
    };
    dragHandleProps: {
        'data-draghandle': boolean;
        tabIndex: number;
        role: string;
        'aria-grabbed': boolean;
        onKeyDown: (event: import("react").KeyboardEvent<Element>) => void;
    };
};
