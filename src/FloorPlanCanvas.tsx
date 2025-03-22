// FloorPlanCanvas.tsx
import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import './FloorPlanCanvas.css';

interface FloorPlanCanvasProps {
    selectedTool: string | null;
}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ selectedTool }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current;
    
        if (canvasElement) {
            const container = canvasElement.parentElement; // Get the parent container
            if (!container) return;
    
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
    
            // Set canvas dimensions explicitly
            canvasElement.width = containerWidth;
            canvasElement.height = containerHeight;
    
            fabricRef.current = new fabric.Canvas(canvasElement, {
                width: containerWidth,
                height: containerHeight,
                backgroundColor: '#f0f0f0',
                renderOnAddRemove: true,
            });
    
            const canvas = fabricRef.current;
    
            // Recalculate offsets and zoom
            canvas.calcOffset();
            canvas.setZoom(1); // Ensure no zoom scaling issues
    
            let isDrawing = false;
            let currentLine: fabric.Line | null = null;
    
            const handleMouseDown = (event: fabric.TEvent) => {
                if (selectedTool === 'line') {
                    isDrawing = true;
                    const pointer = canvas.getPointer(event.e);
                    const points = [pointer.x, pointer.y, pointer.x, pointer.y] as [number, number, number, number];
                    currentLine = new fabric.Line(points, {
                        strokeWidth: 3,
                        stroke: 'black',
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                    });
                    canvas.add(currentLine);
                }
            };
    
            const handleMouseMove = (event: fabric.TEvent) => {
                if (!isDrawing || selectedTool !== 'line') return;
    
                const pointer = canvas.getPointer(event.e);
                if (currentLine) {
                    currentLine.set({ x2: pointer.x, y2: pointer.y });
                    canvas.requestRenderAll();
                }
            };
    
            const handleMouseUp = () => {
                isDrawing = false;
                currentLine = null;
            };
    
            canvas.on('mouse:down', handleMouseDown);
            canvas.on('mouse:move', handleMouseMove);
            canvas.on('mouse:up', handleMouseUp);
    
            return () => {
                if (fabricRef.current) {
                    canvas.off('mouse:down', handleMouseDown);
                    canvas.off('mouse:move', handleMouseMove);
                    canvas.off('mouse:up', handleMouseUp);
                    fabricRef.current.dispose();
                }
            };
        }
    }, [selectedTool]);
    

    return (
        <div className="floorPlanCanvasContainer">
            <canvas ref={canvasRef} id="fabricCanvas" className="floorPlanCanvas" />
        </div>
    );
};

export default FloorPlanCanvas;
