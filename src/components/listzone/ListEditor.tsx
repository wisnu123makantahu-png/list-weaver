import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Settings2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ObjectDialog } from "./ObjectDialog";
import { ObjectCardView, SortableObjectCard } from "./ObjectCard";
import { ScoreOptionsEditor } from "./ScoreOptionsEditor";
import { TierSettings } from "./TierSettings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useLists, type ListDoc, type ListObject } from "@/lib/listzone";

const POOL = "pool";
const RANK = "ranking";

type Board = Record<string, string[]>;

function boardFromList(list: ListDoc): Board {
  if (list.type === "ranking") return { [POOL]: list.pool, [RANK]: list.ranking };
  const board: Board = { [POOL]: list.pool };
  list.tiers.forEach((t) => (board[t.id] = t.objectIds));
  return board;
}

export function ListEditor({ list }: { list: ListDoc }) {
  const { updateList } = useLists();
  const [board, setBoard] = useState<Board>(() => boardFromList(list));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [objDialog, setObjDialog] = useState(false);
  const [editing, setEditing] = useState<ListObject | null>(null);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    setBoard(boardFromList(list));
  }, [list]);

  const objectsById = useMemo(
    () => Object.fromEntries(list.objects.map((o) => [o.id, o])),
    [list.objects],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const commit = (next: Board) => {
    setBoard(next);
    updateList(list.id, (l) =>
      l.type === "ranking"
        ? { ...l, pool: next[POOL] ?? [], ranking: next[RANK] ?? [] }
        : {
            ...l,
            pool: next[POOL] ?? [],
            tiers: l.tiers.map((t) => ({ ...t, objectIds: next[t.id] ?? [] })),
          },
    );
  };

  const findContainer = (id: string, b: Board) =>
    b[id] ? id : Object.keys(b).find((key) => (b[key] ?? []).includes(id));

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    const from = findContainer(activeIdStr, board);
    const to = findContainer(overIdStr, board);
    if (!from || !to || from === to) return;
    setBoard((prev) => {
      const fromItems = (prev[from] ?? []).filter((i) => i !== activeIdStr);
      const toItems = (prev[to] ?? []).slice();
      const overIndex = toItems.indexOf(overIdStr);
      toItems.splice(overIndex >= 0 ? overIndex : toItems.length, 0, activeIdStr);
      return { ...prev, [from]: fromItems, [to]: toItems };
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    const from = findContainer(activeIdStr, board);
    const to = findContainer(overIdStr, board);
    if (!from || !to) return;
    if (from === to) {
      const items = board[from] ?? [];
      const oldIndex = items.indexOf(activeIdStr);
      const newIndex = items.indexOf(overIdStr);
      const next =
        newIndex >= 0 && oldIndex !== newIndex
          ? { ...board, [from]: arrayMove(items, oldIndex, newIndex) }
          : board;
      commit(next);
    } else {
      commit(board);
    }
  };

  const saveObject = (obj: ListObject) => {
    const exists = list.objects.some((o) => o.id === obj.id);
    updateList(list.id, (l) => ({
      ...l,
      objects: exists ? l.objects.map((o) => (o.id === obj.id ? obj : o)) : [...l.objects, obj],
      pool: exists ? l.pool : [...l.pool, obj.id],
    }));
  };

  const deleteObject = (id: string) => {
    updateList(list.id, (l) => ({
      ...l,
      objects: l.objects.filter((o) => o.id !== id),
      pool: l.pool.filter((i) => i !== id),
      ranking: l.ranking.filter((i) => i !== id),
      tiers: l.tiers.map((t) => ({ ...t, objectIds: t.objectIds.filter((i) => i !== id) })),
    }));
  };

  const activeObject = activeId ? objectsById[activeId] : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Column
          id={POOL}
          title="Object Pool"
          items={board[POOL] ?? []}
          count={(board[POOL] ?? []).length}
          action={
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setObjDialog(true);
              }}
            >
              <Plus className="size-4" /> Tambahkan Objek
            </Button>
          }
        >
          {(board[POOL] ?? []).map((id) =>
            objectsById[id] ? (
              <SortableObjectCard
                key={id}
                object={objectsById[id]}
                containerId={POOL}
                onEdit={() => {
                  setEditing(objectsById[id] ?? null);
                  setObjDialog(true);
                }}
                onDelete={() => deleteObject(id)}
              />
            ) : null,
          )}
          {(board[POOL] ?? []).length === 0 && (
            <EmptyHint text="Belum ada objek. Tambahkan objek untuk mulai." />
          )}
        </Column>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold">
              {list.type === "ranking" ? "Ranking" : "Tier List"}
            </h2>
            <Button size="sm" variant="secondary" onClick={() => setSettings(true)}>
              <Settings2 className="size-4" /> Pengaturan
            </Button>
          </div>

          {list.type === "ranking" ? (
            <Column
              id={RANK}
              title="Peringkat"
              items={board[RANK] ?? []}
              count={(board[RANK] ?? []).length}
              padded
            >
              {(board[RANK] ?? []).map((id, i) =>
                objectsById[id] ? (
                  <SortableObjectCard
                    key={id}
                    object={objectsById[id]}
                    containerId={RANK}
                    rank={i + 1}
                    onEdit={() => {
                      setEditing(objectsById[id] ?? null);
                      setObjDialog(true);
                    }}
                    onDelete={() => deleteObject(id)}
                  />
                ) : null,
              )}
              {(board[RANK] ?? []).length === 0 && (
                <EmptyHint text="Drag objek ke sini untuk memberi peringkat." />
              )}
            </Column>
          ) : (
            <div className="space-y-3">
              {list.tiers.map((tier, idx) => (
                <TierRow
                  key={tier.id}
                  name={tier.name}
                  index={idx}
                  id={tier.id}
                  items={board[tier.id] ?? []}
                  objectsById={objectsById}
                  onEdit={(o) => {
                    setEditing(o);
                    setObjDialog(true);
                  }}
                  onDelete={deleteObject}
                />
              ))}
              {list.tiers.length === 0 && (
                <EmptyHint text="Belum ada tier. Tambahkan tier lewat Pengaturan." />
              )}
            </div>
          )}
        </div>
      </div>

      <ObjectDialog
        open={objDialog}
        onOpenChange={setObjDialog}
        object={editing}
        scoring={list.scoring}
        scoreOptions={list.scoreOptions}
        onSave={saveObject}
      />

      <Dialog open={settings} onOpenChange={setSettings}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pengaturan List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div className="min-w-0 pr-3">
                <p className="text-sm font-medium">Sistem Nilai</p>
                <p className="text-xs text-muted-foreground">Beri nilai pada setiap objek.</p>
              </div>
              <Switch
                checked={list.scoring}
                onCheckedChange={(v) =>
                  updateList(list.id, (l) => ({
                    ...l,
                    scoring: v,
                    scoreOptions:
                      v && l.scoreOptions.length === 0
                        ? Array.from({ length: 10 }, (_, i) => `⭐ ${10 - i}`)
                        : l.scoreOptions,
                  }))
                }
              />
            </div>
            {list.scoring && (
              <ScoreOptionsEditor
                options={list.scoreOptions}
                onChange={(next) => updateList(list.id, (l) => ({ ...l, scoreOptions: next }))}
              />
            )}
            {list.type === "tier" && (
              <TierSettings
                tiers={list.tiers}
                onChange={(next) => updateList(list.id, (l) => ({ ...l, tiers: next }))}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DragOverlay>
        {activeObject ? <ObjectCardView object={activeObject} dragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  id,
  title,
  items,
  count,
  action,
  padded,
  children,
}: {
  id: string;
  title: string;
  items: string[];
  count: number;
  action?: React.ReactNode;
  padded?: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <h2 className="truncate text-base font-bold">
          {title} <span className="text-sm font-normal text-muted-foreground">({count})</span>
        </h2>
        {action}
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[220px] space-y-2 rounded-2xl border border-dashed border-border bg-card/40 p-3 transition",
          padded && "min-h-[320px]",
          isOver && "border-primary bg-accent/40",
        )}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </section>
  );
}

