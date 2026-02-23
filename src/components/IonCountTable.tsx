import { IonCounts, AcidType, BaseType, ACIDS, BASES } from '@/types/neutralization';

interface IonCountTableProps {
  ionCounts: IonCounts;
  acidType: AcidType;
  baseType: BaseType;
}

export default function IonCountTable({ ionCounts, acidType, baseType }: IonCountTableProps) {
  const acid = ACIDS[acidType];
  const base = BASES[baseType];

  const items = [
    { label: acid.cation, value: ionCounts.h, color: 'bg-yellow-500' },
    { label: base.anion, value: ionCounts.oh, color: 'bg-blue-500' },
    { label: base.cation, value: ionCounts.baseCation, color: 'bg-muted-foreground/60' },
    { label: acid.anion, value: ionCounts.acidAnion, color: 'bg-muted-foreground/40' },
  ];

  const maxVal = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-primary mb-3">현재 이온 수 (상대값)</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value, color }) => {
          const pct = (value / maxVal) * 100;
          return (
            <div key={label} className="flex flex-col gap-1 bg-background/40 rounded-lg p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground/80">{label}</span>
                <span className="text-lg font-bold font-mono text-foreground">{value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
