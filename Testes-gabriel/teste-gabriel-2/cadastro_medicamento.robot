*** Settings ***
Documentation       Testes de verificação do botão na página de calendário
Library             SeleniumLibrary

Suite Setup         Abrir Navegador
Suite Teardown      Fechar Navegador

*** Variables ***
${URL}              http://localhost:3000/calendario.html
${NAVEGADOR}        chrome

*** Test Cases ***
CT02 - Preencher E Salvar Novo Medicamento No Modal
    Open Browser               ${URL}    ${NAVEGADOR}
    # Força a abertura do Modal chamando a função mapeada no HTML
    Execute JavaScript         openAddModal()
    Wait Until Element Is Visible    id=med-nome    timeout=3s
    
    # Preenchimento do Formulário de Interface
    Input Text                 id=med-nome       Paracetamol
    Input Text                 id=med-dosagem    750mg
    Input Text                 id=med-via        Oral
    Input Text                 id=med-freq       A cada 8h
    Click Button               xpath=//button[contains(@class, 'btn-save')]
    
    # Validação do Fechamento Automático do Modal após sucesso
    Wait Until Element Is Not Visible    id=add-modal    timeout=5s
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
