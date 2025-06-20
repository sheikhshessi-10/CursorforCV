
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

const WordRuler: React.FC = () => {
  const [leftMargin, setLeftMargin] = useState(64);
  const [rightMargin, setRightMargin] = useState(64);
  const [firstLineIndent, setFirstLineIndent] = useState(80);
  const [hangingIndent, setHangingIndent] = useState(64);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [tabStops, setTabStops] = useState<number[]>([160, 320, 480, 640]);
  const rulerRef = useRef<HTMLDivElement>(null);

  const generateTicks = () => {
    const ticks = [];
    for (let i = 0; i <= 16; i++) {
      const isInch = i % 4 === 0;
      const isHalfInch = i % 2 === 0;
      
      ticks.push(
        <div
          key={i}
          className={cn(
            "absolute border-l border-gray-400",
            isInch ? "h-4" : isHalfInch ? "h-3" : "h-2"
          )}
          style={{ left: `${(i / 16) * 100}%` }}
        >
          {isInch && (
            <span className="absolute -top-5 -left-1 text-xs text-gray-600">
              {i / 4}
            </span>
          )}
        </div>
      );
    }
    return ticks;
  };

  const handleMouseDown = (type: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rulerRef.current) return;
    
    const rect = rulerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const maxWidth = rect.width;
    
    switch (isDragging) {
      case 'leftMargin':
        setLeftMargin(Math.max(16, Math.min(x, maxWidth - rightMargin - 32)));
        break;
      case 'rightMargin':
        setRightMargin(Math.max(16, Math.min(maxWidth - x, maxWidth - leftMargin - 32)));
        break;
      case 'firstLineIndent':
        setFirstLineIndent(Math.max(leftMargin, Math.min(x, maxWidth - rightMargin - 16)));
        break;
      case 'hangingIndent':
        setHangingIndent(Math.max(leftMargin, Math.min(x, maxWidth - rightMargin - 16)));
        break;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleRulerClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    
    // Add tab stop
    if (x > leftMargin && x < rect.width - rightMargin) {
      const newTabStops = [...tabStops, x].sort((a, b) => a - b);
      setTabStops(newTabStops);
    }
  };

  const removeTabStop = (index: number) => {
    const newTabStops = tabStops.filter((_, i) => i !== index);
    setTabStops(newTabStops);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const maxWidth = rect.width;
        
        switch (isDragging) {
          case 'leftMargin':
            setLeftMargin(Math.max(16, Math.min(x, maxWidth - rightMargin - 32)));
            break;
          case 'rightMargin':
            setRightMargin(Math.max(16, Math.min(maxWidth - x, maxWidth - leftMargin - 32)));
            break;
          case 'firstLineIndent':
            setFirstLineIndent(Math.max(leftMargin, Math.min(x, maxWidth - rightMargin - 16)));
            break;
          case 'hangingIndent':
            setHangingIndent(Math.max(leftMargin, Math.min(x, maxWidth - rightMargin - 16)));
            break;
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, leftMargin, rightMargin]);

  return (
    <div 
      ref={rulerRef}
      className="h-8 bg-white border-b border-gray-300 relative select-none cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleRulerClick}
    >
      {/* Ruler background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"></div>
      
      {/* Left margin indicator */}
      <div 
        className="absolute top-0 w-3 h-8 bg-blue-500 cursor-ew-resize hover:bg-blue-600 transition-colors z-10"
        style={{ left: `${leftMargin - 6}px` }}
        onMouseDown={(e) => handleMouseDown('leftMargin', e)}
        title="Left Margin"
      >
        <div className="absolute top-1 left-0.5 w-2 h-2 bg-white rounded-sm"></div>
      </div>
      
      {/* Right margin indicator */}
      <div 
        className="absolute top-0 w-3 h-8 bg-blue-500 cursor-ew-resize hover:bg-blue-600 transition-colors z-10"
        style={{ right: `${rightMargin - 6}px` }}
        onMouseDown={(e) => handleMouseDown('rightMargin', e)}
        title="Right Margin"
      >
        <div className="absolute top-1 right-0.5 w-2 h-2 bg-white rounded-sm"></div>
      </div>
      
      {/* First line indent */}
      <div 
        className="absolute top-0 w-3 h-4 bg-green-500 cursor-ew-resize hover:bg-green-600 transition-colors z-10"
        style={{ left: `${firstLineIndent - 6}px` }}
        onMouseDown={(e) => handleMouseDown('firstLineIndent', e)}
        title="First Line Indent"
      >
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-green-500 absolute top-4 left-0"></div>
      </div>

      {/* Hanging indent */}
      <div 
        className="absolute bottom-0 w-3 h-4 bg-orange-500 cursor-ew-resize hover:bg-orange-600 transition-colors z-10"
        style={{ left: `${hangingIndent - 6}px` }}
        onMouseDown={(e) => handleMouseDown('hangingIndent', e)}
        title="Hanging Indent"
      >
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-500 absolute bottom-4 left-0"></div>
      </div>
      
      {/* Tab stops */}
      {tabStops.map((position, index) => (
        <div
          key={index}
          className="absolute bottom-0 w-2 h-2 bg-gray-600 cursor-pointer hover:bg-gray-800 transition-colors z-10"
          style={{ left: `${position - 4}px` }}
          onClick={(e) => {
            e.stopPropagation();
            removeTabStop(index);
          }}
          title="Tab Stop (click to remove)"
        >
          <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-600"></div>
        </div>
      ))}
      
      {/* Ruler ticks */}
      <div className="relative h-full" style={{ marginLeft: `${leftMargin}px`, marginRight: `${rightMargin}px` }}>
        {generateTicks()}
      </div>
      
      {/* Tab stops area */}
      <div className="absolute bottom-0 left-0 right-0 h-2 border-t border-gray-200 bg-gray-50"></div>
    </div>
  );
};

export default WordRuler;
