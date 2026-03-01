package tech.family.api;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// Classe responsável por gerenciar a conexão com o banco de dados MySQL

public class Conexao {

    private static final String URL =
            "jdbc:mysql://localhost:3306/family?serverTimezone=UTC&useSSL=false";

    private static final String USER = "";      // ajuste se necessário
    private static final String PASSWORD = "";     // ajuste se necessário

    private Conexao() {
        // Evita instanciamento da classe (boa prática)
    }

    public static Connection getConnection() {
        try {
            Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Conexão estabelecida com sucesso!");
            return connection;
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao conectar ao banco de dados.", e);
        }
    }
}
    