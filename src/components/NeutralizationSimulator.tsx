import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Beaker from './Beaker';
import StateInfo from './StateInfo';
import TemperatureChart from './TemperatureChart';
import IonChart from './IonChart';
import NeutralizationQuiz from './NeutralizationQuiz';
import { CONSTANTS, calculateIonCounts, calculateSolutionState, calculateTemperature } from '@/lib/neutralizationCalculations';
import { ChartDataPoint, IndicatorType } from '@/types/neutralization';
import { FlaskConical, RotateCcw } from 'lucide-react';

export default function NeutralizationSimulator() {
  const [addedNaohVolume, setAddedNaohVolume] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorType>('btb');
  const [tempData, setTempData] = useState<ChartDataPoint[]>([]);
  const [ionData, setIonData] = useState({
    h: [] as ChartDataPoint[],
    oh: [] as ChartDataPoint[],
    na: [] as ChartDataPoint[],
    cl: [] as ChartDataPoint[],
  });

  const ionCounts = calculateIonCounts(addedNaohVolume);
  const state = calculateSolutionState(addedNaohVolume);

  const handleAdd = async () => {
    if (addedNaohVolume >= CONSTANTS.MAX_NAOH_VOLUME) return;

    setIsAdding(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const newVolume = addedNaohVolume + CONSTANTS.VOLUME_INCREMENT;
    setAddedNaohVolume(newVolume);

    const currentTemp = calculateTemperature(newVolume);
    const newTempPoint = { x: newVolume, y: currentTemp };
    setTempData(prev => [...prev, newTempPoint]);

    const newIonCounts = calculateIonCounts(newVolume);
    setIonData(prev => ({
      h: [...prev.h, { x: newVolume, y: newIonCounts.h }],
      oh: [...prev.oh, { x: newVolume, y: newIonCounts.oh }],
      na: [...prev.na, { x: newVolume, y: newIonCounts.na }],
      cl: [...prev.cl, { x: newVolume, y: newIonCounts.cl }],
    }));

    setIsAdding(false);
  };

  const handleReset = () => {
    setAddedNaohVolume(0);
    setIsAdding(false);
    setTempData([]);
    setIonData({
      h: [],
      oh: [],
      na: [],
      cl: [],
    });
  };

  const showQuiz = addedNaohVolume >= CONSTANTS.MAX_NAOH_VOLUME;

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
          묽은 염산(HCl)에 수산화 나트륨(NaOH)을 첨가하며 지시약의 색 변화를 관찰해 봅시다.
        </p>
        
        {/* Indicator Selection */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="font-semibold text-gray-700">지시약 선택:</span>
          <div className="flex gap-3">
            <Button
              onClick={() => setIndicator('btb')}
              variant={indicator === 'btb' ? 'default' : 'outline'}
              className={indicator === 'btb' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : ''}
            >
              BTB 용액
            </Button>
            <Button
              onClick={() => setIndicator('phenolphthalein')}
              variant={indicator === 'phenolphthalein' ? 'default' : 'outline'}
              className={indicator === 'phenolphthalein' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : ''}
            >
              페놀프탈레인 용액
            </Button>
          </div>
        </div>
      </header>

      <NeutralizationQuiz show={showQuiz} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Section */}
        <div className="flex flex-col gap-8">
          {/* Simulation Area */}
          <div className="glass-panel p-6 rounded-xl h-[480px] flex flex-col">
            <div className="flex justify-center items-end gap-12 md:gap-20 w-full h-[280px] mb-6">
              <Beaker 
                addedNaohVolume={addedNaohVolume} 
                state={state} 
                ionCounts={ionCounts}
                isAdding={isAdding}
                indicator={indicator}
              />
              <div className="flex flex-col gap-3 pb-4">
                <Button
                  onClick={handleAdd}
                  disabled={isAdding || addedNaohVolume >= CONSTANTS.MAX_NAOH_VOLUME}
                  className="w-44 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  NaOH 10mL 첨가
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
            <div className="text-center bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-xl border-2 border-amber-300 mt-auto">
              <span className="text-sm font-semibold text-gray-700">첨가한 NaOH 부피:</span>
              <span className="font-bold text-3xl text-primary ml-2">{addedNaohVolume}</span>
              <span className="text-gray-600 ml-1">mL</span>
            </div>
          </div>

          {/* State Info */}
          <StateInfo 
            state={state} 
            ionCounts={ionCounts} 
            addedNaohVolume={addedNaohVolume}
            indicator={indicator}
          />
        </div>

        {/* Right Section - Charts */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl h-[480px] flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-primary border-b-2 border-primary/20 pb-2">
              이온 수 변화 그래프
            </h2>
            <div className="flex-1">
              <IonChart 
                hData={ionData.h}
                ohData={ionData.oh}
                naData={ionData.na}
                clData={ionData.cl}
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl h-[480px] flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-primary border-b-2 border-primary/20 pb-2">
              온도 변화 그래프
            </h2>
            <div className="flex-1">
              <TemperatureChart data={tempData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
