import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Dimensions, PackagingConfig } from '@/types';

interface Props {
  product: Dimensions;
  config: PackagingConfig;
  t: { dragToRotate: string; innerPackTitle: string; masterCartonTitle: string; stackCount?: string };
  showDimensions?: boolean; // 是否显示尺寸标注（计算结果时显示）
}

export const ProductPreview: React.FC<Props> = ({ product, config, t, showDimensions = false }) => {
  const [rotation, setRotation] = useState({ x: -25, y: 35 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { stackCount, masterArr, thickness } = useMemo(() => ({
    stackCount: config.innerBox.stackCount,
    masterArr: config.masterArrangement,
    thickness: config.innerWallThickness
  }), [config]);

  // 叠放模式：内盒尺寸 = 产品长宽 + 壁厚，高度 = 产品高 × 叠放数量 + 壁厚
  const innerBoxDims = useMemo(() => ({
    length: product.length + thickness,
    width: product.width + thickness,
    height: product.height * stackCount + thickness
  }), [product, stackCount, thickness]);

  const masterPayloadDims = useMemo(() => ({
    length: innerBoxDims.length * masterArr.l,
    width: innerBoxDims.width * masterArr.w,
    height: innerBoxDims.height * masterArr.h
  }), [innerBoxDims, masterArr]);

  const maxDim = Math.max(masterPayloadDims.length, masterPayloadDims.width, masterPayloadDims.height, product.length, product.width, product.height * stackCount, 1);
  const baseScale = 100 / maxDim;
  const scale = baseScale * zoom;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotation(prev => ({ x: Math.max(-90, Math.min(90, prev.x - dy * 0.4)), y: prev.y + dx * 0.4 }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

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

  const totalProducts = stackCount * masterArr.l * masterArr.w * masterArr.h;
  const hasValidProduct = product.length > 0 || product.width > 0 || product.height > 0;

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl cursor-grab active:cursor-grabbing relative overflow-hidden flex items-center justify-center select-none"
      onMouseDown={handleMouseDown} style={{ perspective: '1200px' }}>
      <div className="absolute top-3 left-4 text-xs font-medium text-slate-400 select-none bg-white/70 dark:bg-slate-800/70 px-2 py-1 rounded backdrop-blur-sm z-10">{t.dragToRotate}</div>
      <div className="absolute top-12 left-4 text-xs font-mono text-slate-400 select-none bg-white/70 dark:bg-slate-800/70 px-2 py-1 rounded backdrop-blur-sm z-10">{Math.round(zoom * 100)}%</div>
      
      <div className="absolute top-3 right-4 text-xs text-right space-y-1 z-10">
        <div className="bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded backdrop-blur-sm">
          <span className="opacity-70">{t.stackCount || '叠放'}:</span> <span className="font-mono font-medium">{stackCount} pcs</span>
        </div>
        <div className="bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded backdrop-blur-sm">
          <span className="opacity-70">{t.masterCartonTitle}:</span> <span className="font-mono font-medium">{masterArr.l}×{masterArr.w}×{masterArr.h}</span>
        </div>
      </div>

      <div className="absolute bottom-3 left-4 text-xs space-y-1 z-10">
        <div className="font-mono text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 px-2 py-1 rounded backdrop-blur-sm">
          产品: {product.length || 0} × {product.width || 0} × {product.height || 0} cm
        </div>
        <div className="font-mono text-indigo-600 dark:text-indigo-400 bg-white/70 dark:bg-slate-800/70 px-2 py-1 rounded backdrop-blur-sm">
          内盒: {innerBoxDims.length.toFixed(0)} × {innerBoxDims.width.toFixed(0)} × {innerBoxDims.height.toFixed(0)} cm
        </div>
        <div className="font-mono text-amber-600 dark:text-amber-400 bg-white/70 dark:bg-slate-800/70 px-2 py-1 rounded backdrop-blur-sm">
          外箱内装: {masterPayloadDims.length.toFixed(0)} × {masterPayloadDims.width.toFixed(0)} × {masterPayloadDims.height.toFixed(0)} cm
        </div>
      </div>

      <div className="absolute bottom-3 right-4 text-xs z-10 bg-purple-100/80 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded backdrop-blur-sm">
        总数量: <span className="font-mono font-bold">{totalProducts}</span> pcs
      </div>

      <div style={{ position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transition: 'transform 0.1s ease-out' }}>
        {hasValidProduct ? (
          <>
            {/* 渲染内盒排列 */}
            {Array.from({ length: masterArr.l }).map((_, ml) =>
              Array.from({ length: masterArr.w }).map((_, mw) =>
                Array.from({ length: masterArr.h }).map((_, mh) => (
                  <StackedInnerBox key={`${ml}-${mw}-${mh}`} product={product} stackCount={stackCount} thickness={thickness} scale={scale}
                    offset={{ x: (ml - (masterArr.l - 1) / 2) * innerBoxDims.length, y: (mh - (masterArr.h - 1) / 2) * innerBoxDims.height, z: (mw - (masterArr.w - 1) / 2) * innerBoxDims.width }} />
                ))
              )
            )}
            {/* 尺寸标注线 - 仅在计算结果时显示 */}
            {showDimensions && <DimensionLabels dims={masterPayloadDims} scale={scale} />}
          </>
        ) : null}
      </div>
    </div>
  );
};

// 叠放内盒组件
const StackedInnerBox: React.FC<{ product: Dimensions; stackCount: number; thickness: number; scale: number; offset: { x: number; y: number; z: number } }> = 
  ({ product, stackCount, thickness, scale, offset }) => {
  const boxL = (product.length + thickness) * scale;
  const boxW = (product.width + thickness) * scale;
  const boxH = (product.height * stackCount + thickness) * scale;
  const ox = offset.x * scale, oy = offset.y * scale, oz = offset.z * scale;

  // 显示叠放的产品（最多显示5层，避免性能问题）
  const displayCount = Math.min(stackCount, 5);
  const productH = product.height * scale;

  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${ox}px, ${-oy}px, ${oz}px)` }}>
      {/* 内盒边框 */}
      <Cube w={boxL} h={boxH} d={boxW} color="16, 185, 129" opacity={0.15} border />
      {/* 叠放的产品 */}
      {Array.from({ length: displayCount }).map((_, i) => {
        const py = (i - (displayCount - 1) / 2) * (boxH / displayCount);
        return <Cube key={i} w={product.length * scale} h={productH} d={product.width * scale} color="99, 102, 241" opacity={0.8} offset={{ x: 0, y: -py, z: 0 }} />;
      })}
    </div>
  );
};

const Cube: React.FC<{ w: number; h: number; d: number; color: string; opacity: number; border?: boolean; offset?: { x: number; y: number; z: number } }> = 
  ({ w, h, d, color, opacity, border, offset = { x: 0, y: 0, z: 0 } }) => {
  const face = (transform: string, fw: number, fh: number): React.CSSProperties => ({
    position: 'absolute', width: fw, height: fh, transform, marginLeft: -fw / 2, marginTop: -fh / 2,
    backgroundColor: `rgba(${color}, ${opacity})`,
    border: border ? `1.5px dashed rgba(${color}, 0.6)` : `1px solid rgba(0,0,0,0.1)`,
    boxShadow: border ? 'none' : 'inset 0 0 8px rgba(0,0,0,0.1)', backfaceVisibility: border ? 'visible' : 'hidden',
  });
  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${offset.x}px, ${offset.y}px, ${offset.z}px)` }}>
      <div style={face(`translateZ(${d / 2}px)`, w, h)} />
      <div style={face(`rotateY(180deg) translateZ(${d / 2}px)`, w, h)} />
      <div style={face(`rotateY(90deg) translateZ(${w / 2}px)`, d, h)} />
      <div style={face(`rotateY(-90deg) translateZ(${w / 2}px)`, d, h)} />
      <div style={face(`rotateX(90deg) translateZ(${h / 2}px)`, w, d)} />
      <div style={face(`rotateX(-90deg) translateZ(${h / 2}px)`, w, d)} />
    </div>
  );
};

