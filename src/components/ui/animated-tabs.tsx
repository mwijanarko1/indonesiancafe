"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useId, useMemo, useState } from "react";

export type AnimatedTab = {
  id: string;
  label: string;
  icon?: ReactNode;
};

export type AnimatedTabsProps = {
  activeTab?: string;
  className?: string;
  defaultTab?: string;
  indicatorClassName?: string;
  layoutId?: string;
  onChange?: (tabId: string) => void;
  tabClassName?: string;
  tabs: AnimatedTab[];
  variant?: "underline" | "pill" | "segment";
};

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.05,
};

export function AnimatedTabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  variant = "underline",
  layoutId: customLayoutId,
  className,
  tabClassName,
  indicatorClassName,
}: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId();
  const layoutId = customLayoutId ?? `animated-tabs-${generatedId}`;

  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab ?? tabs[0]?.id ?? "",
  );

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      onChange?.(tabId);
    },
    [isControlled, onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        newIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      const newTab = tabs[newIndex];
      if (newTab) {
        handleTabChange(newTab.id);
        const tabElement = document.getElementById(`${layoutId}-tab-${newTab.id}`);
        tabElement?.focus();
      }
    },
    [tabs, handleTabChange, layoutId],
  );

  const baseContainerStyles = cn(
    "relative inline-flex",
    variant === "underline" && "gap-1 border-b border-border",
    variant === "pill" && "flex-wrap justify-center gap-2",
    variant === "segment" && "gap-0 rounded-lg bg-muted p-1",
  );

  const getTabStyles = (isActive: boolean) =>
    cn(
      "relative z-10 flex items-center justify-center gap-2 font-medium text-sm transition-colors",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-maroon",
      variant === "underline" && [
        "rounded-t-md px-4 py-2",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      ],
      variant === "pill" && [
        "rounded-full px-4 py-2.5",
        isActive
          ? "text-white"
          : "bg-brand-cream text-brand-charcoal hover:bg-brand-maroon/8",
      ],
      variant === "segment" && [
        "flex-1 rounded-md px-4 py-2",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      ],
      tabClassName,
    );

  const getIndicatorStyles = () =>
    cn(
      "absolute",
      variant === "underline" && "inset-x-0 -bottom-px h-0.5 bg-brand-maroon",
      variant === "pill" && "inset-0 rounded-full bg-brand-maroon shadow-sm",
      variant === "segment" &&
        "inset-0 rounded-md border border-border bg-background shadow-sm",
      indicatorClassName,
    );

  const selectItems = useMemo(
    () => tabs.map((tab) => ({ value: tab.id, label: tab.label })),
    [tabs],
  );

  const mobileSelectTriggerClassName = cn(
    "h-auto min-h-11 w-full justify-between px-4 py-2.5 shadow-sm",
    "focus-visible:border-brand-maroon focus-visible:ring-2 focus-visible:ring-brand-maroon/30 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream-page focus-visible:outline-none",
    variant === "pill" && [
      "rounded-full border border-brand-maroon/20 bg-brand-maroon text-white",
      "[&_svg]:text-white/80",
      "data-placeholder:text-white/70",
    ],
    variant === "underline" && [
      "rounded-t-md border-border bg-transparent text-brand-maroon",
      "[&_svg]:text-brand-maroon/70",
    ],
    variant === "segment" && [
      "rounded-lg border-transparent bg-muted text-brand-maroon",
      "[&_svg]:text-brand-maroon/70",
    ],
    tabClassName,
  );

  const mobileSelectContentClassName = cn(
    "rounded-xl border border-brand-maroon/15 bg-white p-1.5 shadow-md ring-0",
    tabClassName,
  );

  const mobileSelectItemClassName = cn(
    "rounded-lg py-2.5 pl-3 pr-8 text-brand-charcoal",
    "focus:bg-brand-maroon/8 focus:text-brand-maroon",
    "data-highlighted:bg-brand-maroon/8 data-highlighted:text-brand-maroon",
    "[&_svg]:text-brand-maroon",
    tabClassName,
  );

  return (
    <>
      <div className="w-full sm:hidden">
        <Select
          items={selectItems}
          value={activeTab}
          onValueChange={(value) => {
            if (value) handleTabChange(value);
          }}
        >
          <SelectTrigger className={mobileSelectTriggerClassName} aria-label="Select section">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            sideOffset={8}
            align="start"
            alignItemWithTrigger={false}
            className={mobileSelectContentClassName}
          >
            {tabs.map((tab) => (
              <SelectItem key={tab.id} value={tab.id} className={mobileSelectItemClassName}>
                <span className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        aria-label="Tabs"
        className={cn(baseContainerStyles, className, "hidden sm:inline-flex")}
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`${layoutId}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={getTabStyles(isActive)}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {isActive ? (
                <motion.span
                  layout
                  layoutId={layoutId}
                  className={getIndicatorStyles()}
                  style={{ originY: "0px" }}
                  transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                />
              ) : null}
              {tab.icon ? <span className="relative z-10">{tab.icon}</span> : null}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
