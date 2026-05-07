"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Smartphone,
  ArrowRight,
  RotateCcw,
  Type,
  Image,
  Square,
  List,
  ToggleLeft,
  MapPin,
  CreditCard,
  Menu,
  GripVertical,
  X,
  Home,
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";

interface UIComponent {
  id: string;
  type: string;
  label: string;
  icon: typeof Type;
}

interface DroppedComponent {
  id: string;
  type: string;
  label: string;
}

const UI_COMPONENTS: UIComponent[] = [
  { id: "header", type: "header", label: "Header", icon: Menu },
  { id: "text", type: "text", label: "Text", icon: Type },
  { id: "image", type: "image", label: "Image", icon: Image },
  { id: "button", type: "button", label: "Button", icon: Square },
  { id: "list", type: "list", label: "List", icon: List },
  { id: "toggle", type: "toggle", label: "Toggle", icon: ToggleLeft },
  { id: "map", type: "map", label: "Map", icon: MapPin },
  { id: "card", type: "card", label: "Card", icon: CreditCard },
];

const APP_SCREENS = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "cart", label: "Cart", icon: ShoppingBag },
  { id: "profile", label: "Profile", icon: User },
];

const SCREEN_COLORS = [
  { name: "Blue", primary: "bg-blue-500", text: "text-blue-500", light: "bg-blue-100" },
  { name: "Purple", primary: "bg-violet-500", text: "text-violet-500", light: "bg-violet-100" },
  { name: "Orange", primary: "bg-orange-500", text: "text-orange-500", light: "bg-orange-100" },
];

