import React, { useState, useRef, useEffect } from 'react';
import { Dimensions } from '@/types';

interface Props {
  box: Dimensions;
  product: Dimensions;
  isCustom: boolean;
  t: { dragToRotate: string };
}

export const BoxVisualizer: React.FC<Props> = ({ box, product, isCustom, t }) => {
  const [rotation, setRotation] = useState({ x: -25, y: 45 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const maxDim = Math.max(box.length, box.width, box.height);
  const baseScale = maxDim > 0 ? 140 / maxDim : 1;
  const scale = baseScale * zoom;

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

  useEffect(() => { // 非passive滚轮事件
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => Math.max(0.3, Math.min(3, prev - e.deltaY * 0.001)));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[320px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing relative overflow-hidden flex items-center justify-center"
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ perspective: '1200px' }}>
      <div className="absolute top-3 left-4 text-xs font-medium text-slate-400 select-none bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm z-10">{t.dragToRotate}</div>
      <div className="absolute top-3 right-4 text-xs font-mono text-slate-400 select-none bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded backdrop-blur-sm z-10">{Math.round(zoom * 100)}%</div>
      <div style={{ position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}>
        <Cube dims={product} color="99, 102, 241" opacity={0.9} scale={scale} />
        <Cube dims={box} color={isCustom ? "245, 158, 11" : "16, 185, 129"} isWireframe={true} scale={scale} />
        <DimensionLabels dims={box} scale={scale} />
      </div>
    </div>
  );
};

const Cube = ({ dims, color, isWireframe = false, opacity = 1, scale }: { dims: Dimensions, color: string, isWireframe?: boolean, opacity?: number, scale: number }) => {
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

// 3D尺寸标注组件
const DimensionLabels: React.FC<{ dims: Dimensions; scale: number }> = ({ dims, scale }) => {
  const l = dims.length * scale, w = dims.width * scale, h = dims.height * scale;
  const offset = 18;
  const labelStyle: React.CSSProperties = { position: 'absolute', fontSize: 12, fontFamily: 'monospace', color: '#ea580c', fontWeight: 700, whiteSpace: 'nowrap', textShadow: '0 0 4px white, 0 0 4px white, 0 0 4px white' };
  const lineStyle: React.CSSProperties = { position: 'absolute', backgroundColor: '#ea580c' };

  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d', left: '50%', top: '50%' }}>
      {/* 长度标注 (X轴, 底部前方) */}
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(0, ${h/2 + offset}px, ${w/2 + offset}px)` }}>
        <div style={{ ...lineStyle, width: l, height: 2, marginLeft: -l/2 }} />
        <div style={{ ...lineStyle, width: 2, height: 10, marginLeft: -l/2 - 1, marginTop: -4 }} />
        <div style={{ ...lineStyle, width: 2, height: 10, marginLeft: l/2 - 1, marginTop: -4 }} />
        <div style={{ ...labelStyle, transform: 'translateX(-50%)', top: 8 }}>{dims.length} cm</div>
      </div>
      {/* 宽度标注 (Z轴, 底部右侧) */}
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${l/2 + offset}px, ${h/2 + offset}px, 0) rotateY(90deg)` }}>
        <div style={{ ...lineStyle, width: w, height: 2, marginLeft: -w/2 }} />
        <div style={{ ...lineStyle, width: 2, height: 10, marginLeft: -w/2 - 1, marginTop: -4 }} />
        <div style={{ ...lineStyle, width: 2, height: 10, marginLeft: w/2 - 1, marginTop: -4 }} />
        <div style={{ ...labelStyle, transform: 'translateX(-50%)', top: 8 }}>{dims.width} cm</div>
      </div>
      {/* 高度标注 (Y轴, 右侧前方) */}
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${l/2 + offset}px, 0, ${w/2 + offset}px)` }}>
        <div style={{ ...lineStyle, width: 2, height: h, marginTop: -h/2 }} />
        <div style={{ ...lineStyle, width: 10, height: 2, marginLeft: -4, marginTop: -h/2 - 1 }} />
        <div style={{ ...lineStyle, width: 10, height: 2, marginLeft: -4, marginTop: h/2 - 1 }} />
        <div style={{ ...labelStyle, transform: 'translateY(-50%) rotate(-90deg)', left: 12 }}>{dims.height} cm</div>
      </div>
    </div>
  );
};
