import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flame, Layers, ListOrdered } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useUser } from "@/lib/listzone";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ListZone — Buat Ranking & Tier List" },
      {
        name: "description",
        content:
          "ListZone adalah tool modern untuk membuat ranking dan tier list dengan drag & drop, sistem nilai custom, dan penyimpanan otomatis.",
      },
      { property: "og:title", content: "ListZone — Buat Ranking & Tier List" },
      {
        property: "og:description",
        content: "Buat ranking dan tier list favoritmu dengan drag & drop yang cepat dan intuitif.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, ready } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard", replace: true });
  }, [ready, user, navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-gradient-primary hidden flex-col justify-between p-10 lg:flex">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Flame className="size-6" />
          <span className="font-display text-xl font-bold">ListZone</span>
        </div>
        <div className="space-y-4 text-primary-foreground">
          <h2 className="text-4xl font-black">Urutkan apa pun, dengan cara paling seru.</h2>
          <p className="max-w-sm text-sm opacity-90">
            Buat ranking bernomor atau tier list S/A/B/C, drag & drop objek, dan simpan otomatis di
            perangkatmu.
          </p>
          <div className="flex gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1">
              <ListOrdered className="size-4" /> Ranking
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1">
              <Layers className="size-4" /> Tier List
            </span>
          </div>
        </div>
        <p className="text-xs text-primary-foreground/70">Versi awal — data tersimpan lokal.</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <form
          className="surface-card w-full max-w-sm space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!username.trim() || !password.trim()) {
              setError("Username dan password wajib diisi.");
              return;
            }
            signIn(username.trim());
            navigate({ to: "/dashboard", replace: true });
          }}
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Masuk ke ListZone</h1>
            <p className="text-sm text-muted-foreground">
              Gunakan username apa pun untuk mulai membuat list.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="wisnu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
