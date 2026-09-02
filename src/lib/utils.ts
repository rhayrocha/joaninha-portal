import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DocumentStatus, PaymentStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatDateLong(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function getDocumentStatusConfig(status: DocumentStatus) {
  const configs = {
    pending: {
      label: "Pendente",
      color: "bg-amber-100 text-amber-800",
      dot: "bg-amber-500",
    },
    under_review: {
      label: "Em Análise",
      color: "bg-blue-100 text-blue-800",
      dot: "bg-blue-500",
    },
    approved: {
      label: "Aprovado",
      color: "bg-emerald-100 text-emerald-800",
      dot: "bg-emerald-500",
    },
    rejected: {
      label: "Rejeitado",
      color: "bg-red-100 text-red-800",
      dot: "bg-red-500",
    },
  };
  return configs[status];
}

export function getPaymentStatusConfig(status: PaymentStatus) {
  const configs = {
    paid: {
      label: "Paga",
      color: "bg-emerald-100 text-emerald-800",
      icon: "check-circle" as const,
    },
    pending: {
      label: "Pendente",
      color: "bg-amber-100 text-amber-800",
      icon: "clock" as const,
    },
    overdue: {
      label: "Vencida",
      color: "bg-red-100 text-red-800",
      icon: "alert-circle" as const,
    },
    cancelled: {
      label: "Cancelada",
      color: "bg-gray-100 text-gray-600",
      icon: "x-circle" as const,
    },
  };
  return configs[status];
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function generatePixCode(): string {
  // Mock PIX EMV code
  return "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540" +
    "52000.005802BR5925JOANINHA CRECHE ESCOLA BI6014SAO PAULO SP62070503***6304ABCD";
}

export function generateBarcode(): string {
  // Mock barcode
  return "23793.38128 60000.000003 00000.000400 1 90250000200000";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
