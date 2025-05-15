"use client";

import * as React from "react";

// Define types for navigation data

type ActiveItem = {
  section: string;
  item: string;
};

interface SidebarContextType {
  activeItem: ActiveItem;
  setActiveItem: React.Dispatch<React.SetStateAction<ActiveItem>>;
}

// Default value is still needed for initial render
const DEFAULT_ACTIVE_ITEM: ActiveItem = {
  section: "Dashboard",
  item: "Dashboard",
};

export const SidebarContext = React.createContext<
  SidebarContextType | undefined
>(undefined);

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeItem, setActiveItem] =
    React.useState<ActiveItem>(DEFAULT_ACTIVE_ITEM);

  return (
    <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider"
    );
  }
  return context;
}
