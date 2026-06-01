/**
 * calendario.js — Saúde em Família
 * Toda persistência via API (banco de dados).
 * localStorage é usado APENAS para token e dados do usuário logado.
 */

// ─── Estado ───────────────────────────────────────────────
const today    = new Date();
let curYear    = today.getFullYear();
let curMonth   = today.getMonth();
let selDate    = new Date(today);

// Cache local por mês (evita re-fetch ao navegar) — { 'YYYY-MM': [...] }
const agendaCache = {};

// Dados de histórico recente
let historicoRecente = [];

// ─── Utils ────────────────────────────────────────────────
function toDateStr(d) {
    return d.toISOString().split('T')[0];
}

function toMonthStr(year, month) {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
}

function getUser() {
    try { return JSON.parse(localStorage.getItem('sf_user') || '{}'); } catch { return {}; }
}

function getToken() {
    return localStorage.getItem('sf_token') || '';
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
    };
}

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    setTopbarDate();
    loadUserInfo();
    await fetchMesAtual();
    await fetchHistorico();
    renderCalendar();
    await renderSchedule(selDate);
    renderHistory();
    updateStats();
});

function setTopbarDate() {
    const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('topbar-date').textContent =
        today.toLocaleDateString('pt-BR', opts);
}

function loadUserInfo() {
    const user     = getUser();
    const name     = user.nome || user.name || user.email || 'Usuário';
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    document.getElementById('sidebar-user-name').textContent = name;
    document.getElementById('user-avatar').textContent       = initials;

    // Paciente = o próprio usuário neste contexto
    document.getElementById('sidebar-patient-name').textContent = name;
    document.getElementById('patient-initials').textContent     = initials;
}

