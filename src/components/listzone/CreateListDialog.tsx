import { ListOrdered, Layers, ArrowLeft } from "lucide-react";
import { useState } from "react";

import { ImageField } from "./ImageField";
import { ScoreOptionsEditor } from "./ScoreOptionsEditor";
import { TierSettings } from "./TierSettings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  defaultScoreOptions,
  defaultTiers,
  useLists,
  type ListType,
  type Tier,
} from "@/lib/listzone";

export function CreateListDialog({
  open,
  onOpenChange,
  fixedType,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fixedType?: ListType;
  onCreated?: (id: string) => void;
}) {
  const { createList } = useLists();
  const [type, setType] = useState<ListType | null>(fixedType ?? null);
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<string | undefined>();
  const [scoring, setScoring] = useState(false);
  const [scoreOptions, setScoreOptions] = useState<string[]>(defaultScoreOptions());
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers());

  const reset = () => {
    setType(fixedType ?? null);
    setTitle("");
    setCover(undefined);
    setScoring(false);
    setScoreOptions(defaultScoreOptions());
    setTiers(defaultTiers());
  };

  const submit = () => {
    if (!type || !title.trim()) return;
    const doc = createList({
      type,
      title: title.trim(),
      cover,
      scoring,
      scoreOptions: scoring ? scoreOptions : [],
      objects: [],
      pool: [],
      ranking: [],
      tiers: type === "tier" ? tiers : [],
    });
    reset();
    onOpenChange(false);
    onCreated?.(doc.id);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{type ? "Detail List" : "Pilih Jenis List"}</DialogTitle>
          <DialogDescription>
            {type
              ? "Isi informasi list yang ingin dibuat."
              : "Mau membuat Ranking atau Tier List?"}
          </DialogDescription>
        </DialogHeader>

        {!type ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setType("ranking")}
              className="surface-card group flex flex-col items-start gap-2 p-4 text-left transition hover:border-primary"
            >
              <ListOrdered className="size-6 text-primary" />
              <span className="font-display font-semibold">Ranking</span>
              <span className="text-xs text-muted-foreground">Urutan 1, 2, 3, dan seterusnya.</span>
            </button>
            <button
              type="button"
              onClick={() => setType("tier")}
              className="surface-card group flex flex-col items-start gap-2 p-4 text-left transition hover:border-primary"
            >
              <Layers className="size-6 text-primary" />
              <span className="font-display font-semibold">Tier List</span>
              <span className="text-xs text-muted-foreground">Kelompokkan objek ke tier S, A, B, C.</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="list-title">Judul</Label>
              <Input
                id="list-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mis. Anime Terbaik 2026"
              />
            </div>
            <ImageField label="Foto Cover" value={cover} onChange={setCover} />
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div className="min-w-0 pr-3">
                <p className="text-sm font-medium">Sistem Nilai</p>
                <p className="text-xs text-muted-foreground">Aktifkan untuk memberi nilai pada objek.</p>
              </div>
              <Switch checked={scoring} onCheckedChange={setScoring} />
            </div>
            {scoring && <ScoreOptionsEditor options={scoreOptions} onChange={setScoreOptions} />}
            {type === "tier" && <TierSettings tiers={tiers} onChange={setTiers} />}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          {type && !fixedType ? (
            <Button variant="ghost" onClick={() => setType(null)}>
              <ArrowLeft className="size-4" /> Kembali
            </Button>
          ) : (
            <span />
          )}
          {type && (
            <Button onClick={submit} disabled={!title.trim()}>
              Buat List
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}