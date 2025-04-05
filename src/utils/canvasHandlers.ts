// utils/canvasHandlers.ts
import * as fabric from 'fabric';
import {
    updateShape,
    handleDelete
} from './canvasUtils';

// Wheel Event Handler
export const handleMouseWheel = (opt: fabric.TEvent < WheelEvent > , canvas: fabric.Canvas) => {
    const event = opt.e as WheelEvent;
    const delta = event.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;

    // Get the pointer position
    const pointer = canvas.getPointer(event);

    // Calculate the zoom point
    const zoomPoint = new fabric.Point(pointer.x, pointer.y);

    // Set the zoom
    canvas.zoomToPoint(zoomPoint, zoom);

    opt.e.preventDefault();
    opt.e.stopPropagation();
};

// Keyboard Event Handler
export const handleKeyDown = (e: KeyboardEvent, canvas: fabric.Canvas) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDelete(canvas);
    }
};
