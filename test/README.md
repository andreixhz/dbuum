# Testes Unitários - Migration Database

Este diretório contém todos os testes unitários para o projeto de migração de banco de dados.

## Estrutura dos Testes

- `setup.ts` - Configuração e utilitários para os testes
- `convertData.test.ts` - Testes para conversão de dados
- `makeInsertQuery.test.ts` - Testes para geração de queries de inserção
- `extractionQuery.test.ts` - Testes para geração de queries de extração
- `saveInsertedIds.test.ts` - Testes para sistema de checkpoint
- `formatAnalytics.test.ts` - Testes para formatação de analytics
- `configValidation.test.ts` - Testes para validação de configuração
- `index.test.ts` - Arquivo principal que executa todos os testes

## Executando os Testes

```bash
# Executar todos os testes
bun test

# Executar testes em modo watch
bun test:watch

# Executar testes com cobertura
bun test:coverage
```

## Cobertura de Testes

Os testes cobrem as seguintes funcionalidades:

### Funções Utilitárias
- ✅ `convertData` - Conversão de tipos de dados (int para boolean)
- ✅ `makeInsertQuery` - Geração de queries SQL de inserção
- ✅ `extractionQuery` - Geração de queries SQL de extração
- ✅ `saveInsertedIds` - Sistema de checkpoint para IDs inseridos
- ✅ `formatAnalytics` - Formatação de estatísticas de migração

### Validação de Configuração
- ✅ Validação de estrutura de configuração
- ✅ Validação de configuração de banco de dados (source e target)
- ✅ Validação de configuração de migrações
- ✅ Validação de configuração de colunas

### Casos de Teste
- ✅ Dados válidos e inválidos
- ✅ Valores nulos e indefinidos
- ✅ Conversões de tipos de dados
- ✅ Diferentes tipos de dados (string, number, boolean, object)
- ✅ Valores extremos (zero, valores altos, decimais)
- ✅ Tratamento de erros

## Adicionando Novos Testes

Para adicionar novos testes:

1. Crie um novo arquivo `*.test.ts` no diretório `test/`
2. Importe as funções que deseja testar de `../src/utils.ts`
3. Use as funções de teste do Bun (`describe`, `it`, `expect`)
4. Adicione o import do novo arquivo em `index.test.ts`

## Mock e Utilitários

O arquivo `setup.ts` fornece:
- Dados de mock para testes
- Funções auxiliares para manipulação de arquivos de checkpoint
- Configuração de limpeza antes e depois dos testes
