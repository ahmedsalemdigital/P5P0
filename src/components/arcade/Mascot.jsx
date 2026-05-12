import { useState, useEffect } from 'react';

export function Mascot({ size = 72, talking = false, happy = false, sad = false }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3200);
    return () => clearInterval(iv);
  }, []);
  const eyeColor = happy ? '#00ff41' : sad ? '#006600' : '#00ff41';
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="3" y="3" width="10" height="9" fill="#00aa00" />
      {!blink && <rect x="4" y="5" width="3" height="3" fill="#003300" />}
      {!blink && <rect x="9" y="5" width="3" height="3" fill="#003300" />}
      {!blink && <rect x="5" y="5" width="2" height="2" fill={eyeColor} />}
      {!blink && <rect x="10" y="5" width="2" height="2" fill={eyeColor} />}
      {blink && <rect x="4" y="6" width="3" height="1" fill="#003300" />}
      {blink && <rect x="9" y="6" width="3" height="1" fill="#003300" />}
      <rect x="4" y="12" width="8" height="4" fill="#004400" />
      <rect x="7" y="12" width="2" height="4" fill="#ccffdd" />
      <rect x="7" y="13" width="2" height="3" fill="#00ff41" />
      <rect x="7" y="13" width="1" height="1" fill="#ccffdd" />
      <rect x="5" y="12" width="2" height="2" fill="#ccffdd" />
      <rect x="4" y="12" width="2" height="3" fill="#004400" />
      <rect x="9" y="12" width="2" height="2" fill="#ccffdd" />
      <rect x="10" y="12" width="2" height="3" fill="#004400" />
      <rect x="2" y="12" width="2" height="3" fill="#004400" />
      <rect x="12" y="12" width="2" height="3" fill="#004400" />
      <rect x="2" y="14" width="2" height="1" fill="#ccffdd" />
      <rect x="12" y="14" width="2" height="1" fill="#ccffdd" />
      <rect x="5" y="15" width="2" height="1" fill="#002200" />
      <rect x="9" y="15" width="2" height="1" fill="#002200" />
    </svg>
  );
}
