import useDraw from '@/hooks/useDraw';
import { useState } from 'react';
import { FiDownload, FiSave } from 'react-icons/fi';
import { GrPowerReset } from "react-icons/gr";

const DrawingCanvas: React.FC = () => {

    const [color, setColor] = useState('black');
    const [lineWidth, setLineWidth] = useState(2);

    const storageKey = 'drawing-canvas-data';

    const { canvasRef, clearCanvas, saveDrawing, loadDrawing } = useDraw(color, lineWidth, storageKey);

    const handleReset = () => {
        if (confirm("Are you sure you want to clear the canvas? This cannot be undone.")) {
            clearCanvas();
        }
    };

    const handleSave = () => {
        saveDrawing();
        alert("Drawing saved successfully!");
    };

    const handleExport = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {

            const link = document.createElement('a');
            link.download = 'drawing.png';

            link.href = canvas.toDataURL('image/png');

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting canvas:', error);
            alert('Failed to export drawing. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center h-full bg-neutral-900">
            {/* Tools area */}
            <div className="flex gap-3 text-neutral-400 h-[4rem] w-full items-center justify-between px-4 py-2">
                <label className="flex items-center gap-2">
                    <span className="text-neutral-400">Color:</span>
                    <div
                        className="w-10 h-10 rounded-full border border-neutral-800 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => document.getElementById('colorPicker')?.click()}
                    />

                    <input
                        id="colorPicker"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="hidden"
                    />
                </label>

                <label className="flex items-center gap-2">
                    <span className="text-neutral-400">Size:</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(parseInt(e.target.value))}
                        className="w-24"
                    />
                </label>

                <div className='flex items-center justify-center gap-2'>
                    <button
                        className='flex text-white  tracking-wider items-center justify-center px-2 py-1 border border-indigo-400 rounded-md bg-indigo-400 bg-opacity-55  gap-2 hover:bg-opacity-70 transition-colors'
                        onClick={handleReset}
                        title="Clear canvas"
                    >
                        reset
                        <GrPowerReset className='opacity-75 text-white' />
                    </button>

                    <button
                        className='flex text-white  tracking-wider items-center justify-center px-2 py-1 border border-neutral-700 rounded-md bg-neutral-800 gap-2 transition-colors bg-opacity-50 hover:bg-opacity-90 '
                        onClick={handleSave}
                        title="Save drawing"
                    >
                        save
                        <FiSave className='opacity-75 text-white' />
                    </button>

                    <button
                        className='flex text-white  tracking-wider items-center justify-center px-2 py-1 border border-neutral-700 rounded-md bg-neutral-800 gap-2 transition-colors bg-opacity-50 hover:bg-opacity-90'
                        onClick={handleExport}
                        title="Download as PNG"
                    >
                        export
                        <FiDownload className='opacity-75 text-white' />
                    </button>
                </div>
            </div>

            {/* Canvas container */}
            <div className='flex justify-center items-center flex-1 w-full p-4'>
                <div className="border border-neutral-700 rounded-md bg-neutral-800 w-full h-full">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full touch-none"
                    />
                </div>
            </div>
        </div>
    )
}
export default DrawingCanvas;