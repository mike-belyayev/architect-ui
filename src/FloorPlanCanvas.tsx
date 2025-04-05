// FloorPlanCanvas.tsx
import React, {
    useRef,
    useEffect,
    useContext
} from 'react';
import * as fabric from 'fabric';
import {
    AppContext
} from './ContextProvider';
import './FloorPlanCanvas.css';
import {
    createGrid,
    handleDelete,
    updateShape
} from './utils/canvasUtils';

// Mouse Event Handlers
import {
    // handleMouseDown,
    // handleMouseMove,
    // handleMouseUp,
    handleMouseWheel,
    handleKeyDown
} from './utils/canvasHandlers';

//Key Hook
import {
    useCanvasHandlers
} from './hooks/useCanvasHandlers';

interface FloorPlanCanvasProps {
    selectedTool: string | null;
}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = () => {
    const {
        selectedTool,
        setSelectedTool
    } = useContext(AppContext)!;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (canvasElement && !fabricRef.current) {
            const canvas = new fabric.Canvas(canvasElement, {
                width: canvasElement.offsetWidth,
                height: canvasElement.offsetHeight,
                backgroundColor: 'white',
            });
            fabricRef.current = canvas;

            // Add grid
            const gridSize = 50; // 50 pixels = 10cm (adjust as needed)
            createGrid(canvas, gridSize);

            // Snap to grid
            canvas.on('object:moving', (options) => {
                if (options.target) {
                    options.target.set({
                        left: Math.round(options.target.left! / gridSize) * gridSize,
                        top: Math.round(options.target.top! / gridSize) * gridSize
                    });
                }
            });

            // Add zoom functionality
            canvas.on('mouse:wheel', (opt: fabric.TEvent<WheelEvent>) => {
                handleMouseWheel(opt, canvas);
            });

            // Handle Key Down
            document.addEventListener('keydown', (e) => {
                handleKeyDown(e, canvas);
            });

            return () => {
                document.removeEventListener('keydown', (e) => {
                    handleKeyDown(e, canvas);
                });
            };
        }
    }, []); // Empty dependency array ensures this runs only once

    const {
        isDrawing,
        isPanning,
        currentShape,
        lastPosX,
        lastPosY,
        mouseDownHandler,
        mouseMoveHandler,
        mouseUpHandler
    } = useCanvasHandlers({
        canvas: fabricRef.current as fabric.Canvas,
        selectedTool
    });

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        if (isDrawing === undefined) return;

        canvas.on('mouse:down', mouseDownHandler);
        canvas.on('mouse:move', mouseMoveHandler);
        canvas.on('mouse:up', mouseUpHandler);

        return () => {
            canvas.off('mouse:down', mouseDownHandler);
            canvas.off('mouse:move', mouseMoveHandler);
            canvas.off('mouse:up', mouseUpHandler);
        };
    }, [selectedTool, isDrawing, isPanning, currentShape, lastPosX, lastPosY]);

    return (<div className="floorPlanCanvasContainer" >
        <
            canvas ref={
                canvasRef
            }
            className="floorPlanCanvas" />
    </div>
    );
};

export default FloorPlanCanvas;
