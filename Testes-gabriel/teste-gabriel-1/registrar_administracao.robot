*** Settings ***
Documentation       Testes de verificação do botão na página de calendário
Library             SeleniumLibrary

Suite Setup         Abrir Navegador
Suite Teardown      Fechar Navegador

*** Variables ***
${URL}              http://localhost:3000/calendario.html
${NAVEGADOR}        chrome

*** Test Cases ***
CT01 - Validar Transição Visual Para Medicamento Tomado
    Open Browser               ${URL}    ${NAVEGADOR}
    Maximize Browser Window
    Wait Until Element Is Visible    xpath=//button[contains(@class, 'btn-register')]    timeout=5s
    Click Element              xpath=//button[contains(@class, 'btn-register')]
    
    # Validações visuais da Interface
    Element Should Be Visible  id=toast
    Element Text Should Be     id=toast    Administração registrada!
    Element Text Should Be     xpath=//span[contains(@class, 'status-badge')]    Tomada
    [Teardown]    Close Browser

*** Keywords ***
Abrir Navegador
    Open Browser    ${URL}    ${NAVEGADOR}
    Maximize Browser Window

Fechar Navegador
    Close All Browsers

Acessar Página do Calendário
    Go To           ${URL}
    Wait Until Page Contains Element    tag:body    timeout=10s
