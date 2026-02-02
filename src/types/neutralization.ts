export type SolutionState = 'acid' | 'neutral' | 'base';
export type IndicatorType = 'btb' | 'phenolphthalein';
export type AcidType = 'hcl' | 'h2so4';
export type BaseType = 'naoh' | 'caoh2';

export interface AcidInfo {
  type: AcidType;
  name: string;
  formula: string;
  valence: number; // 1가 또는 2가
  cation: string; // H⁺
  anion: string; // Cl⁻ 또는 SO₄²⁻
}

export interface BaseInfo {
  type: BaseType;
  name: string;
  formula: string;
  valence: number; // 1가 또는 2가
  cation: string; // Na⁺ 또는 Ca²⁺
  anion: string; // OH⁻
}

export const ACIDS: Record<AcidType, AcidInfo> = {
  hcl: {
    type: 'hcl',
    name: '묽은 염산',
    formula: 'HCl',
    valence: 1,
    cation: 'H⁺',
    anion: 'Cl⁻'
  },
  h2so4: {
    type: 'h2so4',
    name: '묽은 황산',
    formula: 'H₂SO₄',
    valence: 2,
    cation: 'H⁺',
    anion: 'SO₄²⁻'
  }
};

export const BASES: Record<BaseType, BaseInfo> = {
  naoh: {
    type: 'naoh',
    name: '수산화 나트륨',
    formula: 'NaOH',
    valence: 1,
    cation: 'Na⁺',
    anion: 'OH⁻'
  },
  caoh2: {
    type: 'caoh2',
    name: '수산화 칼슘',
    formula: 'Ca(OH)₂',
    valence: 2,
    cation: 'Ca²⁺',
    anion: 'OH⁻'
  }
};

export interface SimulationState {
  addedNaohVolume: number;
  totalVolume: number;
  hMoles: number;
  ohMoles: number;
  state: SolutionState;
}

export interface IonCounts {
  h: number;
  oh: number;
  baseCation: number; // Na⁺ 또는 Ca²⁺
  acidAnion: number; // Cl⁻ 또는 SO₄²⁻
  water: number;
}

export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface StateColors {
  indicator: string;
  solution: string;
  text: string;
}

export const INDICATOR_COLORS: Record<IndicatorType, Record<SolutionState, StateColors>> = {
  btb: {
    acid: {
      indicator: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
      solution: 'bg-yellow-400/30',
      text: '노란색'
    },
    neutral: {
      indicator: 'bg-gradient-to-br from-green-300 to-green-500',
      solution: 'bg-green-400/30',
      text: '초록색'
    },
    base: {
      indicator: 'bg-gradient-to-br from-blue-300 to-blue-500',
      solution: 'bg-blue-400/30',
      text: '파란색'
    }
  },
  phenolphthalein: {
    acid: {
      indicator: 'bg-gradient-to-br from-gray-50 to-gray-100',
      solution: 'bg-gray-100/30',
      text: '무색'
    },
    neutral: {
      indicator: 'bg-gradient-to-br from-gray-50 to-gray-100',
      solution: 'bg-gray-100/30',
      text: '무색'
    },
    base: {
      indicator: 'bg-gradient-to-br from-pink-300 to-fuchsia-400',
      solution: 'bg-pink-400/30',
      text: '붉은색'
    }
  }
};

export const STATE_COLORS = INDICATOR_COLORS.btb;
