import { COMPANY } from "@paxo/shared";

const DEFAULT_MESSAGE = "Hola, quisiera solicitar una asesoría personalizada de SOLUCIONES PAXO.";

/**
 * Enlace de WhatsApp. Se usa wa.me y no el esquema whatsapp://: este ultimo
 * no hace nada en un computador sin la app instalada, mientras que wa.me abre
 * la app en el telefono y WhatsApp Web en el escritorio.
 */
export function whatsappUrl(message = DEFAULT_MESSAGE) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? COMPANY.whatsappNumber;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
