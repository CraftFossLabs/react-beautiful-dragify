export declare const getTranslate: (dragOffset: {
    x: number;
    y: number;
}, axis: 'x' | 'y') => number;
export declare const getDraggableStyle: (isDragging: boolean, draggableStyle?: React.CSSProperties, transform?: string) => React.CSSProperties;
export declare const getDroppableStyle: (isDraggingOver: boolean, placeholderStyle?: React.CSSProperties) => React.CSSProperties;
export declare const isTouchDevice: () => boolean;
export declare const isInteractiveElement: (element: HTMLElement) => boolean;
export declare const announceForScreenReader: (message: string) => void;
