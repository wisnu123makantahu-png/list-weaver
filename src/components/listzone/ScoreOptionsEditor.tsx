import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { move } from "@/lib/listzone";

export function ScoreOptionsEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-2">
      <Label>Urutan Nilai</Label>
      <p className="text-xs text-muted-foreground">
        Atur urutan nilai dari tertinggi ke terendah. Tambahkan nilai custom seperti "Masterpiece".
      </p>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder="Nilai custom, mis. Absolute Cinema"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              onChange([draft.trim(), ...options]);
              setDraft("");
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (!draft.trim()) return;
            onChange([draft.trim(), ...options]);
            setDraft("");
          }}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <ul className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-border p-2">
        {options.map((opt, i) => (
          <li key={`${opt}-${i}`} className="flex items-center gap-2 rounded-lg bg-muted/60 px-2 py-1">
            <span className="min-w-0 flex-1 truncate text-sm">{opt}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              disabled={i === 0}
              onClick={() => onChange(move(options, i, i - 1))}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              disabled={i === options.length - 1}
              onClick={() => onChange(move(options, i, i + 1))}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() => onChange(options.filter((_, idx) => idx !== i))}
            >
              <X className="size-4" />
            </Button>
          </li>
        ))}
        {options.length === 0 && (
          <li className="px-2 py-3 text-center text-xs text-muted-foreground">Belum ada nilai.</li>
        )}
      </ul>
    </div>
  );
}