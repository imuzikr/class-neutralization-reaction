import { SolutionState, IonCounts, AcidType, BaseType } from '@/types/neutralization';

// ACIDS와 BASES를 여기서 직접 정의하여 순환 참조 문제 해결
export const ACIDS_DATA = {
  hcl: {
    type: 'hcl' as AcidType,
    name: '묽은 염산',
    formula: 'HCl',
    valence: 1,
    cation: 'H⁺',
    anion: 'Cl⁻'
  },
  h2so4: {
    type: 'h2so4' as AcidType,
    name: '묽은 황산',
    formula: 'H₂SO₄',
    valence: 2,
    cation: 'H⁺',
    anion: 'SO₄²⁻'
  }
};

export const BASES_DATA = {
  naoh: {
    type: 'naoh' as BaseType,
    name: '수산화 나트륨',
    formula: 'NaOH',
    valence: 1,
    cation: 'Na⁺',
    anion: 'OH⁻'
  },
  caoh2: {
    type: 'caoh2' as BaseType,
    name: '수산화 칼슘',
    formula: 'Ca(OH)₂',
    valence: 2,
    cation: 'Ca²⁺',
    anion: 'OH⁻'
  }
};

export const CONSTANTS = {
  INITIAL_ACID_MOLES: 0.005,
  BASE_CONCENTRATION: 0.1,
  VOLUME_INCREMENT: 10,
  INITIAL_TOTAL_VOLUME: 50,
  MAX_BASE_VOLUME: 100,
  NEUTRALIZATION_POINT_1V: 50,
  NUM_IONS_TO_DISPLAY: 5,
  TOLERANCE: 1e-9
};

// 중화점 계산: 산의 가수 × 산의 몰 = 염기의 가수 × 염기의 몰
export function calculateNeutralizationPoint(acidType: AcidType, baseType: BaseType): number {
  const acidValence = ACIDS_DATA[acidType].valence;
  const baseValence = BASES_DATA[baseType].valence;
  
  const baseMolesNeeded = (acidValence * CONSTANTS.INITIAL_ACID_MOLES) / baseValence;
  const baseVolumeNeeded = (baseMolesNeeded / CONSTANTS.BASE_CONCENTRATION) * 1000;
  
  return baseVolumeNeeded;
}

export function calculateIonFactors(addedBaseVolume: number, acidType: AcidType, baseType: BaseType) {
  const acidValence = ACIDS_DATA[acidType].valence;
  const baseValence = BASES_DATA[baseType].valence;
  
  const baseMolesAdded = (addedBaseVolume / 1000) * CONSTANTS.BASE_CONCENTRATION;
  
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
  
  const ionMultiplier = (volume: number, valence: number) => {
    return Math.round((volume / 10) * valence);
  };

  const initialHCount = ionMultiplier(CONSTANTS.INITIAL_TOTAL_VOLUME, acidValence);
  const hCount = Math.round(hIonFactor * initialHCount);
  
  const ohCount = Math.round(ohIonFactor * initialHCount);
  
  const acidAnionCount = ionMultiplier(CONSTANTS.INITIAL_TOTAL_VOLUME, 1);
  
  const baseCationCount = ionMultiplier(addedBaseVolume, 1);
  
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
  const acidInfo = ACIDS_DATA[acidType];
  const baseInfo = BASES_DATA[baseType];
  
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
