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

function getFilteredCounts(ionCounts: IonCounts, mode: IonDisplayMode): IonCounts {
  switch (mode) {
    case 'all':
      return ionCounts;
    case 'net':
      return { h: ionCounts.h, oh: ionCounts.oh, water: ionCounts.water, baseCation: 0, acidAnion: 0 };
    case 'spectator':
      return { h: 0, oh: 0, water: 0, baseCation: ionCounts.baseCation, acidAnion: ionCounts.acidAnion };
    default:
      return ionCounts;
  }
}

// 보이는 이온만 수집하여 겹치지 않게 배치
function distributePositions(totalVisible: number): { x: number; y: number }[] {
  if (totalVisible === 0) return [];

  const positions: { x: number; y: number }[] = [];
  
  // 용액 영역 내에서 균등 배치 (padding 포함)
  const padX = 12; // % from edges
  const padY = 10;
  const areaW = 100 - padX * 2;
  const areaH = 100 - padY * 2;

  if (totalVisible <= 3) {
    // 한 줄 배치
    for (let i = 0; i < totalVisible; i++) {
      positions.push({
        x: padX + (areaW / (totalVisible + 1)) * (i + 1),
        y: 50,
      });
    }
  } else if (totalVisible <= 8) {
    // 2줄 배치
    const rows = 2;
    const perRow = Math.ceil(totalVisible / rows);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const countInRow = r === rows - 1 ? totalVisible - idx : perRow;
      for (let c = 0; c < countInRow; c++) {
        positions.push({
          x: padX + (areaW / (countInRow + 1)) * (c + 1),
          y: padY + (areaH / (rows + 1)) * (r + 1),
        });
        idx++;
      }
    }
  } else if (totalVisible <= 15) {
    // 3줄 배치
    const rows = 3;
    const perRow = Math.ceil(totalVisible / rows);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const countInRow = Math.min(perRow, totalVisible - idx);
      for (let c = 0; c < countInRow; c++) {
        positions.push({
          x: padX + (areaW / (countInRow + 1)) * (c + 1),
          y: padY + (areaH / (rows + 1)) * (r + 1),
        });
        idx++;
      }
    }
  } else {
    // 4줄 이상
    const rows = Math.ceil(totalVisible / 5);
    const perRow = Math.ceil(totalVisible / rows);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const countInRow = Math.min(perRow, totalVisible - idx);
      for (let c = 0; c < countInRow; c++) {
        positions.push({
          x: padX + (areaW / (countInRow + 1)) * (c + 1),
          y: padY + (areaH / (rows + 1)) * (r + 1),
        });
        idx++;
      }
    }
  }

  return positions;
}

interface VisibleIon {
  key: string;
  label: string;
  colorClass: string;
}

export default function IonDisplay({ ionCounts, acidType, baseType, ionDisplayMode = 'all' }: IonDisplayProps) {
  const acidInfo = ACIDS_DATA[acidType];
  const baseInfo = BASES_DATA[baseType];
  const filtered = getFilteredCounts(ionCounts, ionDisplayMode) ?? ionCounts;

  // 보이는 이온들만 수집
  const visibleIons = useMemo(() => {
    const ions: VisibleIon[] = [];

    for (let i = 0; i < filtered.h; i++) {
      ions.push({ key: `h-${i}`, label: acidInfo.cation, colorClass: 'bg-gradient-to-br from-red-400 to-red-600' });
    }
    for (let i = 0; i < filtered.oh; i++) {
      ions.push({ key: `oh-${i}`, label: baseInfo.anion, colorClass: 'bg-gradient-to-br from-blue-400 to-blue-600' });
    }
    for (let i = 0; i < filtered.water; i++) {
      ions.push({ key: `water-${i}`, label: 'H₂O', colorClass: 'bg-gradient-to-br from-cyan-400 to-teal-500' });
    }
    for (let i = 0; i < filtered.baseCation; i++) {
      ions.push({ key: `cation-${i}`, label: baseInfo.cation, colorClass: 'bg-gradient-to-br from-purple-400 to-purple-600' });
    }
    for (let i = 0; i < filtered.acidAnion; i++) {
      ions.push({ key: `anion-${i}`, label: acidInfo.anion, colorClass: 'bg-gradient-to-br from-green-400 to-green-600' });
    }

    return ions;
  }, [filtered, acidInfo, baseInfo]);

  const positions = useMemo(() => distributePositions(visibleIons.length), [visibleIons.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {visibleIons.map((ion, idx) => {
        const pos = positions[idx];
        return (
          <div
            key={ion.key}
            className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500 ease-in-out ${ion.colorClass}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%) scale(1)',
              fontSize: '7px',
              zIndex: 2,
              opacity: 1,
            }}
          >
            {ion.label}
          </div>
        );
      })}
    </div>
  );
}