function TierRow({
  id,
  name,
  index,
  items,
  objectsById,
  onEdit,
  onDelete,
}: {
  id: string;
  name: string;
  index: number;
  items: string[];
  objectsById: Record<string, ListObject | undefined>;
  onEdit: (o: ListObject) => void;
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const tone = ["bg-tier-1", "bg-tier-2", "bg-tier-3", "bg-tier-4", "bg-tier-5"][index % 5];
  return (
    <div className="surface-card grid grid-cols-[72px_minmax(0,1fr)] overflow-hidden">
      <div className={cn("grid place-items-center p-2 text-center", tone)}>
        <span className="font-display text-lg font-black break-words text-foreground">{name}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[92px] flex-wrap content-start gap-2 p-3 transition",
          isOver && "bg-accent/50",
        )}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((oid) =>
            objectsById[oid] ? (
              <SortableObjectCard
                key={oid}
                object={objectsById[oid]}
                containerId={id}
                compact
                onEdit={() => onEdit(objectsById[oid] as ListObject)}
                onDelete={() => onDelete(oid)}
              />
            ) : null,
          )}
        </SortableContext>
        {items.length === 0 && (
          <p className="self-center text-xs text-muted-foreground">Drop objek di sini</p>
        )}
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <p className="py-8 text-center text-xs text-muted-foreground">{text}</p>;
}
