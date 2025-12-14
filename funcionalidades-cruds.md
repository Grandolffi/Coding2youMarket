# Funcionalidades e CRUDs - Subscrivery (Supermercado Digital)

**ATUALIZADO após reunião com key users (13/12/2025)**  
**Conceito:** Supermercado único com assinaturas recorrentes + Club Market

---

## 🎯 CONCEITO FINAL

**O que é:** Um supermercado web onde o cliente monta um "carrinho fixo" de produtos que deseja receber periodicamente.

**Diferencial:** Club Market - Programa de fidelidade com frete grátis e descontos

**Fluxo:**
1. Cliente monta carrinho fixo
2. Escolhe frequência (semanal, quinzenal, mensal)
3. Paga com cartão de crédito (cobrança recorrente automática)
4. Recebe produtos na frequência escolhida
5. Sistema avisa 7 dias antes se produto estiver faltando (oferece substituições)

---

## 🗄️ CRUDS NECESSÁRIOS

### 1. **Usuários (Clientes)**
**Modelo:** `Usuario`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| nome | string | Nome completo |
| email | string | E-mail (único) |
| cpf | string | CPF (único) |
| telefone | string | Celular |
| senha | string | Hash bcrypt |
| clubMember | boolean | É membro do Club Market? |
| dataCadastroClub | datetime | Quando virou membro |
| dataCadastro | datetime | Data de registro |
| ativo | boolean | Conta ativa? |

**Endpoints:**
- POST `/auth/register` - Criar conta
- POST `/auth/login` - Autenticar
- GET `/usuarios/perfil` - Ver perfil
- PATCH `/usuarios/perfil` - Editar perfil
- POST `/usuarios/club/aderir` - Aderir ao Club Market
- DELETE `/usuarios/club/cancelar` - Cancelar Club Market
- DELETE `/usuarios/conta` - Deletar conta

---

### 2. **Admin** (Dono do App)
**Modelo:** `Admin`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| nome | string | Nome |
| email | string | E-mail (único) |
| senha | string | Hash bcrypt |
| role | string | `admin` |

**Endpoints:**
- POST `/admin/login` - Login admin
- GET `/admin/dashboard` - Dashboard geral
- GET `/admin/vendas` - Relatório de vendas
- GET `/admin/planos` - Resumo de assinaturas ativas
- GET `/admin/estoque/baixo` - Produtos com estoque baixo
- POST `/admin/pedido-fornecedor` - Fazer pedido ao fornecedor externo

---

### 3. **Produtos**
**Modelo:** `Produto`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| nome | string | Ex: "Arroz Integral 1kg" |
| descricao | text | Detalhes do produto |
| categoria | string | Mercearia, Bebidas, Higiene, Limpeza, etc |
| precoNormal | decimal | Preço sem desconto |
| unidade | string | kg, litro, unidade, pacote |
| imagem | string | URL da imagem |
| estoque | int | Quantidade disponível |
| ativo | boolean | Disponível para venda? |
-----------------------------------------------
//| estoqueMinimo | int | **Quando atingir, avisar admin** |


**Endpoints:**
- GET `/produtos` - Listar todos (com filtros)
- GET `/produtos/:id` - Detalhes
- GET `/produtos/categorias` - Listar categorias disponíveis
- *(Admin)* POST `/produtos` - Cadastrar produto
- *(Admin)* PATCH `/produtos/:id` - Editar produto
- *(Admin)* DELETE `/produtos/:id` - Deletar produto

---

### 4. **Carrinho** (Carrinho Fixo)
**Modelo:** `CarrinhoItem`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| usuarioId | int | FK para Usuario |
| produtoId | int | FK para Produto |
| quantidade | int | Quantos itens |
| observacao | text | Ex: "Preferência de marca X" |

**Endpoints:**
- GET `/carrinho` - Ver carrinho atual
- POST `/carrinho/adicionar` - Adicionar produto
- PATCH `/carrinho/:id` - Atualizar quantidade
- DELETE `/carrinho/:id` - Remover item
- DELETE `/carrinho/limpar` - Esvaziar carrinho

---

