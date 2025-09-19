# 📚 Exemplos de Uso

Este documento contém exemplos práticos de como usar o Gerador de Hostnames.

## 🎯 Exemplos Básicos

### 1. Servidor Web Simples
```
Nome Base: web
Ambiente: prod
Localização: us-east
Padrão: Descritivo
Quantidade: 3

Resultado:
- web-prod-us-east
- web-prod-us-east-instancia-02
- web-prod-us-east-instancia-03
```

### 2. API com Abreviações
```
Nome Base: api
Ambiente: staging
Localização: eu-west
Padrão: Abreviado
Quantidade: 2

Resultado:
- api-stg-euw
- api-stg-euw-02
```

### 3. Banco de Dados Numerado
```
Nome Base: database
Ambiente: prod
Localização: (vazio)
Padrão: Numérico
Quantidade: 5

Resultado:
- database-prod-01
- database-prod-02
- database-prod-03
- database-prod-04
- database-prod-05
```

## 🏢 Exemplos Empresariais

### 1. Infraestrutura Completa
```
Prefixo: mycompany
Nome Base: web
Ambiente: prod
Localização: br-south
Padrão: Por Localização
Quantidade: 3

Resultado:
- mycompany-web-br-south-prod-01
- mycompany-web-br-south-prod-02
- mycompany-web-br-south-prod-03
```

### 2. Microserviços
```
Nome Base: api
Ambiente: dev
Localização: (vazio)
Padrão: Por Função
Quantidade: 4

Resultado:
- api-gateway-dev
- rest-api-dev
- graphql-dev
- api-gateway-dev-02
```

### 3. Cache e Filas
```
Nome Base: cache
Ambiente: prod
Localização: us-east
Padrão: Por Função
Quantidade: 3

Resultado:
- redis-prod-us-east
- memcached-prod-us-east
- cache-server-prod-us-east
```

## 🌍 Exemplos por Região

### 1. Multi-região
```
Nome Base: web
Ambiente: prod
Localização: (vazio)
Padrão: Por Localização
Quantidade: 6

Resultado:
- web-us-east-prod-01
- web-us-west-prod-01
- web-eu-west-prod-01
- web-eu-central-prod-01
- web-asia-pacific-prod-01
- web-br-south-prod-01
```

### 2. Ambiente de Desenvolvimento
```
Nome Base: api
Ambiente: dev
Localização: us-east
Padrão: Por Ambiente
Quantidade: 2

Resultado:
- dev-api-us-east
- dev-api-us-east-02
```

## 🔧 Exemplos Técnicos

### 1. Monitoramento
```
Nome Base: monitoring
Ambiente: prod
Localização: (vazio)
Padrão: Por Função
Quantidade: 3

Resultado:
- prometheus-prod
- grafana-prod
- monitoring-prod
```

### 2. Logging
```
Nome Base: logging
Ambiente: prod
Localização: eu-west
Padrão: Por Função
Quantidade: 3

Resultado:
- elasticsearch-prod-eu-west
- logstash-prod-eu-west
- kibana-prod-eu-west
```

### 3. Banco de Dados
```
Nome Base: db
Ambiente: prod
Localização: us-east
Padrão: Por Função
Quantidade: 4

Resultado:
- database-prod-us-east
- postgres-prod-us-east
- mysql-prod-us-east
- mongodb-prod-us-east
```

## 🎨 Exemplos Criativos

### 1. Com Sufixo Personalizado
```
Nome Base: web
Ambiente: staging
Localização: (vazio)
Padrão: Descritivo
Sufixo: internal
Quantidade: 2

Resultado:
- web-staging-internal
- web-staging-instancia-02-internal
```

### 2. Com Prefixo da Empresa
```
Prefixo: acme
Nome Base: api
Ambiente: prod
Localização: us-west
Padrão: Abreviado
Quantidade: 3

Resultado:
- acme-api-prod-usw
- acme-api-prod-usw-02
- acme-api-prod-usw-03
```

### 3. Ambiente de Teste
```
Nome Base: test
Ambiente: test
Localização: (vazio)
Padrão: Numérico
Quantidade: 5

Resultado:
- test-test-01
- test-test-02
- test-test-03
- test-test-04
- test-test-05
```

## 📋 Dicas de Uso

### ✅ Boas Práticas
- Use nomes descritivos para o nome base
- Inclua ambiente para separar dev/staging/prod
- Use localização para infraestrutura multi-região
- Mantenha consistência na nomenclatura
- Use prefixos para identificar a empresa/projeto

### ❌ Evite
- Nomes muito genéricos (server, host, machine)
- Nomes muito longos (>30 caracteres)
- Caracteres especiais além de hífens
- Números no início do hostname
- Múltiplos hífens consecutivos

### 🔍 Validação
O gerador valida automaticamente os hostnames gerados e mostra:
- ✅ Hostnames válidos
- ❌ Hostnames inválidos com explicação
- ⚠️ Avisos sobre convenções
- 💡 Sugestões de melhoria

## 🚀 Casos de Uso Reais

### 1. Startup Tech
```
Prefixo: startup
Nome Base: web
Ambiente: prod
Localização: us-east
Padrão: Descritivo

Resultado: startup-web-prod-us-east
```

### 2. E-commerce
```
Prefixo: shop
Nome Base: api
Ambiente: prod
Localização: eu-west
Padrão: Por Localização

Resultado: shop-api-eu-west-prod
```

### 3. SaaS Multi-tenant
```
Prefixo: saas
Nome Base: web
Ambiente: prod
Localização: us-west
Padrão: Abreviado

Resultado: saas-web-prod-usw
```

### 4. Gaming
```
Prefixo: game
Nome Base: api
Ambiente: prod
Localização: asia-pacific
Padrão: Por Função

Resultado: game-api-gateway-prod-asia-pacific
```

### 5. Fintech
```
Prefixo: fintech
Nome Base: db
Ambiente: prod
Localização: us-east
Padrão: Por Função

Resultado: fintech-database-prod-us-east
```

---

Estes exemplos mostram a flexibilidade do gerador para diferentes cenários e necessidades. Experimente combinações diferentes para encontrar o padrão ideal para seu projeto!
