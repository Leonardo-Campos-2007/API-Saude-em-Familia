const express = require("express");
const router = express.Router();
const db = require("../../db");

router.post('/validarLogin', (req, res) => {
    const { email, senha } = req.body;

    db.query(
        'SELECT * FROM usuario WHERE email = ? AND senha = ?',
        [email, senha],
        (err, result) => {""
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            const usuario = result[0];

            return res.status(200).json({
                message: 'Login realizado com sucesso',
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            });
        }
    );
});

router.post('/cadastroUser', (req, res) => {
    const { nome, email, senha } = req.body;

    db.query(
        'SELECT id_usuario FROM usuario WHERE nome = ? OR email = ?',
        [nome, email],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (rows.length > 0) {
                return res.status(409).json({ error: 'Nome ou email já cadastrado' });
            }

            db.query(
                'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, senha],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erro interno do servidor' });
                    }

                    res.status(201).json({
                        message: 'Usuário cadastrado com sucesso',
                        id: result.insertId,
                        nome,
                        email
                    });
                }
            );
        }
    );
});

router.get('/medicamentos/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        'SELECT * FROM medicamento WHERE id_usuario = ?',
        [id_usuario],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            res.status(200).json(rows);
        }
    );
});

router.post('/cadastroMedicamento', (req, res) => {
    const { id_usuario, nome, dosagem, via_administracao, frequencia, horario_principal, data_inicio, data_termino, observacoes } = req.body;

    db.query(
        'INSERT INTO medicamento (id_usuario, nome, dosagem, via_administracao, frequencia, horario_principal, data_inicio, data_termino, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id_usuario, nome, dosagem, via_administracao, frequencia, horario_principal, data_inicio, data_termino, observacoes],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            res.status(201).json({
                message: 'Medicamento cadastrado com sucesso',
                id: result.insertId,
                id_usuario,
                nome,
                dosagem,
                via_administracao,
                frequencia,
                horario_principal,
                data_inicio,
                data_termino,
                observacoes
            });
        }
    );
});

// ─── Novas rotas: calendário / administrações ─────────────

/**
 * GET /agenda/:id_usuario/:data
 * Retorna os medicamentos ativos naquela data + status de administração.
 * Parâmetro :data no formato YYYY-MM-DD
 */
router.get('/agenda/:id_usuario/:data', (req, res) => {
    const { id_usuario, data } = req.params;

    // Medicamentos com período que abrange a data solicitada
    const sqlMeds = `
        SELECT m.*,
               a.id_administracao,
               a.status           AS adm_status,
               a.data_hora        AS adm_data_hora,
               a.cuidador         AS adm_cuidador,
               a.observacao       AS adm_observacao
        FROM medicamento m
        LEFT JOIN administracao a
               ON a.id_medicamento  = m.id_medicamento
              AND a.data_referencia = ?
        WHERE m.id_usuario  = ?
          AND m.data_inicio <= ?
          AND (m.data_termino IS NULL OR m.data_termino >= ?)
    `;

    db.query(sqlMeds, [data, id_usuario, data, data], (err, rows) => {
        if (err) { console.error(err); return res.status(500).json({ error: 'Erro interno do servidor' }); }
        res.status(200).json({ data, medicamentos: rows, total: rows.length });
    });
});

/**
 * GET /agenda/:id_usuario
 * Retorna o resumo mensal: quais dias têm medicamentos e qual status.
 * Query string: ?mes=YYYY-MM
 */
router.get('/agenda/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const mes = req.query.mes; // ex.: 2025-06

    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
        return res.status(400).json({ error: 'Parâmetro ?mes=YYYY-MM obrigatório.' });
    }

    const primeiroDia = `${mes}-01`;
    const ultimoDia = `${mes}-31`; // MySQL ajusta automaticamente

    const sql = `
        SELECT
            m.id_medicamento,
            m.nome,
            m.dosagem,
            m.horario_principal,
            m.data_inicio,
            m.data_termino,
            a.data_referencia,
            a.status AS adm_status
        FROM medicamento m
        LEFT JOIN administracao a
               ON a.id_medicamento = m.id_medicamento
              AND a.data_referencia BETWEEN ? AND ?
        WHERE m.id_usuario  = ?
          AND m.data_inicio <= ?
          AND (m.data_termino IS NULL OR m.data_termino >= ?)
    `;

    db.query(sql, [primeiroDia, ultimoDia, id_usuario, ultimoDia, primeiroDia], (err, rows) => {
        if (err) { console.error(err); return res.status(500).json({ error: 'Erro interno do servidor' }); }
        res.status(200).json({ mes, registros: rows });
    });
});

/**
 * POST /registrarAdministracao
 * Body: { id_medicamento, id_usuario, data_referencia, status, cuidador, observacao }
 */
router.post('/registrarAdministracao', (req, res) => {
    const { id_medicamento, id_usuario, data_referencia,
        status = 'tomada', cuidador = '', observacao = '' } = req.body;

    if (!id_medicamento || !id_usuario || !data_referencia) {
        return res.status(400).json({ error: 'id_medicamento, id_usuario e data_referencia são obrigatórios.' });
    }

    // Evitar duplicata na mesma data
    db.query(
        'SELECT id_administracao FROM administracao WHERE id_medicamento = ? AND data_referencia = ?',
        [id_medicamento, data_referencia],
        (err, existing) => {
            if (err) { console.error(err); return res.status(500).json({ error: 'Erro interno do servidor' }); }

            if (existing.length > 0) {
                // Atualiza o existente
                db.query(
                    `UPDATE administracao
                     SET status = ?, cuidador = ?, observacao = ?, data_hora = NOW()
                     WHERE id_administracao = ?`,
                    [status, cuidador, observacao, existing[0].id_administracao],
                    (err2) => {
                        if (err2) { console.error(err2); return res.status(500).json({ error: 'Erro interno do servidor' }); }
                        res.status(200).json({
                            message: 'Administração atualizada',
                            id_administracao: existing[0].id_administracao,
                            id_medicamento, id_usuario, data_referencia,
                            status, cuidador, observacao
                        });
                    }
                );
            } else {
                // Insere novo
                db.query(
                    `INSERT INTO administracao
                        (id_medicamento, id_usuario, data_referencia, status, cuidador, observacao)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [id_medicamento, id_usuario, data_referencia, status, cuidador, observacao],
                    (err2, result) => {
                        if (err2) { console.error(err2); return res.status(500).json({ error: 'Erro interno do servidor' }); }
                        res.status(201).json({
                            message: 'Administração registrada com sucesso',
                            id_administracao: result.insertId,
                            id_medicamento, id_usuario, data_referencia,
                            status, cuidador, observacao
                        });
                    }
                );
            }
        }
    );
});

/**
 * GET /administracoes/:id_usuario
 * Retorna histórico recente de administrações com nome do medicamento.
 * Query string opcional: ?limite=20
 */
router.get('/administracoes/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const limite = parseInt(req.query.limite) || 20;

    db.query(
        `SELECT a.*, m.nome AS medicamento_nome, m.dosagem
         FROM administracao a
         JOIN medicamento m ON m.id_medicamento = a.id_medicamento
         WHERE a.id_usuario = ?
         ORDER BY a.data_hora DESC
         LIMIT ?`,
        [id_usuario, limite],
        (err, rows) => {
            if (err) { console.error(err); return res.status(500).json({ error: 'Erro interno do servidor' }); }
            res.status(200).json(rows);
        }
    );
});

module.exports = router;