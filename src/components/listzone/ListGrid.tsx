import { Link } from "@tanstack/react-router";
import { Layers, ListOrdered, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLists, type ListDoc } from "@/lib/listzone";

export function ListGrid({ lists }: { lists: ListDoc[] }) {
  const { deleteList } = useLists();

  if (lists.length === 0) {
    return (
      <div className="surface-card grid place-items-center gap-2 p-12 text-center">
        <p className="font-display text-lg font-semibold">Belum ada list</p>
        <p className="text-sm text-muted-foreground">
          Buat list pertamamu dengan tombol "+ Tambahkan List".
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {lists.map((list) => {
        const Icon = list.type === "ranking" ? ListOrdered : Layers;
        return (
          <article key={list.id} className="surface-card overflow-hidden">
            <div className="relative h-32 bg-muted">
              {list.cover ? (
                <img src={list.cover} alt={list.title} className="size-full object-cover" />
              ) : (
                <div className="bg-gradient-primary grid size-full place-items-center">
                  <Icon className="size-8 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold">{list.title}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {list.type === "ranking" ? "Ranking" : "Tier List"} · {list.objects.length} objek
                    {list.scoring ? " · Bernilai" : ""}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0"
                  onClick={() => deleteList(list.id)}
                  aria-label="Hapus list"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/list/$id" params={{ id: list.id }}>
                  Detail
                </Link>
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
