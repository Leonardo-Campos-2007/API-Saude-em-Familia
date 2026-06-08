*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://localhost:3000/calendario.html

*** Test Cases ***
Cadastrar Medicamento Com Sucesso

    Open Browser    ${URL}    chrome
    Maximize Browser Window

    Click Button    xpath=//button[contains(.,'+ Adicionar')]

    Input Text    id=med-nome        Paracetamol
    Input Text    id=med-dose        500mg

    Select From List By Label    id=med-via    Oral

    Select From List By Index    id=med-freq    1

    Input Text    id=med-horario    08:00

    Input Text    id=med-inicio    2026-06-03

    Input Text    id=med-fim    2026-06-10

    Input Text    id=med-obs    Após refeições

    Click Button    xpath=//button[contains(.,'Salvar Medicamento')]

    Sleep    3s

    Page Should Contain    Medicamento

    Close Browser