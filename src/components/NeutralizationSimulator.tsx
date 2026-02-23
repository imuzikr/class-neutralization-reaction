import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Beaker from './Beaker';
import StateInfo from './StateInfo';
import TemperatureChart from './TemperatureChart';
import IonChart from './IonChart';
import { CONSTANTS, calculateIonCounts, calculateSolutionState, calculateTemperature, calculateNeutralizationPoint, ACIDS_DATA, BASES_DATA } from '@/lib/neutralizationCalculations';
import { ChartDataPoint, IndicatorType, AcidType, BaseType, IonDisplayMode } from '@/types/neutralization';
import { FlaskConical, RotateCcw } from 'lucide-react';

export default function NeutralizationSimulator() {
  const [acidType, setAcidType] = useState<AcidType>('hcl');
  const [baseType, setBaseType] = useState<BaseType>('naoh');
  const [addedBaseVolume, setAddedBaseVolume] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorType>('btb');
  const [ionDisplayMode, setIonDisplayMode] = useState<IonDisplayMode>('all');
  const [tempData, setTempData] = useState<ChartDataPoint[]>([{ x: 0, y: 20 }]);
  
  const initialIonCounts = calculateIonCounts(0, acidType, baseType);
  const [ionData, setIonData] = useState({
    h: [{ x: 0, y: initialIonCounts.h }] as ChartDataPoint[],
    oh: [{ x: 0, y: initialIonCounts.oh }] as ChartDataPoint[],
    baseCation: [{ x: 0, y: initialIonCounts.baseCation }] as ChartDataPoint[],
    acidAnion: [{ x: 0, y: initialIonCounts.acidAnion }] as ChartDataPoint[],
  });

  const ionCounts = calculateIonCounts(addedBaseVolume, acidType, baseType);
  const state = calculateSolutionState(addedBaseVolume, acidType, baseType);
  const neutralizationPoint = calculateNeutralizationPoint(acidType, baseType);

  const acidInfo = ACIDS_DATA[acidType];
  const baseInfo = BASES_DATA[baseType];

  const handleAdd = async () => {
    if (addedBaseVolume >= CONSTANTS.MAX_BASE_VOLUME) return;

    setIsAdding(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    const newVolume = addedBaseVolume + CONSTANTS.VOLUME_INCREMENT;
    setAddedBaseVolume(newVolume);

    const currentTemp = calculateTemperature(newVolume, acidType, baseType);
    const newTempPoint = { x: newVolume, y: currentTemp };
    setTempData(prev => [...prev, newTempPoint]);

    const newIonCounts = calculateIonCounts(newVolume, acidType, baseType);
    setIonData(prev => ({
      h: [...prev.h, { x: newVolume, y: newIonCounts.h }],
      oh: [...prev.oh, { x: newVolume, y: newIonCounts.oh }],
      baseCation: [...prev.baseCation, { x: newVolume, y: newIonCounts.baseCation }],
      acidAnion: [...prev.acidAnion, { x: newVolume, y: newIonCounts.acidAnion }],
    }));

    setIsAdding(false);
  };

  const resetWithTypes = (newAcidType: AcidType, newBaseType: BaseType) => {
    setIsAdding(false);
    setAddedBaseVolume(0);
    const counts = calculateIonCounts(0, newAcidType, newBaseType);
    setTempData([{ x: 0, y: 20 }]);
    setIonData({
      h: [{ x: 0, y: counts.h }],
      oh: [{ x: 0, y: counts.oh }],
      baseCation: [{ x: 0, y: counts.baseCation }],
      acidAnion: [{ x: 0, y: counts.acidAnion }],
    });
  };

  const handleReset = () => {
    resetWithTypes(acidType, baseType);
  };

  const handleAcidChange = (newAcidType: AcidType) => {
    setAcidType(newAcidType);
    resetWithTypes(newAcidType, baseType);
  };

  const handleBaseChange = (newBaseType: BaseType) => {
    setBaseType(newBaseType);
    resetWithTypes(acidType, newBaseType);
  };

  

  return (
    <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-amber-200">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <FlaskConical className="w-10 h-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            산-염기 중화 반응 시뮬레이터
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto">
          {acidInfo.name}({acidInfo.formula})에 {baseInfo.name}({baseInfo.formula})을 첨가하며 지시약의 색 변화를 관찰해 봅시다.
        </p>
        
        {/* Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Acid Selection Card */}
          <div className="glass-panel rounded-xl p-4">
            <span className="block font-semibold text-foreground/70 text-sm mb-3">산 선택</span>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => handleAcidChange('hcl')}
                variant={acidType === 'hcl' ? 'default' : 'outline'}
                size="sm"
                className={acidType === 'hcl' ? 'bg-foreground/80 hover:bg-foreground/70 text-background' : ''}
              >
                HCl (1가)
              </Button>
              <Button
                onClick={() => handleAcidChange('h2so4')}
                variant={acidType === 'h2so4' ? 'default' : 'outline'}
                size="sm"
                className={acidType === 'h2so4' ? 'bg-foreground/80 hover:bg-foreground/70 text-background' : ''}
              >
                H₂SO₄ (2가)
              </Button>
            </div>
          </div>

          {/* Base Selection Card */}
          <div className="glass-panel rounded-xl p-4">
            <span className="block font-semibold text-foreground/70 text-sm mb-3">염기 선택</span>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => handleBaseChange('naoh')}
                variant={baseType === 'naoh' ? 'default' : 'outline'}
                size="sm"
                className={baseType === 'naoh' ? 'bg-foreground/80 hover:bg-foreground/70 text-background' : ''}
              >
                NaOH (1가)
              </Button>
              <Button
                onClick={() => handleBaseChange('caoh2')}
                variant={baseType === 'caoh2' ? 'default' : 'outline'}
                size="sm"
                className={baseType === 'caoh2' ? 'bg-foreground/80 hover:bg-foreground/70 text-background' : ''}
              >
                Ca(OH)₂ (2가)
              </Button>
            </div>
          </div>

          {/* Indicator Selection Card */}
          <div className="glass-panel rounded-xl p-4">
            <span className="block font-semibold text-foreground/70 text-sm mb-3">지시약 선택</span>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setIndicator('btb')}
                variant={indicator === 'btb' ? 'default' : 'outline'}
                size="sm"
                className={indicator === 'btb' ? 'bg-foreground/80 hover:bg-foreground/70 text-background' : ''}
              >
                BTB 용액
              </Button>
              <Button
                onClick={() => setIndicator('phenolphthalein')}
                variant={indicator === 'phenolphthalein' ? 'default' : 'outline'}
                size="sm"
                className={indicator === 'phenolphthalein' ? 'bg-foreground/80 hover:bg-foreground/70 text-background' : ''}
              >
                페놀프탈레인
              </Button>
            </div>
          </div>
        </div>

      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Section */}
        <div className="flex flex-col gap-8">
          {/* Simulation Area */}
          <div className="glass-panel p-6 rounded-xl h-[480px] flex flex-col">
            {/* Ion Display Mode - small buttons */}
            <div className="flex items-center gap-2 mb-3 justify-end">
              <span className="text-xs font-semibold text-muted-foreground">이온 모형:</span>
              <div className="flex gap-1">
                {(['all', 'net', 'spectator'] as IonDisplayMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setIonDisplayMode(mode)}
                    className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                      ionDisplayMode === mode
                        ? 'bg-foreground/80 text-background border-foreground/80'
                        : 'bg-background/50 text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {mode === 'all' ? '전체' : mode === 'net' ? '알짜' : '구경꾼'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-end gap-12 md:gap-20 w-full h-[260px] mb-4">
              <Beaker 
                addedBaseVolume={addedBaseVolume} 
                state={state} 
                ionCounts={ionCounts}
                isAdding={isAdding}
                indicator={indicator}
                acidType={acidType}
                baseType={baseType}
                ionDisplayMode={ionDisplayMode}
              />
              <div className="flex flex-col gap-3 pb-4">
                <Button
                  onClick={handleAdd}
                  disabled={isAdding || addedBaseVolume >= CONSTANTS.MAX_BASE_VOLUME}
                  className="w-44 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {baseInfo.formula} 10mL 첨가
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  className="w-44 h-12 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </div>

            {/* Volume Display */}
            <div className="text-center bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-xl border-2 border-amber-300 mt-auto space-y-2">
              <div>
                <span className="text-sm font-semibold text-gray-700">첨가한 {baseInfo.formula} 부피:</span>
                <span className="font-bold text-3xl text-primary ml-2">{addedBaseVolume}</span>
                <span className="text-gray-600 ml-1">mL</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700">총 용액 부피:</span>
                <span className="font-bold text-2xl text-primary ml-2">{CONSTANTS.INITIAL_TOTAL_VOLUME + addedBaseVolume}</span>
                <span className="text-gray-600 ml-1">mL</span>
              </div>
              <div className="text-xs text-muted-foreground">
                중화점: {neutralizationPoint}mL
              </div>
            </div>
          </div>

          {/* State Info */}
          <StateInfo 
            state={state} 
            ionCounts={ionCounts} 
            addedBaseVolume={addedBaseVolume}
            indicator={indicator}
            acidType={acidType}
            baseType={baseType}
          />
        </div>

        {/* Right Section - Charts */}
        <div className="flex flex-col gap-8">
          <div className="glass-panel p-6 rounded-xl h-[480px] flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-primary border-b-2 border-primary/20 pb-2">
              이온 수 변화 그래프
            </h2>
            <div className="flex-1">
              <IonChart 
                hData={ionData.h}
                ohData={ionData.oh}
                baseCationData={ionData.baseCation}
                acidAnionData={ionData.acidAnion}
                acidType={acidType}
                baseType={baseType}
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl h-[480px] flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-primary border-b-2 border-primary/20 pb-2">
              온도 변화 그래프
            </h2>
            <div className="flex-1">
              <TemperatureChart data={tempData} baseType={baseType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