### 5. **Endereços de Entrega**
**Modelo:** `Endereco`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| usuarioId | int | FK para Usuario |
| cep | string | CEP |
| rua | string | Logradouro |
| numero | string | Número |
| complemento | string | Apto, bloco, etc |
| bairro | string | Bairro |
| cidade | string | Cidade |
| estado | string | UF |
| apelido | string | "Casa", "Trabalho" |
| principal | boolean | Endereço padrão? |

**Endpoints:**
- GET `/enderecos` - Listar endereços do usuário
- POST `/enderecos` - Cadastrar novo
- PATCH `/enderecos/:id` - Editar
- DELETE `/enderecos/:id` - Remover

---

### 6. **Assinaturas** (Plano Recorrente)
**Modelo:** `Assinatura`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| usuarioId | int | FK para Usuario |
| enderecoId | int | FK para Endereco |
| frequencia | enum | `semanal`, `quinzenal`, `mensal` |
| diaEntrega | int | Dia da semana/mês |
| valorTotal | decimal | Soma dos produtos |
| valorFrete | decimal | **R$ 0,00 se Club, senão R$ X,XX** |
| descontoClub | decimal | Desconto aplicado (se membro) |
| valorFinal | decimal | Total com frete e descontos |
| status | enum | `ativa`, `pausada`, `cancelada`, `pendente_estoque` |
| dataInicio | datetime | Quando começou |
| dataProximaEntrega | datetime | Próxima entrega |
| dataProximaCobranca | datetime | 1 dia antes da entrega |
| dataCancelamento | datetime | Quando cancelou |

**Endpoints:**
- POST `/assinaturas` - Criar assinatura (do carrinho)
- GET `/assinaturas/minhas` - Listar minhas assinaturas
- GET `/assinaturas/:id` - Detalhes
- PATCH `/assinaturas/:id/editar` - Editar produtos da assinatura
- PATCH `/assinaturas/:id/pausar` - Pausar temporariamente
- PATCH `/assinaturas/:id/reativar` - Reativar
- DELETE `/assinaturas/:id` - Cancelar definitivamente

---

### 7. **Itens da Assinatura**
**Modelo:** `AssinaturaItem`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| assinaturaId | int | FK para Assinatura |
| produtoId | int | FK para Produto |
| quantidade | int | Quantos itens |
| precoUnitario | decimal | Preço no momento da assinatura |
| produtoSubstituto | int | FK para Produto (se produto original acabou) |

**Endpoints:**
- GET `/assinaturas/:id/itens` - Ver produtos da assinatura
- POST `/assinaturas/:id/itens` - Adicionar produto à assinatura
- DELETE `/assinaturas/:id/itens/:itemId` - Remover produto da assinatura

---

### 8. **Cartões de Crédito Salvos**
**Modelo:** `CartaoCredito`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| usuarioId | int | FK para Usuario |
| tokenCartao | string | Token do gateway (não salvar dados reais!) |
| bandeira | string | Visa, Mastercard, Elo, etc |
| ultimos4Digitos | string | "1234" |
| nomeImpresso | string | Nome no cartão |
| principal | boolean | Cartão padrão? |

**Endpoints:**
- GET `/cartoes` - Listar cartões salvos
- POST `/cartoes` - Adicionar novo cartão
- DELETE `/cartoes/:id` - Remover cartão

---

### 9. **Pagamentos**
**Modelo:** `Pagamento`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| assinaturaId | int | FK para Assinatura |
| usuarioId | int | FK para Usuario |
| cartaoId | int | FK para CartaoCredito |
| valor | decimal | Valor cobrado |
| status | enum | `pendente`, `aprovado`, `recusado`, `estornado` |
| transacaoId | string | ID do gateway (Mercado Pago/Stripe) |
| dataPagamento | datetime | Quando foi cobrado |
| dataVencimento | datetime | 1 dia antes da entrega |

**Endpoints:**
- POST `/pagamentos` - Processar pagamento inicial
- POST `/pagamentos/webhook` - Receber notificações do gateway
- GET `/pagamentos/historico` - Histórico de pagamentos do usuário

---

