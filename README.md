# Apresentação — Saúde em Família

Este documento reúne, de forma resumida, os principais elementos do projeto **Saúde em Família**, seguindo o roteiro de apresentação definido pela equipe. Cada seção apresenta apenas o conteúdo selecionado como exemplo representativo.

---

## 🎯 Objetivo Geral

Implementar uma solução tecnológica — o sistema **Saúde em Família** — com a finalidade de **organizar, gerenciar, monitorar e compartilhar** as informações relacionadas à administração de medicamentos entre os responsáveis pelo cuidado do paciente, promovendo maior organização e eficiência no tratamento.

---

## 🎯 Objetivos Específicos

1. **Cadastramento do paciente** — desenvolver uma funcionalidade que permita armazenar informações pessoais e dados relevantes para o acompanhamento da saúde do paciente.
2. **Registro detalhado dos medicamentos** — criar um módulo para registrar nome, dosagem, frequência, horários e orientações médicas de cada medicamento.
3. **Registro das administrações realizadas** — desenvolver um sistema que permita aos cuidadores informar data, horário e responsável por cada administração de medicamento.

---

## 📋 Regra de Negócio

> **Falha possível:** Registrar o mesmo medicamento como "tomado" mais de uma vez no mesmo horário.

**Como evitar:** Impedir, por regra do sistema, que existam múltiplos registros de administração para o mesmo medicamento no mesmo horário programado — bloqueando a segunda confirmação e evitando o risco de **superdosagem**.

---

## 👤 História de Usuário

**Persona:** *Maria*, cuidadora de seu pai *João*, que precisa tomar medicamentos diariamente. Como o cuidado é compartilhado entre os familiares, surgem problemas como esquecimento de horários, falta de comunicação entre cuidadores e risco de doses duplicadas.

**HdU1:** *Como cuidadora, Maria quer registrar cada administração de medicamento realizada ao seu pai João, para manter um histórico atualizado, acessível a todos os cuidadores, e evitar erros como doses duplicadas.*

---

## ⚙️ Requisito Funcional

**RF4 — Registrar administração de medicamento com controle de horário e impedir duplicidade**

- **Classificação:** Funcional
- **Prioridade:** Alta
- **Referência:** HdU1; RdN4

**Descrição:** O sistema deve permitir o registro da administração do medicamento pelos cuidadores, validando o horário dentro de uma janela de tolerância e impedindo múltiplos registros para o mesmo horário.

**Critério de Aceitação (Gherkin):**

```gherkin
Cenário: Lembrete enviado no horário do medicamento
  Dado que existe um medicamento cadastrado com horário programado
  E existem cuidadores associados ao paciente
  Quando chega o horário programado do medicamento
  Então o sistema deve enviar um lembrete aos cuidadores
```

---

## ✅ Plano de Qualidade — Atributo: Confiabilidade (Reliability)

**O que é:** Capacidade do sistema de funcionar corretamente por longos períodos sem falhas, sem perder registros de medicação.

**Meta quantitativa:**
- Disponibilidade: **99,9% de uptime mensal** (máximo de 43 minutos de indisponibilidade por mês).
- Precisão de registro: **100%** dos registros de medicamentos devem ser persistentes (zero perda de dados).

**Métrica:**
- **Disponibilidade do sistema (Uptime):** `(Tempo Total do Mês − Tempo de Indisponibilidade) / Tempo Total do Mês × 100`
- **Integridade dos dados:** verificação da persistência correta dos registros de medicamentos no banco de dados.

**Metodologia de Validação:**
- Monitoramento contínuo de logs para detectar falhas de registro.
- Testes automatizados de integridade de dados realizados diariamente.
- Backup automático a cada 6 horas.

---

## 🛠️ FMEA

### Tabela FMEA

Estrutura utilizada para mapear cada modo de falha do produto:

| Função | Modo de Falha | Efeito | Causa | S | O | D | RPN (S×O×D) | Ação de Controle (Teste de Produto) |
|---|---|---|---|---|---|---|---|---|
| Registro de dose | F4 – Duplicidade | Superdosagem | Concorrência de usuários | 10 | 3 | 5 | 150 | Teste de Concorrência: simular múltiplos registros simultâneos para o mesmo paciente/horário. |

### Matriz FMEA (Severidade × Ocorrência)

| Severidade \ Ocorrência | 1-2 (Baixa) | 3-4 (Média) | 5+ (Alta) |
|---|---|---|---|
| **9-10 (Crítica)** | F2 | F1, F3, **F4** | F5 |
| **7-8 (Alta)** | - | - | - |
| **1-6 (Baixa)** | - | - | - |

### Modo de Falha selecionado

**F4 – Duplicidade de registro**
- **Função:** Registro de dose
- **Efeito:** Superdosagem do paciente
- **Causa:** Concorrência de usuários (dois cuidadores registrando a mesma medicação ao mesmo tempo)
- **Severidade:** 10 · **Ocorrência:** 3 · **Detecção:** 5 → **RPN = 150** (maior risco identificado)

