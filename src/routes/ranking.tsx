import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/listzone/AppShell";
import { CreateListDialog } from "@/components/listzone/CreateListDialog";
import { ListGrid } from "@/components/listzone/ListGrid";
import { Button } from "@/components/ui/button";
import { useLists } from "@/lib/listzone";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking — ListZone" },
      { name: "description", content: "Buat dan kelola ranking bernomor 1, 2, 3, dan seterusnya." },
      { property: "og:title", content: "Ranking — ListZone" },
      { property: "og:description", content: "Susun peringkat favoritmu dengan drag & drop." },
    ],
  }),
  component: RankingPage,
});

function RankingPage() {
  const { lists } = useLists();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <AppShell
      title="Ranking"
      description="List dengan urutan bernomor"
      actions={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Ranking Baru
        </Button>
      }
    >
      <ListGrid lists={lists.filter((l) => l.type === "ranking")} />
      <CreateListDialog
        open={open}
        onOpenChange={setOpen}
        fixedType="ranking"
        onCreated={(id) => navigate({ to: "/list/$id", params: { id } })}
      />
    </AppShell>
  );
}
