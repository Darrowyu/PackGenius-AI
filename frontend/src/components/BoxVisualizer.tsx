import { useState, useRef } from 'react';
import { Dimensions } from '@/types';

interface Props {
  box: Dimensions;
  product: Dimensions;
  isCustom: boolean;
  t: { dragToRotate: string };
}

export const BoxVisualizer = ({ box, product, isCustom, t }: Props) => {
  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const scale = 140 / Math.max(box.length, box.width, box.height, 1);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - dy * 0.5)),
      y: prev.y + dx * 0.5
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  // 渲染立方体
  const renderCube = (dims: Dimensions, color: string, wireframe = false, opacity = 1) => {
    const sx = dims.length * scale, sy = dims.height * scale, sz = dims.width * scale;
    const baseStyle = { position: 'absolute' as const, width: 0, height: 0, transformStyle: 'preserve-3d' as const, left: '50%', top: '50%' };
    const face = (transform: string, w: number, h: number) => ({
      position: 'absolute' as const, width: w, height: h, transform, marginLeft: -w / 2, marginTop: -h / 2,
      backgroundColor: wireframe ? `rgba(${color}, 0.05)` : `rgba(${color}, ${opacity})`,
      border: wireframe ? `2px solid rgba(${color}, 0.6)` : `1px solid rgba(0,0,0,0.1)`,
      backfaceVisibility: wireframe ? 'visible' as const : 'hidden' as const,
    });
    return (
      <div style={baseStyle}>
        <div style={face(`translateZ(${sz / 2}px)`, sx, sy)} />
        <div style={face(`rotateY(180deg) translateZ(${sz / 2}px)`, sx, sy)} />
        <div style={face(`rotateY(90deg) translateZ(${sx / 2}px)`, sz, sy)} />
        <div style={face(`rotateY(-90deg) translateZ(${sx / 2}px)`, sz, sy)} />
        <div style={face(`rotateX(90deg) translateZ(${sy / 2}px)`, sx, sz)} />
        <div style={face(`rotateX(-90deg) translateZ(${sy / 2}px)`, sx, sz)} />
      </div>
    );
  };

  return (
    <div className="w-full h-[320px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing relative overflow-hidden flex items-center justify-center"
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      style={{ perspective: '1200px' }}>
      <div className="absolute top-3 left-4 text-xs font-medium text-slate-400 select-none bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm z-10">{t.dragToRotate}</div>
      <div style={{ position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}>
        {renderCube(product, '99, 102, 241', false, 0.9)}
        {renderCube(box, isCustom ? '245, 158, 11' : '16, 185, 129', true)}
      </div>
    </div>
  );
};
