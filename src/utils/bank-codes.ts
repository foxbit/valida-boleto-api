const BANK_CODES = {
  '001': 'Banco do Brasil',
  '033': 'Santander',
  '104': 'Caixa Econômica Federal',
  '237': 'Bradesco',
  '341': 'Itaú',
  '356': 'Banco Real',
  '389': 'Banco Mercantil do Brasil',
  '399': 'HSBC',
  '422': 'Safra',
  '453': 'Banco Rural',
  '633': 'Banco Rendimento',
  '652': 'Itaú Unibanco',
  '745': 'Citibank'
};

export function getBankName(code: string): string {
  return BANK_CODES[code] || 'Banco não identificado';
}
