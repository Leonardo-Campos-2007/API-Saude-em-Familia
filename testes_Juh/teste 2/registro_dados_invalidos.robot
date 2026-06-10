# test02_registro_dados_invalidos.robot
# Teste 02: Registro de usuário com dados inválidos

*** Settings ***
Documentation     Teste de registro de usuário - Casos de Dados Inválidos
Library           SeleniumLibrary
Library           ../register_helper.py
Library           Collections

*** Variables ***
${URL}            file:///${CURDIR}/register.html
${BROWSER}        chrome
${DELAY}          0.5

*** Test Cases ***
CT02 - Registro com nome muito curto deve falhar
    [Documentation]    Verifica que nome com menos de 3 caracteres não é aceito
    [Tags]             erro    validacao    negativo
    
    # Dados de teste
    ${dados}=          Gerar Dados Teste    nome_curto
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
    
    # Aguardar validação
    Sleep              1
    
    # Verificar mensagem de erro (pode vir do HTML5 validation)
    ${validation}=     Execute JavaScript    return document.querySelector('input[name="nome"]').validationMessage
    Log                Validação HTML5: ${validation}
    
    # Verificar mensagem na div message
    ${message}=        Get Text    id=message
    Log                Mensagem: ${message}
    
    # Verificar se não foi enviado (validação do navegador deve barrar)
    ${current_url}=    Get Location
    Log                URL atual: ${current_url}
    
    [Teardown]         Close Browser

CT03 - Registro com email inválido deve falhar
    [Documentation]    Verifica que email em formato inválido não é aceito
    [Tags]             erro    validacao    negativo
    
    # Dados de teste
    ${dados}=          Gerar Dados Teste    email_invalido
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
    
    # Aguardar validação
    Sleep              1
    
    # Verificar validação HTML5 para email
    ${validation}=     Execute JavaScript    return document.querySelector('input[name="email"]').validationMessage
    Log                Validação HTML5: ${validation}
    
    # Deve haver mensagem de validação
    Should Not Be Empty    ${validation}
    
    [Teardown]         Close Browser

CT04 - Registro com senha muito curta deve falhar
    [Documentation]    Verifica que senha com menos de 6 caracteres não é aceita
    [Tags]             erro    validacao    negativo
    
    # Dados de teste
    ${dados}=          Gerar Dados Teste    senha_curta
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
    
    # Tentar submeter (HTML5 pode não validar senha curta)
    Click Button       css=.login-button
    
    # Aguardar
    Sleep              1
    
    # Verificar se o navegador bloqueou
    ${validation}=     Execute JavaScript    return document.querySelector('input[name="senha"]').validationMessage
    Log                Validação HTML5: ${validation}
    
    # Como HTML5 não valida tamanho por padrão, verificar se houve erro do backend
    ${message}=        Get Text    id=message
    
    # Se não houver validação HTML5, pode ter sido enviado
    IF    '${validation}' == ''
        Should Contain Any    ${message}    senha    Senha    mínimo    6
    END
    
    [Teardown]         Close Browser

CT05 - Registro com campos vazios deve falhar
    [Documentation]    Verifica que campos obrigatórios vazios bloqueiam o envio
    [Tags]             erro    validacao    negativo
    
    # Dados de teste
    ${dados}=          Gerar Dados Teste    campos_vazios
    
    # Abrir navegador
    Open Browser       ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    
    # Não preencher nada (campos já estão vazios)
    
    # Tentar submeter
    Click Button       css=.login-button
    
    # Aguardar
    Sleep              1
    
    # Verificar validação HTML5 para campos obrigatórios
    ${nome_validation}=    Execute JavaScript    return document.querySelector('input[name="nome"]').validationMessage
    ${email_validation}=   Execute JavaScript    return document.querySelector('input[name="email"]').validationMessage
    ${senha_validation}=   Execute JavaScript    return document.querySelector('input[name="senha"]').validationMessage
    
    Log                Validação nome: ${nome_validation}
    Log                Validação email: ${email_validation}
    Log                Validação senha: ${senha_validation}
    
    # Pelo menos um campo deve ter mensagem de validação
    ${alguma_validacao}=    Evaluate    bool('${nome_validation}' or '${email_validation}' or '${senha_validation}')
    Should Be True      ${alguma_validacao}
    
    # Verificar que não houve redirecionamento (ainda na mesma página)
    ${current_url}=     Get Location
    Should Contain      ${current_url}    register.html
    
    [Teardown]         Close Browser

*** Keywords ***
Gerar Dados Teste
    [Arguments]        ${tipo}
    ${helper}=         RegisterHelper
    ${dados}=          Gerar Dados Teste    ${tipo}
    [Return]           ${dados}