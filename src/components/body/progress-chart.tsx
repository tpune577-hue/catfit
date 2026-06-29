"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import type { BodyMetric } from "@/lib/plan-adjuster";

export function ProgressChart({
  metrics,
  dataKey,
  label,
  unit,
  color = "#F5C400",
}: {
  metrics: BodyMetric[];
  dataKey: "weight" | "waist";
  label: string;
  unit: string;
  color?: string;
}) {
  const data = [...metrics]
    .filter((m) => m[dataKey] !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((m) => ({
      date: format(parseISO(m.date), "d MMM", { locale: th }),
      value: m[dataKey],
    }));

  if (data.length < 2) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        บันทึกข้อมูลอย่างน้อย 2 ครั้งเพื่อดูกราฟ
      </p>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
          <Tooltip formatter={(v) => [`${v} ${unit}`, label]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
