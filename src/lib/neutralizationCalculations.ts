import { SolutionState, IonCounts } from '@/types/neutralization';

export const CONSTANTS = {
  INITIAL_HCL_MOLES: 0.005,
  NAOH_CONCENTRATION: 0.1,
  VOLUME_INCREMENT: 10,
  INITIAL_TOTAL_VOLUME: 50,
  MAX_NAOH_VOLUME: 100,
  NEUTRALIZATION_POINT: 50,
  NUM_IONS_TO_DISPLAY: 10,
  TOLERANCE: 1e-9
};

export function calculateIonFactors(addedNaohVolume: number) {
  const naohMolesAdded = (addedNaohVolume / 1000) * CONSTANTS.NAOH_CONCENTRATION;
  let hMoles = CONSTANTS.INITIAL_HCL_MOLES - naohMolesAdded;
  let ohMoles = naohMolesAdded - CONSTANTS.INITIAL_HCL_MOLES;

  let hIonFactor = 0;
  let ohIonFactor = 0;

  if (hMoles > CONSTANTS.TOLERANCE) {
    hIonFactor = hMoles / CONSTANTS.INITIAL_HCL_MOLES;
  } else if (ohMoles > CONSTANTS.TOLERANCE) {
    ohIonFactor = Math.min(1, ohMoles / CONSTANTS.INITIAL_HCL_MOLES);
  }

  return { hIonFactor, ohIonFactor, naohMolesAdded };
}

export function calculateIonCounts(addedNaohVolume: number): IonCounts {
  const { hIonFactor, ohIonFactor, naohMolesAdded } = calculateIonFactors(addedNaohVolume);
  
  const hCount = Math.round(hIonFactor * CONSTANTS.NUM_IONS_TO_DISPLAY);
  const ohCount = Math.round(ohIonFactor * CONSTANTS.NUM_IONS_TO_DISPLAY);
  const clCount = CONSTANTS.NUM_IONS_TO_DISPLAY;
  const naCount = Math.round((naohMolesAdded / CONSTANTS.INITIAL_HCL_MOLES) * CONSTANTS.NUM_IONS_TO_DISPLAY);

  return { h: hCount, oh: ohCount, na: naCount, cl: clCount };
}

export function calculateSolutionState(addedNaohVolume: number): SolutionState {
  const { hIonFactor, ohIonFactor } = calculateIonFactors(addedNaohVolume);

  if (hIonFactor > 0) return 'acid';
  if (ohIonFactor > 0) return 'base';
  return 'neutral';
}

export function calculateTemperature(addedNaohVolume: number): number {
  const START_TEMP = 20;
  const PEAK_TEMP = 30;
  const END_TEMP = 25;
  const NEUTRALIZATION_POINT = CONSTANTS.NEUTRALIZATION_POINT;

  if (addedNaohVolume <= NEUTRALIZATION_POINT) {
    // 중화점까지: 온도 상승
    const tempRise = (PEAK_TEMP - START_TEMP) * (addedNaohVolume / NEUTRALIZATION_POINT);
    return START_TEMP + tempRise;
  } else {
    // 중화점 이후: 온도 하강
    const volumeAfterNeutralization = addedNaohVolume - NEUTRALIZATION_POINT;
    const maxVolumeAfterNeutralization = CONSTANTS.MAX_NAOH_VOLUME - NEUTRALIZATION_POINT;
    const tempDrop = (PEAK_TEMP - END_TEMP) * (volumeAfterNeutralization / maxVolumeAfterNeutralization);
    return PEAK_TEMP - tempDrop;
  }
}

export function getExplanation(state: SolutionState, addedNaohVolume: number): string {
  if (addedNaohVolume === 0) {
    return '초기 50mL의 묽은 염산은 H⁺ 이온 때문에 산성을 띠며, BTB 용액은 노란색입니다.';
  }

  switch (state) {
    case 'acid':
      return '아직 H⁺ 이온이 남아있어 산성을 띱니다. H⁺와 OH⁻가 반응하여 물(H₂O)이 생성되고 열이 발생합니다.';
    case 'neutral':
      return '중화점에 도달했습니다! H⁺와 OH⁻ 이온이 모두 반응하여 온도가 가장 높습니다.';
    case 'base':
      return '이제 OH⁻ 이온이 남아있어 용액이 염기성을 띱니다. 더 이상 반응열이 발생하지 않아 온도가 내려갑니다.';
  }
}

export function getAcidityText(state: SolutionState): string {
  switch (state) {
    case 'acid': return '산성';
    case 'neutral': return '중성';
    case 'base': return '염기성';
  }
}
