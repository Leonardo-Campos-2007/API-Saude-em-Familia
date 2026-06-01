CREATE DATABASE familia;
USE familia;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE medicamento (
    id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    dosagem VARCHAR(50),
    via_administracao VARCHAR(50),
    frequencia VARCHAR(50),
    horario_principal TIME,
    data_inicio DATE,
    data_termino DATE,
    observacoes TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE administracao (
    id_administracao INT AUTO_INCREMENT PRIMARY KEY,
    id_medicamento   INT         NOT NULL,
    id_usuario       INT         NOT NULL,
    data_hora        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_referencia  DATE        NOT NULL,   -- dia ao qual a dose pertence
    status           ENUM('tomada','perdida','pendente') NOT NULL DEFAULT 'tomada',
    cuidador         VARCHAR(100),
    observacao       TEXT,
    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento),
    FOREIGN KEY (id_usuario)     REFERENCES usuario(id_usuario)
);