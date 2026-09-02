import React from "react";
import Link from "next/link";
import { AlertCircle, Calendar, CreditCard, Clock, CheckCircle } from "lucide-react";
import type { Payment } from "@/types";
import { formatCurrency, formatDate, daysUntil, cn } from "@/lib/utils";

interface NextPaymentCardProps {
  payment: Payment | null;
}

export default function NextPaymentCard({ payment }: NextPaymentCardProps) {
  if (!payment) {
    return (
      <div className="card p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4">
        <div className="p-3 bg-joaninha-green text-white rounded-full">
          <CheckCircle size={24} />
        </div>
        <div>
          <h3 className="font-display font-bold text-joaninha-green text-lg">Tudo em dia!</h3>
          <p className="text-joaninha-green/80 text-sm">Não há faturas pendentes no momento.</p>
        </div>
      </div>
    );
  }

  const isOverdue = payment.status === "overdue";
  const days = daysUntil(payment.dueDate);

  return (
    <div className={cn(
      "card p-6 rounded-2xl border-l-4",
      isOverdue ? "border-joaninha-red bg-red-50" : "border-amber-400 bg-white"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-full",
            isOverdue ? "bg-red-100 text-joaninha-red" : "bg-amber-100 text-amber-700"
          )}>
            {isOverdue ? <AlertCircle size={24} /> : <Calendar size={24} />}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-joaninha-black">Próxima Fatura</h3>
            <p className="text-sm text-joaninha-gray-500">Ref: {payment.reference} • Vence em {formatDate(payment.dueDate)}</p>
          </div>
        </div>
      </div>

      <div className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4",
        isOverdue ? "bg-red-100 text-joaninha-red" : "bg-amber-100 text-amber-700"
      )}>
        <Clock size={14} />
        {isOverdue ? `Atrasada há ${Math.abs(days)} dias` : `Vence em ${days} dias`}
      </div>

      <div className="flex justify-between items-end mt-2">
        <div>
          <p className="text-sm text-joaninha-gray-500 mb-1">Valor Total</p>
          <p className="text-3xl font-display font-bold text-joaninha-black">
            {formatCurrency(payment.totalAmount)}
          </p>
          {isOverdue && payment.fine > 0 && (
            <p className="text-xs text-joaninha-red mt-1 font-medium">
              Inclui multa de {formatCurrency(payment.fine)}
            </p>
          )}
        </div>
        <Link href={`/pagamento/${payment.id}`} className="btn-primary flex items-center gap-2">
          <CreditCard size={18} />
          Pagar
        </Link>
      </div>
    </div>
  );
}
