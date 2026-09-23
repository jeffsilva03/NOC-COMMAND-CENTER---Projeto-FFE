import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { TelemetryData } from '../types/fleet';

interface TelemetryChartProps {
  data: TelemetryData[];
}

export function TelemetryChart({
  data,
}: TelemetryChartProps) {
  return (
    <div className="bg-noc-card border border-slate-800 rounded-2xl p-6">

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Telemetria da Frota
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Velocidade média por categoria
        </p>
      </div>

      <div className="w-full h-[300px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>

            <defs>
              <linearGradient
                id="velocidadeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3b82f6"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#3b82f6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{
                fontSize: 11,
              }}
            />

            <YAxis
              stroke="#64748b"
              tick={{
                fontSize: 11,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#fff',
              }}
            />

            <Area
              type="monotone"
              dataKey="velocidade"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#velocidadeGradient)"
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}