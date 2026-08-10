"use client";

import type { ScoredReportPoint } from "@/lib/monthlyReports";

type MonthlyGrowthChartProps = {
  points: ScoredReportPoint[];
  selectedReportId: string | null;
  onSelectPoint: (point: ScoredReportPoint) => void;
  emptyLabel: string;
  singlePointHint: string;
  title?: string;
};

function formatAxisDay(ts: number) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function MonthlyGrowthChart({
  points,
  selectedReportId,
  onSelectPoint,
  emptyLabel,
  singlePointHint,
  title,
}: MonthlyGrowthChartProps) {
  if (points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center border border-dashed border-slate-200 px-4 text-center text-xs leading-relaxed text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  const width = 360;
  const height = 200;
  const padL = 34;
  const padR = 16;
  const padT = 20;
  const padB = 32;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const scores = points.map((p) => p.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const span = Math.max(10, maxScore - minScore);
  const yMin = Math.max(0, Math.floor((minScore - span * 0.2) / 5) * 5);
  const yMax = Math.min(100, Math.ceil((maxScore + span * 0.2) / 5) * 5);
  const yRange = Math.max(1, yMax - yMin);

  const xAt = (index: number) => {
    if (points.length === 1) return padL + plotW / 2;
    return padL + (index / (points.length - 1)) * plotW;
  };
  const yAt = (score: number) => padT + ((yMax - score) / yRange) * plotH;

  const lineCoords = points.map((p, i) => ({
    x: xAt(i),
    y: yAt(p.score),
    point: p,
  }));

  const linePath = lineCoords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    lineCoords.length >= 1
      ? [
          `M ${lineCoords[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)}`,
          ...lineCoords.map(
            (c) => `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`,
          ),
          `L ${lineCoords[lineCoords.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)}`,
          "Z",
        ].join(" ")
      : "";

  const yTicks = [yMin, Math.round((yMin + yMax) / 2), yMax];
  const last = points[points.length - 1];
  const first = points[0];
  const delta = last.score - first.score;

  return (
    <div>
      {title ? (
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {points.length >= 2 ? (
            <p
              className={`text-sm font-semibold tabular-nums ${
                delta > 0
                  ? "text-slate-900"
                  : delta < 0
                    ? "text-slate-500"
                    : "text-slate-500"
              }`}
            >
              {delta > 0 ? `+${delta}` : String(delta)}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Monthly score growth chart"
        >
          <defs>
            <linearGradient id="scoreAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = yAt(tick);
            return (
              <g key={tick}>
                <line
                  x1={padL}
                  x2={width - padR}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                  strokeDasharray={tick === yMin ? undefined : "3 4"}
                />
                <text
                  x={padL - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  style={{ fontSize: 10, fontWeight: 500 }}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {areaPath ? (
            <path d={areaPath} fill="url(#scoreAreaFill)" />
          ) : null}

          {lineCoords.length >= 2 ? (
            <path
              d={linePath}
              fill="none"
              stroke="#0f172a"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}

          {lineCoords.map(({ x, y, point }, index) => {
            const selected = point.report.id === selectedReportId;
            const showLabel =
              index === 0 ||
              index === points.length - 1 ||
              selected ||
              points.length <= 5;
            return (
              <g key={point.report.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => onSelectPoint(point)}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={selected ? 7 : 5}
                  fill={selected ? "#0f172a" : "#ffffff"}
                  stroke="#0f172a"
                  strokeWidth={2.25}
                  className="cursor-pointer"
                  onClick={() => onSelectPoint(point)}
                />
                {(selected || points.length <= 4) && (
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill="#0f172a"
                    style={{ fontSize: 10, fontWeight: 700 }}
                  >
                    {point.score}
                  </text>
                )}
                {showLabel ? (
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    fill="#94a3b8"
                    style={{ fontSize: 10 }}
                  >
                    {formatAxisDay(point.endedAt)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {points.length === 1 ? (
        <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-500">
          {singlePointHint}
        </p>
      ) : (
        <p className="mt-2 text-center text-[11px] text-slate-400">
          {formatAxisDay(first.endedAt)} · {first.score}
          {"  →  "}
          {formatAxisDay(last.endedAt)} · {last.score}
        </p>
      )}
    </div>
  );
}
