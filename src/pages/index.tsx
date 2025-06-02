import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useState, useRef, useCallback, useEffect } from 'react';
import AIResponsePanel from './AIResponsePanel';

interface AIResponse {
    text: string;
    timestamp: Date;
    loading: boolean;
}

export default function Overlay() {
    const [box, setBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [showAiPanel, setShowAiPanel] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const overlayRef = useRef<HTMLDivElement>(null);

    // Clear error after 4 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Handle mouse down - start selection
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0 || isCapturing) return;

        e.preventDefault();
        setIsDragging(true);
        setIsVisible(true);
        setError(null);
        setShowAiPanel(false);

        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);

        startPos.current = { x, y };
        setBox({ x, y, width: 0, height: 0 });
    }, [isCapturing]);

    // Handle mouse move - update selection
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || isCapturing) return;

        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const currentX = Math.round(e.clientX - rect.left);
        const currentY = Math.round(e.clientY - rect.top);

        const x = Math.min(startPos.current.x, currentX);
        const y = Math.min(startPos.current.y, currentY);
        const width = Math.abs(currentX - startPos.current.x);
        const height = Math.abs(currentY - startPos.current.y);

        setBox({ x, y, width, height });
    }, [isDragging, isCapturing]);

    // Process AI response
    const processWithAI = useCallback(async (text: any) => {
        setAiResponse({ text: '', timestamp: new Date(), loading: true });
        setShowAiPanel(true);

        try {
            // Process AI in background - don't block the UI
            setAiResponse({
                text: text as string,
                timestamp: new Date(),
                loading: false
            });
        } catch (err) {
            console.error('AI processing failed:', err);
            setAiResponse({
                text: 'AI processing failed. Please try again.',
                timestamp: new Date(),
                loading: false
            });
        } finally {
            // Reset capturing state after AI processing
            setIsCapturing(false);
        }
    }, []);

    // Handle mouse up - finish selection
    const handleMouseUp = useCallback(async () => {
        if (!isDragging || isCapturing) return;

        setIsDragging(false);

        if (box.width < 10 || box.height < 10) {
            setError('Selection too small. Please select a larger area.');
            setIsVisible(false);
            setBox({ x: 0, y: 0, width: 0, height: 0 });
            return;
        }

        try {
            const pixelRatio = window.devicePixelRatio || 1;

            const scaledData = {
                x: Math.round(box.x * pixelRatio),
                y: Math.round(box.y * pixelRatio),
                width: Math.round(box.width * pixelRatio),
                height: Math.round(box.height * pixelRatio),
                pixelRatio: pixelRatio
            };

            console.log('Capturing screenshot with data:', scaledData);

            // Immediately hide overlay and set capturing state
            setIsVisible(false);
            setIsCapturing(true);

            // Minimal delay for UI update - just one frame
            await new Promise(resolve => requestAnimationFrame(resolve));

            const imageData = await invoke("screenshot", scaledData);
            console.log('Screenshot captured successfully');

            // Process with AI in background without blocking
            processWithAI(imageData);

        } catch (err) {
            console.error('Screenshot capture failed:', err);
            setError('Failed to capture screenshot. Please try again.');
            setIsCapturing(false);
        } finally {
            setBox({ x: 0, y: 0, width: 0, height: 0 });
        }
    }, [isDragging, box, isCapturing]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (showAiPanel) {
                    setShowAiPanel(false);
                    return;
                }

                setIsDragging(false);
                setIsVisible(false);
                setIsCapturing(false);
                setError(null);
                setBox({ x: 0, y: 0, width: 0, height: 0 });

                const app = getCurrentWindow();
                app.hide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showAiPanel]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
    }, []);

    const getDimensionsPosition = () => {
        const defaultLeft = box.x + box.width + 16;
        const defaultTop = box.y;

        if (defaultLeft + 140 > window.innerWidth) {
            return { left: box.x - 140, top: defaultTop };
        }

        if (defaultTop + 60 > window.innerHeight) {
            return { left: defaultLeft, top: box.y + box.height - 60 };
        }

        return { left: defaultLeft, top: defaultTop };
    };

    const dimensionsPos = getDimensionsPosition();

    return (
        <div
            ref={overlayRef}
            className={`fixed inset-0 z-50 select-none transition-opacity duration-75 ${isCapturing ? 'cursor-wait bg-transparent opacity-0' : 'cursor-crosshair opacity-100'
                }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
            style={{
                backgroundColor: isCapturing ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                backdropFilter: isCapturing ? 'none' : 'blur(0.5px)'
            }}
        >
            {/* Glassmorphism overlay areas - only visible when not capturing */}
            {isVisible && !isCapturing && (
                <>
                    {/* Top area */}
                    <div
                        className="absolute bg-black/20 backdrop-blur-sm"
                        style={{
                            left: 0, top: 0, width: '100%', height: box.y,
                        }}
                    />
                    {/* Bottom area */}
                    <div
                        className="absolute bg-black/20 backdrop-blur-sm"
                        style={{
                            left: 0, top: box.y + box.height, width: '100%',
                            height: `calc(100% - ${box.y + box.height}px)`,
                        }}
                    />
                    {/* Left area */}
                    <div
                        className="absolute bg-black/20 backdrop-blur-sm"
                        style={{
                            left: 0, top: box.y, width: box.x, height: box.height,
                        }}
                    />
                    {/* Right area */}
                    <div
                        className="absolute bg-black/20 backdrop-blur-sm"
                        style={{
                            left: box.x + box.width, top: box.y,
                            width: `calc(100% - ${box.x + box.width}px)`, height: box.height,
                        }}
                    />
                </>
            )}

            {/* Modern selection box */}
            {isVisible && !isCapturing && (
                <div
                    className="absolute border-2 border-blue-400 transition-all duration-200 animate-pulse"
                    style={{
                        left: box.x, top: box.y, width: box.width, height: box.height,
                        pointerEvents: 'none', backgroundColor: 'transparent',
                        boxShadow: '0 0 0 1px rgba(96, 165, 250, 0.8), 0 0 20px rgba(96, 165, 250, 0.4), inset 0 0 20px rgba(96, 165, 250, 0.1)',
                        borderRadius: '4px',
                    }}
                >
                    {/* Modern corner handles */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full shadow-lg animate-bounce"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.3s' }}></div>

                    {/* Edge handles with modern design */}
                    <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 border border-white rounded-full shadow-md"></div>
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 border border-white rounded-full shadow-md"></div>
                    <div className="absolute -left-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 border border-white rounded-full shadow-md"></div>
                    <div className="absolute -right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 border border-white rounded-full shadow-md"></div>
                </div>
            )}

            {/* Modern floating instructions */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900/95 to-black/95 text-white px-6 py-3 rounded-2xl text-sm font-medium shadow-2xl backdrop-blur-md border border-white/10">
                {isCapturing ? (
                    <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                            Capturing & Processing with AI...
                        </span>
                    </div>
                ) : isDragging ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Release to capture & analyze • <kbd className="bg-white/20 px-2 py-1 rounded text-xs">ESC</kbd> to cancel</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span>Click and drag to select area • <kbd className="bg-white/20 px-2 py-1 rounded text-xs">ESC</kbd> to cancel</span>
                    </div>
                )}
            </div>

            {/* Modern error message */}
            {error && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600/95 to-red-700/95 text-white px-6 py-3 rounded-2xl text-sm font-medium shadow-2xl backdrop-blur-md border border-red-400/30 animate-slide-down">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Modern dimensions display */}
            {isVisible && !isCapturing && box.width > 0 && box.height > 0 && (
                <div
                    className="absolute bg-gradient-to-br from-gray-900/95 to-black/95 text-white px-4 py-3 rounded-xl text-xs font-mono shadow-2xl backdrop-blur-md border border-white/10"
                    style={{
                        left: dimensionsPos.left,
                        top: dimensionsPos.top,
                    }}
                >
                    <div className="text-blue-300 font-semibold">{Math.round(box.width)} × {Math.round(box.height)} px</div>
                    {window.devicePixelRatio > 1 && (
                        <div className="text-gray-400 text-xs mt-1">
                            HiDPI: {Math.round(box.width * window.devicePixelRatio)} × {Math.round(box.height * window.devicePixelRatio)}
                        </div>
                    )}
                </div>
            )}

            {/* Modern AI Response Panel */}
            {showAiPanel && <AIResponsePanel aiResponse={aiResponse} show={showAiPanel} onClose={() => setShowAiPanel(false)} />}

            <style>{`
                @keyframes slide-down {
                    from { transform: translate(-50%, -20px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}