import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import './FloorPlanCanvas.css';

interface FloorPlanCanvasProps {
    selectedTool: string | null;
}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ selectedTool }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const createGrid = (canvas: fabric.Canvas, gridSize: number) => {
        const width = canvas.getWidth();
        const height = canvas.getHeight();

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

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (canvasElement && !fabricRef.current) {
            const canvas = new fabric.Canvas(canvasElement, {
                width: canvasElement.offsetWidth,
                height: canvasElement.offsetHeight,
                backgroundColor: '#f0f0f0',
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
            });

        }
    }, []); // Empty dependency array ensures this runs only once

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        let isDrawing = false;
        let isPanning = false;
        let currentShape: fabric.Object | null = null;
        let lastPosX: number;
        let lastPosY: number;

        const handleMouseDown = (event: fabric.TEvent) => {
            if (event.e instanceof MouseEvent) {
                if (event.e.button === 0 && event.e.altKey) { // Left mouse button + Alt key
                    isPanning = true;
                    canvas.selection = false; // disable selection during panning
                    lastPosX = event.e.clientX;
                    lastPosY = event.e.clientY;
                    canvas.setCursor('move');
                    event.e.preventDefault(); // prevent text selection etc.
                } else if (event.e.button === 0) { // Left mouse button
                    isDrawing = true;
                    const pointer = canvas.getPointer(event.e);

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
                    }
                }
            } else if (event.e instanceof TouchEvent) {
                isDrawing = true;
                const touch = event.e.touches[0];
                if (touch) {
                    const pointerEvent = new PointerEvent('pointermove', {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        pointerId: touch.identifier,
                        pointerType: 'touch'
                    });
                    const pointer = canvas.getPointer(pointerEvent);

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
                    }
                }
            }
        };

        const handleMouseMove = (event: fabric.TEvent) => {
            if (event.e instanceof MouseEvent) {
                if (isPanning) {
                    const vpt = canvas.viewportTransform;
                    if (!vpt) return;
                    vpt[4] += event.e.clientX - lastPosX;
                    vpt[5] += event.e.clientY - lastPosY;
                    canvas.requestRenderAll();
                    lastPosX = event.e.clientX;
                    lastPosY = event.e.clientY;
                } else if (isDrawing && currentShape) {
                    const pointer = canvas.getPointer(event.e);
                    updateShape(pointer);
                }
            } else if (event.e instanceof TouchEvent) {
                const touch = event.e.touches[0];
                if (touch) {
                    const pointerEvent = new PointerEvent('pointermove', {
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        pointerId: touch.identifier,
                        pointerType: 'touch'
                    });
                    const pointer = canvas.getPointer(pointerEvent);
                    updateShape(pointer);
                }
            }
        };

        const updateShape = (pointer: { x: number; y: number }) => {
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


        const handleMouseUp = () => {
            isDrawing = false;
            isPanning = false;
            currentShape = null;
            canvas.selection = true; // re-enable selection
            canvas.setCursor('default');
        };

        canvas.on('mouse:down', handleMouseDown);
        canvas.on('mouse:move', handleMouseMove);
        canvas.on('mouse:up', handleMouseUp);

        return () => {
            canvas.off('mouse:down', handleMouseDown);
            canvas.off('mouse:move', handleMouseMove);
            canvas.off('mouse:up', handleMouseUp);
        };
    }, [selectedTool]);


    return (
        <div className="floorPlanCanvasContainer">
            <canvas ref={canvasRef} className="floorPlanCanvas" />
        </div>
    );
};

export default FloorPlanCanvas;
