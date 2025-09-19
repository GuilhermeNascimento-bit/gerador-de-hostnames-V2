# 🚀 Início Rápido

## ⚡ Instalação e Execução

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar em Desenvolvimento
```bash
npm run dev
```
A aplicação abrirá automaticamente em `http://localhost:3000`

### 3. Build para Produção
```bash
npm run build
```

### 4. Preview da Build
```bash
npm run preview
```

## 🎯 Como Usar

1. **Digite o Nome Base** (ex: web, api, db)
2. **Selecione o Ambiente** (dev, staging, prod)
3. **Escolha a Localização** (opcional)
4. **Selecione o Padrão** de nomenclatura
5. **Defina a Quantidade** de hostnames
6. **Clique em "Gerar Hostnames"**

## ✨ Funcionalidades Principais

- **6 Padrões Diferentes**: Descritivo, Abreviado, Numérico, etc.
- **Validação Automática**: Verifica se os hostnames são válidos
- **Histórico**: Mantém registro dos hostnames gerados
- **Exportação**: Salva resultados em JSON
- **Responsivo**: Funciona em desktop e mobile

## 📱 Interface

- **Formulário Intuitivo**: Campos organizados e claros
- **Resultados Visuais**: Status de validação com ícones
- **Ações Rápidas**: Copiar individual ou todos os hostnames
- **Histórico Persistente**: Salvo no navegador

## 🔧 Configuração Avançada

### Prefixos e Sufixos Personalizados
- Use o campo "Prefixo Personalizado" para adicionar identificação da empresa
- Use o campo "Sufixo Personalizado" para adicionar contexto adicional

### Exemplos Rápidos
```
Nome Base: web
Ambiente: prod
Padrão: Descritivo
→ web-prod

Nome Base: api
Ambiente: dev
Padrão: Abreviado
→ api-dev

Nome Base: db
Ambiente: prod
Padrão: Numérico
→ db-prod-01, db-prod-02, etc.
```

## 🚀 Deploy

### GitHub Pages
O projeto está configurado para deploy automático via GitHub Actions:
1. Faça push para a branch `main`
2. O deploy acontece automaticamente
3. Acesse via `https://seu-usuario.github.io/hostname-generator`

### Outros Provedores
- **Netlify**: Arraste a pasta `dist` após o build
- **Vercel**: Conecte o repositório GitHub
- **Surge**: `npm run build && surge dist`

## 🆘 Solução de Problemas

### Erro de Módulos
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Porta em Uso
```bash
# Use uma porta diferente
npm run dev -- --port 3001
```

### Build Falha
```bash
# Verifique se todos os arquivos estão presentes
ls -la src/
```

## 📚 Próximos Passos

1. **Explore os Exemplos**: Veja `examples.md` para casos de uso
2. **Contribua**: Leia `CONTRIBUTING.md` para contribuições
3. **Personalize**: Modifique os padrões em `src/js/generator.js`
4. **Estilize**: Ajuste o CSS em `src/css/style.css`

---

**Divirta-se gerando hostnames! 🎉**
