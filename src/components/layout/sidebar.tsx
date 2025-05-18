"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

import { navData } from "@/lib/nav-data";
import { useSidebarContext } from "@/context/siderbar-context";

export function AppSidebar() {
  const { activeItem, setActiveItem } = useSidebarContext();

  // Definir los roles requeridos para diferentes secciones

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader className="h-16 text-center">Ama Wara Tours</SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {navData.navMain.map((item) => {
          return (
            <div key={item.title}>
              {item.submenu ? (
                <Collapsible
                  title={item.title}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarGroup>
                    <SidebarGroupLabel
                      asChild
                      className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                    >
                      <CollapsibleTrigger>
                        <item.icon className="w-5 h-5 text-sidebar-accent-foreground" />
                        <span className="ml-2">{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subMenu) => (
                            <SidebarMenuSubItem key={subMenu.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={
                                  activeItem.section === item.title &&
                                  activeItem.item === subMenu.title
                                }
                              >
                                <Link
                                  href={subMenu.href}
                                  onClick={() => {
                                    setActiveItem({
                                      section: item.title,
                                      item: subMenu.title,
                                    });
                                  }}
                                >
                                  <subMenu.icon className="w-5 h-5" />
                                  <span>{subMenu.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              ) : (
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="font-medium"
                        isActive={activeItem.section === item.title}
                      >
                        <Link
                          href={item.href}
                          onClick={() => {
                            setActiveItem({
                              section: item.title,
                              item: item.title,
                            });
                          }}
                        >
                          <item.icon className="w-5 h-5 text-sidebar-accent-foreground" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              )}
            </div>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
