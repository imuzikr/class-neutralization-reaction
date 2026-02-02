import { useEffect, useRef } from 'react';
import { IonCounts, AcidType, BaseType, ACIDS, BASES } from '@/types/neutralization';

interface IonDisplayProps {
  ionCounts: IonCounts;
  acidType: AcidType;
  baseType: BaseType;
}

const MAX_DISPLAY_IONS = 10; // 최대 표시 이온 수

export default function IonDisplay({ ionCounts, acidType, baseType }: IonDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const acidInfo = ACIDS[acidType];
  const baseInfo = BASES[baseType];

  useEffect(() => {
    if (!containerRef.current) return;

    const hIons = containerRef.current.querySelectorAll('[data-type="h"]');
    const ohIons = containerRef.current.querySelectorAll('[data-type="oh"]');
    const waterMolecules = containerRef.current.querySelectorAll('[data-type="water"]');
    const baseCations = containerRef.current.querySelectorAll('[data-type="baseCation"]');
    const acidAnions = containerRef.current.querySelectorAll('[data-type="acidAnion"]');
    
    hIons.forEach((ion, index) => {
      const ionElement = ion as HTMLElement;
      if (index < ionCounts.h) {
        ionElement.style.opacity = '1';
        ionElement.style.transform = 'scale(1)';
      } else {
        ionElement.style.opacity = '0';
        ionElement.style.transform = 'scale(0.5)';
      }
    });

    ohIons.forEach((ion, index) => {
      const ionElement = ion as HTMLElement;
      if (index < ionCounts.oh) {
        ionElement.style.opacity = '1';
        ionElement.style.transform = 'scale(1)';
      } else {
        ionElement.style.opacity = '0';
        ionElement.style.transform = 'scale(0.5)';
      }
    });

    waterMolecules.forEach((ion, index) => {
      const ionElement = ion as HTMLElement;
      if (index < ionCounts.water) {
        ionElement.style.opacity = '1';
        ionElement.style.transform = 'scale(1)';
      } else {
        ionElement.style.opacity = '0';
        ionElement.style.transform = 'scale(0.5)';
      }
    });

    baseCations.forEach((ion, index) => {
      const ionElement = ion as HTMLElement;
      if (index < ionCounts.baseCation) {
        ionElement.style.opacity = '1';
        ionElement.style.transform = 'scale(1)';
      } else {
        ionElement.style.opacity = '0';
        ionElement.style.transform = 'scale(0.5)';
      }
    });

    acidAnions.forEach((ion, index) => {
      const ionElement = ion as HTMLElement;
      if (index < ionCounts.acidAnion) {
        ionElement.style.opacity = '1';
        ionElement.style.transform = 'scale(1)';
      } else {
        ionElement.style.opacity = '0';
        ionElement.style.transform = 'scale(0.5)';
      }
    });
  }, [ionCounts]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex flex-wrap items-center justify-center p-2 gap-1 overflow-hidden"
    >
      {/* H+ ions */}
      {Array.from({ length: MAX_DISPLAY_IONS }).map((_, i) => (
        <div
          key={`h-${i}`}
          data-type="h"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-red-400 to-red-600 transition-all duration-500 ease-in-out"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          {acidInfo.cation}
        </div>
      ))}
      {/* OH- ions */}
      {Array.from({ length: MAX_DISPLAY_IONS }).map((_, i) => (
        <div
          key={`oh-${i}`}
          data-type="oh"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 transition-all duration-500 ease-in-out"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          {baseInfo.anion}
        </div>
      ))}
      {/* Water molecules */}
      {Array.from({ length: MAX_DISPLAY_IONS }).map((_, i) => (
        <div
          key={`water-${i}`}
          data-type="water"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-cyan-400 to-teal-500 transition-all duration-500 ease-in-out"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          H₂O
        </div>
      ))}
      {/* Base cations (Na+ or Ca2+) */}
      {Array.from({ length: MAX_DISPLAY_IONS }).map((_, i) => (
        <div
          key={`baseCation-${i}`}
          data-type="baseCation"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-purple-400 to-purple-600 transition-all duration-500 ease-in-out"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          {baseInfo.cation}
        </div>
      ))}
      {/* Acid anions (Cl- or SO4 2-) */}
      {Array.from({ length: MAX_DISPLAY_IONS }).map((_, i) => (
        <div
          key={`acidAnion-${i}`}
          data-type="acidAnion"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-green-400 to-green-600 transition-all duration-500 ease-in-out"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          {acidInfo.anion}
        </div>
      ))}
    </div>
  );
}
