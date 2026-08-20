import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/listzone/AppShell";
import { ListEditor } from "@/components/listzone/ListEditor";
import { Button } from "@/components/ui/button";
import { useLists } from "@/lib/listzone";

export const Route = createFileRoute("/list/$id")({
  head: () => ({
    meta: [
      { title: "Editor List — ListZone" },
      { name: "description", content: "Editor drag & drop untuk ranking dan tier list kamu." },
      { property: "og:title", content: "Editor List — ListZone" },
      { property: "og:description", content: "Susun objek ke ranking atau tier dengan drag & drop." },
    ],
  }),
  component: ListDetailPage,
});

function ListDetailPage() {
  const { id } = Route.useParams();
  const { lists } = useLists();
  const list = lists.find((l) => l.id === id);

  return (
    <AppShell
      title={list?.title ?? "List"}
      description={list ? (list.type === "ranking" ? "Editor Ranking" : "Editor Tier List") : ""}
      actions={
        <Button asChild size="sm" variant="secondary">
          <Link to="/dashboard">
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
        </Button>
      }
    >
      {list ? (
        <ListEditor list={list} />
      ) : (
        <p className="text-sm text-muted-foreground">List tidak ditemukan.</p>
      )}
    </AppShell>
  );
}
