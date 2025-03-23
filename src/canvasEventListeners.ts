import * as fabric from 'fabric';

export const setupEventListeners = (canvas: fabric.Canvas, gridSize: number, gridGroup: fabric.Group | undefined) => {
    let isPanning = false;
    let lastPosX: number | undefined;
    let lastPosY: number | undefined;

    // Update grid position on pan
    const handleMouseMove = (opt: fabric.TEvent<MouseEvent>) => {
        if (isPanning && opt.e) {
            const e = opt.e; // Explicitly get the MouseEvent
            const deltaX = e.clientX - (lastPosX || 0);
            const deltaY = e.clientY - (lastPosY || 0);
            canvas.relativePan(new fabric.Point(deltaX, deltaY));
            lastPosX = e.clientX;
            lastPosY = e.clientY;

            const gridExtent = Math.max(canvas.getWidth(), canvas.getHeight()) * 2;

            if (gridGroup) {
                gridGroup.set({
                    left: -gridExtent / 2 + canvas.viewportTransform[4],
                    top: -gridExtent / 2 + canvas.viewportTransform[5]
                });
                canvas.requestRenderAll();
            }
        }
    };

    // Panning
    const handleMouseDown = (opt: fabric.TEvent<MouseEvent>) => {
        if (opt.e && opt.e.altKey) {
            isPanning = true;
            lastPosX = opt.e.clientX;
            lastPosY = opt.e.clientY;
        }
    };

    const handleMouseUp = () => {
        isPanning = false;
    };

            // Snap to grid
            canvas.on('object:moving', (options) => {
                if (options.target) {
                    options.target.set({
                        left: Math.round(options.target.left! / gridSize) * gridSize,
                        top: Math.round(options.target.top! / gridSize) * gridSize
                    });
                }
            });

    // canvas.on('mouse:move', handleMouseMove);
    // canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);
};
