import { SolutionState, IonCounts, AcidType, BaseType, ACIDS, BASES } from '@/types/neutralization';

export const CONSTANTS = {
  INITIAL_ACID_MOLES: 0.005,
  BASE_CONCENTRATION: 0.1,
  VOLUME_INCREMENT: 10,
  INITIAL_TOTAL_VOLUME: 50,
  MAX_BASE_VOLUME: 100,
  NEUTRALIZATION_POINT_1V: 50, // 1가-1가 중화점
  NUM_IONS_TO_DISPLAY: 5,
  TOLERANCE: 1e-9
};

// 중화점 계산: 산의 가수 × 산의 몰 = 염기의 가수 × 염기의 몰
export function calculateNeutralizationPoint(acidType: AcidType, baseType: BaseType): number {
  const acidValence = ACIDS[acidType].valence;
  const baseValence = BASES[baseType].valence;
  
  // n(H⁺) = n(OH⁻)
  // acidValence × acidMoles = baseValence × baseMoles
  // baseMoles = (acidValence × acidMoles) / baseValence
  // baseVolume(mL) = baseMoles / BASE_CONCENTRATION × 1000
  const baseMolesNeeded = (acidValence * CONSTANTS.INITIAL_ACID_MOLES) / baseValence;
  const baseVolumeNeeded = (baseMolesNeeded / CONSTANTS.BASE_CONCENTRATION) * 1000;
  
  return baseVolumeNeeded;
}

export function calculateIonFactors(addedBaseVolume: number, acidType: AcidType, baseType: BaseType) {
  const acidValence = ACIDS[acidType].valence;
  const baseValence = BASES[baseType].valence;
  
  const baseMolesAdded = (addedBaseVolume / 1000) * CONSTANTS.BASE_CONCENTRATION;
  
  // H⁺ 몰수 = 산의 가수 × 산의 몰수 - 염기의 가수 × 염기의 몰수
  let hMoles = acidValence * CONSTANTS.INITIAL_ACID_MOLES - baseValence * baseMolesAdded;
  let ohMoles = baseValence * baseMolesAdded - acidValence * CONSTANTS.INITIAL_ACID_MOLES;

  let hIonFactor = 0;
  let ohIonFactor = 0;

  const initialHMoles = acidValence * CONSTANTS.INITIAL_ACID_MOLES;

  if (hMoles > CONSTANTS.TOLERANCE) {
    hIonFactor = hMoles / initialHMoles;
  } else if (ohMoles > CONSTANTS.TOLERANCE) {
    ohIonFactor = Math.min(1, ohMoles / initialHMoles);
  }

  return { hIonFactor, ohIonFactor, baseMolesAdded, acidValence, baseValence };
}

export function calculateIonCounts(addedBaseVolume: number, acidType: AcidType, baseType: BaseType): IonCounts {
  const { hIonFactor, ohIonFactor, baseMolesAdded, acidValence, baseValence } = calculateIonFactors(addedBaseVolume, acidType, baseType);
  
  // 10mL당 이온 수: 1가 = 1개, 2가 = 2개
  const ionMultiplier = (volume: number, valence: number) => {
    return Math.round((volume / 10) * valence);
  };

  // H⁺ 이온: 초기 산의 H⁺ 수에서 반응한 만큼 감소
  const initialHCount = ionMultiplier(CONSTANTS.INITIAL_TOTAL_VOLUME, acidValence);
  const hCount = Math.round(hIonFactor * initialHCount);
  
  // OH⁻ 이온: 과잉 염기의 OH⁻ 수
  const ohCount = Math.round(ohIonFactor * initialHCount);
  
  // 산의 음이온 (Cl⁻ 또는 SO₄²⁻): 초기 산의 몰수에 비례, 변하지 않음
  const acidAnionCount = ionMultiplier(CONSTANTS.INITIAL_TOTAL_VOLUME, 1); // 음이온은 항상 산 1분자당 1개
  
  // 염기의 양이온 (Na⁺ 또는 Ca²⁺): 첨가된 염기의 몰수에 비례
  const baseCationCount = ionMultiplier(addedBaseVolume, 1); // 양이온은 염기 1분자당 1개
  
  // 물 분자: 반응한 H⁺/OH⁻ 수만큼 생성
  const neutralizationPoint = calculateNeutralizationPoint(acidType, baseType);
  const reactedVolume = Math.min(addedBaseVolume, neutralizationPoint);
  const waterCount = ionMultiplier(reactedVolume, Math.min(acidValence, baseValence));

  return { h: hCount, oh: ohCount, baseCation: baseCationCount, acidAnion: acidAnionCount, water: waterCount };
}

export function calculateSolutionState(addedBaseVolume: number, acidType: AcidType, baseType: BaseType): SolutionState {
  const { hIonFactor, ohIonFactor } = calculateIonFactors(addedBaseVolume, acidType, baseType);

  if (hIonFactor > 0) return 'acid';
  if (ohIonFactor > 0) return 'base';
  return 'neutral';
}

export function calculateTemperature(addedBaseVolume: number, acidType: AcidType, baseType: BaseType): number {
  const START_TEMP = 20;
  const PEAK_TEMP = 30;
  const END_TEMP = 25;
  const neutralizationPoint = calculateNeutralizationPoint(acidType, baseType);

  if (addedBaseVolume <= neutralizationPoint) {
    const tempRise = (PEAK_TEMP - START_TEMP) * (addedBaseVolume / neutralizationPoint);
    return START_TEMP + tempRise;
  } else {
    const volumeAfterNeutralization = addedBaseVolume - neutralizationPoint;
    const maxVolumeAfterNeutralization = CONSTANTS.MAX_BASE_VOLUME - neutralizationPoint;
    const tempDrop = (PEAK_TEMP - END_TEMP) * (volumeAfterNeutralization / maxVolumeAfterNeutralization);
    return PEAK_TEMP - tempDrop;
  }
}

export function getExplanation(state: SolutionState, addedBaseVolume: number, acidType: AcidType, baseType: BaseType): string {
  const acidInfo = ACIDS[acidType];
  const baseInfo = BASES[baseType];
  
  if (addedBaseVolume === 0) {
    return `초기 50mL의 ${acidInfo.name}(${acidInfo.formula})은 ${acidInfo.cation} 이온 때문에 산성을 띠며, BTB 용액은 노란색입니다.`;
  }

  switch (state) {
    case 'acid':
      return `아직 ${acidInfo.cation} 이온이 남아있어 산성을 띱니다. ${acidInfo.cation}와 ${baseInfo.anion}가 반응하여 물(H₂O)이 생성되고 열이 발생합니다.`;
    case 'neutral':
      return `중화점에 도달했습니다! ${acidInfo.cation}와 ${baseInfo.anion} 이온이 모두 반응하여 온도가 가장 높습니다.`;
    case 'base':
      return `이제 ${baseInfo.anion} 이온이 남아있어 용액이 염기성을 띱니다. 더 이상 반응열이 발생하지 않아 온도가 내려갑니다.`;
  }
}

export function getAcidityText(state: SolutionState): string {
  switch (state) {
    case 'acid': return '산성';
    case 'neutral': return '중성';
    case 'base': return '염기성';
  }
}
