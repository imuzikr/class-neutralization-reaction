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

    const ions = containerRef.current.querySelectorAll('.ion');
    ions.forEach((ion, index) => {
      const ionElement = ion as HTMLElement;
      const ionType = ionElement.dataset.type;
      
      let shouldShow = false;
      if (ionType === 'h' && index < ionCounts.h) shouldShow = true;
      if (ionType === 'oh' && index < ionCounts.oh) shouldShow = true;

      if (shouldShow) {
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
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs shadow-lg ion-h transition-all duration-500 ease-in-out"
        >
          H⁺
        </div>
      ))}
      {/* OH- ions */}
      {Array.from({ length: CONSTANTS.NUM_IONS_TO_DISPLAY }).map((_, i) => (
        <div
          key={`oh-${i}`}
          data-type="oh"
          className="ion w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ion-oh transition-all duration-500 ease-in-out"
        >
          OH⁻
        </div>
      ))}
    </div>
  );
}
