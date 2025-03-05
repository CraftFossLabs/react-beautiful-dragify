import React, { createContext, useState, useCallback, useContext, useRef, useEffect } from 'react';

var DragifyContext = createContext(undefined);
var DragifyProvider = function (_a) {
    var children = _a.children, onDragStart = _a.onDragStart, onDragEnd = _a.onDragEnd;
    var _b = useState(null), draggedItem = _b[0], setDraggedItem = _b[1];
    var _c = useState(false), isDragging = _c[0], setIsDragging = _c[1];
    var handleDragStart = useCallback(function (start) {
        onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart(start);
    }, [onDragStart]);
    var handleDragEnd = useCallback(function (result) {
        setIsDragging(false);
        setDraggedItem(null);
        onDragEnd(result);
    }, [onDragEnd]);
    return (React.createElement(DragifyContext.Provider, { value: {
            isDragging: isDragging,
            draggedItem: draggedItem,
            setDraggedItem: setDraggedItem,
            setIsDragging: setIsDragging,
            onDragStart: handleDragStart,
            onDragEnd: handleDragEnd
        } }, children));
};
var useDragifyContext = function () {
    var context = useContext(DragifyContext);
    if (!context) {
        throw new Error('useDragifyContext must be used within a DragifyProvider');
    }
    return context;
};

