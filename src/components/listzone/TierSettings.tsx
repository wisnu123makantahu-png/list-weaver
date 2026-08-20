import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { move, uid, type Tier } from "@/lib/listzone";

export function TierSettings({
  tiers,
  onChange,
}: {
  tiers: Tier[];
  onChange: (next: Tier[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Tier</Label>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onChange([...tiers, { id: uid(), name: "Tier Baru", objectIds: [] }])}
        >
          <Plus className="size-4" /> Tambah Tier
        </Button>
      </div>
      <ul className="space-y-2">
        {tiers.map((tier, i) => (
          <li key={tier.id} className="flex items-center gap-2">
            <Input
              value={tier.name}
              onChange={(e) =>
                onChange(tiers.map((t) => (t.id === tier.id ? { ...t, name: e.target.value } : t)))
              }
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 shrink-0"
              disabled={i === 0}
              onClick={() => onChange(move(tiers, i, i - 1))}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 shrink-0"
              disabled={i === tiers.length - 1}
              onClick={() => onChange(move(tiers, i, i + 1))}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 shrink-0"
              onClick={() => onChange(tiers.filter((t) => t.id !== tier.id))}
            >
              <X className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}