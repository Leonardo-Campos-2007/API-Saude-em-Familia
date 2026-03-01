package tech.family.api;

import tech.family.api.model.Usuario;
import tech.family.api.dao.UsuarioDAO;

public class Index {

    public static void main(String[] args) {
        Usuario usuario = new Usuario();
        usuario.setId(1);
        usuario.setNome("João");
        
        new UsuarioDAO().cadastrarUsuario(usuario);
    }
}
