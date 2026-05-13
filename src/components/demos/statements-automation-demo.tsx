"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Bot, Table, Trash2, X, GripVertical, RotateCcw, Check, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

interface Position {
  x: number;
  y: number;
}

interface DemoNode {
  id: string;
  type: "statements" | "agent" | "excel";
  label: string;
  position: Position;
}

interface Connection {
  from: string;
  to: string;
}

const INITIAL_NODES: DemoNode[] = [];

const PALETTE_ITEMS = [
  {
    type: "statements" as const,
    label: "Text Statements",
    icon: FileText,
    description: "142 documents",
  },
  {
    type: "agent" as const,
    label: "AI Agent",
    icon: Bot,
    description: "Extract & Categorize",
  },
  {
    type: "excel" as const,
    label: "Excel Sheet",
    icon: Table,
    description: "Organized output",
  },
];

function getNodeColor(type: string) {
  switch (type) {
    case "statements":
      return "border-amber-500/50 bg-amber-500/10";
    case "agent":
      return "border-blue-500/50 bg-blue-500/10";
    case "excel":
      return "border-emerald-500/50 bg-emerald-500/10";
    default:
      return "border-white/20 bg-white/5";
  }
}

function getNodeIconColor(type: string) {
  switch (type) {
    case "statements":
      return "text-amber-400";
    case "agent":
      return "text-blue-400";
    case "excel":
      return "text-emerald-400";
    default:
      return "text-white";
  }
}

const EXTRACTED_DATA = [
  {
    category: "Utilities",
    vendor: "City Power Co.",
    amount: "$284.50",
    date: "2024-01-15",
    account: "Business Ops",
  },
  {
    category: "Software",
    vendor: "Adobe Creative",
    amount: "$54.99",
    date: "2024-01-12",
    account: "Subscriptions",
  },
  {
    category: "Office Supplies",
    vendor: "Staples Inc.",
    amount: "$127.33",
    date: "2024-01-10",
    account: "Operations",
  },
  {
    category: "Travel",
    vendor: "Delta Airlines",
    amount: "$892.00",
    date: "2024-01-08",
    account: "Business Travel",
  },
  {
    category: "Insurance",
    vendor: "State Farm",
    amount: "$1,240.00",
    date: "2024-01-05",
    account: "Fixed Costs",
  },
];

const VALID_CONNECTIONS: Record<string, string[]> = {
  statements: ["agent"],
  agent: ["excel"],
};

const MOBILE_POSITIONS: Record<string, Position> = {
  statements: { x: 20, y: 30 },
  agent: { x: 20, y: 140 },
  excel: { x: 20, y: 250 },
};

