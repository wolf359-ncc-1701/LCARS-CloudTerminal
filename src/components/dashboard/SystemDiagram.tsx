import React, { useState } from "react";
import { rooms } from "../../data/mock";

interface SystemDiagramProps {
  telemetry: number[];
}

interface HoveredNodeData {
  id: string;
  name: string;
  x: number;
  y: number;
  details: string[];
}

export const SystemDiagram: React.FC<SystemDiagramProps> = ({ telemetry }) => {
  const [hoveredNode, setHoveredNode] = useState<HoveredNodeData | null>(null);

  // Core coordinates
  const cx = 250;
  const cy = 200;

  // Nodes metadata
  const nodes = [
    {
      id: "living",
      name: "LIVING DECK",
      x: 120,
      y: 110,
      getDetails: () => {
        const room = rooms.find((r) => r.id === "living");
        return [
          `DECK: ${room?.deck || "01"}`,
          `TEMP: ${room?.temperature.toFixed(1) || "23.5"}°C`,
          `HUMIDITY: ${room?.humidity || "42"}%`,
          `LIGHT: ${room?.light || "60"}%`,
          `MOTION: ${room?.motion ? "DETECTED" : "NONE"}`,
          `FLOW: ${telemetry[3]} KB/s`,
        ];
      },
    },
    {
      id: "work",
      name: "WORK BAY",
      x: 380,
      y: 110,
      getDetails: () => {
        const room = rooms.find((r) => r.id === "work");
        return [
          `DECK: ${room?.deck || "02"}`,
          `TEMP: ${room?.temperature.toFixed(1) || "22.0"}°C`,
          `HUMIDITY: ${room?.humidity || "39"}%`,
          `LIGHT: ${room?.light || "80"}%`,
          `MOTION: ${room?.motion ? "DETECTED" : "NONE"}`,
          `FLOW: ${telemetry[4]} KB/s`,
        ];
      },
    },
    {
      id: "sleep",
      name: "SLEEP QTRS",
      x: 120,
      y: 290,
      getDetails: () => {
        const room = rooms.find((r) => r.id === "sleep");
        return [
          `DECK: ${room?.deck || "03"}`,
          `TEMP: ${room?.temperature.toFixed(1) || "21.0"}°C`,
          `HUMIDITY: ${room?.humidity || "45"}%`,
          `LIGHT: ${room?.light || "15"}%`,
          `MOTION: ${room?.motion ? "DETECTED" : "NONE"}`,
          `FLOW: ${telemetry[5]} KB/s`,
        ];
      },
    },
    {
      id: "entry",
      name: "ENTRY LOCK",
      x: 380,
      y: 290,
      getDetails: () => {
        const room = rooms.find((r) => r.id === "entry");
        return [
          `DECK: ${room?.deck || "04"}`,
          `TEMP: ${room?.temperature.toFixed(1) || "24.0"}°C`,
          `HUMIDITY: ${room?.humidity || "44"}%`,
          `LIGHT: ${room?.light || "30"}%`,
          `MOTION: ${room?.motion ? "DETECTED" : "NONE"}`,
          `FLOW: ${telemetry[6]} KB/s`,
        ];
      },
    },
    {
      id: "eps",
      name: "EPS MODULE",
      x: 250,
      y: 50,
      getDetails: () => [
        "SYSTEM: EPS GRID",
        `GRID LOAD: ${telemetry[8]}%`,
        `VOLTAGE: 440 V`,
        "STATUS: NOMINAL",
      ],
    },
    {
      id: "sif",
      name: "LIFE SUPPORT",
      x: 250,
      y: 350,
      getDetails: () => [
        "SYSTEM: SIF LAYER",
        `O2 INDEX: 99.4%`,
        `SCRUBBERS: ${telemetry[12]}%`,
        "STATUS: STANDBY",
      ],
    },
  ];

  return (
    <div className="system-diagram-container" style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        viewBox="0 0 500 400"
        className="system-diagram-svg"
        style={{ width: "100%", height: "100%", background: "#000" }}
      >
        {/* Background Grid */}
        <defs>
          <pattern id="diag-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(42, 113, 147, 0.12)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag-grid)" />

        {/* Animated Connections from Core to Rooms */}
        {nodes.map((node) => {
          const isWarning = node.id === "eps" && telemetry[8] > 75;
          const strokeColor = isWarning ? "var(--orange-dark)" : "var(--cyan)";
          const flowColor = isWarning ? "var(--orange)" : "var(--cyan-bright)";

          return (
            <g key={`link-${node.id}`}>
              {/* Static background path */}
              <line
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={strokeColor}
                strokeWidth="2.5"
                opacity="0.3"
              />
              {/* Animated data flow dots */}
              <line
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={flowColor}
                strokeWidth="2.5"
                strokeDasharray="6, 18"
                className="animated-flow-line"
              />
            </g>
          );
        })}

        {/* Central Gateway Node */}
        <g
          className="node-group core-node"
          transform={`translate(${cx}, ${cy})`}
          onMouseEnter={(e) => {
            setHoveredNode({
              id: "core",
              name: "MAIN MOCK GATEWAY",
              x: cx,
              y: cy,
              details: [
                "CPU USAGE: " + telemetry[1] + "%",
                "NET STATUS: LINKED",
                "EPS FEED: " + telemetry[14] + " kW",
                "TEMP THRESH: OK",
              ],
            });
          }}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle r="26" fill="rgba(42, 113, 147, 0.2)" stroke="var(--cyan-bright)" strokeWidth="3" />
          <circle r="14" fill="var(--cyan-bright)" />
          <text
            y="-32"
            textAnchor="middle"
            fill="var(--cyan-bright)"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="1"
          >
            CORE.LOCAL
          </text>
        </g>

        {/* Room & Module Nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          const isEpsWarning = node.id === "eps" && telemetry[8] > 75;
          const nodeColor = isEpsWarning
            ? "var(--orange)"
            : isHovered
              ? "var(--cyan-bright)"
              : "var(--cyan-light)";

          return (
            <g
              key={node.id}
              className={`node-group node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => {
                setHoveredNode({
                  id: node.id,
                  name: node.name,
                  x: node.x,
                  y: node.y,
                  details: node.getDetails(),
                });
              }}
              onMouseLeave={() => setHoveredNode(null)}
              tabIndex={0}
              onFocus={() => {
                setHoveredNode({
                  id: node.id,
                  name: node.name,
                  x: node.x,
                  y: node.y,
                  details: node.getDetails(),
                });
              }}
              onBlur={() => setHoveredNode(null)}
            >
              <rect
                x="-40"
                y="-16"
                width="80"
                height="32"
                rx="6"
                fill="var(--panel-2)"
                stroke={nodeColor}
                strokeWidth={isHovered ? "3" : "1.8"}
                style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
              />
              <text
                textAnchor="middle"
                y="4"
                fill="var(--gray-white)"
                fontSize="9.5"
                fontWeight="800"
                pointerEvents="none"
              >
                {node.name}
              </text>
              {/* Telemetry percentage display overlay */}
              <text
                textAnchor="middle"
                y="-20"
                fill={nodeColor}
                fontSize="8"
                pointerEvents="none"
              >
                {node.id === "living" && `LCARS.01`}
                {node.id === "work" && `LCARS.02`}
                {node.id === "sleep" && `LCARS.03`}
                {node.id === "entry" && `LCARS.04`}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Sci-fi Tooltip */}
      {hoveredNode && (
        <div
          className="system-diagram-tooltip panel-enter"
          style={{
            position: "absolute",
            left: hoveredNode.x > 250 ? `${hoveredNode.x - 190}px` : `${hoveredNode.x + 45}px`,
            top: hoveredNode.y > 200 ? `${hoveredNode.y - 120}px` : `${hoveredNode.y - 10}px`,
            width: "155px",
            background: "rgba(16, 20, 27, 0.95)",
            border: "1.5px solid var(--cyan-light)",
            borderLeftWidth: "6px",
            padding: "8px 10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.65)",
            zIndex: 10,
            pointerEvents: "none",
            fontFamily: "var(--font-family)",
          }}
        >
          <div
            style={{
              color: "var(--cyan-bright)",
              fontWeight: 800,
              fontSize: "0.8rem",
              borderBottom: "1px solid rgba(103, 202, 240, 0.3)",
              paddingBottom: "3px",
              marginBottom: "5px",
              letterSpacing: "0.5px",
            }}
          >
            {hoveredNode.name}
          </div>
          {hoveredNode.details.map((detail, idx) => (
            <div
              key={idx}
              style={{
                color: "var(--gray-white)",
                fontSize: "0.72rem",
                lineHeight: "1.3",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{detail.split(":")[0]}:</span>
              <span style={{ color: "var(--cyan-bright)", fontWeight: "bold" }}>
                {detail.split(":")[1]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
