import { useEffect, useState } from "react";

import { ImageField } from "./ImageField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uid, type ListObject } from "@/lib/listzone";

const NONE = "__none__";

export function ObjectDialog({
  open,
  onOpenChange,
  object,
  scoring,
  scoreOptions,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  object?: ListObject | null;
  scoring: boolean;
  scoreOptions: string[];
  onSave: (obj: ListObject) => void;
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [description, setDescription] = useState("");
  const [score, setScore] = useState<string>(NONE);

  useEffect(() => {
    if (!open) return;
    setName(object?.name ?? "");
    setImage(object?.image);
    setDescription(object?.description ?? "");
    setScore(object?.score ?? NONE);
  }, [open, object]);

  const submit = () => {
    if (!name.trim()) return;
    onSave({
      id: object?.id ?? uid(),
      name: name.trim(),
      image,
      description: description.trim() || undefined,
      score: scoring && score !== NONE ? score : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{object ? "Edit Objek" : "Tambahkan Objek"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="obj-name">Nama</Label>
            <Input
              id="obj-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama objek"
            />
          </div>
          <ImageField label="Foto" value={image} onChange={setImage} />
          <div className="space-y-2">
            <Label htmlFor="obj-desc">Deskripsi (opsional)</Label>
            <Textarea
              id="obj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          {scoring && (
            <div className="space-y-2">
              <Label>Nilai</Label>
              <Select value={score} onValueChange={setScore}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih nilai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Tanpa nilai</SelectItem>
                  {scoreOptions.map((opt, i) => (
                    <SelectItem key={`${opt}-${i}`} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={!name.trim()}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}