### 10. **Entregas** (Histórico)
**Modelo:** `Entrega`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| assinaturaId | int | FK para Assinatura |
| enderecoId | int | FK para Endereco |
| dataEntrega | datetime | Quando foi/será entregue |
| status | enum | `agendada`, `preparando`, `em_rota`, `entregue`, `falhou` |
| problemaEstoque | boolean | **Se teve produto faltando** |
| observacoes | text | Notas da entrega |
| dataConfirmacao | datetime | Quando cliente confirmou recebimento |

**Endpoints:**
- GET `/entregas/proximas` - Próximas entregas
- GET `/entregas/historico` - Histórico completo
- GET `/entregas/:id` - Detalhes de uma entrega
- PATCH `/entregas/:id/confirmar` - Cliente confirma recebimento

---

### 11. **Notificações** (Falta de Estoque)
**Modelo:** `Notificacao`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| usuarioId | int | FK para Usuario |
| assinaturaId | int | FK para Assinatura |
| tipo | enum | `estoque_baixo`, `entrega_proxima`, `pagamento_falhou` |
| mensagem | text | Texto da notificação |
| produtoAfetado | int | FK para Produto (se aplicável) |
| produtosSubstitutos | json | Lista de IDs de produtos substitutos |
| lida | boolean | Usuário já viu? |
| dataCriacao | datetime | Quando foi criada |
| dataLeitura | datetime | Quando foi lida |

**Endpoints:**
- GET `/notificacoes` - Listar notificações do usuário
- PATCH `/notificacoes/:id/ler` - Marcar como lida
- POST `/notificacoes/:id/aceitar-substituto` - Aceitar produto substituto

---

### 12. **Club Market** (Assinatura Premium)
**Modelo:** `ClubMarket`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | PK |
| usuarioId | int | FK para Usuario (único) |
| dataInicio | datetime | Quando aderiu |
| status | enum | `ativa`, `cancelada`, `suspensa` |
| valorMensal | decimal | **Ex: R$ 19,90/mês** |
| beneficios | json | Lista de benefícios |

**Benefícios:**
- ✅ Frete grátis em todas as entregas
- ✅ Descontos exclusivos em produtos selecionados
- ✅ Prioridade em produtos em falta
- ✅ Acesso antecipado a novos produtos

**Endpoints:**
- POST `/club/aderir` - Aderir ao Club Market
- GET `/club/status` - Ver status da assinatura Club
- DELETE `/club/cancelar` - Cancelar Club Market
- GET `/club/beneficios` - Listar benefícios ativos

---

## 📱 TELAS NECESSÁRIAS

### **CLIENTE (App Web)**

#### 1️⃣ **Autenticação**
- **Login:** E-mail + Senha
- **Cadastro:** Nome, E-mail, CPF, Telefone, Senha
- **Recuperar Senha:** E-mail → Link de reset

---

#### 2️⃣ **Home / Catálogo de Produtos**
- **Barra de busca** (pesquisar produtos)
- **Filtros:**
  - Por categoria (Mercearia, Bebidas, Higiene, Limpeza, etc)
  - Por faixa de preço
  - Apenas produtos em estoque
  - Apenas produtos Club (com desconto)
- **Grid de produtos:**
  - Foto
  - Nome
  - Preço normal ~~R$ XX,XX~~
  - Preço Club: **R$ XX,XX** (se membro)
  - Badge "Frete Grátis" (se membro Club)
  - Botão "+ Adicionar ao Carrinho"
- **Banner Club Market** (chamada para aderir)

---

#### 3️⃣ **Carrinho Fixo**
- **Lista de produtos escolhidos**
- Ajustar quantidade (+ / -)
- Remover produto
- **Resumo:**
  - Subtotal: R$ XX,XX
  - Desconto Club: - R$ XX,XX (se membro)
  - Frete: R$ XX,XX ou **Grátis** (se membro)
  - **Total: R$ XX,XX**
- **Botão "Finalizar e Criar Assinatura"**

---

#### 4️⃣ **Configurar Assinatura**
- **Escolher Frequência:**
  - ⚪ Semanal (toda semana)
  - ⚪ Quinzenal (a cada 2 semanas)
  - ⚪ Mensal (1x por mês)
