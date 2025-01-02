#!/usr/bin/env node
import axios, { AxiosError } from 'axios';
import chalk from 'chalk';
import { program } from 'commander';

const API_URL = 'http://localhost:8080/api';

program
  .name('boleto-cli')
  .description('CLI para validação de boletos')
  .version('1.0.0');

program
  .command('validar')
  .description('Valida um código de boleto')
  .argument('<codigo>', 'código do boleto')
  .action(async (codigo) => {
    try {
      console.log(chalk.blue('Validando boleto...'));
      
      const response = await axios.get(`${API_URL}/boleto/${codigo}`);
      const { barCode, amount, expirationDate } = response.data.data;

      console.log('\n' + chalk.green('✓ Boleto válido!\n'));
      console.log(chalk.white.bold('Detalhes:'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.yellow('Código de barras:'), barCode);
      console.log(chalk.yellow('Valor:'), `R$ ${amount}`);
      if (expirationDate) {
        console.log(chalk.yellow('Vencimento:'), expirationDate);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(chalk.red('\n✗ Erro:'), error.response.data.message);
      } else {
        console.error(chalk.red('\n✗ Erro:'), 'Não foi possível conectar à API');
      }
      process.exit(1);
    }
  });

program.parse();