var TRANSITION_DURATION = 200;
var useDraggable = function (options) {
    var id = options.id, type = options.type, index = options.index, _a = options.isDragDisabled, isDragDisabled = _a === void 0 ? false : _a; options.disableInteractiveElementBlocking; var data = options.data;
    var _c = useDragifyContext(), setDraggedItem = _c.setDraggedItem, setIsDragging = _c.setIsDragging, onDragStart = _c.onDragStart, onDragEnd = _c.onDragEnd;
    var elementRef = useRef(null);
    var initialPosition = useRef(null);
    useEffect(function () {
        return function () {
            initialPosition.current = null;
        };
    }, []);
    var getDragHandleProps = useCallback(function () { return ({
        'data-draghandle': true,
        tabIndex: 0,
        role: 'button',
        'aria-grabbed': false,
        onKeyDown: function (e) {
            if (isDragDisabled)
                return;
            switch (e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    e.stopPropagation();
                    startDrag(e);
                    break;
                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    cancelDrag();
                    break;
            }
        }
    }); }, [isDragDisabled]);
    var startDrag = useCallback(function (e) {
        var _a, _b;
        if (isDragDisabled)
            return;
        var element = elementRef.current;
        if (!element)
            return;
        var rect = element.getBoundingClientRect();
        initialPosition.current = { x: rect.left, y: rect.top };
        setIsDragging(true);
        setDraggedItem({
            id: id,
            type: type,
            index: index,
            droppableId: ((_a = element.closest('[data-droppable]')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-droppable')) || '',
            data: data
        });
        onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart({
            draggableId: id,
            type: type,
            source: {
                droppableId: ((_b = element.closest('[data-droppable]')) === null || _b === void 0 ? void 0 : _b.getAttribute('data-droppable')) || '',
                index: index
            }
        });
        // Only set drag image if this is a DragEvent (not a keyboard event)
        if ('dataTransfer' in e && e.dataTransfer) {
            var dragImage_1 = element.cloneNode(true);
            dragImage_1.style.position = 'fixed';
            dragImage_1.style.top = '-1000px';
            document.body.appendChild(dragImage_1);
            e.dataTransfer.setDragImage(dragImage_1, 0, 0);
            setTimeout(function () { return document.body.removeChild(dragImage_1); }, 0);
        }
    }, [id, type, index, isDragDisabled, data, setDraggedItem, setIsDragging, onDragStart]);
    var cancelDrag = useCallback(function () {
        var _a;
        var element = elementRef.current;
        if (!element || !initialPosition.current)
            return;
        element.style.transition = "transform ".concat(TRANSITION_DURATION, "ms cubic-bezier(0.2, 0, 0, 1)");
        element.style.transform = 'translate(0, 0)';
        setTimeout(function () {
            element.style.transition = '';
            element.style.transform = '';
        }, TRANSITION_DURATION);
        setIsDragging(false);
        setDraggedItem(null);
        initialPosition.current = null;
        onDragEnd({
            draggableId: id,
            type: type,
            source: {
                droppableId: ((_a = element.closest('[data-droppable]')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-droppable')) || '',
                index: index
            },
            destination: null,
            reason: 'CANCEL'
        });
    }, [id, type, index, setDraggedItem, setIsDragging, onDragEnd]);
    return {
        draggableProps: {
            ref: elementRef,
            draggable: !isDragDisabled,
            'data-draggable': id,
            'data-index': index,
            onDragStart: startDrag,
            onDragEnd: cancelDrag,
        },
        dragHandleProps: getDragHandleProps(),
    };
};

var SCROLL_SPEED = 20;
var AUTOSCROLL_THRESHOLD = 50;
var useDroppable = function (options) {
    var id = options.id, type = options.type, _a = options.direction, direction = _a === void 0 ? 'vertical' : _a, _b = options.isDropDisabled, isDropDisabled = _b === void 0 ? false : _b; options.isCombineEnabled; var _d = options.ignoreContainerClipping, ignoreContainerClipping = _d === void 0 ? false : _d;
    var _e = useDragifyContext(), draggedItem = _e.draggedItem, isDragging = _e.isDragging, onDragEnd = _e.onDragEnd;
    var dropZoneRef = useRef(null);
    var autoScrollInterval = useRef(null);
    useEffect(function () {
        return function () {
            if (autoScrollInterval.current) {
                window.clearInterval(autoScrollInterval.current);
            }
        };
    }, []);
    var startAutoScroll = useCallback(function (direction) {
        if (autoScrollInterval.current)
            return;
        autoScrollInterval.current = window.setInterval(function () {
            var element = dropZoneRef.current;
            if (!element)
                return;
            var amount = direction === 'up' ? -SCROLL_SPEED : SCROLL_SPEED;
            element.scrollTop += amount;
        }, 16);
    }, []);
    var stopAutoScroll = useCallback(function () {
        if (autoScrollInterval.current) {
            window.clearInterval(autoScrollInterval.current);
            autoScrollInterval.current = null;
        }
    }, []);
    var handleDragOver = useCallback(function (e) {
        e.preventDefault();
        if (isDropDisabled || !isDragging)
            return;
        var element = dropZoneRef.current;
        if (!element)
            return;
        var rect = element.getBoundingClientRect();
        var mouseY = e.clientY;
        // Auto-scrolling logic
        if (mouseY - rect.top < AUTOSCROLL_THRESHOLD) {
            startAutoScroll('up');
        }
        else if (rect.bottom - mouseY < AUTOSCROLL_THRESHOLD) {
            startAutoScroll('down');
        }
        else {
            stopAutoScroll();
        }
        // Calculate drop position
        var items = Array.from(element.querySelectorAll('[data-draggable]'));
        var hoveredItem = items.find(function (item) {
            var itemRect = item.getBoundingClientRect();
            return direction === 'vertical'
                ? mouseY >= itemRect.top && mouseY <= itemRect.bottom
                : e.clientX >= itemRect.left && e.clientX <= itemRect.right;
        });
        if (hoveredItem) {
            var hoverIndex_1 = parseInt(hoveredItem.getAttribute('data-index') || '0', 10);
            var itemRect = hoveredItem.getBoundingClientRect();
            var hoverMiddleY = (itemRect.bottom - itemRect.top) / 2;
            var hoverClientY = mouseY - itemRect.top;
            if (draggedItem && draggedItem.index < hoverIndex_1 && hoverClientY < hoverMiddleY) {
                return;
            }
            if (draggedItem && draggedItem.index > hoverIndex_1 && hoverClientY > hoverMiddleY) {
                return;
            }
            // Update position styles
            items.forEach(function (item) {
                var itemIndex = parseInt(item.getAttribute('data-index') || '0', 10);
                if (draggedItem && itemIndex > draggedItem.index && itemIndex <= hoverIndex_1) {
                    item.style.transform = direction === 'vertical'
                        ? 'translateY(-100%)'
                        : 'translateX(-100%)';
                }
                else if (draggedItem && itemIndex < draggedItem.index && itemIndex >= hoverIndex_1) {
                    item.style.transform = direction === 'vertical'
                        ? 'translateY(100%)'
                        : 'translateX(100%)';
                }
                else {
                    item.style.transform = '';
                }
            });
        }
    }, [isDropDisabled, isDragging, draggedItem, direction, startAutoScroll, stopAutoScroll]);
    var handleDrop = useCallback(function (e) {
        e.preventDefault();
        stopAutoScroll();
        if (isDropDisabled || !draggedItem)
            return;
        var element = dropZoneRef.current;
        if (!element)
            return;
        var items = Array.from(element.querySelectorAll('[data-draggable]'));
        items.forEach(function (item) {
            item.style.transform = '';
        });
        var dropIndex = Math.max(0, items.findIndex(function (item) {
            var itemRect = item.getBoundingClientRect();
            return direction === 'vertical'
                ? e.clientY <= itemRect.bottom
                : e.clientX <= itemRect.right;
        }));
        onDragEnd({
            draggableId: draggedItem.id,
            type: draggedItem.type,
            source: {
                droppableId: draggedItem.droppableId,
                index: draggedItem.index
            },
            destination: {
                droppableId: id,
                index: dropIndex
            },
            reason: 'DROP'
        });
    }, [isDropDisabled, draggedItem, direction, id, onDragEnd, stopAutoScroll]);
    var handleDragLeave = useCallback(function (e) {
        var element = dropZoneRef.current;
        if (!element)
            return;
        var rect = element.getBoundingClientRect();
        if (e.clientX < rect.left ||
            e.clientX >= rect.right ||
            e.clientY < rect.top ||
            e.clientY >= rect.bottom) {
            stopAutoScroll();
        }
    }, [stopAutoScroll]);
    return {
        droppableProps: {
            ref: dropZoneRef,
            'data-droppable': id,
            'data-type': type,
            'data-direction': direction,
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            onDragLeave: handleDragLeave,
            style: {
                position: 'relative',
                overflow: ignoreContainerClipping ? 'visible' : 'auto',
            }
        }
    };
};

export { DragifyProvider, useDraggable, useDroppable };
//# sourceMappingURL=index.esm.js.map
