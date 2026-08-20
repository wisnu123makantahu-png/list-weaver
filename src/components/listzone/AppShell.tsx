import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ListOrdered, Layers, LogOut, Flame } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut, useUser } from "@/lib/listzone";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Ranking", url: "/ranking", icon: ListOrdered },
  { title: "Tier List", url: "/tier-list", icon: Layers },
];

function AppSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex min-w-0 items-center gap-2 px-2 py-3">
          <div className="bg-gradient-primary grid size-9 shrink-0 place-items-center rounded-xl">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-display text-base font-bold">ListZone</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{user ?? "Guest"}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Logout"
                  onClick={() => {
                    signOut();
                    navigate({ to: "/", replace: true });
                  }}
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { user, ready } = useUser();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
            <SidebarTrigger />
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold sm:text-xl">{title}</h1>
              {description && (
                <p className="truncate text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="shrink-0">{actions}</div>
          </header>
          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}