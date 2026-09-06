import { NextRequest, NextResponse } from 'next/server';
import { asaas } from '@/lib/asaas';

/**
 * Endpoint para gerar uma cobrança real (Sandbox) no Asaas com PIX dinâmico
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      customerName, 
      cpfCnpj, 
      email, 
      phone, 
      amount, 
      dueDate, 
      description,
      isAnnual
    } = body;

    if (!customerName || !cpfCnpj || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes: customerName, cpfCnpj, amount, dueDate' },
        { status: 400 }
      );
    }

    // 1. Localiza ou cria o cliente no Asaas Sandbox
    const customer = await asaas.getOrCreateCustomer({
      name: customerName,
      cpfCnpj,
      email: email || 'responsavel@escola.com.br',
      mobilePhone: phone,
    });

    // 2. Gera a cobrança no Asaas
    const payment = await asaas.createPayment({
      customerId: customer.id,
      value: amount,
      dueDate,
      description: description || (isAnnual ? 'Anuidade Escolar com 10% OFF' : 'Mensalidade Escolar Maternal I'),
      billingType: 'PIX',
      discountValue: isAnnual ? 0 : 100, // R$ 100 de desconto de pontualidade se for mensal
      discountDaysBeforeDue: 0,
    });

    // 3. Obtém o QR Code e chave copia-e-cola PIX
    const pixData = await asaas.getPixQrCode(payment.id);

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        value: payment.value,
        dueDate: payment.dueDate,
        invoiceUrl: payment.invoiceUrl,
        pix: pixData,
      },
    });
  } catch (error: any) {
    console.error('[API Payments Create] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar cobrança no Asaas' },
      { status: 500 }
    );
  }
}
