import { SolutionState, STATE_COLORS } from '@/types/neutralization';
import { IonCounts } from '@/types/neutralization';
import { getAcidityText, getExplanation } from '@/lib/neutralizationCalculations';

interface StateInfoProps {
  state: SolutionState;
  ionCounts: IonCounts;
  addedNaohVolume: number;
}

export default function StateInfo({ state, ionCounts, addedNaohVolume }: StateInfoProps) {
  const stateColors = STATE_COLORS[state];
  const acidityText = getAcidityText(state);
  const explanation = getExplanation(state, addedNaohVolume);

  return (
    <div className="glass-panel p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-primary border-b-2 border-primary/20 pb-2">
        현재 용액 상태
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">용액의 액성</p>
          <p className="text-lg font-bold text-foreground">{acidityText}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">BTB 용액 색</p>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full border-2 border-gray-400 shadow-lg ${stateColors.indicator}`} />
            <p className="text-lg font-bold text-foreground">{stateColors.text}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          용액 속 이온 수 (상대값)
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-muted/50 p-3 rounded-lg">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-muted-foreground">H⁺:</span>
            <span className="font-bold text-yellow-600">{ionCounts.h}</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-muted-foreground">OH⁻:</span>
            <span className="font-bold text-blue-600">{ionCounts.oh}</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-muted-foreground">Cl⁻:</span>
            <span className="font-bold text-gray-500">{ionCounts.cl}</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-muted-foreground">Na⁺:</span>
            <span className="font-bold text-gray-500">{ionCounts.na}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
          <h3 className="text-sm font-semibold text-emerald-700 mb-1">알짜 이온</h3>
          <p className="text-sm font-mono text-emerald-900">H⁺, OH⁻</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">구경꾼 이온</h3>
          <p className="text-sm font-mono text-gray-700">Na⁺, Cl⁻</p>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}
