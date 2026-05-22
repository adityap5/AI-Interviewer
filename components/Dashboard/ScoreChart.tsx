"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, Award } from "lucide-react";

interface ScoreChartProps {
  data: {
    date: string;
    score: number;
  }[];
}

export function ScoreChart({ data }: ScoreChartProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden h-80 flex flex-col justify-between select-none">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
            Progress Tracking
          </span>
          <h3 className="text-sm font-bold text-textPrimary mt-0.5 flex items-center gap-1.5">
            Score History <TrendingUp className="w-4 h-4 text-accent" />
          </h3>
        </div>
        {hasData && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-accent/10 border border-accent/25 rounded-lg text-accent-light text-[10px] font-bold uppercase tracking-wider">
            Last {data.length} Mocks
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[160px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 10]}
                tickCount={6}
                dx={-5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111111",
                  borderColor: "#1f1f1f",
                  borderRadius: "12px",
                  color: "#f5f5f5",
                  fontSize: "11px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#6366f1" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: "#111111", stroke: "#6366f1", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 1.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center p-6 border border-dashed border-border/80 rounded-2xl max-w-[280px]">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center mx-auto text-textSecondary mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-textPrimary">No data points yet</h4>
            <p className="text-[10px] text-textSecondary mt-1 leading-relaxed">
              Complete your first mock interview session to unlock progress trend tracking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScoreChart;
