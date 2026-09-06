import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Endpoint de diagnóstico para validar a comunicação da Vercel com o Asaas Sandbox
 */
export async function GET() {
  const apiKey = process.env.ASAAS_API_KEY;
  const env = process.env.ASAAS_ENVIRONMENT || 'sandbox';

  if (!apiKey) {
    return NextResponse.json({
      status: 'error',
      message: '❌ A variável ASAAS_API_KEY não foi encontrada nas Environment Variables da Vercel.',
      instructions: 'Vá em Project Settings > Environment Variables na Vercel e adicione ASAAS_API_KEY.',
      environment: env,
    }, { status: 500 });
  }

  const baseUrl = env === 'production' 
    ? 'https://api.asaas.com/v3' 
    : 'https://sandbox.asaas.com/api/v3';

  try {
    const res = await fetch(`${baseUrl}/myAccount`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        status: 'error',
        message: '❌ A chave foi lida pela Vercel, mas a API do Asaas recusou a autenticação.',
        details: data,
        environment: env,
      }, { status: 400 });
    }

    return NextResponse.json({
      status: 'connected',
      message: '✅ Conexão com o Asaas Sandbox 100% ativa e funcionando na Vercel!',
      account: {
        name: data.name || data.tradingName,
        email: data.email,
        personType: data.personType,
      },
      environment: env,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: '❌ Falha de rede ao conectar com o Asaas a partir da Vercel.',
      error: error.message,
    }, { status: 500 });
  }
}
