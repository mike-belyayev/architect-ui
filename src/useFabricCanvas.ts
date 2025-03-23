// useFabricCanvas.ts
import { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { createGrid } from './Grid';
import { setupEventListeners } from './canvasEventListeners';

export const useFabricCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (canvasElement && !fabricRef.current) {
            const canvas = new fabric.Canvas(canvasElement, {
                width: canvasElement.offsetWidth,
                height: canvasElement.offsetHeight,
                backgroundColor: '#f0f0f0',
                selection: false
            });
            fabricRef.current = canvas;

            const gridSize = 50;
            const gridGroup = createGrid(canvas, gridSize);

            canvas._objects.unshift(gridGroup);
            canvas.renderAll();

            setupEventListeners(canvas, gridSize, gridGroup);
        }
    }, [canvasRef]);

    return fabricRef;
};
