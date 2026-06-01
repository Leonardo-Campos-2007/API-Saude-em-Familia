/**
 * medicamentos.js — Saúde em Família
 * Responsável pelo cadastro de medicamentos via API.
 * Importado por medicamentos.html (e apenas por ele).
 */

// ─── Utils compartilhadas ─────────────────────────────────
function getUser()  { try { return JSON.parse(localStorage.getItem('sf_user') || '{}'); } catch { return {}; } }
function getToken() { return localStorage.getItem('sf_token') || ''; }
function authHeaders() {
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

// ─── Modal ────────────────────────────────────────────────
function openAddModal()  { document.getElementById('add-modal').classList.add('open'); }
function closeAddModal() { document.getElementById('add-modal').classList.remove('open'); }

// Fechar ao clicar no backdrop
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('add-modal');
    if (overlay) {
        overlay.addEventListener('click', e => { if (e.target === overlay) closeAddModal(); });
    }

    const today = new Date();
    const inicioInput = document.getElementById('med-inicio');
    if (inicioInput) inicioInput.value = today.toISOString().split('T')[0];

    loadUserInfo();
    carregarMedicamentos();
});

function loadUserInfo() {
    const user = getUser();
    const name = user.nome || user.name || user.email || 'Usuário';
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const elName   = document.getElementById('sidebar-user-name');
    const elAvatar = document.getElementById('user-avatar');
    if (elName)   elName.textContent   = name;
    if (elAvatar) elAvatar.textContent = initials;

    const elPat = document.getElementById('sidebar-patient-name');
    const elPI  = document.getElementById('patient-initials');
    if (elPat) elPat.textContent = name;
    if (elPI)  elPI.textContent  = initials;
}

// ─── Salvar medicamento ───────────────────────────────────
async function saveMedication() {
    const nome  = document.getElementById('med-nome').value.trim();
    const alrt  = document.getElementById('add-alert');

    if (!nome) {
        alrt.textContent   = 'Informe o nome do medicamento.';
        alrt.style.display = 'block';
        return;
    }
    alrt.style.display = 'none';

    const user = getUser();
    if (!user.id_usuario) {
        alrt.textContent   = 'Usuário não autenticado.';
        alrt.style.display = 'block';
        return;
    }

    const payload = {
        id_usuario:        user.id_usuario,
        nome,
        dosagem:           document.getElementById('med-dose').value.trim(),
        via_administracao: document.getElementById('med-via').value   || 'Oral',
        frequencia:        document.getElementById('med-freq').value,
        horario_principal: document.getElementById('med-horario').value,
        data_inicio:       document.getElementById('med-inicio').value,
        data_termino:      document.getElementById('med-fim').value   || null,
        observacoes:       document.getElementById('med-obs').value.trim()
    };

    try {
        const res  = await fetch('/cadastroMedicamento', {
            method:  'POST',
            headers: authHeaders(),
            body:    JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
            alrt.textContent   = data.error || 'Erro ao salvar.';
            alrt.style.display = 'block';
            return;
        }

        closeAddModal();
        showToast('Medicamento adicionado com sucesso!');
        ['med-nome', 'med-dose', 'med-obs'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        await carregarMedicamentos();

    } catch {
        alrt.textContent   = 'Falha de conexão. Tente novamente.';
        alrt.style.display = 'block';
    }
}

// ─── Listagem de medicamentos ─────────────────────────────
async function carregarMedicamentos() {
    const user = getUser();
    if (!user.id_usuario) return;

    const lista = document.getElementById('med-list');
    if (!lista) return;

    lista.innerHTML = '<p class="loading-msg">Carregando...</p>';

    try {
        const res  = await fetch(`/medicamentos/${user.id_usuario}`, { headers: authHeaders() });
        const meds = await res.json();

        if (!Array.isArray(meds) || meds.length === 0) {
            lista.innerHTML = `
            <div class="empty-med">
                <div style="font-size:2.5rem">💊</div>
                <p>Nenhum medicamento cadastrado.<br>Clique em "+ Adicionar" para começar.</p>
            </div>`;
            return;
        }

        lista.innerHTML = meds.map(m => {
            const inicio   = m.data_inicio   ? m.data_inicio.split('T')[0]   : '—';
            const termino  = m.data_termino  ? m.data_termino.split('T')[0]  : 'Contínuo';
            const horario  = m.horario_principal
                ? String(m.horario_principal).substring(0, 5)
                : '—';

            return `
            <div class="med-card" id="medcard-${m.id_medicamento}">
                <div class="med-card-icon">💊</div>
                <div class="med-card-info">
                    <div class="med-card-name">${m.nome}</div>
                    <div class="med-card-details">
                        <span>${m.dosagem || '—'}</span>
                        <span>${m.via_administracao || 'Oral'}</span>
                        <span>${m.frequencia || '—'}</span>
                        <span>⏰ ${horario}</span>
                    </div>
                    <div class="med-card-period">${inicio} → ${termino}</div>
                    ${m.observacoes ? `<div class="med-card-obs">${m.observacoes}</div>` : ''}
                </div>
            </div>`;
        }).join('');

    } catch {
        lista.innerHTML = '<p class="loading-msg error">Erro ao carregar medicamentos.</p>';
    }
}

// ─── Sidebar ──────────────────────────────────────────────
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function logout() {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    window.location.href = '/';
}

function notifySection(s) {
    showToast('Seção "' + s + '" em breve!');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}