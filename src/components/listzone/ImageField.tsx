import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { readFileAsDataUrl } from "@/lib/listzone";

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string | undefined;
  onChange: (v?: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted">
          {value ? (
            <img src={value} alt={label} className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            Pilih Foto
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
              <X className="size-4" /> Hapus
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) onChange(await readFileAsDataUrl(file));
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}