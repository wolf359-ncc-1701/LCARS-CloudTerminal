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
      x: 110,
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
      x: 390,
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
      x: 110,
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
      x: 390,
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

  // Room loop connections to show network ring structure
  const rings = [
    { from: "living", to: "work", label: "ODN-A" },
    { from: "work", to: "entry", label: "ODN-B" },
    { from: "entry", to: "sif", label: "SIF-A" },
    { from: "sif", to: "sleep", label: "SIF-B" },
    { from: "sleep", to: "living", label: "ODN-C" },
    { from: "living", to: "eps", label: "EPS-X" },
    { from: "work", to: "eps", label: "EPS-Y" },
  ];

  const getNodeCoords = (id: string) => {
    const n = nodes.find((node) => node.id === id);
    return n ? { x: n.x, y: n.y } : { x: cx, y: cy };
  };

  return (
    <div className="system-diagram-container" style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        viewBox="0 0 500 400"
        className="system-diagram-svg"
        style={{ width: "100%", height: "100%", background: "#000" }}
      >
        <defs>
          {/* Background Grid Pattern */}
          <pattern id="diag-grid-v06" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(42, 113, 147, 0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag-grid-v06)" />

        {/* Decorative Dial/Compass behind Core */}
        <circle cx={cx} cy={cy} r="65" fill="none" stroke="rgba(103, 202, 240, 0.08)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="85" fill="none" stroke="rgba(103, 202, 240, 0.05)" strokeWidth="1.5" strokeDasharray="8, 6" />
        <circle cx={cx} cy={cy} r="105" fill="none" stroke="rgba(103, 202, 240, 0.03)" strokeWidth="1" strokeDasharray="3, 15" />
        
        {/* Crosshairs behind Core */}
        <line x1={cx - 120} y1={cy} x2={cx + 120} y2={cy} stroke="rgba(103, 202, 240, 0.04)" strokeWidth="1" />
        <line x1={cx} y1={cy - 120} x2={cx} y2={cy + 120} stroke="rgba(103, 202, 240, 0.04)" strokeWidth="1" />

        {/* Room-to-Room Network Ring Connections */}
        {rings.map((ring, idx) => {
          const fromCoords = getNodeCoords(ring.from);
          const toCoords = getNodeCoords(ring.to);
          const midX = (fromCoords.x + toCoords.x) / 2;
          const midY = (fromCoords.y + toCoords.y) / 2;

          return (
            <g key={`ring-${idx}`}>
              <line
                x1={fromCoords.x}
                y1={fromCoords.y}
                x2={toCoords.x}
                y2={toCoords.y}
                stroke="var(--gray-dark)"
                strokeWidth="1"
                strokeDasharray="4, 4"
                opacity="0.6"
              />
              <text
                x={midX}
                y={midY - 4}
                fill="var(--gray)"
                fontSize="6"
                textAnchor="middle"
                fontFamily="var(--font-lcars)"
              >
                {ring.label}
              </text>
            </g>
          );
        })}

        {/* Core to Room Star Connections (Animated Data Streams) */}
        {nodes.map((node) => {
          const isWarning = node.id === "eps" && telemetry[8] > 75;
          const strokeColor = isWarning ? "var(--orange-dark)" : "var(--cyan)";
          const flowColor = isWarning ? "var(--orange)" : "var(--cyan-bright)";

          // Calculate angle for port label position
          const angle = Math.atan2(node.y - cy, node.x - cx);
          const labelX = cx + Math.cos(angle) * 55;
          const labelY = cy + Math.sin(angle) * 55;
          const portNumber = node.id === "living" ? "P-80" : node.id === "work" ? "P-443" : node.id === "sleep" ? "P-109" : node.id === "entry" ? "P-22" : "P-47";

          return (
            <g key={`star-${node.id}`}>
              {/* Solid background path */}
              <line
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={strokeColor}
                strokeWidth="2"
                opacity="0.3"
              />
              {/* Denser animated flow dashes */}
              <line
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={flowColor}
                strokeWidth="2"
                strokeDasharray="4, 12"
                className="animated-flow-line"
              />
              {/* Port label markings */}
              <text
                x={labelX}
                y={labelY + 2}
                fill="var(--gray-light)"
                fontSize="6"
                textAnchor="middle"
                fontFamily="var(--font-lcars)"
              >
                {portNumber}
              </text>
            </g>
          );
        })}

        {/* Gateway Center Core Node */}
        <g
          className="node-group core-node"
          transform={`translate(${cx}, ${cy})`}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => {
            setHoveredNode({
              id: "core",
              name: "AI TRANSCEIVER CORE",
              x: cx,
              y: cy,
              details: [
                "CPU MUX LOAD: " + telemetry[1] + "%",
                "ODN NET STATE: LINKED",
                "EPS INDUCTION: " + telemetry[14] + " kW",
                "BUS FREQUENCY: 60.02 Hz",
              ],
            });
          }}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle r="26" fill="rgba(16, 20, 27, 0.95)" stroke="var(--cyan-bright)" strokeWidth="3" />
          <circle r="16" fill="none" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="3, 3" />
          <circle r="8" fill="var(--cyan-bright)" />
          
          <text
            y="-34"
            textAnchor="middle"
            fill="var(--cyan-bright)"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="0.8"
            fontFamily="var(--font-lcars)"
          >
            TRANS.CORE-01
          </text>
        </g>

        {/* Room & Sub-System Nodes */}
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
              style={{ cursor: "pointer", outline: "none" }}
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
                x="-46"
                y="-15"
                width="92"
                height="30"
                rx="3"
                fill="var(--panel)"
                stroke={nodeColor}
                strokeWidth={isHovered ? "2.5" : "1.2"}
                style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
              />
              {/* Ticks on Node Corners */}
              <line x1="-46" y1="-15" x2="-40" y2="-15" stroke={nodeColor} strokeWidth="1.5" />
              <line x1="-46" y1="-15" x2="-46" y2="-9" stroke={nodeColor} strokeWidth="1.5" />
              <line x1="46" y1="15" x2="40" y2="15" stroke={nodeColor} strokeWidth="1.5" />
              <line x1="46" y1="15" x2="46" y2="9" stroke={nodeColor} strokeWidth="1.5" />

              <text
                textAnchor="middle"
                y="4"
                fill="var(--gray-white)"
                fontSize="9"
                fontWeight="bold"
                letterSpacing="0.5"
                fontFamily="var(--font-lcars)"
                pointerEvents="none"
              >
                {node.name}
              </text>
              {/* Small sub-label number */}
              <text
                textAnchor="middle"
                y="-18"
                fill={nodeColor}
                fontSize="7.5"
                fontFamily="var(--font-lcars)"
                pointerEvents="none"
              >
                {node.id === "living" && "SYS-CH-01"}
                {node.id === "work" && "SYS-CH-02"}
                {node.id === "sleep" && "SYS-CH-03"}
                {node.id === "entry" && "SYS-CH-04"}
                {node.id === "eps" && "EPS-GRID"}
                {node.id === "sif" && "SIF-LOOP"}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip Panel */}
      {hoveredNode && (
        <div
          className="system-diagram-tooltip panel-enter"
          style={{
            position: "absolute",
            left: hoveredNode.x > 250 ? `${hoveredNode.x - 190}px` : `${hoveredNode.x + 45}px`,
            top: hoveredNode.y > 200 ? `${hoveredNode.y - 120}px` : `${hoveredNode.y - 10}px`,
            width: "165px",
            background: "rgba(10, 12, 16, 0.96)",
            border: "1.5px solid var(--cyan-light)",
            borderLeftWidth: "6px",
            padding: "8px 10px",
            boxShadow: "0 4px 25px rgba(0,0,0,0.85)",
            zIndex: 10,
            pointerEvents: "none",
            fontFamily: "var(--font-lcars)",
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
                lineHeight: "1.4",
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-lcars)"
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
