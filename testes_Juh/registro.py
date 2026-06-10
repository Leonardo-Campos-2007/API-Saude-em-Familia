# register_helper.py
# Biblioteca auxiliar para testes de registro - usa apenas bibliotecas padrão Python

import json
import sqlite3
import hashlib
from datetime import datetime
import re

class RegisterHelper:
    """Classe auxiliar para testes de registro de usuário"""
    
    def __init__(self):
        self.messages = []
        self.test_data = {}
    
    def validar_email(self, email):
        """Valida formato de email usando regex"""
        padrao = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(padrao, email) is not None
    
    def validar_senha(self, senha):
        """Valida se a senha tem pelo menos 6 caracteres"""
        return len(senha) >= 6
    
    def validar_nome(self, nome):
        """Valida se o nome não está vazio e tem pelo menos 3 caracteres"""
        return nome and len(nome.strip()) >= 3
    
    def simular_registro(self, nome, email, senha):
        """Simula o registro de um usuário (para teste sem backend)"""
        
        # Validações
        if not self.validar_nome(nome):
            return {"success": False, "message": "Nome deve ter pelo menos 3 caracteres"}
        
        if not self.validar_email(email):
            return {"success": False, "message": "Email inválido"}
        
        if not self.validar_senha(senha):
            return {"success": False, "message": "Senha deve ter pelo menos 6 caracteres"}
        
        # Simular sucesso
        return {
            "success": True, 
            "message": "Cadastro realizado com sucesso",
            "user": {
                "nome": nome,
                "email": email,
                "id": datetime.now().strftime("%Y%m%d%H%M%S")
            }
        }
    
    def gerar_dados_teste(self, tipo="valido"):
        """Gera dados de teste específicos"""
        
        dados = {
            "valido": {
                "nome": "Usuario Teste",
                "email": f"teste_{datetime.now().strftime('%H%M%S')}@email.com",
                "senha": "senha123"
            },
            "nome_curto": {
                "nome": "Jo",
                "email": "jo@email.com",
                "senha": "senha123"
            },
            "email_invalido": {
                "nome": "Usuario Teste",
                "email": "email_invalido",
                "senha": "senha123"
            },
            "senha_curta": {
                "nome": "Usuario Teste",
                "email": "teste@email.com",
                "senha": "123"
            },
            "campos_vazios": {
                "nome": "",
                "email": "",
                "senha": ""
            }
        }
        
        return dados.get(tipo, dados["valido"])
    
    def extrair_mensagem_erro(self, html_content):
        """Extrai mensagem de erro do HTML de resposta"""
        import re
        match = re.search(r'<div[^>]*class="[^"]*message[^"]*"[^>]*>(.*?)</div>', html_content, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        return ""
    
    def verificar_campos_presentes(self, html_content):
        """Verifica se os campos do formulário estão presentes no HTML"""
        campos = ['name="nome"', 'name="email"', 'name="senha"', 'type="submit"']
        presentes = []
        for campo in campos:
            if campo in html_content:
                presentes.append(campo)
        return len(presentes) == len(campos)