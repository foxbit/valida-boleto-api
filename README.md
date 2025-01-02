# Validador de Boletos API

API REST para validação de linhas digitáveis de boletos bancários e de concessionárias, seguindo as especificações da FEBRABAN.

## 🚀 Features

- Validação de boletos bancários (47 dígitos)
- Validação de boletos de concessionárias (48 dígitos)
- Validação em lote
- Interface web para testes
- CLI para validações via terminal
- Cache de resultados
- Rate limiting para proteção da API

## 📋 Requisitos

- Node.js 14+
- npm ou yarn

## 🛠️ Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd validador-de-boletos

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env

# Inicie o servidor
npm run start
```

## 🔧 Configuração

Variáveis de ambiente disponíveis no `.env`:

```env
NODE_ENV=development
PORT=8080
APP_HOST=http://localhost
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 📚 Documentação da API

### Endpoints

#### 1. Validar Boleto Individual

```http
GET /api/boleto/:codigo
```

##### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| codigo | string | Linha digitável do boleto (47 ou 48 dígitos) |

##### Exemplo de Requisição

```bash
curl http://localhost:8080/api/boleto/23793380296099605290241006333300689690000143014
```

##### Exemplo de Resposta

```json
{
  "status": "success",
  "data": {
    "barCode": "23796896900001430143380260996052904100633330",
    "amount": "1430.14",
    "expirationDate": "28-04-2022",
    "type": "BANK_SLIP",
    "bank": {
      "code": "237",
      "name": "Bradesco"
    },
    "validation": {
      "verifierDigits": {
        "field1": { "expected": "9", "calculated": "9", "valid": true }
      }
    }
  },
  "metadata": {
    "requestId": "123e4567-e89b-12d3-a456-426614174000",
    "timestamp": "2023-07-20T10:30:00Z",
    "processingTime": "23ms"
  }
}
```

#### 2. Validação em Lote

```http
POST /api/boleto/batch
```

##### Body da Requisição

```json
{
  "codes": [
    "23793380296099605290241006333300689690000143014",
    "846100000005246100291102005460339004695895061080"
  ]
}
```

##### Exemplo de Requisição

```bash
curl -X POST http://localhost:8080/api/boleto/batch \
  -H "Content-Type: application/json" \
  -d '{"codes":["23793380296099605290241006333300689690000143014"]}'
```

#### 3. Estatísticas de Uso

```http
GET /api/stats
```

##### Exemplo de Resposta

```json
{
  "total": 1500,
  "successful": 1450,
  "failed": 50,
  "averageProcessingTime": "45ms"
}
```

## 🖥️ Interface Web

A interface web está disponível em `http://localhost:8080` e permite:

- Validação de boletos via interface gráfica
- Visualização detalhada dos resultados
- Exemplos de códigos para teste

## 💻 CLI

### Instalação do CLI

```bash
# Instalar globalmente
npm link

# Ou executar diretamente
npm run cli
```

### Uso do CLI

```bash
# Validar um boleto
boleto validar 23793380296099605290241006333300689690000143014

# Validar múltiplos boletos de um arquivo
boleto batch boletos.txt
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm test -- --coverage
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t validador-boletos .

# Executar container
docker run -p 8080:8080 validador-boletos
```

## 📝 Exemplos de Uso

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const validateBoleto = async (code: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/boleto/${code}`);
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};
```

### Python

```python
import requests

def validate_boleto(code):
    try:
        response = requests.get(f'http://localhost:8080/api/boleto/{code}')
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
```

### cURL

```bash
# Validar boleto
curl http://localhost:8080/api/boleto/23793380296099605290241006333300689690000143014

# Validação em lote
curl -X POST http://localhost:8080/api/boleto/batch \
  -H "Content-Type: application/json" \
  -d '{"codes":["23793380296099605290241006333300689690000143014"]}'
```

## 📄 Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Código inválido |
| 429 | Muitas requisições |
| 500 | Erro interno do servidor |

## ⚠️ Limites da API

- Rate limit: 100 requisições por 15 minutos por IP
- Tamanho máximo do lote: 100 boletos
- Cache: resultados são cacheados por 1 hora

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está sob a licença ISC.

## 📞 Suporte

- Abra uma issue
- Email: [seu-email]
- Discord: [seu-discord]
