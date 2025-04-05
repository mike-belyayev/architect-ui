// hooks/useCanvasHandlers.ts
import {
    useState,
    useCallback
} from 'react';
import * as  fabric from 'fabric';
import {
    updateShape
} from '../utils/canvasUtils';

interface useCanvasHandlersProps {
    canvas: fabric.Canvas;
    selectedTool: string | null;
}

export const useCanvasHandlers = ({
    canvas,
    selectedTool
}: useCanvasHandlersProps) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [currentShape, setCurrentShape] = useState<fabric.Object | null>(null);
    const [lastPosX, setLastPosX] = useState(0);
    const [lastPosY, setLastPosY] = useState(0);

    const handleMouseDown = useCallback((event: fabric.TEvent) => {
        if (event.e instanceof MouseEvent) {
            if (event.e.button === 0 && event.e.altKey) { // Left mouse button + Alt key
                setIsPanning(true);
                canvas.selection = false; // disable selection during panning
                setLastPosX(event.e.clientX);
                setLastPosY(event.e.clientY);
                canvas.setCursor('move');
                event.e.preventDefault(); // prevent text selection etc.
            } else if (event.e.button === 0) { // Left mouse button
                setIsDrawing(true);
                const pointer = canvas.getPointer(event.e);

                let currentShape = null;
                switch (selectedTool) {
                    case 'line':
                        currentShape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                            strokeWidth: 2,
                            stroke: 'black',
                        });
                        break;
                    case 'rectangle':
                        currentShape = new fabric.Rect({
                            left: pointer.x,
                            top: pointer.y,
                            width: 0,
                            height: 0,
                            fill: 'transparent',
                            stroke: 'black',
                            strokeWidth: 2,
                        });
                        break;
                    case 'circle':
                        currentShape = new fabric.Circle({
                            left: pointer.x,
                            top: pointer.y,
                            radius: 0,
                            fill: 'transparent',
                            stroke: 'black',
                            strokeWidth: 2,
                        });
                        break;
                }

                if (currentShape) {
                    canvas.add(currentShape);
                    setCurrentShape(currentShape); // Update the state
                }
            }
        }
    }, [canvas, selectedTool, setIsPanning, setLastPosX, setLastPosY, setIsDrawing, setCurrentShape]);

    const handleMouseMove = useCallback((event: fabric.TEvent) => {
        if (event.e instanceof MouseEvent) {
            if (isPanning) {
                const vpt = canvas.viewportTransform;
                if (!vpt) return;
                vpt[4] += event.e.clientX - lastPosX;
                vpt[5] += event.e.clientY - lastPosY;
                canvas.requestRenderAll();
            } else if (isDrawing && currentShape) {
                const pointer = canvas.getPointer(event.e);
                updateShape(pointer, selectedTool, currentShape, canvas);
            }
        }
    }, [canvas, isPanning, currentShape, selectedTool, lastPosX, lastPosY, isDrawing]);

    const handleMouseUp = useCallback(() => {
        setIsDrawing(false);
        setIsPanning(false);
        canvas.selection = true; // re-enable selection
        canvas.setCursor('default');
    }, [canvas, setIsDrawing, setIsPanning]);

    return {
        isDrawing,
        isPanning,
        currentShape,
        lastPosX,
        lastPosY,
        mouseDownHandler: handleMouseDown,
        mouseMoveHandler: handleMouseMove,
        mouseUpHandler: handleMouseUp
    };
};
