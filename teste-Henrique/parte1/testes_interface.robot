*** Settings ***
Library    SeleniumLibrary

Suite Setup       Abrir navegador na pagina inicial
Suite Teardown    Fechar navegador

*** Variables ***
${URL}                  http://localhost:8080
${BROWSER}              chrome

${TITULO_HOME}          id=titulo
${STATUS_SERVIDOR}      id=status
${LINK_USUARIOS}        id=linkUsuarios
${TITULO_USUARIOS}      id=tituloUsuarios
${TOTAL_USUARIOS}       id=totalUsuarios

*** Test Cases ***
CT01 - Deve exibir a pagina inicial com servidor funcionando
    Entao a pagina inicial deve apresentar o titulo    Servidor de Teste
    E deve apresentar o status do servidor    Servidor funcionando!

CT02 - Deve navegar para usuarios e listar cadastrados
    Quando acessar a tela de usuarios
    Entao a tela de usuarios deve apresentar o titulo    Usuarios cadastrados
    E deve listar o usuario    Henrique
    E deve listar o usuario    Joao
    E deve apresentar o total de usuarios    Total de usuarios: 2

*** Keywords ***
Abrir navegador na pagina inicial
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Entao a pagina inicial deve apresentar o titulo
    [Arguments]    ${titulo}
    Element Text Should Be    ${TITULO_HOME}    ${titulo}

E deve apresentar o status do servidor
    [Arguments]    ${status}
    Element Text Should Be    ${STATUS_SERVIDOR}    ${status}

Quando acessar a tela de usuarios
    Click Link    ${LINK_USUARIOS}

Entao a tela de usuarios deve apresentar o titulo
    [Arguments]    ${titulo}
    Element Text Should Be    ${TITULO_USUARIOS}    ${titulo}

E deve listar o usuario
    [Arguments]    ${nome}
    Page Should Contain Element    xpath=//li[contains(@class, 'usuario') and normalize-space(.)='${nome}']

E deve apresentar o total de usuarios
    [Arguments]    ${total}
    Element Text Should Be    ${TOTAL_USUARIOS}    ${total}

Fechar navegador
    Close Browser
