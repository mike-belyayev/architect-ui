//canvasUtils.ts
import * as fabric from 'fabric';

export const createGrid = (canvas: fabric.Canvas, gridSize: number) => {

    const width = 15000;
    const height = 15000;

    for (let i = 0; i < width / gridSize; i++) {
        canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, height], {
            stroke: '#ccc',
            selectable: false,
            evented: false // prevent grid from being interactive
        }));
    }

    for (let i = 0; i < height / gridSize; i++) {
        canvas.add(new fabric.Line([0, i * gridSize, width, i * gridSize], {
            stroke: '#ccc',
            selectable: false,
            evented: false // prevent grid from being interactive
        }));
    }
};

export const handleDelete = (canvas: any) => {
    console.log(canvas);
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
        activeObjects.forEach((obj: any) => {
            canvas.remove(obj);
        });
        canvas.discardActiveObject(); // Deselect objects
    }
};

export const updateShape = (pointer: { x: number; y: number }, selectedTool: any, currentShape: any, canvas: any) => {
    switch (selectedTool) {
        case 'line':
            (currentShape as fabric.Line).set({ x2: pointer.x, y2: pointer.y });
            break;
        case 'rectangle':
            const rect = currentShape as fabric.Rect;
            rect.set({
                width: Math.abs(pointer.x - rect.left!),
                height: Math.abs(pointer.y - rect.top!),
            });
            break;
        case 'circle':
            const circle = currentShape as fabric.Circle;
            const radius = Math.sqrt(Math.pow(pointer.x - circle.left!, 2) + Math.pow(pointer.y - circle.top!, 2));
            circle.set({ radius: radius });
            break;
    }
    canvas.renderAll();
};