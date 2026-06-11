*** Settings ***
Library    SeleniumLibrary

Suite Setup       Abrir navegador na tela de login
Test Setup        Acessar tela de login
Suite Teardown    Fechar navegador

*** Variables ***
${URL}              http://localhost:8081
${BROWSER}          chrome

${TITULO}           id=titulo
${INPUT_EMAIL}      id=email
${INPUT_SENHA}      id=senha
${BOTAO_ENTRAR}     id=btnEntrar
${MENSAGEM}         id=mensagem

*** Test Cases ***
CT02-01 - Deve realizar login com dados validos
    Dado que o usuario informa o email    admin@email.com
    E informa a senha    123456
    Quando solicitar login
    Entao o sistema deve apresentar a mensagem    Login realizado com sucesso

CT02-02 - Deve validar campos obrigatorios
    Quando solicitar login
    Entao o sistema deve apresentar a mensagem    Email e senha obrigatorios

CT02-03 - Deve validar email invalido
    Dado que o usuario informa o email    adminemail.com
    E informa a senha    123456
    Quando solicitar login
    Entao o sistema deve apresentar a mensagem    Email invalido

CT02-04 - Deve validar usuario inexistente
    Dado que o usuario informa o email    teste@email.com
    E informa a senha    123456
    Quando solicitar login
    Entao o sistema deve apresentar a mensagem    Usuario nao encontrado

CT02-05 - Deve validar senha incorreta
    Dado que o usuario informa o email    admin@email.com
    E informa a senha    111111
    Quando solicitar login
    Entao o sistema deve apresentar a mensagem    Senha incorreta

*** Keywords ***
Abrir navegador na tela de login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Acessar tela de login
    Go To    ${URL}

Dado que o usuario informa o email
    [Arguments]    ${email}=${EMPTY}
    Input Text    ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}=${EMPTY}
    Input Password    ${INPUT_SENHA}    ${senha}

Quando solicitar login
    Click Button    ${BOTAO_ENTRAR}

Entao o sistema deve apresentar a mensagem
    [Arguments]    ${texto_esperado}
    Wait Until Element Is Visible    ${MENSAGEM}
    Element Text Should Be    ${MENSAGEM}    ${texto_esperado}

Fechar navegador
    Close Browser
