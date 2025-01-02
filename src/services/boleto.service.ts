export class BoletoService {
  public parse(code: string) {
    if (!code) {
      throw new Error("Missing code");
    }

    if (!/^\d+$/.test(code)) {
      throw new Error("Code must contain numeric characters only");
    }

    if (code.length !== 47 && code.length !== 48) {
      throw new Error("Invalid code format: code is either too short or too long");
    }

    // Determina se é boleto bancário ou concessionária
    const isUtilityBill = code.length === 48;

    if (isUtilityBill) {
      return this.parseUtilityBill(code);
    } else {
      return this.parseBankSlip(code);
    }
  }

  private parseUtilityBill(code: string) {
    // Produto (1)
    const produto = code.substring(0, 1);
    
    // Segmento (1)
    const segmento = code.substring(1, 2);
    
    // Valor (11)
    const valorCobrado = parseInt(code.substring(4, 15), 10) / 100;
    
    // Data de vencimento (8) - AAAAMMDD
    const vencimento = code.substring(19, 27);
    
    // Monta o código de barras
    const barCode = this.generateUtilityBarCode(code);

    return {
      barCode,
      amount: valorCobrado.toFixed(2),
      expirationDate: this.formatUtilityExpirationDate(vencimento),
      details: {
        type: "UTILITY_BILL" as const,
        segment: {
          code: segmento,
          type: this.getUtilitySegmentType(segmento)
        },
        product: {
          code: produto,
          type: this.getProductType(produto)
        }
      }
    };
  }

  private parseBankSlip(code: string) {
    // Banco (3)
    const banco = code.substring(0, 3);
    
    // Valor (10)
    const valor = parseInt(code.substring(9, 19), 10) / 100;
    
    // Fator de Vencimento (4)
    const fatorVencimento = code.substring(5, 9);

    // Monta o código de barras
    const barCode = this.generateBankBarCode(code);

    return {
      barCode,
      amount: valor.toFixed(2),
      expirationDate: this.calculateBankExpirationDate(fatorVencimento),
      details: {
        type: "BANK_SLIP" as const,
        bank: {
          code: banco,
          name: this.getBankName(banco)
        }
      }
    };
  }

  private generateUtilityBarCode(code: string): string {
    return code.substring(0, 44);
  }

  private generateBankBarCode(code: string): string {
    return code.substring(0, 4) + code.substring(32, 47) + code.substring(4, 32);
  }

  private getUtilitySegmentType(segmento: string): string {
    const tipos: Record<string, string> = {
      '1': 'Prefeituras',
      '2': 'Saneamento',
      '3': 'Energia Elétrica e Gás',
      '4': 'Telecomunicações',
      '5': 'Órgãos Governamentais',
      '6': 'Carnes e Assemelhados',
      '7': 'Multas de trânsito',
      '8': 'Uso interno do banco',
      '9': 'Outros'
    };
    return tipos[segmento] || 'Desconhecido';
  }

  private getProductType(produto: string): string {
    const tipos: Record<string, string> = {
      '8': 'Arrecadação'
    };
    return tipos[produto] || 'Desconhecido';
  }

  private getBankName(codigo: string): string {
    const bancos: Record<string, string> = {
      '001': 'Banco do Brasil',
      '033': 'Santander',
      '104': 'Caixa Econômica Federal',
      '237': 'Bradesco',
      '341': 'Itaú'
    };
    return bancos[codigo] || 'Banco não identificado';
  }

  private formatUtilityExpirationDate(date: string): string {
    if (!date || date.length !== 8) return '';
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  private calculateBankExpirationDate(factor: string): string {
    const baseDate = new Date('1997-10-07');
    const days = parseInt(factor, 10);
    const date = new Date(baseDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
