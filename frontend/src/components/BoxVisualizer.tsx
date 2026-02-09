import React, { useState, useRef } from 'react';
import { Dimensions } from '@/types';

interface Props {
  box: Dimensions;
  product: Dimensions;
  isCustom: boolean;
  t: { dragToRotate: string };
}

export const BoxVisualizer: React.FC<Props> = ({ box, product, isCustom, t }) => {
  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const maxDim = Math.max(box.length, box.width, box.height);
  const scale = maxDim > 0 ? 140 / maxDim : 1;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => setIsDragging(false);

  const Cube = ({ dims, color, isWireframe = false, opacity = 1 }: { dims: Dimensions, color: string, isWireframe?: boolean, opacity?: number }) => {
    const { length: x, height: y, width: z } = dims;
    const sx = x * scale, sy = y * scale, sz = z * scale;
    const style: React.CSSProperties = { position: 'absolute', width: 0, height: 0, transformStyle: 'preserve-3d', transform: 'translate3d(0, 0, 0)', left: '50%', top: '50%' };
    const faceStyle = (transform: string, w: number, h: number): React.CSSProperties => ({
      position: 'absolute', width: w, height: h, transform, marginLeft: -w / 2, marginTop: -h / 2,
      backgroundColor: isWireframe ? `rgba(${color}, 0.05)` : `rgba(${color}, ${opacity})`,
      border: isWireframe ? `2px solid rgba(${color}, 0.6)` : `1px solid rgba(0,0,0,0.1)`,
      boxShadow: isWireframe ? 'none' : 'inset 0 0 10px rgba(0,0,0,0.1)',
      backfaceVisibility: isWireframe ? 'visible' : 'hidden', transition: 'all 0.3s ease', pointerEvents: 'none',
    });
    return (
      <div style={style}>
        <div style={faceStyle(`translateZ(${sz / 2}px)`, sx, sy)} />
        <div style={faceStyle(`rotateY(180deg) translateZ(${sz / 2}px)`, sx, sy)} />
        <div style={faceStyle(`rotateY(90deg) translateZ(${sx / 2}px)`, sz, sy)} />
        <div style={faceStyle(`rotateY(-90deg) translateZ(${sx / 2}px)`, sz, sy)} />
        <div style={faceStyle(`rotateX(90deg) translateZ(${sy / 2}px)`, sx, sz)} />
        <div style={faceStyle(`rotateX(-90deg) translateZ(${sy / 2}px)`, sx, sz)} />
      </div>
    );
  };

  return (
    <div className="w-full h-[320px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing relative overflow-hidden flex items-center justify-center"
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ perspective: '1200px' }}>
      <div className="absolute top-3 left-4 text-xs font-medium text-slate-400 select-none bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm z-10">{t.dragToRotate}</div>
      <div style={{ position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}>
        <Cube dims={product} color="99, 102, 241" opacity={0.9} />
        <Cube dims={box} color={isCustom ? "245, 158, 11" : "16, 185, 129"} isWireframe={true} />
      </div>
    </div>
  );
};
