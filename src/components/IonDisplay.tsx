import { useMemo } from 'react';
import { IonCounts, AcidType, BaseType, IonDisplayMode } from '@/types/neutralization';
import { ACIDS_DATA, BASES_DATA } from '@/lib/neutralizationCalculations';

interface IonDisplayProps {
  ionCounts: IonCounts;
  acidType: AcidType;
  baseType: BaseType;
  ionDisplayMode: IonDisplayMode;
}

const MAX_DISPLAY_IONS = 10;

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

// 알짜 이온: 실제 반응에 참여하는 이온 (H⁺, OH⁻, H₂O)
// 구경꾼 이온: 반응에 참여하지 않는 이온 (Na⁺/Ca²⁺, Cl⁻/SO₄²⁻)
function getFilteredCounts(ionCounts: IonCounts, mode: IonDisplayMode): IonCounts {
  switch (mode) {
    case 'all':
      return ionCounts;
    case 'net':
      // 알짜 이온: H⁺, OH⁻, H₂O만 표시
      return { h: ionCounts.h, oh: ionCounts.oh, water: ionCounts.water, baseCation: 0, acidAnion: 0 };
    case 'spectator':
      // 구경꾼 이온: 양이온(Na⁺/Ca²⁺), 음이온(Cl⁻/SO₄²⁻)만 표시
      return { h: 0, oh: 0, water: 0, baseCation: ionCounts.baseCation, acidAnion: ionCounts.acidAnion };
  }
}

export default function IonDisplay({ ionCounts, acidType, baseType, ionDisplayMode = 'all' }: IonDisplayProps) {
  const acidInfo = ACIDS_DATA[acidType];
  const baseInfo = BASES_DATA[baseType];
  const filtered = getFilteredCounts(ionCounts, ionDisplayMode) ?? ionCounts;

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
      {renderIon('h', acidInfo.cation, 'bg-gradient-to-br from-red-400 to-red-600', hPositions, filtered.h)}
      {renderIon('oh', baseInfo.anion, 'bg-gradient-to-br from-blue-400 to-blue-600', ohPositions, filtered.oh)}
      {renderIon('water', 'H₂O', 'bg-gradient-to-br from-cyan-400 to-teal-500', waterPositions, filtered.water)}
      {renderIon('baseCation', baseInfo.cation, 'bg-gradient-to-br from-purple-400 to-purple-600', baseCationPositions, filtered.baseCation)}
      {renderIon('acidAnion', acidInfo.anion, 'bg-gradient-to-br from-green-400 to-green-600', acidAnionPositions, filtered.acidAnion)}
    </div>
  );
}
