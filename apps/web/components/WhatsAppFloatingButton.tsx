"use client";

import { COMPANY } from "@paxo/shared";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppFloatingButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? COMPANY.whatsappNumber;
  const message = encodeURIComponent(
    "Hola, quisiera solicitar una asesoría personalizada de SOLUCIONES PAXO."
  );

  return (
    <a
      href={`whatsapp://send?phone=${number}&text=${message}`}
      onClick={() => trackEvent("whatsapp_click", { metadata: { source: "floating_button" } })}
      aria-label="Escríbenos por WhatsApp"
      className="whatsapp-pulse fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 0 0 4.62 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.13c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.15.11.32.02.51-.09.2-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.2.71-.83.9-1.11.19-.28.38-.23.63-.14.26.1 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
      </svg>
    </a>
  );
}
