package com.br.family.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    @GetMapping
    public Map<String, String> listarUsuarios() {

        Map<String, String> resposta = new HashMap<>();

        resposta.put("mensagem", "API funcionando");
        resposta.put("nome", "Leonardo");
        resposta.put("email", "leonardo@gmail.com");

        return resposta;
    }
}
