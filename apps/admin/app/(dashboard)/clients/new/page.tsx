import { ClientForm } from "@/components/ClientForm";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paxo-blue">Nuevo cliente</h1>
        <p className="text-sm text-paxo-ink-light">Registra un cliente en el CRM.</p>
      </div>
      <ClientForm />
    </div>
  );
}
