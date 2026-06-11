*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser    http://localhost:3000    chrome
Suite Teardown    Close Browser

*** Variables ***
${EMAIL_VALIDO}       chaodeterraefogo@gmail.com
${SENHA_VALIDA}       1
${EMAIL_SEM_ARROBA}   usuarioemail.com
${URL_LOGIN}          http://localhost:3000/index.html

*** Test Cases ***

CT01 — Email e senha válidos
    [Documentation]    Login com credenciais válidas deve redirecionar para o calendário
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text        id=email       ${EMAIL_VALIDO}
    Input Text        id=password    ${SENHA_VALIDA}
    Click Button      xpath=//button[@type='submit']
    Wait Until Location Contains    calendario.html    timeout=10s

CT02 — Email sem @
    [Documentation]    Email sem @ deve exibir mensagem de erro do navegador
    Go To             ${URL_LOGIN}
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text        id=email       ${EMAIL_SEM_ARROBA}
    Input Text        id=password    ${SENHA_VALIDA}
    Click Button      xpath=//button[@type='submit']
    Element Should Be Visible    id=email

CT03 — Email vazio
    [Documentation]    Email vazio deve exibir mensagem de campo obrigatório
    Go To             ${URL_LOGIN}
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text        id=password    ${SENHA_VALIDA}
    Click Button      xpath=//button[@type='submit']
    Element Should Be Visible    id=email

CT04 — Senha vazia
    [Documentation]    Senha vazia deve exibir mensagem de campo obrigatório
    Go To             ${URL_LOGIN}
    Wait Until Element Is Visible    id=email    timeout=10s
    Input Text        id=email       ${EMAIL_VALIDO}
    Click Button      xpath=//button[@type='submit']
    Element Should Be Visible    id=password