import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ListObject } from "@/lib/listzone";

export function ObjectCardView({
  object,
  rank,
  compact,
  dragging,
  onEdit,
  onDelete,
  handleProps,
}: {
  object: ListObject;
  rank?: number;
  compact?: boolean;
  dragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  handleProps?: Record<string, unknown>;
}) {
  return (
    <div
      className={cn(
        "surface-card flex items-center gap-3 p-2 transition",
        dragging && "shadow-[var(--shadow-lift)] ring-2 ring-primary",
        compact && "w-[190px]",
      )}
    >
      <button
        {...handleProps}
        className="grid size-7 shrink-0 cursor-grab place-items-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
        aria-label="Drag"
        type="button"
      >
        <GripVertical className="size-4" />
      </button>
      {rank !== undefined && (
        <span className="bg-gradient-primary grid size-8 shrink-0 place-items-center rounded-lg font-display text-sm font-bold text-primary-foreground">
          {rank}
        </span>
      )}
      <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
        {object.image ? (
          <img src={object.image} alt={object.name} className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center text-xs font-semibold text-muted-foreground">
            {object.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{object.name}</p>
        {object.description && (
          <p className="truncate text-xs text-muted-foreground">{object.description}</p>
        )}
        {object.score && (
          <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
            {object.score}
          </span>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 items-center">
          {onEdit && (
            <Button size="icon" variant="ghost" className="size-7" onClick={onEdit}>
              <Pencil className="size-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button size="icon" variant="ghost" className="size-7" onClick={onDelete}>
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function SortableObjectCard(props: {
  object: ListObject;
  containerId: string;
  rank?: number;
  compact?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.object.id,
    data: { containerId: props.containerId },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? "opacity-40" : undefined}
    >
      <ObjectCardView
        object={props.object}
        {...(props.rank !== undefined ? { rank: props.rank } : {})}
        {...(props.compact ? { compact: true } : {})}
        {...(props.onEdit ? { onEdit: props.onEdit } : {})}
        {...(props.onDelete ? { onDelete: props.onDelete } : {})}
        handleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}