// 3D尺寸标注组件
const DimensionLabels: React.FC<{ dims: Dimensions; scale: number }> = ({ dims, scale }) => {
  const l = dims.length * scale, w = dims.width * scale, h = dims.height * scale;
  const offset = 15; // 标注线偏移距离
  const labelStyle: React.CSSProperties = { position: 'absolute', fontSize: 11, fontFamily: 'monospace', color: '#ea580c', fontWeight: 600, whiteSpace: 'nowrap', textShadow: '0 0 3px white, 0 0 3px white' };
  const lineStyle: React.CSSProperties = { position: 'absolute', backgroundColor: '#ea580c' };

  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
      {/* 长度标注 (X轴, 底部前方) */}
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(0, ${h/2 + offset}px, ${w/2 + offset}px)` }}>
        <div style={{ ...lineStyle, width: l, height: 2, marginLeft: -l/2 }} />
        <div style={{ ...lineStyle, width: 2, height: 8, marginLeft: -l/2 - 1, marginTop: -3 }} />
        <div style={{ ...lineStyle, width: 2, height: 8, marginLeft: l/2 - 1, marginTop: -3 }} />
        <div style={{ ...labelStyle, transform: 'translateX(-50%)', top: 6 }}>{dims.length.toFixed(1)} cm</div>
      </div>
      {/* 宽度标注 (Z轴, 底部右侧) */}
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${l/2 + offset}px, ${h/2 + offset}px, 0) rotateY(90deg)` }}>
        <div style={{ ...lineStyle, width: w, height: 2, marginLeft: -w/2 }} />
        <div style={{ ...lineStyle, width: 2, height: 8, marginLeft: -w/2 - 1, marginTop: -3 }} />
        <div style={{ ...lineStyle, width: 2, height: 8, marginLeft: w/2 - 1, marginTop: -3 }} />
        <div style={{ ...labelStyle, transform: 'translateX(-50%)', top: 6 }}>{dims.width.toFixed(1)} cm</div>
      </div>
      {/* 高度标注 (Y轴, 右侧前方) */}
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${l/2 + offset}px, 0, ${w/2 + offset}px)` }}>
        <div style={{ ...lineStyle, width: 2, height: h, marginTop: -h/2 }} />
        <div style={{ ...lineStyle, width: 8, height: 2, marginLeft: -3, marginTop: -h/2 - 1 }} />
        <div style={{ ...lineStyle, width: 8, height: 2, marginLeft: -3, marginTop: h/2 - 1 }} />
        <div style={{ ...labelStyle, transform: 'translateY(-50%) rotate(-90deg)', left: 10 }}>{dims.height.toFixed(1)} cm</div>
      </div>
    </div>
  );
};
