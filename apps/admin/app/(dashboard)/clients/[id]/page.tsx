import { notFound } from "next/navigation";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@paxo/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import { ClientNoteForm } from "@/components/ClientNoteForm";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: client }, { data: notes }, { data: quotes }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase.from("client_notes").select("id, note, created_at").eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("quotes").select("id, status, total, created_at").eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("projects").select("id, name, status").eq("client_id", id).order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paxo-blue">{client.full_name}</h1>
        {client.company_name && <p className="text-sm text-paxo-ink-light">{client.company_name}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Datos de contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-paxo-ink-light">Teléfono:</span> {client.phone}
            </p>
            {client.email && (
              <p>
                <span className="text-paxo-ink-light">Correo:</span> {client.email}
              </p>
            )}
            {client.address && (
              <p>
                <span className="text-paxo-ink-light">Dirección:</span> {client.address}
              </p>
            )}
            {client.source && (
              <p>
                <span className="text-paxo-ink-light">Origen:</span> {client.source}
              </p>
            )}
            <p className="text-xs text-paxo-ink-light">Cliente desde {formatDate(client.created_at)}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cotizaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(quotes ?? []).length === 0 && <p className="text-sm text-paxo-ink-light">Sin cotizaciones aún.</p>}
            {(quotes ?? []).map((q) => (
              <div key={q.id} className="flex items-center justify-between border-b border-paxo-neutral-dark py-2 text-sm last:border-0">
                <span className="text-paxo-ink-light">{formatDate(q.created_at)}</span>
                <Badge variant={q.status === "aceptada" ? "success" : q.status === "rechazada" ? "danger" : "neutral"}>
                  {q.status}
                </Badge>
                <span className="font-medium text-paxo-ink">{formatCurrency(Number(q.total))}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {(projects ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Proyectos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(projects ?? []).map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-paxo-neutral-dark py-2 text-sm last:border-0">
                <span>{p.name}</span>
                <Badge>{p.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Notas de seguimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientNoteForm clientId={client.id} />
          <div className="space-y-3">
            {(notes ?? []).map((n) => (
              <div key={n.id} className="rounded-lg bg-paxo-neutral p-3 text-sm">
                <p className="text-paxo-ink">{n.note}</p>
                <p className="mt-1 text-xs text-paxo-ink-light">{formatDate(n.created_at)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
