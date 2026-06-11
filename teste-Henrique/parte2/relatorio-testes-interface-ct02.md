# Segundo teste de interface de usuario

## Modelagem de teste web - Tabela de decisao

Interface testada: tela de login local.

URL inicial: `http://localhost:8081`

| Condicao / Regra | CT02-01 | CT02-02 | CT02-03 | CT02-04 | CT02-05 |
|---|---|---|---|---|---|
| Email preenchido | S | N | S | S | S |
| Senha preenchida | S | N | S | S | S |
| Email possui @ | S | - | N | S | S |
| Usuario cadastrado | S | - | - | N | S |
| Senha correta | S | - | - | - | N |
| Resultado esperado | Login realizado | Campos obrigatorios | Email invalido | Usuario nao encontrado | Senha incorreta |

## Casos de teste derivados

### CT02-01 - Login com dados validos

| Campo | Valor |
|---|---|
| Email | `admin@email.com` |
| Senha | `123456` |
| Resultado esperado | `Login realizado com sucesso` |

### CT02-02 - Campos obrigatorios

| Campo | Valor |
|---|---|
| Email | vazio |
| Senha | vazio |
| Resultado esperado | `Email e senha obrigatorios` |

### CT02-03 - Email invalido

| Campo | Valor |
|---|---|
| Email | `adminemail.com` |
| Senha | `123456` |
| Resultado esperado | `Email invalido` |

### CT02-04 - Usuario inexistente

| Campo | Valor |
|---|---|
| Email | `teste@email.com` |
| Senha | `123456` |
| Resultado esperado | `Usuario nao encontrado` |

### CT02-05 - Senha incorreta

| Campo | Valor |
|---|---|
| Email | `admin@email.com` |
| Senha | `111111` |
| Resultado esperado | `Senha incorreta` |

## Implementacao - Robot Framework com SeleniumLibrary

Arquivo da suite: [`testes_interface_ct02.robot`](testes_interface_ct02.robot)

Comando de execucao:

```bash
robot testes_interface_ct02.robot
```

## Ambiente de testes

| Item | Valor |
|---|---|
| Ferramenta | Robot Framework |
| Biblioteca | SeleniumLibrary |
| Navegador | Google Chrome |
| Ambiente | Localhost |
| URL | `http://localhost:8081` |
| Data de execucao | 09/06/2026 |

## Resultados da execucao

| Caso de teste | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|
| CT02-01 - Login valido | Login realizado com sucesso | Login realizado com sucesso | Aprovado |
| CT02-02 - Campos obrigatorios | Email e senha obrigatorios | Email e senha obrigatorios | Aprovado |
| CT02-03 - Email invalido | Email invalido | Email invalido | Aprovado |
| CT02-04 - Usuario inexistente | Usuario nao encontrado | Usuario nao encontrado | Aprovado |
| CT02-05 - Senha incorreta | Senha incorreta | Senha incorreta | Aprovado |

## Resumo dos resultados

| Total de testes | Aprovados | Reprovados |
|---|---|---|
| 5 | 5 | 0 |

## Arquivos de evidencia da execucao

| Arquivo | Descricao | Link |
|---|---|---|
| `report.html` | Resumo executivo da execucao dos testes | [`report.html`](report.html) |
| `log.html` | Log detalhado da execucao dos testes | [`log.html`](log.html) |
| `output.xml` | Resultado bruto da execucao dos testes | [`output.xml`](output.xml) |

## Conclusao

Os testes automatizados validam o comportamento principal da tela de login usando Robot Framework e SeleniumLibrary.
