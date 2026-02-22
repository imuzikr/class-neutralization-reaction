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
const TOTAL_SLOTS = MAX_DISPLAY_IONS * 5; // 5 ion types
const ION_SIZE = 20; // px

// 겹치지 않는 그리드 위치 생성 (비커 내부 영역에 맞춤)
function generateGridPositions(totalSlots: number): { x: number; y: number }[] {
  const cols = 10;
  const rows = Math.ceil(totalSlots / cols);
  const positions: { x: number; y: number }[] = [];

  const cellW = 80 / cols; // percentage width per cell (within 5%~85% range)
  const cellH = 70 / rows; // percentage height per cell (within 10%~80% range)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (positions.length >= totalSlots) break;
      // Center of cell with small deterministic offset to look natural
      const jitterX = ((r * 7 + c * 13) % 5) - 2; // -2 to 2
      const jitterY = ((r * 11 + c * 3) % 5) - 2;
      const x = 5 + c * cellW + cellW / 2 + jitterX;
      const y = 10 + r * cellH + cellH / 2 + jitterY;
      positions.push({ x: Math.max(2, Math.min(88, x)), y: Math.max(5, Math.min(85, y)) });
    }
  }

  return positions;
}

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
    default:
      return ionCounts;
  }
}

interface IonSlot {
  key: string;
  label: string;
  colorClass: string;
  visible: boolean;
}

export default function IonDisplay({ ionCounts, acidType, baseType, ionDisplayMode = 'all' }: IonDisplayProps) {
  const acidInfo = ACIDS_DATA[acidType];
  const baseInfo = BASES_DATA[baseType];
  const filtered = getFilteredCounts(ionCounts, ionDisplayMode) ?? ionCounts;

  const gridPositions = useMemo(() => generateGridPositions(TOTAL_SLOTS), []);

  // 모든 이온을 하나의 배열로 만들어 각 슬롯에 하나씩 배치
  const ionSlots: IonSlot[] = useMemo(() => {
    const slots: IonSlot[] = [];

    // H⁺ ions
    for (let i = 0; i < MAX_DISPLAY_IONS; i++) {
      slots.push({
        key: `h-${i}`,
        label: acidInfo.cation,
        colorClass: 'bg-gradient-to-br from-red-400 to-red-600',
        visible: i < filtered.h,
      });
    }
    // OH⁻ ions
    for (let i = 0; i < MAX_DISPLAY_IONS; i++) {
      slots.push({
        key: `oh-${i}`,
        label: baseInfo.anion,
        colorClass: 'bg-gradient-to-br from-blue-400 to-blue-600',
        visible: i < filtered.oh,
      });
    }
    // H₂O molecules
    for (let i = 0; i < MAX_DISPLAY_IONS; i++) {
      slots.push({
        key: `water-${i}`,
        label: 'H₂O',
        colorClass: 'bg-gradient-to-br from-cyan-400 to-teal-500',
        visible: i < filtered.water,
      });
    }
    // Base cations (Na⁺/Ca²⁺)
    for (let i = 0; i < MAX_DISPLAY_IONS; i++) {
      slots.push({
        key: `cation-${i}`,
        label: baseInfo.cation,
        colorClass: 'bg-gradient-to-br from-purple-400 to-purple-600',
        visible: i < filtered.baseCation,
      });
    }
    // Acid anions (Cl⁻/SO₄²⁻)
    for (let i = 0; i < MAX_DISPLAY_IONS; i++) {
      slots.push({
        key: `anion-${i}`,
        label: acidInfo.anion,
        colorClass: 'bg-gradient-to-br from-green-400 to-green-600',
        visible: i < filtered.acidAnion,
      });
    }

    return slots;
  }, [filtered, acidInfo, baseInfo]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {ionSlots.map((slot, idx) => {
        const pos = gridPositions[idx];
        return (
          <div
            key={slot.key}
            className={`absolute w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-500 ease-in-out ${slot.colorClass}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              opacity: slot.visible ? 1 : 0,
              transform: slot.visible ? 'scale(1)' : 'scale(0)',
              fontSize: '8px',
              zIndex: slot.visible ? 2 : 0,
            }}
          >
            {slot.label}
          </div>
        );
      })}
    </div>
  );
}
