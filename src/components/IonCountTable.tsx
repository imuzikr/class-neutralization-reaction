import { IonCounts, AcidType, BaseType, ACIDS, BASES } from '@/types/neutralization';

interface IonCountTableProps {
  ionCounts: IonCounts;
  acidType: AcidType;
  baseType: BaseType;
}

export default function IonCountTable({ ionCounts, acidType, baseType }: IonCountTableProps) {
  const acid = ACIDS[acidType];
  const base = BASES[baseType];

  const rows = [
    { label: acid.cation, value: ionCounts.h, className: 'text-yellow-600' },
    { label: base.anion, value: ionCounts.oh, className: 'text-blue-600' },
    { label: base.cation, value: ionCounts.baseCation, className: 'text-muted-foreground' },
    { label: acid.anion, value: ionCounts.acidAnion, className: 'text-muted-foreground/70' },
    { label: 'H₂O', value: ionCounts.water, className: 'text-teal-600' },
  ];

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-primary mb-2">현재 이온 수 (상대값)</h3>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-1.5 px-2 text-muted-foreground font-semibold">이온</th>
            <th className="text-right py-1.5 px-2 text-muted-foreground font-semibold">개수</th>
            <th className="text-left py-1.5 px-3 text-muted-foreground font-semibold w-1/2">비율</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, value, className }) => {
            const maxVal = Math.max(ionCounts.h, ionCounts.oh, ionCounts.baseCation, ionCounts.acidAnion, ionCounts.water, 1);
            const pct = (value / maxVal) * 100;
            return (
              <tr key={label} className="border-b border-border/50">
                <td className={`py-1.5 px-2 font-semibold ${className}`}>{label}</td>
                <td className="text-right py-1.5 px-2 font-mono">{value}</td>
                <td className="py-1.5 px-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary/60 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
