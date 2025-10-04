# GitHub Workflows

Este projeto possui dois workflows principais configurados:

## 1. CI (Continuous Integration) - `.github/workflows/ci.yml`

**Trigger:** Push para `main` ou `develop`, Pull Requests para `main`

**Funcionalidades:**
- Executa testes unitários
- Verificação de tipos TypeScript
- Linting (quando configurado)
- **NÃO gera binários** - apenas valida o código

**Jobs:**
- `test`: Executa testes em múltiplas versões do Bun
- `lint`: Executa verificações de linting

## 2. Release - `.github/workflows/release.yml`

**Trigger:** 
- Publicação de release no GitHub
- Execução manual via `workflow_dispatch`

**Funcionalidades:**
- Executa testes antes do build
- Gera binários para Linux, Windows e macOS
- Cria checksums de verificação
- Anexa binários à release do GitHub

**Binários gerados:**
- `migration-database-linux-x64` (Linux x64)
- `migration-database-windows-x64.exe` (Windows x64)
- `migration-database-macos-x64` (macOS x64)
- `migration-database-binaries.tar.gz` (arquivo compactado com todos)
- `checksums.txt` (checksums SHA256)

## Como usar

### Para desenvolvimento (branch main):
```bash
# Push normal - apenas executa testes
git push origin main
```

### Para criar uma release:
1. Crie uma tag de versão:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Crie uma release no GitHub:
   - Vá para "Releases" no repositório
   - Clique em "Create a new release"
   - Selecione a tag criada
   - Preencha o título e descrição
   - Clique em "Publish release"

3. O workflow de release será executado automaticamente e anexará os binários à release.

### Execução manual do workflow de release:
1. Vá para "Actions" no repositório
2. Selecione "Release" workflow
3. Clique em "Run workflow"
4. Digite a versão desejada
5. Clique em "Run workflow"

## Scripts disponíveis

- `bun run test`: Executa todos os testes
- `bun run test:ci`: Executa testes com relatório verbose
- `bun run type-check`: Verifica tipos TypeScript
- `bun run compile`: Compila para a plataforma atual
- `bun run compile-all`: Compila para todas as plataformas
- `bun run build:release`: Executa type-check, testes e compilação completa