// ─── Fetch agenda mensal ───────────────────────────────────
async function fetchMesAtual() {
    const mes = toMonthStr(curYear, curMonth);
    if (agendaCache[mes]) return; // já em cache

    const user = getUser();
    if (!user.id_usuario) return;

    try {
        const res  = await fetch(`/agenda/${user.id_usuario}?mes=${mes}`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Falha ao buscar agenda');
        const data = await res.json();
        agendaCache[mes] = data.registros || [];
    } catch (e) {
        console.error('fetchMesAtual:', e);
        agendaCache[mes] = [];
    }
}

// ─── Fetch agenda de um dia específico ────────────────────
async function fetchDia(date) {
    const user = getUser();
    if (!user.id_usuario) return [];

    const ds = toDateStr(date);
    try {
        const res  = await fetch(`/agenda/${user.id_usuario}/${ds}`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Falha ao buscar dia');
        const data = await res.json();
        return data.medicamentos || [];
    } catch (e) {
        console.error('fetchDia:', e);
        return [];
    }
}

// ─── Fetch histórico recente ───────────────────────────────
async function fetchHistorico() {
    const user = getUser();
    if (!user.id_usuario) return;

    try {
        const res  = await fetch(`/administracoes/${user.id_usuario}?limite=8`, { headers: authHeaders() });
        if (!res.ok) throw new Error();
        historicoRecente = await res.json();
    } catch {
        historicoRecente = [];
    }
}

// ─── Calendário ───────────────────────────────────────────
const MONTHS = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

function getDayStatus(dateStr) {
    const mes = dateStr.substring(0, 7);
    const reg = (agendaCache[mes] || []).filter(r => {
        const start = r.data_inicio;
        const end   = r.data_termino || '2099-12-31';
        return dateStr >= start && dateStr <= end;
    });
    if (reg.length === 0) return null; // sem medicamentos

    const comAdm = reg.filter(r => r.data_referencia === dateStr);
    if (comAdm.length === 0) return 'pending';
    if (comAdm.some(r => r.adm_status === 'perdida')) return 'missed';
    if (comAdm.every(r => r.adm_status === 'tomada'))  return 'taken';
    return 'pending';
}

function renderCalendar() {
    document.getElementById('cal-month-label').textContent =
        MONTHS[curMonth] + ' ' + curYear;

    const first    = new Date(curYear, curMonth, 1);
    const last     = new Date(curYear, curMonth + 1, 0);
    const startDay = first.getDay();
    const prevLast = new Date(curYear, curMonth, 0).getDate();
    const tbody    = document.getElementById('cal-body');
    tbody.innerHTML = '';

    let day = 1, nextDay = 1;

    for (let row = 0; row < 6; row++) {
        const tr = document.createElement('tr');

        for (let col = 0; col < 7; col++) {
            const td   = document.createElement('td');
            const cell = document.createElement('div');
            cell.className = 'day-cell';

            let cellDate;

            if (row === 0 && col < startDay) {
                const d = prevLast - startDay + col + 1;
                cell.textContent = d;
                cell.classList.add('other-month');
                cellDate = new Date(curYear, curMonth - 1, d);
            } else if (day > last.getDate()) {
                cell.textContent = nextDay++;
                cell.classList.add('other-month');
                cellDate = new Date(curYear, curMonth + 1, nextDay - 1);
            } else {
                cell.textContent = day;
                cellDate = new Date(curYear, curMonth, day);

                if (sameDay(cellDate, today))      cell.classList.add('today');
                else if (sameDay(cellDate, selDate)) cell.classList.add('selected');

                const status = getDayStatus(toDateStr(cellDate));
                if (status === 'missed')  cell.classList.add('missed');
                else if (status === 'taken')   cell.classList.add('taken');
                else if (status === 'pending') cell.classList.add('has-events');

                day++;
            }

            const captured = new Date(cellDate);
            cell.addEventListener('click', async () => {
                selDate = captured;
                renderCalendar();
                await renderSchedule(captured);
                const lbl = captured.toLocaleDateString('pt-BR',
                    { weekday: 'long', day: 'numeric', month: 'long' });
                document.getElementById('sched-title').textContent =
                    lbl.charAt(0).toUpperCase() + lbl.slice(1);
            });

            td.appendChild(cell);
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
        if (day > last.getDate() && row >= 4) break;
    }
}

async function prevMonth() {
    curMonth--;
    if (curMonth < 0) { curMonth = 11; curYear--; }
    await fetchMesAtual();
    renderCalendar();
}

async function nextMonth() {
    curMonth++;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    await fetchMesAtual();
    renderCalendar();
}

async function goToday() {
    curYear  = today.getFullYear();
    curMonth = today.getMonth();
    selDate  = new Date(today);
    await fetchMesAtual();
    renderCalendar();
    await renderSchedule(selDate);
}

// ─── Schedule (lista do dia) ───────────────────────────────
async function renderSchedule(date) {
    const meds  = await fetchDia(date);
    const list  = document.getElementById('sched-list');
    const empty = document.getElementById('empty-sched');

    if (meds.length === 0) {
        list.innerHTML       = '';
        empty.style.display  = 'flex';
        if (sameDay(date, today))
            document.getElementById('stat-hoje').textContent = 0;
        return;
    }

    empty.style.display = 'none';
    if (sameDay(date, today))
        document.getElementById('stat-hoje').textContent = meds.length;

    const ds = toDateStr(date);

    list.innerHTML = meds.map(m => {
        const jaRegistrado = !!m.id_administracao;
        const isPast       = date < today && !jaRegistrado;

        let cls = 'pending', lbl = 'Pendente', ico = '⏳';
        if (jaRegistrado) {
            if (m.adm_status === 'tomada')  { cls = 'taken';  lbl = 'Tomada';  ico = '✅'; }
            if (m.adm_status === 'perdida') { cls = 'missed'; lbl = 'Perdida'; ico = '❌'; }
        }
        if (isPast) { cls = 'missed'; lbl = 'Perdida'; ico = '❌'; }

        const horario = m.horario_principal
            ? String(m.horario_principal).substring(0, 5)
            : '—';

        return `
        <div class="med-item">
            <div class="med-icon ${cls}">${ico}</div>
            <div class="med-details">
                <div class="med-name">${m.nome}</div>
                <div class="med-info">${m.dosagem || '—'} &middot; ${horario} &middot; ${m.via_administracao || 'Oral'}</div>
            </div>
            <div>
                ${(jaRegistrado || isPast)
                    ? `<span class="status-badge ${cls}">${lbl}</span>`
                    : `<button class="btn-register"
                         onclick="registrarAdm(${m.id_medicamento},'${ds}')">Registrar</button>`
                }
            </div>
        </div>`;
    }).join('');
}

// ─── Registrar administração ───────────────────────────────
async function registrarAdm(id_medicamento, data_referencia) {
    const user = getUser();
    if (!user.id_usuario) { showToast('Faça login para registrar.'); return; }

    try {
        const res = await fetch('/registrarAdministracao', {
            method:  'POST',
            headers: authHeaders(),
            body:    JSON.stringify({
                id_medicamento,
                id_usuario:     user.id_usuario,
                data_referencia,
                status:         'tomada',
                cuidador:       user.nome || 'Cuidador'
            })
        });

        if (!res.ok) throw new Error();

        showToast('Administração registrada!');

        // Invalida cache do mês e re-busca
        const mes = data_referencia.substring(0, 7);
        delete agendaCache[mes];
        await fetchMesAtual();
        await fetchHistorico();
        renderCalendar();
        await renderSchedule(selDate);
        renderHistory();
        updateStats();

    } catch {
        showToast('Erro ao registrar. Tente novamente.');
    }
}

// ─── Histórico ────────────────────────────────────────────
function renderHistory() {
    const list = document.getElementById('history-list');

    if (historicoRecente.length === 0) {
        list.innerHTML = '<p style="font-size:0.8rem;color:#94a3b8;text-align:center;padding:8px 0">Nenhum registro ainda.</p>';
        return;
    }

    list.innerHTML = historicoRecente.slice(0, 6).map(a => {
        const dt = new Date(a.data_hora).toLocaleString('pt-BR',
            { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        return `
        <div class="history-item">
            <div class="h-dot ${a.status === 'tomada' ? 'taken' : 'missed'}"></div>
            <div class="h-text">${a.medicamento_nome} — ${a.status}</div>
            <div class="h-time">${dt}</div>
        </div>`;
    }).join('');
}

// ─── Stats ────────────────────────────────────────────────
function updateStats() {
    const mesAtual = toMonthStr(today.getFullYear(), today.getMonth());
    const reg      = agendaCache[mesAtual] || [];

    const adms      = reg.filter(r => r.data_referencia);
    const tomadas   = adms.filter(r => r.adm_status === 'tomada').length;
    const perdidas  = adms.filter(r => r.adm_status === 'perdida').length;
    const total     = tomadas + perdidas;

    document.getElementById('stat-tomadas').textContent  = tomadas;
    document.getElementById('stat-perdidas').textContent = perdidas;
    document.getElementById('stat-adesao').textContent   =
        total > 0 ? Math.round((tomadas / total) * 100) + '%' : '—';

    // Conta medicamentos ativos hoje
    const hoje = toDateStr(today);
    const ativos = reg.filter(r => r.data_inicio <= hoje && (!r.data_termino || r.data_termino >= hoje));
    // Unique por id_medicamento
    const uniqueIds = [...new Set(ativos.map(r => r.id_medicamento))];
    document.getElementById('med-count').textContent = uniqueIds.length;
}

// ─── Sidebar / UI helpers ─────────────────────────────────
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function logout() {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    window.location.href = 'index.html';
}

function notifySection(s) {
    showToast('Seção "' + s + '" em breve!');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}