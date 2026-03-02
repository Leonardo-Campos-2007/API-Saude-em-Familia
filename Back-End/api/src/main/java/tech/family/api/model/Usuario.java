package tech.family.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    private int id;

    private String nome;

    public Usuario() {}

    public Usuario(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    // getters e setters
}