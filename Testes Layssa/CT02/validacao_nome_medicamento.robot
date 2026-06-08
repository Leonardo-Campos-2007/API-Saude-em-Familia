*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://localhost:3000/calendario.html

*** Test Cases ***
Validar Nome Obrigatorio

    Open Browser    ${URL}    chrome
    Maximize Browser Window

    Click Button    xpath=//button[contains(.,'+ Adicionar')]

    Input Text    id=med-dose    500mg

    Click Button    xpath=//button[contains(.,'Salvar Medicamento')]

    Page Should Contain    Informe o nome do medicamento.

    Close Browser