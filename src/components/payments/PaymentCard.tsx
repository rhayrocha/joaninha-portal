import React from "react";
import Link from "next/link";
import type { Payment } from "@/types";
import { formatCurrency, formatDate, getPaymentStatusConfig, cn } from "@/lib/utils";
import { Calendar, CreditCard, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface PaymentCardProps {
  payment: Payment;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  const statusConfig = getPaymentStatusConfig(payment.status);
  
  const getBorderColor = () => {
    switch (payment.status) {
      case "paid": return "border-joaninha-green";
      case "overdue": return "border-joaninha-red";
      case "pending": return "border-amber-400";
      default: return "border-joaninha-gray-300";
    }
  };

  const getIcon = () => {
    switch (payment.status) {
      case "paid": return <CheckCircle className="text-joaninha-green" size={24} />;
      case "overdue": return <AlertCircle className="text-joaninha-red" size={24} />;
      case "pending": return <Clock className="text-amber-500" size={24} />;
      default: return <Calendar className="text-joaninha-gray-400" size={24} />;
    }
  };

  const isPayable = payment.status === "pending" || payment.status === "overdue";

  return (
    <div className={cn("card p-5 rounded-2xl border-l-4 overflow-hidden flex flex-col justify-between transition-all hover:shadow-elevated", getBorderColor())}>
      {/* Top row: Icon + Reference + Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-joaninha-gray-50 rounded-xl shrink-0">
              {getIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base md:text-lg text-joaninha-black truncate">
                {payment.reference}
              </h3>
              <p className="text-xs text-joaninha-gray-400 truncate">
                {payment.childName || "Pedro Henrique Santos"}
              </p>
            </div>
          </div>
          <span className={cn("badge px-2.5 py-1 rounded-full text-xs font-semibold shrink-0", statusConfig.color)}>
            {statusConfig.label}
          </span>
        </div>

        {/* Due date info */}
        <div className="flex items-center gap-1.5 text-xs text-joaninha-gray-500 mb-4 bg-gray-50/80 px-3 py-2 rounded-xl">
          <Calendar size={14} className="shrink-0 text-joaninha-gray-400" />
          <span className="truncate">Vencimento: <strong className="text-joaninha-black">{formatDate(payment.dueDate)}</strong></span>
        </div>
      </div>

      {/* Amount and Action Bottom Section */}
      <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-joaninha-gray-500 font-medium">Valor total</span>
          <div className="text-right">
            <p className="text-xl md:text-2xl font-display font-bold text-joaninha-black">
              {formatCurrency(payment.totalAmount || payment.amount)}
            </p>
            {payment.status === "overdue" && payment.fine > 0 && (
              <p className="text-[11px] text-joaninha-red font-medium">
                Multa: +{formatCurrency(payment.fine)}
              </p>
            )}
            {payment.discount > 0 && payment.status !== "overdue" && (
              <p className="text-[11px] text-joaninha-green font-medium">
                Desconto: -{formatCurrency(payment.discount)}
              </p>
            )}
          </div>
        </div>

        {isPayable ? (
          <Link 
            href={`/pagamento/${payment.id}`} 
            className="btn-primary w-full text-center flex justify-center items-center gap-2 py-2.5 text-sm rounded-xl font-semibold shadow-sm"
          >
            <CreditCard size={16} /> Pagar Mensalidade
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold">
            <CheckCircle size={14} />
            {payment.paidAt ? `Pago em ${formatDate(payment.paidAt)}` : 'Mensalidade quitada'}
          </div>
        )}
      </div>
    </div>
  );
}
