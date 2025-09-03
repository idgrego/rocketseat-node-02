import { execSync } from "node:child_process";

// Este código é executado uma única vez
export async function setup() {
  console.log('Iniciando o banco de dados de teste...');
  // Lógica para iniciar ou resetar o banco de dados
  execSync('npm run test:knex:rollback -- --all')
  execSync('npm run test:knex:latest')
  
  return async () => {
    // Este código é executado uma única vez no final
    console.log('Finalizando o banco de dados de teste.');
    // Lógica para fechar a conexão
  };
}