- **Escolher dia preferencial:**
  - Dropdown com dias da semana/mês
- **Resumo:**
  - "Você receberá este carrinho toda semana às terças-feiras"
  - Próxima entrega: DD/MM/AAAA
  - Próxima cobrança: DD/MM/AAAA (1 dia antes)

---

#### 5️⃣ **Endereço de Entrega**
- **Selecionar endereço salvo** (se houver)
- **Cadastrar novo:**
  - CEP (busca automática via ViaCEP)
  - Rua, Número, Complemento, Bairro, Cidade, UF
  - Apelido (Casa, Trabalho)

---

#### 6️⃣ **Pagamento**
- **Selecionar cartão salvo**
- **Cadastrar novo cartão:**
  - Número, Titular, Validade, CVV
  - Checkbox "Salvar para próximas compras"
- **Resumo Final:**
  - Valor total
  - Frequência
  - Próxima cobrança automática
- **Botão "Confirmar Assinatura"**

---

#### 7️⃣ **Confirmação**
- ✅ "Sua assinatura foi criada!"
- Resumo completo
- Botões: "Ver Dashboard" / "Voltar à loja"

---

#### 8️⃣ **Dashboard Cliente**

##### **Seção: Minhas Assinaturas**
- **Card da Assinatura Ativa:**
  - Status (ativa/pausada/cancelada)
  - Frequência (semanal/quinzenal/mensal)
  - Próxima entrega: DD/MM/AAAA
  - Próximo pagamento: DD/MM/AAAA
  - Valor: R$ XX,XX
  - Botões:
    - "Gerenciar Assinatura"
    - "Pausar"
    - "Cancelar"

##### **Seção: Histórico de Entregas**
- Lista de entregas passadas
- Data, Status (Entregue/Em rota/Falhou), Produtos

##### **Seção: Histórico de Pagamentos**
- Data, Valor, Status (Aprovado/Recusado), Método

##### **Seção: Notificações** 
- 🔔 Alert "Produto 'Arroz Integral' está em falta. Escolha um substituto"
- Lista de substitutos sugeridos

---

#### 9️⃣ **Gerenciar Assinatura**
- **Ver/Editar produtos do carrinho fixo**
  - Adicionar novos produtos
  - Remover produtos
  - Ajustar quantidades
- **Alterar frequência de entrega**
- **Alterar endereço**
- **Alterar forma de pagamento**
- **Pausar temporariamente**
- **Cancelar assinatura** (confirmar ação)

---

#### 🔟 **Meu Perfil**
- Dados pessoais
- Meus endereços
- Meus cartões salvos
- **Status Club Market:**
  - "Você é membro desde DD/MM/AAAA"
  - Benefícios ativos
  - Botão "Cancelar Club Market"
- Alterar senha
- Excluir conta

---

#### 1️⃣1️⃣ **Club Market (Página de Venda)**
- **Hero Section:**
  - "Faça parte do Club Market!"
  - Benefícios principais
  - Preço: R$ 19,90/mês
- **Comparação:**
  - Sem Club vs Com Club (frete, descontos, prioridade)
- **Botão "Aderir Agora"**
- Depoimentos de clientes

---

### **ADMIN (Painel Administrativo)**

#### 1️⃣ **Login Admin**
- E-mail + Senha (acesso restrito)

---

#### 2️⃣ **Dashboard Admin**

##### **Visão Geral (KPIs):**
- Total de assinaturas ativas
- Receita mensal recorrente (MRR)
- Total de membros Club Market
- Taxa de churn (cancelamentos)

##### **Seção: Vendas**
- Gráfico de vendas (últimos 30 dias)
- Produtos mais vendidos
- Receita por categoria

##### **Seção: Assinaturas**
- Lista de assinaturas ativas
- Filtros: Todas, Apenas Club, Apenas Não-Club
- Planos por frequência (semanal/quinzenal/mensal)

##### **Seção: Estoque Baixo** ⚠️
- **Lista de produtos com estoque <= estoqueMinimo**
- Quantidade atual
- Botão "Fazer Pedido ao Fornecedor"

