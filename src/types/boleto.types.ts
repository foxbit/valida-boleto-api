export interface BoletoResponse {
  status: 'success' | 'error';
  data: {
    // Informações básicas
    barCode: string;
    amount: string;
    expirationDate: string | null;
    type: 'BANK_SLIP' | 'UTILITY_BILL';

    // Informações do banco/concessionária
    bank?: {
      code: string;
      name: string;
    };

    // Informações detalhadas do boleto bancário
    bankSlipDetails?: {
      currency: string;
      checkDigit: string;
      freeField: string;
      paymentMethod: string;
      segmentType?: string;
      realAmount: string;
      effectiveDate?: string;
      issueDate?: string;
      documentNumber?: string;
      payerDocument?: string;
      beneficiaryDocument?: string;
      agencyCode?: string;
      accountNumber?: string;
      portfolio?: string;
      ourNumber: string;
    };

    // Informações detalhadas do boleto de concessionária
    utilityBillDetails?: {
      segmentId: string;
      companyId: string;
      serviceId?: string;
      utilityType: string;
      valueType: string;
      referenceNumber?: string;
      dueMonth?: string;
      dueYear?: string;
      customerNumber?: string;
    };

    // Informações de validação
    validation: {
      isValid: boolean;
      verifierDigits: {
        [field: string]: {
          position: number;
          expected: string;
          calculated: string;
          valid: boolean;
        };
      };
      moduleType: 'MOD10' | 'MOD11';
    };
  };
  metadata: {
    requestId: string;
    timestamp: string;
    processingTime: string;
  };
}
