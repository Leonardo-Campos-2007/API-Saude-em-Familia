*** Settings ***
Documentation     Teste de registro de usuário - Dados Inválidos
Library           SeleniumLibrary

*** Variables ***
${URL}            http://localhost:3000/register.html
${BROWSER}        chrome

*** Test Cases ***
CT02 - Registro com nome muito curto deve falhar
    [Documentation]    Verifica que nome com menos de 3 caracteres não é aceito
    
    # Abrir navegador e preencher com nome inválido
    Open Browser       ${URL}    ${BROWSER}
    Input Text         id=nome       a
    Input Text         id=email      a@a.com
    Input Password     id=senha      123456
    
    # Tentar submeter
    Click Button       css=.login-button
    
    # Verificar que continua na mesma página (não cadastrou)
    Wait Until Location Is    ${URL}    2s
    
    # Verificar mensagem de erro
    Page Should Contain    Nome deve ter pelo menos 3 caracteres
    
    # Fechar navegador
    Close Browser
