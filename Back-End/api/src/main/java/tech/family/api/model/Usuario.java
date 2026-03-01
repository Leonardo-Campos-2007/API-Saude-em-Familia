package tech.family.api.model;

public class Usuario {

    private int id;
    private String nome;

    //Precisa de um construtor vazio para o Jackson (serialização/deserialização JSON)
    public Usuario() {
    }

    
    public Usuario(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}