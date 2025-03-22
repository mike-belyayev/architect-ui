import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import './FloorPlanCanvas.css';

interface FloorPlanCanvasProps {}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current;

        if (canvasElement) {
            // Get the *display* width and height from CSS
            const canvasWidth = canvasElement.offsetWidth;
            const canvasHeight = canvasElement.offsetHeight;

            // Set the *drawing surface* size (resolution) to be larger for better quality
            // You can adjust these values to control the resolution
            const drawingSurfaceWidth = canvasWidth * 2;  // Double the display width
            const drawingSurfaceHeight = canvasHeight * 2; // Double the display height

            canvasElement.width = drawingSurfaceWidth;   // Set the attribute
            canvasElement.height = drawingSurfaceHeight;  // Set the attribute

            fabricRef.current = new fabric.Canvas(canvasElement, {
                width: drawingSurfaceWidth,   // Use the drawing surface width
                height: drawingSurfaceHeight,  // Use the drawing surface height
                backgroundColor: '#f0f0f0',
                renderOnAddRemove: true,       // Ensure proper rendering
            });
            const canvas = fabricRef.current;
            canvas.calcOffset();
            // Scale all objects on the canvas to fit the new size:
            canvas.setZoom(Math.min(canvasWidth / drawingSurfaceWidth, canvasHeight / drawingSurfaceHeight));

            const rect = new fabric.Rect({
                left: 100,
                top: 100,
                fill: 'blue',
                width: 200,
                height: 50,
                selectable: true
            });
            canvas.add(rect);

            const line = new fabric.Line([50, 50, 250, 150], {
                stroke: 'black',
                strokeWidth: 3
            });
            canvas.add(line);

            return () => {
                if (fabricRef.current) {
                    fabricRef.current.dispose();
                }
            };
        }
    }, []);

    return (
        <div className="floorPlanCanvasContainer">
            <canvas ref={canvasRef} id="fabricCanvas" className="floorPlanCanvas" />
        </div>
    );
};

export default FloorPlanCanvas;