### Ação de Controle (Teste) selecionada

**AC4 – Teste de Duplicidade de Registro**

Simular dois cuidadores registrando a mesma medicação simultaneamente e validar que o sistema evita a duplicação do registro.

> **Modo de falha controlado:** F4 – Duplicidade de registro

---

## 🧪 Modelagem de Testes

### Partição de Equivalência (PE)

**CT-PE-01**
- **Descrição:** Validar se a notificação exibe o medicamento correto quando há múltiplos agendamentos em horários próximos.
- **Entrada:** Medicamento A (ID 1) → 08:00 | Medicamento B (ID 2) → 08:01
- **Resultado Esperado:** Cada notificação deve exibir corretamente o nome correspondente ao ID do medicamento agendado.
- **Modo de Falha Relacionado:** F6

### Análise de Valor de Borda (BVA)

**CT-BV-01**
- **Descrição:** Validar o comportamento da interface com tamanhos extremos de fonte do sistema.
- **Entrada:** Fonte mínima do sistema | Fonte máxima do sistema
- **Resultado Esperado:** A interface deve permanecer legível e funcional, sem quebras de layout, em ambos os extremos.
- **Modo de Falha Relacionado:** F7

### Tabela de Decisão (TD)

**CT-TD-01**
- **Descrição:** Validar o comportamento do sistema em diferentes condições de conectividade.

| Internet | Ação do usuário | Resultado esperado |
|---|---|---|
| Ativa | Registrar dose | Salva e sincroniza |
| Inativa | Registrar dose | Salva localmente |
| Inativa → Ativa | Reconectar | Sincroniza dados |

- **Resultado Esperado:** O sistema deve cumprir corretamente cada regra definida para os cenários apresentados.
- **Modo de Falha Relacionado:** F9

---

## 🧩 Testes Práticos

### Teste de API — `POST /validarLogin`

**Funcionamento relevante do sistema:** o endpoint recebe um e-mail e uma senha e verifica se a credencial existe na base de dados, retornando uma resposta de sucesso ou de erro de autenticação.

#### Modelagem (Partição de Equivalência)

| Partição | Descrição | Dados de entrada | Resultado esperado |
|---|---|---|---|
| P1 | Credencial inexistente | Dados que não estão no banco | `401 Unauthorized` |
| P2 | Credencial existente | Dados que estão no banco | `200 OK` |

#### Implementação

- **Ferramenta:** Postman
- **Ambiente:** Local (`http://localhost:3000/validarLogin`)

**CT01 — Barrar dados inválidos**
```json
// Request Body
{
  "email": "leo@gmail.com",
  "password": "12345"
}
```
```javascript
// Script de teste (Postman)
else if (pm.response.code === 401) {
  pm.test("Status code is 401 - Credenciais inválidas", function () {
    pm.response.to.have.status(401);
  });
}
```

**CT02 — Aprovar dados válidos**
```json
// Request Body
{
  "email": "testuser@example.com",
  "senha": "senha123"
}
```
```javascript
// Script de teste (Postman)
if (pm.response.code === 200) {
  pm.test("Status code is 200 - Login realizado com sucesso", function () {
    pm.response.to.have.status(200);
  });
}
```

#### Resultado

| CT | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|
| CT01 | `401 Unauthorized` | `401 Unauthorized` | ✅ Aprovado |
| CT02 | `200 OK` | `200 OK` | ✅ Aprovado |

**Conclusão:** os testes executados apresentaram conformidade com o comportamento esperado do endpoint, sem divergências entre resultado obtido e esperado.

---

### Teste de Interface — Botão de Registrar (`calendario.html`)

**Funcionamento relevante do sistema:** a tela de calendário exibe os medicamentos agendados; espera-se que o botão "Registrar" apareça quando há um medicamento correspondente cadastrado na tabela.

#### Modelagem (Tabela de Decisão)

| Regra | CT01 | CT02 |
|---|---|---|
| Medicamento existe | Aparece | Não aparece |

- **CT01 — Medicamento registrado:** se a tabela está preenchida → botão "Registrar" deve aparecer.
- **CT02 — Medicamento não registrado:** se a tabela não está preenchida → botão "Registrar" não deve aparecer.

#### Implementação

| Ferramenta | Biblioteca | Navegador | Ambiente | URL | Data de execução |
|---|---|---|---|---|---|
| Robot Framework | SeleniumLibrary | Chrome | localhost | `http://localhost:3000/calendario.html` | 07/06/26 |

#### Resultado

| CT | Regra | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| CT01 | Medicamento existe | Aparece | Não aparece | ❌ Reprovado |
| CT02 | Medicamento existe | Não aparece | Aparece | ❌ Reprovado |

**Conclusão:** ambos os casos de teste executados nesta sessão foram **reprovados**. A página `calendario.html` não apresentou o comportamento esperado em nenhum dos cenários validados.

---
