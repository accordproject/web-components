import { getBezierPath, useInternalNode, EdgeLabelRenderer, BaseEdge, Position, type EdgeProps } from '@xyflow/react';

type XY = { x: number; y: number };
type NodeLike = { internals: { positionAbsolute: XY }; measured: { width?: number; height?: number } };

// Pick the closest point on the node's rectangle to the other node's center,
// and return both the point and the side (Position) it sits on.
function getClosestPoint(source: NodeLike, target: NodeLike): { x: number; y: number; position: Position } {
  const w = source.measured.width ?? 0;
  const h = source.measured.height ?? 0;
  const sx = source.internals.positionAbsolute.x;
  const sy = source.internals.positionAbsolute.y;
  const tx = target.internals.positionAbsolute.x + (target.measured.width ?? 0) / 2;
  const ty = target.internals.positionAbsolute.y + (target.measured.height ?? 0) / 2;

  const cx = sx + w / 2;
  const cy = sy + h / 2;

  const dx = tx - cx;
  const dy = ty - cy;

  // Scale so the point lies on the rectangle's perimeter
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const scale = absDx / (w / 2) > absDy / (h / 2) ? (w / 2) / absDx : (h / 2) / absDy;

  const x = cx + dx * scale;
  const y = cy + dy * scale;

  let position: Position;
  if (absDx / (w / 2) > absDy / (h / 2)) {
    position = dx > 0 ? Position.Right : Position.Left;
  } else {
    position = dy > 0 ? Position.Bottom : Position.Top;
  }

  return { x, y, position };
}

export function FloatingEdge({ id, source, target, style, markerEnd, label, labelStyle, labelBgStyle, labelBgPadding, labelBgBorderRadius }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) return null;

  const sp = getClosestPoint(sourceNode as unknown as NodeLike, targetNode as unknown as NodeLike);
  const tp = getClosestPoint(targetNode as unknown as NodeLike, sourceNode as unknown as NodeLike);

  const [path, labelX, labelY] = getBezierPath({
    sourceX: sp.x, sourceY: sp.y, sourcePosition: sp.position,
    targetX: tp.x, targetY: tp.y, targetPosition: tp.position,
  });

  return (
    <>
      <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'none',
              padding: Array.isArray(labelBgPadding) ? `${labelBgPadding[1]}px ${labelBgPadding[0]}px` : '3px 6px',
              borderRadius: labelBgBorderRadius ?? 4,
              background: (labelBgStyle as any)?.fill ?? '#1a202c',
              opacity: (labelBgStyle as any)?.fillOpacity ?? 0.8,
              color: (labelStyle as any)?.fill ?? '#fff',
              fontSize: (labelStyle as any)?.fontSize ?? 10,
              fontWeight: (labelStyle as any)?.fontWeight ?? 500,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
