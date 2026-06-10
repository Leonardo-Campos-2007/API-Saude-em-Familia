# Teste de interface de usuario

## Modelagem de teste web - Particionamento de equivalencia

Interface testada: aplicacao Flask local com pagina inicial e tela de usuarios.

URL inicial: `http://localhost:8080`

### Particoes identificadas

| Funcionalidade | Particao valida | Resultado esperado |
|---|---|---|
| Pagina inicial | Servidor disponivel | Exibe titulo `Servidor de Teste` e status `Servidor funcionando!` |
| Navegacao para usuarios | Link de usuarios disponivel | Abre a tela `Usuarios cadastrados` |
| Listagem de usuarios | Existem usuarios cadastrados | Exibe `Henrique`, `Joao` e total `2` |

## Casos de teste derivados

### CT01 - Validacao da pagina inicial

| Campo | Valor |
|---|---|
| URL | `http://localhost:8080` |
| Titulo esperado | `Servidor de Teste` |
| Status esperado | `Servidor funcionando!` |

Resultado esperado: a pagina inicial deve apresentar o servidor em funcionamento.

### CT02 - Validacao da listagem de usuarios

| Campo | Valor |
|---|---|
| Acao | Clicar em `Ver usuarios cadastrados` |
| Titulo esperado | `Usuarios cadastrados` |
| Usuarios esperados | `Henrique`, `Joao` |
| Total esperado | `Total de usuarios: 2` |

Resultado esperado: a tela de usuarios deve apresentar todos os usuarios cadastrados.

## Implementacao - Robot Framework com SeleniumLibrary

Arquivo da suite: [`testes_interface.robot`](testes_interface.robot)

Comando de execucao utilizado:

```bash
robot testes_interface.robot
```

## Ambiente de testes

| Item | Valor |
|---|---|
| Ferramenta | Robot Framework |
| Biblioteca | SeleniumLibrary |
| Navegador | Google Chrome |
| Ambiente | Localhost |
| URL | `http://localhost:8080` |
| Data de execucao | 09/06/2026 |

## Resultados da execucao

| Caso de teste | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|
| CT01 - Pagina inicial | Titulo e status exibidos corretamente | Titulo e status exibidos corretamente | Aprovado |
| CT02 - Usuarios cadastrados | Usuarios e total exibidos corretamente | Usuarios e total exibidos corretamente | Aprovado |

## Resumo dos resultados

| Total de testes | Aprovados | Reprovados |
|---|---|---|
| 2 | 2 | 0 |

## Arquivos de evidencia da execucao

Os arquivos abaixo foram gerados automaticamente pelo Robot Framework apos a execucao da suite:

| Arquivo | Descricao | Link |
|---|---|---|
| `report.html` | Resumo executivo da execucao dos testes | [`report.html`](report.html) |
| `log.html` | Log detalhado da execucao dos testes | [`log.html`](log.html) |
| `output.xml` | Resultado bruto da execucao dos testes | [`output.xml`](output.xml) |

## Conclusao

Os testes automatizados verificam a interface web principal da aplicacao e a listagem de usuarios utilizando Robot Framework e SeleniumLibrary.
