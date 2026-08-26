'use client';

import { useRef, useState, useEffect, useCallback, MouseEvent, WheelEvent, TouchEvent } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalClose } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GoldTriangle } from '@/components/ui/GoldTriangle';
import type {
  HDCenter,
  HDChannel,
  HDGate,
  CenterType,
  CenterStatus,
  BodygraphCenterPosition,
  BodygraphChannelPath,
} from './types';
import { BODYGRAPH_CENTER_POSITIONS, CHANNEL_CONNECTIONS, CENTER_GATES } from './types';

interface BodygraphSVGProps {
  centers: HDCenter[];
  channels: HDChannel[];
  gates: HDGate[];
  definitionType?: string;
  width?: number;
  height?: number;
  onCenterClick?: (center: HDCenter) => void;
  onChannelClick?: (channel: HDChannel) => void;
  onGateClick?: (gate: HDGate) => void;
  className?: string;
}

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 1000;

function getCenterPosition(centerType: CenterType): BodygraphCenterPosition {
  return BODYGRAPH_CENTER_POSITIONS[centerType];
}

function getChannelPath(channel: HDChannel): string {
  const startPos = getCenterPosition(channel.center_start);
  const endPos = getCenterPosition(channel.center_end);

  const startX = startPos.x;
  const startY = startPos.y;
  const endX = endPos.x;
  const endY = endPos.y;

  // Calculate control points for curved paths
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Offset for curve
  const offset = Math.min(distance * 0.3, 100);
  const perpX = -dy / distance * offset;
  const perpY = dx / distance * offset;

  const ctrlX = midX + perpX;
  const ctrlY = midY + perpY;

  return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
}

function getGatePosition(centerType: CenterType, gateNumber: number, gateIndex: number, totalGates: number): { x: number; y: number } {
  const centerPos = getCenterPosition(centerType);
  const angleStep = (2 * Math.PI) / Math.max(totalGates, 1);
  const startAngle = -Math.PI / 2; // Start at top
  const angle = startAngle + gateIndex * angleStep;
  const radius = centerPos.radius + 25; // Outside the center circle
  return {
    x: centerPos.x + Math.cos(angle) * radius,
    y: centerPos.y + Math.sin(angle) * radius,
  };
}

const CENTER_LABELS: Record<CenterType, string> = {
  Head: 'Head',
  Ajna: 'Ajna',
  Throat: 'Throat',
  'G Center': 'G',
  'Heart/Ego': 'Ego',
  'Solar Plexus': 'SP',
  Spleen: 'Spleen',
  Sacral: 'Sacral',
  Root: 'Root',
};

const CENTER_COLORS: Record<CenterStatus, { fill: string; stroke: string; glow: string }> = {
  defined: {
    fill: 'rgba(251, 191, 36, 0.2)',
    stroke: '#fbbf24',
    glow: '0 0 24px rgba(251, 191, 36, 0.4), 0 0 48px rgba(251, 191, 36, 0.2)',
  },
  undefined: {
    fill: 'rgba(138, 143, 152, 0.1)',
    stroke: 'rgba(255, 255, 255, 0.2)',
    glow: 'none',
  },
  open: {
    fill: 'transparent',
    stroke: 'rgba(255, 255, 255, 0.08)',
    glow: 'none',
  },
};

