import { useState, useEffect } from 'react';
import { INDICATOR_COLORS, SolutionState, IndicatorType } from '@/types/neutralization';
import { IonCounts } from '@/types/neutralization';
import { CONSTANTS } from '@/lib/neutralizationCalculations';
import IonDisplay from './IonDisplay';

interface BeakerProps {
  addedNaohVolume: number;
  state: SolutionState;
  ionCounts: IonCounts;
  isAdding: boolean;
  indicator: IndicatorType;
}

export default function Beaker({ addedNaohVolume, state, ionCounts, isAdding, indicator }: BeakerProps) {
  const [dropVisible, setDropVisible] = useState(false);
  // 총 부피 = 초기 HCl 50mL + 추가된 NaOH
  // 비커 최대 150mL 기준: 50mL(33.33%), 100mL(66.67%), 150mL(100%)
  const totalVolume = CONSTANTS.INITIAL_TOTAL_VOLUME + addedNaohVolume;
  const beakerFillHeight = (totalVolume / 150) * 100;
  const buretteHeight = 100 - (addedNaohVolume / CONSTANTS.MAX_NAOH_VOLUME) * 100;
  const solutionColors = INDICATOR_COLORS[indicator][state];

  useEffect(() => {
    if (isAdding) {
      setDropVisible(true);
      const timer = setTimeout(() => setDropVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isAdding]);

  return (
    <div className="relative w-40 h-full">
      {/* Burette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 flex flex-col items-center z-10" style={{ height: '80px' }}>
        <div className="w-5 h-full bg-gray-300/50 border-x-2 border-t-2 border-gray-400 relative rounded-t-sm shadow-inner">
          <div 
            className="absolute bottom-0 w-full bg-gradient-to-b from-sky-400 to-sky-600 transition-all duration-300"
            style={{ height: `${Math.max(0, buretteHeight)}%` }}
          />
        </div>
        <div className="w-12 h-3 bg-gradient-to-b from-gray-500 to-gray-600 rounded-sm my-1 shadow-md" />
        <div className="w-px h-2 bg-gray-500" />
        {/* Drop - OH- ion */}
        <div 
          className={`w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full absolute bottom-[-10px] shadow-lg transition-all duration-100 flex items-center justify-center text-white font-bold text-xs ${
            dropVisible ? 'animate-drop opacity-100' : 'opacity-0'
          }`}
          style={{ animation: dropVisible ? 'dropFall 0.8s ease-in forwards' : 'none' }}
        >
          OH⁻
        </div>
      </div>

      {/* Beaker */}
      <div className="absolute bottom-0 left-0 w-40 h-48 bg-gradient-to-b from-gray-200/30 to-gray-300/50 border-b-4 border-x-4 border-gray-400 rounded-b-3xl flex items-end shadow-xl">
        <div 
          className={`w-full transition-all duration-500 ease-in-out rounded-b-2xl relative ${solutionColors.solution}`}
          style={{ height: `${Math.min(100, beakerFillHeight)}%` }}
        >
          <IonDisplay ionCounts={ionCounts} />
          {/* Liquid shine effect */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
        </div>
        
        {/* Beaker markings - 비커 높이 100% = 150mL 기준 */}
        <div className="absolute right-[-25px] top-0 bottom-0 w-20 text-xs text-gray-500 font-medium">
          <div className="absolute top-0 flex items-center gap-1">
            <span className="w-3 h-px bg-gray-400" />
            <span>150mL</span>
          </div>
          <div className="absolute top-[33.33%] flex items-center gap-1">
            <span className="w-3 h-px bg-gray-400" />
            <span>100mL</span>
          </div>
          <div className="absolute top-[66.67%] flex items-center gap-1">
            <span className="w-3 h-px bg-gray-400" />
            <span>50mL</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dropFall {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(60px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(120px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
