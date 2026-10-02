"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@paxo/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ClientNoteForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("client_notes").insert({ client_id: clientId, note: note.trim() });
    setIsSubmitting(false);

    if (!error) {
      setNote("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Agregar una nota de seguimiento..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit" size="sm" disabled={isSubmitting || !note.trim()}>
        {isSubmitting ? "Guardando..." : "Agregar nota"}
      </Button>
    </form>
  );
}