function RenderedComponent({ component, color }: { component: DroppedComponent; color: typeof SCREEN_COLORS[0] }) {
  switch (component.type) {
    case "header":
      return (
        <div className={`w-full h-10 rounded-lg ${color.primary} flex items-center px-3 gap-2`}>
          <div className="w-4 h-4 rounded bg-white/30" />
          <div className="w-16 h-2 rounded bg-white/60" />
        </div>
      );
    case "text":
      return (
        <div className="w-full space-y-1.5 py-1">
          <div className="h-2.5 w-4/5 rounded bg-gray-200" />
          <div className="h-2 w-3/5 rounded bg-gray-100" />
        </div>
      );
    case "image":
      return (
        <div className={`w-full h-20 rounded-lg ${color.light} flex items-center justify-center`}>
          <Image className="h-5 w-5 text-gray-400" />
        </div>
      );
    case "button":
      return (
        <div className={`w-full h-9 rounded-lg ${color.primary} flex items-center justify-center`}>
          <div className="w-14 h-2 rounded bg-white/70" />
        </div>
      );
    case "list":
      return (
        <div className="w-full space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <div className={`h-6 w-6 rounded ${color.light}`} />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-3/4 rounded bg-gray-200" />
                <div className="h-1.5 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      );
    case "toggle":
      return (
        <div className="w-full flex items-center justify-between py-1">
          <div className="h-2.5 w-20 rounded bg-gray-200" />
          <div className={`w-9 h-5 rounded-full ${color.primary} flex items-center justify-end px-0.5`}>
            <div className="h-4 w-4 rounded-full bg-white" />
          </div>
        </div>
      );
    case "map":
      return (
        <div className="w-full h-20 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 left-3 w-12 h-px bg-green-300" />
            <div className="absolute top-5 left-6 w-8 h-px bg-green-300" />
            <div className="absolute top-3 left-2 w-px h-8 bg-green-300" />
            <div className="absolute top-1 left-8 w-px h-12 bg-green-300" />
          </div>
          <MapPin className={`h-5 w-5 ${color.text}`} />
        </div>
      );
    case "card":
      return (
        <div className="w-full rounded-lg border border-gray-200 p-2.5 space-y-2">
          <div className={`h-12 rounded ${color.light}`} />
          <div className="h-2.5 w-3/4 rounded bg-gray-200" />
          <div className="h-2 w-1/2 rounded bg-gray-100" />
        </div>
      );
    default:
      return null;
  }
}

export function MobileAppDemo() {
  // Each screen has its own components
  const [screenComponents, setScreenComponents] = useState<Record<string, DroppedComponent[]>>({
    home: [],
    search: [],
    favorites: [],
    cart: [],
    profile: [],
  });
  const [activeScreen, setActiveScreen] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dropCounter = useRef(0);

  const colorScheme = SCREEN_COLORS[colorIndex];
  const currentScreenId = APP_SCREENS[activeScreen].id;
  const currentComponents = screenComponents[currentScreenId] || [];

  const handleDragStart = useCallback((e: React.DragEvent, component: UIComponent) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
    e.dataTransfer.effectAllowed = "copy";
    setDraggingId(component.id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setDraggingId(null);
    const data = e.dataTransfer.getData("component");
    if (!data) return;
    const component = JSON.parse(data) as UIComponent;
    dropCounter.current += 1;
    const newComp: DroppedComponent = {
      id: `${component.type}-${dropCounter.current}`,
      type: component.type,
      label: component.label,
    };
    setScreenComponents((prev) => ({
      ...prev,
      [currentScreenId]: [...(prev[currentScreenId] || []), newComp],
    }));
  }, [currentScreenId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  // Mobile tap-to-add
  const addComponent = useCallback((component: UIComponent) => {
    dropCounter.current += 1;
    const newComp: DroppedComponent = {
      id: `${component.type}-${dropCounter.current}`,
      type: component.type,
      label: component.label,
    };
    setScreenComponents((prev) => ({
      ...prev,
      [currentScreenId]: [...(prev[currentScreenId] || []), newComp],
    }));
  }, [currentScreenId]);

  const removeComponent = useCallback((id: string) => {
    setScreenComponents((prev) => ({
      ...prev,
      [currentScreenId]: (prev[currentScreenId] || []).filter((c) => c.id !== id),
    }));
  }, [currentScreenId]);

  const reorderComponents = useCallback((newOrder: DroppedComponent[]) => {
    setScreenComponents((prev) => ({
      ...prev,
      [currentScreenId]: newOrder,
    }));
  }, [currentScreenId]);

  const reset = useCallback(() => {
    setScreenComponents({
      home: [],
      search: [],
      favorites: [],
      cart: [],
      profile: [],
    });
    dropCounter.current = 0;
  }, []);

  const totalComponents = Object.values(screenComponents).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-astro-grey mb-3">
            Interactive Demo
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-neon-navy">
            Build Your App Screens
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Drag components into the phone, reorder them by dragging up and down, and switch between screens to build your full app.
          </p>
        </motion.div>

        {/* Color picker + reset */}
        <div className="flex justify-center items-center gap-3 mb-8">
          {SCREEN_COLORS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setColorIndex(i)}
              className={`h-8 w-8 rounded-full border-2 transition-all ${c.primary} ${
                colorIndex === i ? "border-neon-navy scale-110 shadow-md" : "border-transparent hover:scale-105"
              }`}
              title={c.name}
            />
          ))}
          {totalComponents > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 ml-4 px-3 py-1.5 rounded-full border border-black/10 text-xs text-wild-dove hover:text-neon-navy hover:border-neon-navy/20 transition-all"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
          {/* Component palette — left on desktop */}
          <div className="w-full lg:w-auto order-2 lg:order-1">
            <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-3 text-center lg:text-left">
              UI Components
            </p>
            {/* Desktop: vertical grid */}
            <div className="hidden lg:grid grid-cols-2 gap-2 w-[200px]">
              {UI_COMPONENTS.map((comp) => {
                const Icon = comp.icon;
                return (
                  <div
                    key={comp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, comp)}
                    onDragEnd={handleDragEnd}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all select-none ${
                      draggingId === comp.id
                        ? "border-neon-navy/30 bg-neon-navy/5 scale-95 opacity-60"
                        : "border-black/10 hover:border-neon-navy/20 hover:bg-neon-navy/[0.02]"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-neon-navy/60" />
                    <span className="text-[10px] font-medium text-nebulosity">{comp.label}</span>
                  </div>
                );
              })}
            </div>
            {/* Mobile: horizontal scroll with tap-to-add */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 px-1">
              {UI_COMPONENTS.map((comp) => {
                const Icon = comp.icon;
                return (
                  <button
                    key={comp.id}
                    onClick={() => addComponent(comp)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-black/10 hover:border-neon-navy/20 transition-all min-w-[70px] shrink-0"
                  >
                    <Icon className="h-4 w-4 text-neon-navy/60" />
                    <span className="text-[9px] font-medium text-nebulosity whitespace-nowrap">{comp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone mockup — centered */}
          <div className="order-1 lg:order-2 flex-shrink-0">
            <div
              className={`relative w-[280px] sm:w-[300px] h-[540px] sm:h-[580px] bg-black rounded-[3rem] p-3 shadow-2xl transition-shadow ${
                dragOver ? "shadow-blue-500/20 shadow-3xl" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-20" />

              {/* Screen */}
              <div className="relative h-full bg-white rounded-[2.2rem] overflow-hidden flex flex-col">
                {/* Status bar */}
                <div className={`h-12 flex items-end justify-center pb-1 ${colorScheme.primary}`}>
                  <span className="text-[10px] font-semibold text-white/90">
                    {APP_SCREENS[activeScreen].label}
                  </span>
                </div>

                {/* Content area */}
                <div className="flex-1 px-3 py-3 overflow-y-auto relative">
                  <AnimatePresence mode="wait">
                    {currentComponents.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-colors ${
                          dragOver ? "border-blue-400 bg-blue-50/50" : "border-gray-200"
                        }`}
                      >
                        <Smartphone className={`h-8 w-8 mb-3 transition-colors ${dragOver ? "text-blue-400" : "text-gray-300"}`} />
                        <p className={`text-sm font-medium transition-colors ${dragOver ? "text-blue-500" : "text-gray-400"}`}>
                          {dragOver ? "Drop here!" : "Drag components here"}
                        </p>
                        <p className="text-[10px] text-gray-300 mt-1 lg:hidden">
                          Tap a component to add it
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Reorder.Group
                          axis="y"
                          values={currentComponents}
                          onReorder={reorderComponents}
                          className="space-y-2"
                        >
                          {currentComponents.map((comp) => (
                            <Reorder.Item
                              key={comp.id}
                              value={comp}
                              className="relative group"
                            >
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative cursor-grab active:cursor-grabbing"
                              >
                                {/* Remove button */}
                                <button
                                  onClick={() => removeComponent(comp.id)}
                                  className="absolute -top-1 -right-1 z-10 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                {/* Drag handle */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 opacity-0 group-hover:opacity-40 transition-opacity">
                                  <GripVertical className="h-3 w-3 text-gray-400" />
                                </div>
                                <RenderedComponent component={comp} color={colorScheme} />
                              </motion.div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Drop overlay when has items */}
                  {currentComponents.length > 0 && dragOver && (
                    <div className="absolute inset-0 bg-blue-50/60 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-400 pointer-events-none z-10">
                      <p className="text-sm font-medium text-blue-500">Drop to add</p>
                    </div>
                  )}
                </div>

                {/* Tab bar — 5 screens */}
                <div className="h-14 border-t border-gray-100 flex items-center justify-around px-2">
                  {APP_SCREENS.map((screen, i) => {
                    const Icon = screen.icon;
                    const isActive = activeScreen === i;
                    const hasComponents = (screenComponents[screen.id] || []).length > 0;
                    return (
                      <button
                        key={screen.id}
                        onClick={() => setActiveScreen(i)}
                        className="flex flex-col items-center gap-0.5 p-1 relative"
                      >
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive ? colorScheme.text : "text-gray-400"
                          }`}
                        />
                        <span className={`text-[8px] ${isActive ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                          {screen.label}
                        </span>
                        {hasComponents && (
                          <div className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${colorScheme.primary}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Home indicator */}
                <div className="h-5 flex items-center justify-center">
                  <div className="w-24 h-1 rounded-full bg-black/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Info panel — right on desktop */}
          <div className="order-3 max-w-[200px] hidden lg:block">
            <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-3">
              App Builder
            </p>
            <p className="text-sm text-wild-dove leading-relaxed mb-4">
              {totalComponents === 0
                ? "Drag components from the left into the phone. Switch screens using the tab bar to build multiple pages."
                : `${totalComponents} component${totalComponents !== 1 ? "s" : ""} across ${Object.values(screenComponents).filter((arr) => arr.length > 0).length} screen${Object.values(screenComponents).filter((arr) => arr.length > 0).length !== 1 ? "s" : ""}. Drag up/down to reorder.`}
            </p>

            {/* Screen summary */}
            <div className="space-y-1.5 mb-5">
              {APP_SCREENS.map((screen, i) => {
                const count = (screenComponents[screen.id] || []).length;
                const Icon = screen.icon;
                return (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreen(i)}
                    className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-left transition-all text-xs ${
                      activeScreen === i
                        ? "bg-neon-navy/5 text-neon-navy font-medium"
                        : "text-wild-dove hover:text-neon-navy"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="flex-1">{screen.label}</span>
                    {count > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neon-navy/10 text-neon-navy font-medium">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-neon-navy/5 text-neon-navy font-medium">React Native</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-neon-navy/5 text-neon-navy font-medium">iOS & Android</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-neon-navy/5 text-neon-navy font-medium">60fps</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
          >
            Build My App
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
