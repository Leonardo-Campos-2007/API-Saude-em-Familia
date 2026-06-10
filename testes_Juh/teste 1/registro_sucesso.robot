# test01_registro_sucesso.robot
# Teste 01: Registro de usuário com dados válidos

*** Settings ***
Documentation     Teste de registro de usuário - Caso de Sucesso
Library           SeleniumLibrary
Library           ../register_helper.py
Library           Collections
Library           String

*** Variables ***
${URL}            file:///${CURDIR}/register.html
${BROWSER}        chrome
${DELAY}          0.5

*** Test Cases ***
CT01 - Registro com dados válidos deve ser bem-sucedido
    [Documentation]    Verifica que um usuário com dados válidos consegue se cadastrar
    [Tags]             sucesso    registro    positivo
    
    # Dados de teste
    ${dados}=          Gerar Dados Teste    valido
    ${nome}=           Get From Dictionary    ${dados}    nome
    ${email}=          Get From Dictionary    ${dados}    email
    ${senha}=          Get From Dictionary    ${dados}    senha
    
    # Abrir navegador
    Open Browser       ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    
    # Preencher formulário
    Input Text         id=nome    ${nome}
    Input Text         id=email    ${email}
    Input Password     id=senha    ${senha}
    
    # Clicar no botão cadastrar
    Click Button       css=.login-button
    
    # Aguardar resposta (simulado)
    Sleep              2
    
    # Verificar mensagem de sucesso
    ${message}=        Get Text    id=message
    Log                Mensagem obtida: ${message}
    
    # Validações
    Should Contain     ${message}    Cadastrado com sucesso
    OR                 Should Contain    ${message}    Cadastro realizado
    
    # Verificar se foi redirecionado ou se há indicação de sucesso
    ${page_source}=    Get Source
    Log                Page source length: ${page_source.__len__()}
    
    [Teardown]         Close Browser

*** Keywords ***
Gerar Dados Teste
    [Arguments]        ${tipo}
    ${helper}=         RegisterHelper
    ${dados}=          Gerar Dados Teste    ${tipo}
    [Return]           ${dados}