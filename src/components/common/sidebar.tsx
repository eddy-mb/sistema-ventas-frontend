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
import { useSidebarContext } from "@/context/siderbar-context";
import { navData } from "@/lib/nav-data";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { ROLES } from "@/constants/auth";

export function AppSidebar() {
  const { activeItem, setActiveItem } = useSidebarContext();

  // Definir los roles requeridos para diferentes secciones
  const getRequiredRole = (
    sectionTitle: string
  ): string | string[] | undefined => {
    switch (sectionTitle) {
      case "Gestión de Administración":
        return ROLES.ADMIN;
      case "Gestión de Reportes":
        return [ROLES.ADMIN, ROLES.GERENTE];
      default:
        return undefined; // Sin restricción para otras secciones
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-16 text-center ">
        Ama Wara Tours
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {navData.navMain.map((item) => {
          const requiredRole = getRequiredRole(item.title);

          return (
            <PermissionGuard key={item.title} role={requiredRole}>
              <div>
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
                          <item.icon className="w-5 h-5" />
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
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroup>
                )}
              </div>
            </PermissionGuard>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
