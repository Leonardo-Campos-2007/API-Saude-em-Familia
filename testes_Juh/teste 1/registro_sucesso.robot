# test01_registro_sucesso.robot
# Teste 01: Registro de usuário com dados válidos

*** Settings ***
Documentation     Teste de registro de usuário - Caso de Sucesso
Library           SeleniumLibrary

*** Variables ***
${URL}            http://localhost:3000/register.html
${BROWSER}        firefox

*** Test Cases ***

CT01 - Registro com dados válidos deve ser bem-sucedido
    [Documentation]    Verifica que um usuário com dados válidos consegue se cadastrar
    
    # Abrir navegador e preencher formulário
    Open Browser       ${URL}    ${BROWSER}
    Input Text         id=nome        Amanda
    Input Text         id=email       amanda@gmail.com
    Input Password     id=senha       senha123
    
    # Submeter formulário
    Click Button       css=.login-button

    
    # Fechar navegador
    Close Browser