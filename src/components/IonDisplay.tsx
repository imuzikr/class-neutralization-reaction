import { useEffect, useRef } from 'react';
import { IonCounts } from '@/types/neutralization';
import { CONSTANTS } from '@/lib/neutralizationCalculations';

interface IonDisplayProps {
  ionCounts: IonCounts;
}

export default function IonDisplay({ ionCounts }: IonDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('IonCounts:', ionCounts);

    const hIons = containerRef.current.querySelectorAll('[data-type="h"]');
    const ohIons = containerRef.current.querySelectorAll('[data-type="oh"]');
    const waterMolecules = containerRef.current.querySelectorAll('[data-type="water"]');
    
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
  }, [ionCounts]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex flex-wrap items-center justify-center p-2 gap-1 overflow-hidden"
    >
      {/* H+ ions */}
      {Array.from({ length: CONSTANTS.NUM_IONS_TO_DISPLAY }).map((_, i) => (
        <div
          key={`h-${i}`}
          data-type="h"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-red-400 to-red-600 transition-all duration-500 ease-in-out"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          H⁺
        </div>
      ))}
      {/* OH- ions */}
      {Array.from({ length: CONSTANTS.NUM_IONS_TO_DISPLAY }).map((_, i) => (
        <div
          key={`oh-${i}`}
          data-type="oh"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 transition-all duration-500 ease-in-out"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          OH⁻
        </div>
      ))}
      {/* Water molecules */}
      {Array.from({ length: CONSTANTS.NUM_IONS_TO_DISPLAY }).map((_, i) => (
        <div
          key={`water-${i}`}
          data-type="water"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg bg-gradient-to-br from-cyan-400 to-teal-500 transition-all duration-500 ease-in-out animate-scale-in"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          H₂O
        </div>
      ))}
    </div>
  );
}
