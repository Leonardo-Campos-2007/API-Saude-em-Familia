*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser    http://localhost:3000    chrome
Suite Teardown    Close Browser

*** Variables ***
${EMAIL_VALIDO}       chaodeterraefogo@gmail.com
${SENHA_VALIDA}       1
${URL_CALENDARIO}     http://localhost:3000/calendario.html?id=1

*** Test Cases ***

CT01 — Usuário sem medicamentos cadastrados
    [Documentation]    Cards devem exibir zeros para usuário sem medicamentos
    Go To             ${URL_CALENDARIO}?id=999
    Wait Until Element Is Visible    id=stat-hoje    timeout=10s
    Element Text Should Be    id=stat-hoje       0
    Element Text Should Be    id=stat-tomadas    0
    Element Text Should Be    id=stat-perdidas   0
    Element Text Should Be    id=stat-adesao     —

CT02 — Usuário com medicamentos, sem doses hoje
    [Documentation]    stat-hoje deve ser 0 quando não há doses programadas para hoje
    Go To             ${URL_CALENDARIO}
    Wait Until Element Is Visible    id=stat-hoje    timeout=10s
    Element Text Should Be    id=stat-hoje    0

CT03 — Doses programadas hoje, sem registros no mês
    [Documentation]    stat-hoje maior que 0, tomadas e perdidas zerados
    Go To             ${URL_CALENDARIO}
    Wait Until Element Is Visible    id=stat-hoje    timeout=10s
    ${hoje}=    Get Text    id=stat-hoje
    Should Be True    ${hoje} > 0
    Element Text Should Be    id=stat-tomadas    0
    Element Text Should Be    id=stat-perdidas   0
    Element Text Should Be    id=stat-adesao     —

CT04 — Doses programadas e registradas no mês
    [Documentation]    stat-tomadas maior que 0 e adesão exibe percentual
    Go To             ${URL_CALENDARIO}
    Wait Until Element Is Visible    id=stat-tomadas    timeout=10s
    ${tomadas}=    Get Text    id=stat-tomadas
    Should Be True    ${tomadas} > 0
    ${adesao}=    Get Text    id=stat-adesao
    Should Contain    ${adesao}    %

CT05 — Todas as doses do mês foram tomadas
    [Documentation]    stat-perdidas deve ser 0 e adesão deve ser 100%
    Go To             ${URL_CALENDARIO}
    Wait Until Element Is Visible    id=stat-adesao    timeout=10s
    Element Text Should Be    id=stat-perdidas   0
    Element Text Should Be    id=stat-adesao     100%