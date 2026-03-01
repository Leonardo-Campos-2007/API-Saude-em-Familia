package tech.family.api.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import tech.family.api.model.Usuario;
import tech.family.api.Conexao;

// Classe responsável por interagir com o banco de dados para operações relacionadas a "Usuario"
//Não apague pois vamos usala como base para outras DAOs (Data Access Object) no futuro

public class UsuarioDAO {

    public void cadastrarUsuario(Usuario usuario) {

        String sql = "INSERT INTO usuarios (id, nome) VALUES (?, ?)";
        

        try {

            Connection connection = Conexao.getConnection();

            PreparedStatement ps = connection.prepareStatement(sql);

            ps.setInt(1, usuario.getId());
            ps.setString(2, usuario.getNome());

            ps.execute();

            ps.close();
            connection.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}