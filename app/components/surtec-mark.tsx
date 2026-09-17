import { MARK_BRIDGES, MARK_EDGES, MARK_NODES } from '../lib/brand-network';

type MarkProps = {
  className?: string;
  decorative?: boolean;
  lineClassName?: string;
  nodeClassName?: string;
};

export function SurTecMark({
  className = '',
  decorative = false,
  lineClassName = '',
  nodeClassName = '',
}: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 320"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : 'Isotipo de SurTec'}
    >
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        {MARK_EDGES.map(([a, b], index) => (
          <line
            className={lineClassName}
            key={`edge-${index}`}
            x1={MARK_NODES[a][0]}
            y1={MARK_NODES[a][1]}
            x2={MARK_NODES[b][0]}
            y2={MARK_NODES[b][1]}
          />
        ))}
        {MARK_BRIDGES.map(([[x1, y1], [x2, y2]], index) => (
          <line className={lineClassName} key={`bridge-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g fill="currentColor">
        {MARK_NODES.map(([cx, cy], index) => (
          <circle className={nodeClassName} key={`node-${index}`} cx={cx} cy={cy} r="11" />
        ))}
      </g>
    </svg>
  );
}

export function SurTecLockup({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`surtec-lockup ${light ? 'is-light' : ''} ${className}`.trim()} aria-label="SurTec Ingeniería y Tecnología">
      <SurTecMark className="surtec-lockup__mark" decorative />
      <div className="surtec-lockup__type">
        <strong>SurTec</strong>
        <span>Ingeniería y Tecnología</span>
      </div>
    </div>
  );
}