---

#### 3️⃣ **Gerenciar Produtos**
- **Lista de produtos** (tabela)
- Filtros por categoria, estoque
- **Adicionar produto:** Formulário completo
- **Editar produto:** Modal
- **Deletar produto:** Confirmar ação

---

#### 4️⃣ **Pedidos ao Fornecedor**
- **Lista de pedidos feitos**
- Status: Pendente, Aprovado, Recebido
- **Criar novo pedido:**
  - Selecionar produtos
  - Quantidade
  - Fornecedor externo (e-mail/WhatsApp)
  - Botão "Enviar Pedido" (envia mensagem automática)

---

## 🔄 FLUXO COMPLETO

```
1. Cliente acessa site e faz LOGIN/CADASTRO
   ↓
2. Navega no CATÁLOGO (filtros, busca)
   ↓
3. Adiciona produtos ao CARRINHO FIXO
   ↓
4. Clica em "Finalizar Assinatura"
   ↓
5. Escolhe FREQUÊNCIA (semanal/quinzenal/mensal) + dia preferencial
   ↓
6. Seleciona/Cadastra ENDEREÇO de entrega
   ↓
7. Informa CARTÃO DE CRÉDITO (ou usa salvo)
   ↓
8. CONFIRMA assinatura
   ↓
9. Sistema cria ASSINATURA recorrente
   ↓
10. Sistema agenda PRIMEIRA ENTREGA
   ↓
11. Sistema agenda COBRANÇA (1 dia antes da entrega)
   ↓
--- CICLO RECORRENTE ---
12. 7 dias antes da entrega: Sistema verifica ESTOQUE
   ↓
13. Se produto faltando → Envia NOTIFICAÇÃO ao cliente
   ↓
14. Cliente escolhe PRODUTO SUBSTITUTO (ou mantém)
   ↓
15. 1 dia antes → Sistema COBRA o cartão
   ↓
16. Dia da entrega → Produtos são entregues
   ↓
17. Volta para passo 12 (próximo ciclo)
```

---

## ⚙️ REGRAS DE NEGÓCIO

### **Preços:**
- Produto tem `precoNormal` e `precoClub` (desconto para membros)
- Frete: **R$ 0,00** para membros Club | **R$ 15,00** para não-membros

### **Cobrança:**
- Recorrente automática **1 dia antes da entrega**
- Se falhar: Sistema tenta 3x em 24h
- Se falhar 3x: Pausa assinatura e notifica cliente

### **Estoque:**
- Quando `estoque <= estoqueMinimo`:
  - Se faltam **7+ dias** até entrega: Envia notificação ao cliente
  - Sistema mostra produtos substitutos similares
  - Admin recebe alerta para fazer pedido ao fornecedor

### **Club Market:**
- Assinatura mensal de **R$ 19,90**
- Benefícios: Frete grátis + Descontos exclusivos
- Pode cancelar a qualquer momento

### **Notificações:**
- **Cliente:**
  - 7 dias antes: Se produto faltar
  - 1 dia antes: Lembrete de cobrança
  - Confirmação de entrega
- **Admin:**
  - Estoque baixo
  - Falha de pagamento (cliente)
  - Nova assinatura criada

---

## 📊 RESUMO DOS CRUDS

| CRUD | Essencial MVP? | Observações |
|------|----------------|-------------|
| Usuários | ✅ Sim | Cliente + Admin |
| Produtos | ✅ Sim | Catálogo principal |
| Carrinho | ✅ Sim | Carrinho fixo |
| Endereços | ✅ Sim | Múltiplos endereços |
| Assinaturas | ✅ Sim | Core do negócio |
| Itens Assinatura | ✅ Sim | Produtos do plano |
| Cartões Salvos | ✅ Sim | Recorrência automática |
| Pagamentos | ✅ Sim | Gateway (Mercado Pago) |
| Entregas | ✅ Sim | Histórico |
| Notificações | ✅ Sim | Estoque baixo |
| Club Market | ⚠️ Importante | Diferencial do negócio |

---

**Atualizado:** 13/12/2025 20:55  
**Responsável:** [Seu nome] - Backend Lead
