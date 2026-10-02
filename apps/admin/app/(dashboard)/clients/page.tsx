import Link from "next/link";
import { Badge, Button, Card } from "@paxo/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, company_name, phone, email, source, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paxo-blue">Clientes</h1>
          <p className="text-sm text-paxo-ink-light">CRM — historial y seguimiento de clientes.</p>
        </div>
        <Link href="/clients/new">
          <Button>Nuevo cliente</Button>
        </Link>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-paxo-neutral-dark text-paxo-ink-light">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Empresa</th>
              <th className="px-5 py-3 font-medium">Contacto</th>
              <th className="px-5 py-3 font-medium">Origen</th>
              <th className="px-5 py-3 font-medium">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((client) => (
              <tr key={client.id} className="border-b border-paxo-neutral-dark last:border-0 hover:bg-paxo-neutral">
                <td className="px-5 py-3">
                  <Link href={`/clients/${client.id}`} className="font-medium text-paxo-ink hover:underline">
                    {client.full_name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-paxo-ink-light">{client.company_name ?? "—"}</td>
                <td className="px-5 py-3 text-paxo-ink-light">
                  <div>{client.phone}</div>
                  {client.email && <div className="text-xs">{client.email}</div>}
                </td>
                <td className="px-5 py-3">{client.source ? <Badge>{client.source}</Badge> : "—"}</td>
                <td className="px-5 py-3 text-paxo-ink-light">{formatDate(client.created_at)}</td>
              </tr>
            ))}
            {(clients ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-paxo-ink-light">
                  Aún no hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