export function BodygraphSVG({
  centers,
  channels,
  gates,
  definitionType,
  width = SVG_WIDTH,
  height = SVG_HEIGHT,
  onCenterClick,
  onChannelClick,
  onGateClick,
  className,
}: BodygraphSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredCenter, setHoveredCenter] = useState<HDCenter | null>(null);
  const [hoveredChannel, setHoveredChannel] = useState<HDChannel | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<HDCenter | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<HDChannel | null>(null);
  const [selectedGate, setSelectedGate] = useState<HDGate | null>(null);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showGateModal, setShowGateModal] = useState(false);

  // Zoom bounds
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 4;

  // Apply transform to SVG
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
      svgRef.current.style.transformOrigin = '0 0';
    }
  }, [transform]);

  // Wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(transform.scale * zoomFactor, MIN_SCALE), MAX_SCALE);

    if (newScale !== transform.scale) {
      const scaleRatio = newScale / transform.scale;
      const newX = mouseX - (mouseX - transform.x) * scaleRatio;
      const newY = mouseY - (mouseY - transform.y) * scaleRatio;

      setTransform({ x: newX, y: newY, scale: newScale });
    }
  }, [transform]);

  // Pan handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    }));
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsPanning(true);
      setPanStart({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
    } else if (e.touches.length === 2) {
      // Pinch zoom would go here - simplified for now
    }
  }, [transform]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    setTransform(prev => ({
      ...prev,
      x: touch.clientX - panStart.x,
      y: touch.clientY - panStart.y,
    }));
  }, [isPanning, panStart]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Reset zoom/pan
  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  // Get gates for a center
  const getCenterGates = (centerType: CenterType) => {
    return gates.filter(g => g.center === centerType);
  };

  // Get defined channels for a center
  const getCenterChannels = (centerType: CenterType) => {
    return channels.filter(c =>
      c.defined && (c.center_start === centerType || c.center_end === centerType)
    );
  };

  // Render channels (paths)
  const channelElements = channels.map(channel => {
    const path = getChannelPath(channel);
    const isDefined = channel.defined;
    const isHovered = hoveredChannel?.id === channel.id;

    return (
      <path
        key={channel.id}
        d={path}
        stroke={isDefined ? '#fbbf24' : 'rgba(255,255,255,0.1)'}
        strokeWidth={isDefined ? (isHovered ? 4 : 3) : 1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isDefined ? 'none' : '4 4'}
        opacity={isHovered ? 1 : isDefined ? 0.8 : 0.4}
        filter={isDefined && isHovered ? 'drop-shadow(0 0 8px rgba(251,191,36,0.6))' : 'none'}
        onMouseEnter={() => setHoveredChannel(channel)}
        onMouseLeave={() => setHoveredChannel(null)}
        onClick={() => {
          onChannelClick?.(channel);
          setSelectedChannel(channel);
          setShowChannelModal(true);
        }}
        style={{
          cursor: 'pointer',
          transition: 'stroke-width 200ms ease-out-expo, opacity 200ms ease-out-expo, filter 200ms ease-out-expo',
        }}
      />
    );
  });

  // Render centers
  const centerElements = centers.map(center => {
    const pos = getCenterPosition(center.id);
    const colors = CENTER_COLORS[center.status];
    const centerGates = getCenterGates(center.id);
    const isHovered = hoveredCenter?.id === center.id;

    return (
      <g key={center.id} onMouseEnter={() => setHoveredCenter(center)} onMouseLeave={() => setHoveredCenter(null)}>
        {/* Center circle */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={pos.radius}
          fill={isHovered ? (center.status === 'defined' ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.05)') : colors.fill}
          stroke={isHovered ? '#fcd34d' : colors.stroke}
          strokeWidth={isHovered ? 3 : center.status === 'defined' ? 2.5 : 1.5}
          filter={center.status === 'defined' ? 'drop-shadow(0 0 16px rgba(251,191,36,0.3))' : 'none'}
          onClick={() => {
            onCenterClick?.(center);
            setSelectedCenter(center);
            setShowCenterModal(true);
          }}
          style={{
            cursor: onCenterClick ? 'pointer' : 'default',
            transition: 'fill 200ms ease-out-expo, stroke 200ms ease-out-expo, stroke-width 200ms ease-out-expo',
          }}
        />

        {/* Center label */}
        <text
          x={pos.x}
          y={pos.y + 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fontWeight={center.status === 'defined' ? '600' : '400'}
          fill={center.status === 'defined' ? '#fbbf24' : 'rgba(255,255,255,0.6)'}
          fontFamily="Inter, system-ui, sans-serif"
          pointerEvents="none"
        >
          {CENTER_LABELS[center.id]}
        </text>

        {/* Gate markers around center */}
        {centerGates.map((gate, idx) => {
          const gatePos = getGatePosition(center.id, gate.number, idx, centerGates.length);
          const isGateDefined = gate.defined;
          const isConscious = gate.conscious;

          return (
            <Tooltip
              key={gate.number}
              content={
                <div className="text-caption">
                  <div className="font-semibold text-accent-gold mb-1">Gate {gate.number}: {gate.name}</div>
                  <div className="text-text-muted">Line {gate.line} • Color {gate.color} • Tone {gate.tone} • Base {gate.base}</div>
                  <div className="text-text-muted mt-1">{isConscious ? 'Personality (Conscious)' : 'Design (Unconscious)'}</div>
                </div>
              }
              side="top"
            >
              <circle
                cx={gatePos.x}
                cy={gatePos.y}
                r={isGateDefined ? 6 : 4}
                fill={isGateDefined ? (isConscious ? '#fbbf24' : '#ef4444') : 'transparent'}
                stroke={isGateDefined ? (isConscious ? '#fbbf24' : '#ef4444') : 'rgba(255,255,255,0.3)'}
                strokeWidth={isGateDefined ? 0 : 1.5}
                filter={isGateDefined ? 'drop-shadow(0 0 8px rgba(251,191,36,0.5))' : 'none'}
                onClick={(e) => {
                  e.stopPropagation();
                  onGateClick?.(gate);
                  setSelectedGate(gate);
                  setShowGateModal(true);
                }}
                style={{
                  cursor: onGateClick ? 'pointer' : 'default',
                  transition: 'r 200ms ease-out-expo, fill 200ms ease-out-expo',
                }}
              />
            </Tooltip>
          );
        })}
      </g>
    );
  });

  // Channel labels
  const channelLabelElements = channels
    .filter(c => c.defined)
    .map(channel => {
      const startPos = getCenterPosition(channel.center_start);
      const endPos = getCenterPosition(channel.center_end);
      const midX = (startPos.x + endPos.x) / 2;
      const midY = (startPos.y + endPos.y) / 2;

      return (
        <text
          key={channel.id}
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="500"
          fill="#fbbf24"
          fontFamily="Inter, system-ui, sans-serif"
          pointerEvents="none"
          opacity={transform.scale > 0.8 ? 1 : 0}
          style={{ transition: 'opacity 200ms ease-out-expo' }}
        >
          {channel.id}
        </text>
      );
    });

  return (
    <div
      className={cn('relative', className)}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ width, height, overflow: 'hidden', touchAction: 'none' }}
    >
      {/* SVG Bodygraph */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <defs>
          {/* Gradient for defined centers */}
          <radialGradient id="definedCenterGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(251,191,36,0.3)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.05)" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#fbbf24" floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode />
            </feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="#08090a" />
        <g stroke="rgba(255,255,255,0.02)" strokeWidth="1">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={i} x1={i * 50} y1="0" x2={i * 50} y2={SVG_HEIGHT} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={i} x1="0" y1={i * 50} x2={SVG_WIDTH} y2={i * 50} />
          ))}
        </g>

        {/* Channels (paths) - render first so they're behind centers */}
        <g strokeWidth="2">{channelElements}</g>

        {/* Centers */}
        <g>{centerElements}</g>

        {/* Channel labels */}
        <g>{channelLabelElements}</g>

        {/* Definition type indicator */}
        {definitionType && (
          <text
            x={SVG_WIDTH / 2}
            y={SVG_HEIGHT - 30}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="500"
            fill="rgba(251,191,36,0.7)"
            fontFamily="Playfair Display, Georgia, serif"
            letterSpacing="0.02em"
            style={{ textTransform: 'uppercase' }}
            pointerEvents="none"
          >
            {definitionType} Definition
          </text>
        )}
      </svg>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, MAX_SCALE) }))}
          className="touch-target p-2 bg-bg-elevated border border-border-standard rounded-lg hover:border-accent-gold hover:text-accent-gold transition-colors"
          aria-label="Zoom in"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
        <button
          onClick={resetView}
          className="touch-target p-2 bg-bg-elevated border border-border-standard rounded-lg hover:border-accent-gold hover:text-accent-gold transition-colors"
          aria-label="Reset view"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, MIN_SCALE) }))}
          className="touch-target p-2 bg-bg-elevated border border-border-standard rounded-lg hover:border-accent-gold hover:text-accent-gold transition-colors"
          aria-label="Zoom out"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
      </div>

      {/* Center Detail Modal */}
      <Modal
        isOpen={showCenterModal}
        onClose={() => { setShowCenterModal(false); setSelectedCenter(null); }}
        title={selectedCenter?.name}
        size="lg"
      >
        <ModalBody>
          {selectedCenter && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant={selectedCenter.status === 'defined' ? 'gold' : 'subtle'}>
                  {selectedCenter.status.charAt(0).toUpperCase() + selectedCenter.status.slice(1)}
                </Badge>
                {selectedCenter.defined && (
                  <GoldTriangle size="sm" orientation="down" className="ml-2" pulse />
                )}
              </div>

              {selectedCenter.theme && (
                <div>
                  <h4 className="label text-text-muted mb-2">Theme</h4>
                  <p className="body">{selectedCenter.theme}</p>
                </div>
              )}

              {selectedCenter.shadow && (
                <div>
                  <h4 className="label text-text-muted mb-2">Not-Self / Shadow</h4>
                  <p className="body text-text-secondary">{selectedCenter.shadow}</p>
                </div>
              )}

              {selectedCenter.description && (
                <div>
                  <h4 className="label text-text-muted mb-2">Description</h4>
                  <p className="body">{selectedCenter.description}</p>
                </div>
              )}

              {selectedCenter.gates.length > 0 && (
                <div>
                  <h4 className="label text-text-muted mb-3">Active Gates</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCenter.gates.map(gateNum => {
                      const gate = gates.find(g => g.number === gateNum);
                      return (
                        <Tooltip
                          key={gateNum}
                          content={
                            <div className="text-caption">
                              <div className="font-semibold text-accent-gold mb-1">Gate {gate?.number}: {gate?.name}</div>
                              <div className="text-text-muted">Line {gate?.line} • Color {gate?.color} • Tone {gate?.tone} • Base {gate?.base}</div>
                            </div>
                          }
                        >
                          <Badge
                            variant={gate?.defined ? 'gold' : 'subtle'}
                            className="cursor-pointer"
                            onClick={() => {
                              if (gate) {
                                setSelectedGate(gate);
                                setShowGateModal(true);
                                setShowCenterModal(false);
                              }
                            }}
                          >
                            {gateNum}
                          </Badge>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              )}

              {getCenterChannels(selectedCenter.id).length > 0 && (
                <div>
                  <h4 className="label text-text-muted mb-3">Defined Channels</h4>
                  <div className="space-y-2">
                    {getCenterChannels(selectedCenter.id).map(channel => (
                      <button
                        key={channel.id}
                        onClick={() => {
                          setSelectedChannel(channel);
                          setShowChannelModal(true);
                          setShowCenterModal(false);
                        }}
                        className="w-full text-left p-3 bg-bg-hover rounded-lg border border-border-subtle hover:border-accent-gold hover:text-accent-gold transition-all text-body-sm flex items-center justify-between"
                      >
                        <span>{channel.id} — {channel.name}</span>
                        <GoldTriangle size="sm" orientation="right" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalClose />
      </Modal>

      {/* Channel Detail Modal */}
      <Modal
        isOpen={showChannelModal}
        onClose={() => { setShowChannelModal(false); setSelectedChannel(null); }}
        title={selectedChannel?.name}
        size="md"
      >
        <ModalBody>
          {selectedChannel && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant={selectedChannel.defined ? 'gold' : 'subtle'}>
                  {selectedChannel.defined ? 'Defined' : 'Undefined'}
                </Badge>
                {selectedChannel.circuit && (
                  <Badge variant="subtle">{selectedChannel.circuit} Circuit</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="label text-text-muted mb-1">Gate {selectedChannel.gate_start}</h4>
                  <p className="body-sm font-medium">
                    {gates.find(g => g.number === selectedChannel.gate_start)?.name || '—'}
                  </p>
                </div>
                <div>
                  <h4 className="label text-text-muted mb-1">Gate {selectedChannel.gate_end}</h4>
                  <p className="body-sm font-medium">
                    {gates.find(g => g.number === selectedChannel.gate_end)?.name || '—'}
                  </p>
                </div>
              </div>

              {selectedChannel.theme && (
                <div>
                  <h4 className="label text-text-muted mb-2">Theme / Keynote</h4>
                  <p className="body">{selectedChannel.theme}</p>
                </div>
              )}

              {selectedChannel.shadow && (
                <div>
                  <h4 className="label text-text-muted mb-2">Not-Self / Shadow</h4>
                  <p className="body text-text-secondary">{selectedChannel.shadow}</p>
                </div>
              )}

              {selectedChannel.description && (
                <div>
                  <h4 className="label text-text-muted mb-2">Description</h4>
                  <p className="body">{selectedChannel.description}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border-subtle">
                <h4 className="label text-text-muted mb-2">Circuit & Keystone</h4>
                <p className="body-sm text-text-secondary">
                  Circuit: {selectedChannel.circuit || '—'} •
                  Keystone: {selectedChannel.gate_start === 20 || selectedChannel.gate_end === 20 ? 'Gate 20 (Throat)' : '—'}
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalClose />
      </Modal>

      {/* Gate Detail Modal */}
      <Modal
        isOpen={showGateModal}
        onClose={() => { setShowGateModal(false); setSelectedGate(null); }}
        title={`Gate ${selectedGate?.number}: ${selectedGate?.name}`}
        size="md"
      >
        <ModalBody>
          {selectedGate && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant={selectedGate.defined ? 'gold' : 'subtle'}>
                  {selectedGate.defined ? 'Defined' : 'Undefined'}
                </Badge>
                <Badge variant={selectedGate.conscious ? 'gold' : 'subtle'}>
                  {selectedGate.conscious ? 'Personality (Black)' : 'Design (Red)'}
                </Badge>
                <Badge variant="subtle">{selectedGate.center}</Badge>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Card variant="default" padding="default" className="text-center">
                  <div className="text-2xl font-display font-semibold text-accent-gold">{selectedGate.line}</div>
                  <div className="label text-text-muted">Line</div>
                </Card>
                <Card variant="default" padding="default" className="text-center">
                  <div className="text-2xl font-display font-semibold text-accent-gold">{selectedGate.color}</div>
                  <div className="label text-text-muted">Color</div>
                </Card>
                <Card variant="default" padding="default" className="text-center">
                  <div className="text-2xl font-display font-semibold text-accent-gold">{selectedGate.tone}</div>
                  <div className="label text-text-muted">Tone</div>
                </Card>
                <Card variant="default" padding="default" className="text-center">
                  <div className="text-2xl font-display font-semibold text-accent-gold">{selectedGate.base}</div>
                  <div className="label text-text-muted">Base</div>
                </Card>
              </div>

              {selectedGate.description && (
                <div>
                  <h4 className="label text-text-muted mb-2">Description</h4>
                  <p className="body">{selectedGate.description}</p>
                </div>
              )}

              {selectedGate.keynotes.length > 0 && (
                <div>
                  <h4 className="label text-text-muted mb-2">Keynotes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGate.keynotes.map((keynote, idx) => (
                      <Badge key={idx} variant="subtle">{keynote}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedGate.harmonic_gate && (
                <div className="pt-4 border-t border-border-subtle">
                  <h4 className="label text-text-muted mb-2">Harmonic Gate</h4>
                  <p className="body">
                    Gate {selectedGate.harmonic_gate} —{' '}
                    {gates.find(g => g.number === selectedGate.harmonic_gate)?.name || '—'}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-border-subtle">
                <h4 className="label text-text-muted mb-2">I Ching Hexagram</h4>
                <p className="body-sm text-text-secondary">
                  Gate {selectedGate.number} corresponds to I Ching Hexagram {selectedGate.number}.
                  Line {selectedGate.line} of Hexagram {selectedGate.number}.
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalClose />
      </Modal>
    </div>
  );
}

BodygraphSVG.displayName = 'BodygraphSVG';