import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/listzone/AppShell";
import { CreateListDialog } from "@/components/listzone/CreateListDialog";
import { ListGrid } from "@/components/listzone/ListGrid";
import { Button } from "@/components/ui/button";
import { useLists } from "@/lib/listzone";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ListZone" },
      { name: "description", content: "Semua ranking dan tier list yang sudah kamu buat." },
      { property: "og:title", content: "Dashboard — ListZone" },
      { property: "og:description", content: "Kelola semua ranking dan tier list milikmu." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { lists } = useLists();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppShell
      title="Dashboard"
      description="Semua ranking dan tier list kamu"
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Tambahkan List
        </Button>
      }
    >
      <ListGrid lists={lists} />
      <CreateListDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(id) => navigate({ to: "/list/$id", params: { id } })}
      />
    </AppShell>
  );
}
