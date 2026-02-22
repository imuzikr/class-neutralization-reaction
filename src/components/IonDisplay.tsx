import { useEffect, useRef, useMemo } from 'react';
import { IonCounts, AcidType, BaseType } from '@/types/neutralization';
import { ACIDS_DATA, BASES_DATA } from '@/lib/neutralizationCalculations';

interface IonDisplayProps {
  ionCounts: IonCounts;
  acidType: AcidType;
  baseType: BaseType;
}

const MAX_DISPLAY_IONS = 10;

// Generate stable random positions for ions
function generatePositions(count: number, seed: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const s = seed + i * 137;
    const x = ((s * 2654435761) % 100);
    const y = ((s * 40503) % 100);
    positions.push({ x: Math.abs(x % 80) + 5, y: Math.abs(y % 70) + 10 });
  }
  return positions;
}

export default function IonDisplay({ ionCounts, acidType, baseType }: IonDisplayProps) {
  const acidInfo = ACIDS_DATA[acidType];
  const baseInfo = BASES_DATA[baseType];

  const hPositions = useMemo(() => generatePositions(MAX_DISPLAY_IONS, 1), []);
  const ohPositions = useMemo(() => generatePositions(MAX_DISPLAY_IONS, 100), []);
  const waterPositions = useMemo(() => generatePositions(MAX_DISPLAY_IONS, 200), []);
  const baseCationPositions = useMemo(() => generatePositions(MAX_DISPLAY_IONS, 300), []);
  const acidAnionPositions = useMemo(() => generatePositions(MAX_DISPLAY_IONS, 400), []);

  const renderIon = (
    key: string,
    label: string,
    colorClass: string,
    positions: { x: number; y: number }[],
    visibleCount: number
  ) =>
    Array.from({ length: MAX_DISPLAY_IONS }).map((_, i) => (
      <div
        key={`${key}-${i}`}
        className={`absolute w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500 ease-in-out ${colorClass}`}
        style={{
          left: `${positions[i].x}%`,
          top: `${positions[i].y}%`,
          opacity: i < visibleCount ? 1 : 0,
          transform: i < visibleCount ? 'scale(1)' : 'scale(0)',
          fontSize: '8px',
          zIndex: i < visibleCount ? 2 : 0,
        }}
      >
        {label}
      </div>
    ));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {renderIon('h', acidInfo.cation, 'bg-gradient-to-br from-red-400 to-red-600', hPositions, ionCounts.h)}
      {renderIon('oh', baseInfo.anion, 'bg-gradient-to-br from-blue-400 to-blue-600', ohPositions, ionCounts.oh)}
      {renderIon('water', 'H₂O', 'bg-gradient-to-br from-cyan-400 to-teal-500', waterPositions, ionCounts.water)}
      {renderIon('baseCation', baseInfo.cation, 'bg-gradient-to-br from-purple-400 to-purple-600', baseCationPositions, ionCounts.baseCation)}
      {renderIon('acidAnion', acidInfo.anion, 'bg-gradient-to-br from-green-400 to-green-600', acidAnionPositions, ionCounts.acidAnion)}
    </div>
  );
}
