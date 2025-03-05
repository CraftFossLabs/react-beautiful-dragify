# react-beautiful-dragify

A powerful, flexible, and accessible drag and drop library for React applications, alterntive of react-beautiful-dnd.

## Features

✨ **Core Features**
- Drag and Drop between lists
- Vertical and horizontal dragging
- Touch device support
- Screen reader accessibility
- RTL support
- Auto-scrolling
- Customizable animations

🛠️ **Developer Experience**
- TypeScript support
- Modular architecture
- Comprehensive documentation
- Easy-to-use hooks API
- Zero external dependencies
- Small bundle size

🎨 **Customization**
- Custom drag handles
- Flexible styling options
- Customizable animations
- Conditional dragging/dropping
- Custom drag previews

## Installation

```bash
npm install react-dragify
# or
yarn add react-dragify
```

## Project Structure

```
src/
├── providers/
│   └── DragifyProvider.tsx    # Context provider for drag and drop state
├── services/
│   ├── useDraggable.tsx      # Hook for draggable elements
│   └── useDroppable.tsx      # Hook for droppable containers
├── types/
│   └── types.ts              # TypeScript type definitions
└── utils/
    └── utils.ts              # Utility functions
```

## Basic Usage

```tsx
import { DragifyProvider, useDraggable, useDroppable } from 'react-dragify';

// 1. Wrap your app with DragifyProvider
function App() {
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    
    // Update your state here
    const items = Array.from(yourItems);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);
    setYourItems(items);
  };

  return (
    <DragifyProvider onDragEnd={handleDragEnd}>
      <YourDraggableList />
    </DragifyProvider>
  );
}

// 2. Create draggable items
function DraggableItem({ id, index, children }) {
  const { draggableProps, dragHandleProps } = useDraggable({
    id,
    type: 'item',
    index,
    isDragDisabled: false, // Optional
    data: { /* your custom data */ } // Optional
  });

  return (
    <div {...draggableProps}>
      <div {...dragHandleProps}>☰</div>
      {children}
    </div>
  );
}

// 3. Create droppable containers
function DroppableList({ id }) {
  const { droppableProps } = useDroppable({
    id,
    type: 'item',
    direction: 'vertical',
    isDropDisabled: false, // Optional
    isCombineEnabled: false, // Optional
    ignoreContainerClipping: false // Optional
  });

  return (
    <div {...droppableProps}>
      {/* Your draggable items */}
    </div>
  );
}
```

## Advanced Features

### Keyboard Navigation
- Space/Enter: Start dragging
- Arrow keys: Move item
- Escape: Cancel drag
- Tab: Navigate between draggable items

### Touch Support
- Long press to start dragging
- Auto-scrolling on touch devices
- Touch-friendly drag handles

### Accessibility
- ARIA attributes for screen readers
- Role announcements during drag operations
- Keyboard navigation support
- High-contrast focus indicators

### Performance
- Optimized re-renders
- Efficient DOM updates
- Smooth animations
- Minimal layout shifts

## API Reference

### DragifyProvider Props
| Prop | Type | Description |
|------|------|-------------|
| onDragEnd | (result: DropResult) => void | Required. Called when a drag operation ends |
| onDragStart | (start: DragStart) => void | Optional. Called when a drag operation starts |
| children | ReactNode | Your app content |

### useDraggable Options
| Option | Type | Description |
|--------|------|-------------|
| id | string | Unique identifier for the draggable |
| type | string | Type identifier for drag operations |
| index | number | Position in the list |
| isDragDisabled | boolean | Disable dragging for this item |
| data | any | Custom data to be passed |

### useDroppable Options
| Option | Type | Description |
|--------|------|-------------|
| id | string | Unique identifier for the droppable |
| type | string | Accepted draggable types |
| direction | 'vertical' \| 'horizontal' | List orientation |
| isDropDisabled | boolean | Disable dropping in this container |
| isCombineEnabled | boolean | Enable item combining |

## License

BSD-3-Clause
