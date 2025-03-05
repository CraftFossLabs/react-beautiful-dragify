export const getTranslate = (
  dragOffset: { x: number; y: number },
  axis: 'x' | 'y'
): number => {
  return axis === 'x' ? dragOffset.x : dragOffset.y;
};

export const getDraggableStyle = (
  isDragging: boolean,
  draggableStyle: React.CSSProperties = {},
  transform?: string
): React.CSSProperties => {
  if (!isDragging) {
    return {
      ...draggableStyle,
      transform,
      transition: transform ? 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)' : undefined,
    };
  }

  return {
    ...draggableStyle,
    transform,
    transition: 'none',
    zIndex: 9999,
    position: 'relative',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.15)',
  };
};

export const getDroppableStyle = (
  isDraggingOver: boolean,
  placeholderStyle: React.CSSProperties = {}
): React.CSSProperties => {
  return {
    ...placeholderStyle,
    transition: 'background-color 0.2s ease',
    backgroundColor: isDraggingOver ? 'rgba(0, 0, 0, 0.05)' : undefined,
  };
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const isInteractiveElement = (element: HTMLElement): boolean => {
  const interactiveElements = [
    'input',
    'button',
    'textarea',
    'select',
    'option',
    'a',
    'video',
    'audio',
  ];
  
  return interactiveElements.includes(element.tagName.toLowerCase()) ||
    element.contentEditable === 'true' ||
    element.getAttribute('role') === 'button';
};

export const announceForScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('role', 'alert');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
