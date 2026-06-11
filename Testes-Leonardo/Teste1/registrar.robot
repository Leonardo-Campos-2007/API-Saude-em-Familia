*** Settings ***
Documentation       Testes de verificação do botão na página de calendário
Library             SeleniumLibrary

Suite Setup         Abrir Navegador
Suite Teardown      Fechar Navegador

*** Variables ***
${URL}              http://localhost:3000/calendario.html
${NAVEGADOR}        chrome
${BOTAO_VERIFICAR}  xpath=//button[contains(text(), 'Verificar')]

*** Keywords ***
Abrir Navegador
    Open Browser    ${URL}    ${NAVEGADOR}
    Maximize Browser Window

Fechar Navegador
    Close All Browsers

Acessar Página do Calendário
    Go To           ${URL}
    Wait Until Page Contains Element    tag:body    timeout=10s

*** Test Cases ***
CT01 - Botão Verificar deve estar visível na página
    [Documentation]    Verifica se o botão "Verificar" está presente e visível na página do calendário.
    [Tags]             CT01    regressao    calendario
    Acessar Página do Calendário
    Page Should Contain Element     ${BOTAO_VERIFICAR}
    Element Should Be Visible       ${BOTAO_VERIFICAR}

CT02 - Botão Verificar não deve aparecer na página
    [Documentation]    Verifica que o botão "Verificar" não está presente na página do calendário.
    [Tags]             CT02    regressao    calendario
    Acessar Página do Calendário
    Page Should Not Contain Element     ${BOTAO_VERIFICAR}
