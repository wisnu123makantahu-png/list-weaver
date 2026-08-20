import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/listzone/AppShell";
import { CreateListDialog } from "@/components/listzone/CreateListDialog";
import { ListGrid } from "@/components/listzone/ListGrid";
import { Button } from "@/components/ui/button";
import { useLists } from "@/lib/listzone";

export const Route = createFileRoute("/tier-list")({
  head: () => ({
    meta: [
      { title: "Tier List — ListZone" },
      { name: "description", content: "Buat tier list S, A, B, C dengan tier yang bisa dikustomisasi." },
      { property: "og:title", content: "Tier List — ListZone" },
      { property: "og:description", content: "Kelompokkan objek ke dalam tier dengan drag & drop." },
    ],
  }),
  component: TierListPage,
});

function TierListPage() {
  const { lists } = useLists();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppShell
      title="Tier List"
      description="List berbasis tier"
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Tier List Baru
        </Button>
      }
    >
      <ListGrid lists={lists.filter((l) => l.type === "tier")} />
      <CreateListDialog
        open={open}
        onOpenChange={setOpen}
        fixedType="tier"
        onCreated={(id) => navigate({ to: "/list/$id", params: { id } })}
      />
    </AppShell>
  );
}
