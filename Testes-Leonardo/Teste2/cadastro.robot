*** Settings ***
Documentation       Testes de cadastro — CT01 (campos preenchidos) e CT02 (campo vazio)
Library             SeleniumLibrary

Suite Setup         Abrir Navegador
Suite Teardown      Fechar Navegador

*** Variables ***
${URL}              http://localhost:3000/cadastro.html
${NAVEGADOR}        chrome
${CAMPO_NOME}       xpath=//input[@placeholder='Digite seu nome']
${CAMPO_EMAIL}      xpath=//input[@placeholder='Digite seu email']
${CAMPO_SENHA}      xpath=//input[@placeholder='Digite sua senha']
${BOTAO_CADASTRAR}  xpath=//button[contains(text(), 'Cadastrar')]

*** Keywords ***
Abrir Navegador
    Open Browser    ${URL}    ${NAVEGADOR}
    Maximize Browser Window

Fechar Navegador
    Close All Browsers

Acessar Página de Cadastro
    Go To                            ${URL}
    Wait Until Page Contains Element    ${CAMPO_NOME}    timeout=10s

Preencher Todos os Campos
    Input Text    ${CAMPO_NOME}     Nome Teste
    Input Text    ${CAMPO_EMAIL}    teste@email.com
    Input Text    ${CAMPO_SENHA}    Senha@123

Deixar Campos Vazios
    Clear Element Text    ${CAMPO_NOME}
    Clear Element Text    ${CAMPO_EMAIL}
    Clear Element Text    ${CAMPO_SENHA}

*** Test Cases ***
CT01 - Cadastro aprovado com todos os campos preenchidos
    [Documentation]    Preenche todos os campos e verifica que o cadastro é aceito.
    [Tags]             CT01    cadastro    regressao
    Acessar Página de Cadastro
    Preencher Todos os Campos
    Click Button                     ${BOTAO_CADASTRAR}
    Wait Until Page Does Not Contain Element    ${BOTAO_CADASTRAR}    timeout=10s

CT02 - Cadastro recusado com campos vazios
    [Documentation]    Deixa os campos vazios e verifica que o cadastro é recusado.
    [Tags]             CT02    cadastro    regressao
    Acessar Página de Cadastro
    Deixar Campos Vazios
    Element Should Be Disabled       ${BOTAO_CADASTRAR}