export type SolutionState = 'acid' | 'neutral' | 'base';

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
  na: number;
  cl: number;
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

export const STATE_COLORS: Record<SolutionState, StateColors> = {
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
};
