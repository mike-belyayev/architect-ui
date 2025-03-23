// Grid.ts
import * as fabric from 'fabric';

export const createGrid = (canvas: fabric.Canvas, gridSize: number): fabric.Group => {
    const gridLines: fabric.Line[] = [];
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const gridExtent = Math.max(canvasWidth, canvasHeight) * 2;

    for (let i = 0; i < gridExtent / gridSize; i++) {
        gridLines.push(new fabric.Line([i * gridSize, -gridExtent, i * gridSize, gridExtent], {
            stroke: '#ccc',
            selectable: false,
            evented: false
        }));
        gridLines.push(new fabric.Line([-gridExtent, i * gridSize, gridExtent, i * gridSize], {
            stroke: '#ccc',
            selectable: false,
            evented: false
        }));
    }

    const gridGroup = new fabric.Group(gridLines, {
        left: -gridExtent / 2,
        top: -gridExtent / 2,
        selectable: false,
        evented: false
    });

    canvas.add(gridGroup);
    return gridGroup;
};
