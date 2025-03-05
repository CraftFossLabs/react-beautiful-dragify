/// <reference types="react" />
import type { DroppableOptions } from '../types/types';
export declare const useDroppable: (options: DroppableOptions) => {
    droppableProps: {
        ref: import("react").MutableRefObject<HTMLElement | null>;
        'data-droppable': string;
        'data-type': string;
        'data-direction': "vertical" | "horizontal";
        onDragOver: (e: React.DragEvent) => void;
        onDrop: (e: React.DragEvent) => void;
        onDragLeave: (e: React.DragEvent) => void;
        style: {
            position: "relative";
            overflow: string;
        };
    };
};
