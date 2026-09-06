/**
 * Asaas Payment Gateway Integration Client (Sandbox & Production)
 * Documentação Oficial: https://docs.asaas.com/reference/
 */

export interface AsaasCustomerInput {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  externalReference?: string;
}

export interface AsaasPaymentInput {
  customerId: string;
  value: number;
  dueDate: string; // YYYY-MM-DD
  description: string;
  billingType?: 'PIX' | 'BOLETO' | 'UNDEFINED';
  externalReference?: string;
  discountValue?: number; // Desconto de pontualidade
  discountDaysBeforeDue?: number;
}

export interface AsaasPixResponse {
  encodedImage: string; // Imagem base64 do QR Code
  payload: string;      // Chave Pix Copia e Cola
  expirationDate: string;
}

export interface AsaasPaymentResponse {
  id: string;
  dateCreated: string;
  customer: string;
  value: number;
  netValue: number;
  description: string;
  billingType: string;
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'DELETED';
  dueDate: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  externalReference?: string;
}

export class AsaasClient {
  private apiKey: string;
  private baseUrl: string;
  private isSandbox: boolean;

  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || '';
    this.isSandbox = process.env.ASAAS_ENVIRONMENT !== 'production';
    this.baseUrl = this.isSandbox 
      ? 'https://sandbox.asaas.com/api/v3' 
      : 'https://api.asaas.com/v3';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'access_token': this.apiKey,
    };
  }

  /**
   * Localiza ou cria um cliente no Asaas pelo CPF/CNPJ
   */
  async getOrCreateCustomer(data: AsaasCustomerInput): Promise<{ id: string; name: string; email: string }> {
    // Modo Simulação (Fallback caso a API Key do sandbox ainda não tenha sido inserida no .env)
    if (!this.apiKey || this.apiKey.includes('sua_chave')) {
      console.warn('[Asaas Sandbox] Executando em modo simulação local (API Key não configurada)');
      return {
        id: `cus_sandbox_${data.cpfCnpj.replace(/\D/g, '').slice(0, 8)}`,
        name: data.name,
        email: data.email,
      };
    }

    try {
      // 1. Busca por CPF existente
      const cleanCpf = data.cpfCnpj.replace(/\D/g, '');
      const searchRes = await fetch(`${this.baseUrl}/customers?cpfCnpj=${cleanCpf}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.data && searchData.data.length > 0) {
          return searchData.data[0];
        }
      }

      // 2. Se não existir, cria o novo cliente
      const createRes = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: data.name,
          cpfCnpj: cleanCpf,
          email: data.email,
          mobilePhone: data.mobilePhone || data.phone,
          externalReference: data.externalReference,
          notificationDisabled: false,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.errors?.[0]?.description || 'Erro ao criar cliente no Asaas');
      }

      return await createRes.json();
    } catch (error) {
      console.error('[Asaas] Erro em getOrCreateCustomer:', error);
      throw error;
    }
  }

  /**
   * Cria uma cobrança de mensalidade no Asaas com desconto de pontualidade e opção de PIX
   */
  async createPayment(input: AsaasPaymentInput): Promise<AsaasPaymentResponse> {
    // Modo Simulação (Fallback)
    if (!this.apiKey || this.apiKey.includes('sua_chave')) {
      const mockId = `pay_sandbox_${Date.now()}`;
      return {
        id: mockId,
        dateCreated: new Date().toISOString(),
        customer: input.customerId,
        value: input.value,
        netValue: input.value,
        description: input.description,
        billingType: input.billingType || 'PIX',
        status: 'PENDING',
        dueDate: input.dueDate,
        invoiceUrl: `https://sandbox.asaas.com/i/${mockId}`,
        externalReference: input.externalReference,
      };
    }

    try {
      const body: Record<string, any> = {
        customer: input.customerId,
        billingType: input.billingType || 'UNDEFINED',
        value: input.value,
        dueDate: input.dueDate,
        description: input.description,
        externalReference: input.externalReference,
        postalService: false,
      };

      // Adiciona desconto de pontualidade caso informado
      if (input.discountValue && input.discountValue > 0) {
        body.discount = {
          value: input.discountValue,
          dueDateLimitDays: input.discountDaysBeforeDue || 0,
          type: 'FIXED',
        };
      }

      const res = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.[0]?.description || 'Erro ao gerar cobrança no Asaas');
      }

      return await res.json();
    } catch (error) {
      console.error('[Asaas] Erro em createPayment:', error);
      throw error;
    }
  }

  /**
   * Obtém o QR Code dinâmico e o código Copia e Cola do PIX para a cobrança
   */
  async getPixQrCode(paymentId: string): Promise<AsaasPixResponse> {
    // Modo Simulação (Fallback)
    if (!this.apiKey || this.apiKey.includes('sua_chave')) {
      return {
        encodedImage: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        payload: '00020126580014br.gov.bcb.pix0136joaninha-escola-sandbox-pix-chave52040000530398654062200.005802BR5925CRECHE ESCOLA JOANINHA6009SAO PAULO62070503***6304ABCD',
        expirationDate: new Date(Date.now() + 86400000).toISOString(),
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/payments/${paymentId}/pixQrCode`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.[0]?.description || 'Erro ao obter Pix QR Code do Asaas');
      }

      return await res.json();
    } catch (error) {
      console.error('[Asaas] Erro em getPixQrCode:', error);
      throw error;
    }
  }

  /**
   * Consulta os detalhes e o status atualizado de uma cobrança
   */
  async getPayment(paymentId: string): Promise<AsaasPaymentResponse> {
    const res = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.errors?.[0]?.description || 'Erro ao consultar cobrança');
    }

    return await res.json();
  }
}

export const asaas = new AsaasClient();
