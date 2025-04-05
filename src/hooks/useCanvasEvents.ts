// hooks/useCanvasEvents.ts
import {
    useEffect,
    useState
} from 'react';
import * as fabric from 'fabric';
import {
    updateShape,
    handleDelete
} from '../utils/canvasUtils';

interface UseCanvasEventHandlingProps {
    canvas: fabric.Canvas | null;
    selectedTool: string | null;
}

export const useCanvasEvents = ({
    canvas,
    selectedTool
}: UseCanvasEventHandlingProps) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [currentShape, setCurrentShape] = useState < fabric.Object | null > (null);
    const [lastPosX, setLastPosX] = useState(0);
    const [lastPosY, setLastPosY] = useState(0);

    useEffect(() => {
        if (!canvas) return;

        const handleMouseDown = (event: fabric.TEvent) => {
            if (event.e instanceof MouseEvent) {
                if (event.e.button === 0 && event.e.altKey) {
                    setIsPanning(true);
                    canvas.selection = false;
                    setLastPosX(event.e.clientX);
                    setLastPosY(event.e.clientY);
                    canvas.setCursor('move');
                    event.e.preventDefault();
                } else if (event.e.button === 0) {
                    setIsDrawing(true);
                    const pointer = canvas.getPointer(event.e);

                    let shapeOptions: any = {
                        strokeWidth: 2,
                        stroke: 'black',
                        fill: 'transparent',
                        originX: 'left',
                        originY: 'top',
                    };

                    let newShape: fabric.Object | null = null;
                    switch (selectedTool) {
                        case 'line':
                            newShape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], shapeOptions);
                            break;
                        case 'rectangle':
                            newShape = new fabric.Rect({
                                left: pointer.x,
                                top: pointer.y,
                                width: 0,
                                height: 0,
                                ...shapeOptions
                            });
                            break;
                        case 'circle':
                            newShape = new fabric.Circle({
                                left: pointer.x,
                                top: pointer.y,
                                radius: 0,
                                ...shapeOptions
                            });
                            break;
                    }

                    if (newShape) {
                        canvas.add(newShape);
                        setCurrentShape(newShape);
                    }
                }
            }
        };

        const handleMouseMove = (event: fabric.TEvent) => {
            if (event.e instanceof MouseEvent) {
                if (isPanning) {
                    let vpt = canvas.viewportTransform;
                    if (!vpt) return;
                    vpt[4] += event.e.clientX - lastPosX;
                    vpt[5] += event.e.clientY - lastPosY;
                    canvas.requestRenderAll();
                } else if (isDrawing && currentShape) {
                    const pointer = canvas.getPointer(event.e);
                    updateShape(pointer, selectedTool, currentShape, canvas);
                }
            }
        };

        const handleMouseUp = () => {
            setIsDrawing(false);
            setIsPanning(false);
            canvas.selection = true;
            canvas.setCursor('default');
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                handleDelete(canvas);
            }
        };

        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:up', handleMouseUp);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            canvas.off('mouse:down', handleMouseDown);
            canvas.off('mouse:move', handleMouseMove);
            canvas.off('mouse:up', handleMouseUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [canvas, selectedTool, isDrawing, isPanning, currentShape, lastPosX, lastPosY]);
};
