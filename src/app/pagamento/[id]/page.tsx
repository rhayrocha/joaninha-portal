import { mockPayments } from '@/data/mockPayments';
import PagamentoClient from './PagamentoClient';

export function generateStaticParams() {
  return mockPayments.map((p) => ({
    id: p.id,
  }));
}

export default function Page() {
  return <PagamentoClient />;
}