export function StatementsAutomationDemo() {
  const [nodes, setNodes] = useState<DemoNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [drawingLine, setDrawingLine] = useState<{ fromId: string; mousePos: Position } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const touchDragging = useRef<{ nodeId: string; offset: Position } | null>(null);
  const touchConnecting = useRef<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isChainComplete =
    nodes.length === 3 &&
    connections.some((c) => c.from === "statements" && c.to === "agent") &&
    connections.some((c) => c.from === "agent" && c.to === "excel");

  const runAutomation = useCallback(() => {
    if (!isChainComplete) return;
    setIsProcessing(true);
    setProcessStep(1);
    setTimeout(() => setProcessStep(2), 1500);
    setTimeout(() => {
      setProcessStep(3);
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }, 3000);
    setTimeout(() => {
      setIsProcessing(false);
    }, 4500);
  }, [isChainComplete]);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("node-type") as DemoNode["type"];
      const isNew = e.dataTransfer.getData("is-new") === "true";

      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      if (isNew) {
        if (nodes.find((n) => n.id === type)) return;
        const paletteItem = PALETTE_ITEMS.find((p) => p.type === type);
        if (!paletteItem) return;

        setNodes((prev) => [
          ...prev,
          {
            id: type,
            type,
            label: paletteItem.label,
            position: {
              x: e.clientX - rect.left - 85,
              y: e.clientY - rect.top - 40,
            },
          },
        ]);
      } else {
        const nodeId = e.dataTransfer.getData("node-id");
        if (!nodeId) return;
        setNodes((prev) =>
          prev.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  position: {
                    x: e.clientX - rect.left - dragOffset.current.x,
                    y: e.clientY - rect.top - dragOffset.current.y,
                  },
                }
              : n
          )
        );
      }
    },
    [nodes]
  );

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if ((e.target as HTMLElement).closest("[data-connect]")) return;
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left - node.position.x,
        y: e.clientY - rect.top - node.position.y,
      };
    },
    [nodes]
  );

  const handleConnectDragStart = useCallback(
    (e: React.MouseEvent, fromId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setDrawingLine({
        fromId,
        mousePos: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      });
    },
    []
  );

  useEffect(() => {
    if (!drawingLine) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setDrawingLine((prev) =>
        prev ? { ...prev, mousePos: { x: e.clientX - rect.left, y: e.clientY - rect.top } } : null
      );
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const fromId = drawingLine.fromId;
      const validTargets = VALID_CONNECTIONS[fromId] || [];

      for (const targetId of validTargets) {
        const targetNode = nodes.find((n) => n.id === targetId);
        if (!targetNode) continue;

        const withinNode =
          mouseX >= targetNode.position.x - 10 &&
          mouseX <= targetNode.position.x + 170 + 10 &&
          mouseY >= targetNode.position.y - 10 &&
          mouseY <= targetNode.position.y + 80 + 10;

        if (withinNode) {
          setConnections((prev) => {
            if (prev.find((c) => c.from === fromId && c.to === targetId)) return prev;
            return [...prev, { from: fromId, to: targetId }];
          });
          break;
        }
      }

      setDrawingLine(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawingLine, nodes]);

  const handleMobileAddNode = useCallback(
    (type: DemoNode["type"]) => {
      if (nodes.find((n) => n.id === type)) return;
      const paletteItem = PALETTE_ITEMS.find((p) => p.type === type);
      if (!paletteItem) return;

      setNodes((prev) => [
        ...prev,
        {
          id: type,
          type,
          label: paletteItem.label,
          position: MOBILE_POSITIONS[type],
        },
      ]);
    },
    [nodes]
  );

  const handleNodeTouchStart = useCallback(
    (e: React.TouchEvent, nodeId: string) => {
      if ((e.target as HTMLElement).closest("[data-connect]")) return;
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || !canvasRef.current) return;

      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      touchDragging.current = {
        nodeId,
        offset: {
          x: touch.clientX - rect.left - node.position.x,
          y: touch.clientY - rect.top - node.position.y,
        },
      };
    },
    [nodes]
  );

  const handleNodeTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchDragging.current || !canvasRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const { nodeId, offset } = touchDragging.current;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                position: {
                  x: Math.max(0, Math.min(rect.width - 150, touch.clientX - rect.left - offset.x)),
                  y: Math.max(0, Math.min(rect.height - 80, touch.clientY - rect.top - offset.y)),
                },
              }
            : n
        )
      );
    },
    []
  );

  const handleNodeTouchEnd = useCallback(() => {
    touchDragging.current = null;
  }, []);

  const handleConnectTouchStart = useCallback(
    (e: React.TouchEvent, fromId: string) => {
      e.preventDefault();
      e.stopPropagation();
      touchConnecting.current = fromId;
      if (!canvasRef.current) return;
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      setDrawingLine({
        fromId,
        mousePos: { x: touch.clientX - rect.left, y: touch.clientY - rect.top },
      });
    },
    []
  );

  const handleCanvasTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchDragging.current) {
        handleNodeTouchMove(e);
        return;
      }
      if (!touchConnecting.current || !canvasRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      setDrawingLine((prev) =>
        prev ? { ...prev, mousePos: { x: touch.clientX - rect.left, y: touch.clientY - rect.top } } : null
      );
    },
    [handleNodeTouchMove]
  );

  const handleCanvasTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchDragging.current) {
        handleNodeTouchEnd();
        return;
      }
      if (!touchConnecting.current || !canvasRef.current) {
        setDrawingLine(null);
        return;
      }

      const touch = e.changedTouches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = touch.clientX - rect.left;
      const mouseY = touch.clientY - rect.top;

      const fromId = touchConnecting.current;
      const validTargets = VALID_CONNECTIONS[fromId] || [];

      for (const targetId of validTargets) {
        const targetNode = nodes.find((n) => n.id === targetId);
        if (!targetNode) continue;

        const withinNode =
          mouseX >= targetNode.position.x - 15 &&
          mouseX <= targetNode.position.x + 150 + 15 &&
          mouseY >= targetNode.position.y - 15 &&
          mouseY <= targetNode.position.y + 80 + 15;

        if (withinNode) {
          setConnections((prev) => {
            if (prev.find((c) => c.from === fromId && c.to === targetId)) return prev;
            return [...prev, { from: fromId, to: targetId }];
          });
          break;
        }
      }

      touchConnecting.current = null;
      setDrawingLine(null);
    },
    [nodes, handleNodeTouchEnd]
  );

  const removeNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.from !== nodeId && c.to !== nodeId)
    );
  }, []);

  const reset = useCallback(() => {
    setNodes([]);
    setConnections([]);
    setIsProcessing(false);
    setProcessStep(0);
    setShowResults(false);
  }, []);

  const NODE_WIDTH = isMobile ? 150 : 170;

  return (
    <div className="mt-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-sunset">
          Try It: Statement Data Extraction
        </h3>
        <p className="mt-2 text-sm text-sunset/50 px-4">
          {isMobile
            ? "Tap to add nodes, then drag from dots to connect them"
            : "Drag nodes onto the canvas, then drag from one dot to another to connect them"}
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:w-56 flex flex-row lg:flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 overflow-x-auto"
        >
          <p className="text-xs font-medium text-sunset/40 uppercase tracking-wider hidden lg:block">
            Components
          </p>
          {PALETTE_ITEMS.map((item) => {
            const alreadyPlaced = nodes.find((n) => n.id === item.type);
            return (
              <div
                key={item.type}
                draggable={!alreadyPlaced && !isMobile}
                onClick={() => isMobile && handleMobileAddNode(item.type)}
                onDragStart={(e) => {
                  e.dataTransfer.setData("node-type", item.type);
                  e.dataTransfer.setData("is-new", "true");
                }}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border transition-all shrink-0 ${
                  isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
                } ${
                  alreadyPlaced
                    ? "border-white/5 bg-white/2 opacity-40 cursor-not-allowed"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95"
                }`}
              >
                <div
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center shrink-0 ${getNodeColor(item.type)}`}
                >
                  <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${getNodeIconColor(item.type)}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-sunset truncate">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-sunset/40 hidden sm:block">
                    {item.description}
                  </p>
                </div>
                <GripVertical className="h-3 w-3 text-sunset/20 ml-auto hidden lg:block" />
              </div>
            );
          })}
          <button
            onClick={reset}
            className="hidden lg:block mt-auto text-sm text-sunset/40 hover:text-sunset/70 transition-colors py-2"
          >
            Reset
          </button>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex-1 relative"
        >
          <div
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleCanvasDrop}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasTouchEnd}
            className="relative h-[360px] sm:h-[380px] lg:h-[400px] rounded-xl bg-white/[0.02] border border-white/10 border-dashed overflow-hidden select-none touch-none"
          >
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #E7E7E0 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <p className="text-sunset/20 text-sm text-center">
                  {isMobile
                    ? "Tap components above to add them here"
                    : "Drag components here to build your automation"}
                </p>
              </div>
            )}

            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.position.x + NODE_WIDTH + 10;
                const y1 = fromNode.position.y + 40;
                const x2 = toNode.position.x - 10;
                const y2 = toNode.position.y + 40;
                const mx = (x1 + x2) / 2;

                return (
                  <g key={`${conn.from}-${conn.to}`}>
                    <path
                      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                      stroke={
                        isProcessing
                          ? processStep >= (conn.from === "statements" ? 1 : 2)
                            ? "#60a5fa"
                            : "#ffffff20"
                          : "#ffffff30"
                      }
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={isProcessing ? "6 4" : "none"}
                      className={isProcessing ? "animate-[dash_1s_linear_infinite]" : ""}
                    />
                    {isProcessing &&
                      processStep >= (conn.from === "statements" ? 1 : 2) && (
                        <circle r="4" fill="#60a5fa">
                          <animateMotion
                            dur="1s"
                            repeatCount="indefinite"
                            path={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                          />
                        </circle>
                      )}
                  </g>
                );
              })}

              {drawingLine && (() => {
                const fromNode = nodes.find((n) => n.id === drawingLine.fromId);
                if (!fromNode) return null;
                const x1 = fromNode.position.x + NODE_WIDTH + 10;
                const y1 = fromNode.position.y + 40;
                const x2 = drawingLine.mousePos.x;
                const y2 = drawingLine.mousePos.y;
                const mx = (x1 + x2) / 2;
                return (
                  <path
                    d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                    stroke="#60a5fa"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6 4"
                    opacity="0.6"
                  />
                );
              })()}
            </svg>

            {nodes.map((node) => {
              const paletteItem = PALETTE_ITEMS.find(
                (p) => p.type === node.type
              );
              if (!paletteItem) return null;
              const Icon = paletteItem.icon;

              return (
                <div
                  key={node.id}
                  draggable={!drawingLine && !isMobile}
                  onDragStart={(e) => {
                    if (drawingLine) {
                      e.preventDefault();
                      return;
                    }
                    e.dataTransfer.setData("node-id", node.id);
                    e.dataTransfer.setData("is-new", "false");
                    handleNodeMouseDown(e as unknown as React.MouseEvent, node.id);
                    setDraggingNode(node.id);
                  }}
                  onDragEnd={() => setDraggingNode(null)}
                  onTouchStart={(e) => handleNodeTouchStart(e, node.id)}
                  onTouchMove={handleNodeTouchMove}
                  onTouchEnd={handleNodeTouchEnd}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    width: NODE_WIDTH,
                  }}
                  className={`absolute z-20 p-3 sm:p-4 rounded-xl border ${getNodeColor(node.type)} backdrop-blur-sm cursor-grab active:cursor-grabbing transition-shadow ${
                    draggingNode === node.id ? "opacity-50" : ""
                  }`}
                >
                  <button
                    onClick={() => removeNode(node.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 sm:h-5 sm:w-5 rounded-full bg-nebulosity border border-white/20 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                  >
                    <X className="h-3 w-3 text-sunset/60" />
                  </button>

                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${getNodeIconColor(node.type)}`} />
                    <span className="text-xs sm:text-sm font-medium text-sunset truncate">
                      {node.label}
                    </span>
                  </div>

                  {node.type === "statements" && (
                    <div className="mt-2 sm:mt-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] sm:text-xs bg-amber-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                        142
                      </span>
                      <span className="text-[10px] sm:text-xs text-sunset/40">documents</span>
                    </div>
                  )}

                  {node.type === "agent" && (
                    <p className="mt-2 sm:mt-2.5 text-[10px] sm:text-xs text-sunset/40 leading-tight">
                      Extract data, categorize
                    </p>
                  )}

                  {node.type === "excel" && (
                    <p className="mt-2 sm:mt-2.5 text-[10px] sm:text-xs text-sunset/40 leading-tight">
                      Output: organized spreadsheet
                    </p>
                  )}

                  {node.type !== "excel" && (
                    <div
                      data-connect
                      onMouseDown={(e) => handleConnectDragStart(e, node.id)}
                      onTouchStart={(e) => handleConnectTouchStart(e, node.id)}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-6 w-6 sm:h-5 sm:w-5 rounded-full border-2 transition-colors z-30 cursor-crosshair ${
                        drawingLine?.fromId === node.id
                          ? "bg-blue-400/60 border-blue-400"
                          : "bg-white/20 border-white/40 hover:bg-blue-400/40 hover:border-blue-400"
                      }`}
                      title="Drag to connect"
                    />
                  )}

                  {node.type !== "statements" && (
                    <div
                      data-connect
                      className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 sm:h-5 sm:w-5 rounded-full border-2 transition-colors z-30 ${
                        drawingLine && VALID_CONNECTIONS[drawingLine.fromId]?.includes(node.id)
                          ? "bg-blue-400/40 border-blue-400 animate-pulse"
                          : "bg-white/20 border-white/40"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-sunset/50">
              {nodes.length === 0 && "Start by adding components to the canvas"}
              {nodes.length > 0 && connections.length === 0 && !showResults && "Drag from a right dot to a left dot to connect nodes"}
              {connections.length > 0 && !isChainComplete && !showResults && "Connect all three: Statements \u2192 Agent \u2192 Excel"}
              {isChainComplete && !isProcessing && !showResults && "Chain complete! Run the automation"}
              {isProcessing && processStep === 1 && "Reading 142 text statements..."}
              {isProcessing && processStep === 2 && "Extracting amounts, dates, vendors... Categorizing..."}
              {isProcessing && processStep === 3 && "Done! 142 entries organized into 8 categories"}
              {showResults && !isProcessing && "Automation complete. Download your spreadsheet or start over."}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={reset}
                className="sm:hidden flex items-center gap-1.5 text-xs text-sunset/40 hover:text-sunset/70 transition-colors px-3 py-2 rounded-full border border-white/10"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={runAutomation}
                disabled={!isChainComplete || isProcessing || showResults}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isChainComplete && !isProcessing && !showResults
                    ? "bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-sunset/30 cursor-not-allowed"
                }`}
              >
                {isProcessing ? "Processing..." : "Run Automation"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="rounded-xl border border-emerald-500/20 bg-white/5 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-sunset">extracted_statements.xlsx</span>
                </div>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-sunset/60 font-medium">Category</th>
                      <th className="text-left p-3 text-sunset/60 font-medium">Vendor</th>
                      <th className="text-left p-3 text-sunset/60 font-medium">Amount</th>
                      <th className="text-left p-3 text-sunset/60 font-medium hidden sm:table-cell">Date</th>
                      <th className="text-left p-3 text-sunset/60 font-medium hidden sm:table-cell">Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXTRACTED_DATA.map((row, i) => (
                      <motion.tr
                        key={row.vendor}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {row.category}
                          </span>
                        </td>
                        <td className="p-3 text-sunset/80">{row.vendor}</td>
                        <td className="p-3 text-sunset font-medium">{row.amount}</td>
                        <td className="p-3 text-sunset/60 hidden sm:table-cell">{row.date}</td>
                        <td className="p-3 text-sunset/60 hidden sm:table-cell">{row.account}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-white/10 text-xs text-sunset/40 text-center">
                Showing 5 of 142 extracted entries
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-sunset/50">
                  142 statements processed into 8 categories
                </span>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-2 text-sm text-sunset/40 hover:text-sunset/70 transition-colors px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20"
              >
                <RotateCcw className="h-4 w-4" />
                Start Over
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-sunset/50 mb-4">
                Hours of manual data entry done in seconds — with perfect accuracy.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-sunset text-neon-navy font-semibold text-base sm:text-lg rounded-full hover:bg-white transition-all shadow-lg shadow-sunset/10"
              >
                Automate Your Data Processing
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
