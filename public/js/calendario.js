
        const today = new Date();
        let curYear  = today.getFullYear();
        let curMonth = today.getMonth();
        let selDate  = new Date(today);

        let medications     = JSON.parse(localStorage.getItem('sf_medications')     || '[]');
        let administrations = JSON.parse(localStorage.getItem('sf_administrations') || '[]');

        //Init
        document.addEventListener('DOMContentLoaded', () => {
            setTopbarDate();
            loadUserInfo();
            processUrlParams();
            renderCalendar();
            renderSchedule(selDate);
            renderHistory();
            updateStats();
            document.getElementById('med-inicio').value = toDateStr(today);
        });

        function setTopbarDate() {
            const opts = { weekday:'long', day:'numeric', month:'long', year:'numeric' };
            document.getElementById('topbar-date').textContent =
                today.toLocaleDateString('pt-BR', opts);
        }

        function loadUserInfo() {
            try {
                const user = JSON.parse(localStorage.getItem('sf_user') || '{}');
                const name = user.name || user.email || 'Usuário';
                const initials = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
                document.getElementById('sidebar-user-name').textContent = name;
                document.getElementById('user-avatar').textContent = initials;
                const pat   = user.patient || {};
                const pName = pat.name || 'Paciente';
                document.getElementById('sidebar-patient-name').textContent = pName;
                document.getElementById('patient-initials').textContent =
                    pName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
            } catch(e) {}
        }

        //Endpoint GET via parâmetros de URL 
        function processUrlParams() {
            const p      = new URLSearchParams(window.location.search);
            const action = p.get('action');
            if (!action) return;

            if (action === 'add-med' && p.get('nome')) {
                const med = {
                    id:       'med_' + Date.now(),
                    nome:     p.get('nome'),
                    dose:     p.get('dose')       || '',
                    via:      p.get('via')        || 'Oral',
                    freq:     p.get('frequencia') || '1x ao dia',
                    horario:  p.get('horario')    || '08:00',
                    inicio:   p.get('data')       || toDateStr(today),
                    fim:      p.get('fim')        || '',
                    obs:      p.get('obs')        || '',
                    criadoEm: new Date().toISOString()
                };
                if (!medications.find(m => m.nome === med.nome && m.inicio === med.inicio)) {
                    medications.push(med);
                    saveMeds();
                    showToast('Medicamento adicionado via GET: ' + med.nome);
                }
                cleanUrl();
            }

            if (action === 'registrar' && p.get('medicamentoId')) {
                const adm = {
                    id:            'adm_' + Date.now(),
                    medicamentoId: p.get('medicamentoId'),
                    date:          (p.get('dataHora') || toDateStr(today)).split('T')[0],
                    status:        p.get('status') === 'tomado' ? 'tomada' : (p.get('status') || 'tomada'),
                    dataHora:      p.get('dataHora') || new Date().toISOString(),
                    cuidador:      p.get('cuidador')   || 'Cuidador',
                    obs:           p.get('observacao') || ''
                };
                administrations.push(adm);
                saveAdm();
                showToast('Administração registrada via GET!');
                cleanUrl();
            }
        }

        function cleanUrl() {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        //Calendário 
        const MONTHS = [
            'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
            'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
        ];

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

                        const isToday = sameDay(cellDate, today);
                        const isSel   = sameDay(cellDate, selDate);

                        if (isToday)       cell.classList.add('today');
                        else if (isSel)    cell.classList.add('selected');

                        const ds      = toDateStr(cellDate);
                        const dayMeds = getMedsForDate(cellDate);

                        if (dayMeds.length > 0) {
                            const hasMissed = administrations.some(a => a.date === ds && a.status === 'perdida');
                            const hasAdm    = administrations.some(a => a.date === ds);
                            if (hasMissed)   cell.classList.add('missed');
                            else if (hasAdm) cell.classList.add('taken');
                            else             cell.classList.add('has-events');
                        }

                        day++;
                    }

                    const captured = new Date(cellDate);
                    cell.addEventListener('click', () => {
                        selDate = captured;
                        renderCalendar();
                        renderSchedule(captured);
                        const lbl = captured.toLocaleDateString('pt-BR',
                            { weekday:'long', day:'numeric', month:'long' });
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

        function prevMonth() {
            curMonth--;
            if (curMonth < 0) { curMonth = 11; curYear--; }
            renderCalendar();
        }

        function nextMonth() {
            curMonth++;
            if (curMonth > 11) { curMonth = 0; curYear++; }
            renderCalendar();
        }

        function goToday() {
            curYear  = today.getFullYear();
            curMonth = today.getMonth();
            selDate  = new Date(today);
            renderCalendar();
            renderSchedule(selDate);
        }

        // Schedules
        function getMedsForDate(date) {
            return medications.filter(m => {
                const start = new Date((m.inicio || toDateStr(today)) + 'T00:00:00');
                const end   = m.fim ? new Date(m.fim + 'T23:59:59') : new Date('2099-12-31');
                return date >= start && date <= end;
            });
        }

        function renderSchedule(date) {
            const meds  = getMedsForDate(date);
            const ds    = toDateStr(date);
            const list  = document.getElementById('sched-list');
            const empty = document.getElementById('empty-sched');

            if (meds.length === 0) {
                list.innerHTML    = '';
                empty.style.display = 'block';
                if (sameDay(date, today))
                    document.getElementById('stat-hoje').textContent = 0;
                return;
            }

            empty.style.display = 'none';
            if (sameDay(date, today))
                document.getElementById('stat-hoje').textContent = meds.length;

            list.innerHTML = meds.map(m => {
                const adm    = administrations.find(a => a.medicamentoId === m.id && a.date === ds);
                const isPast = date < today && !adm;

                let cls = 'pending', lbl = 'Pendente', ico = '⏳';
                if (adm) {
                    if (adm.status === 'tomada')  { cls = 'taken';  lbl = 'Tomada';  ico = '✅'; }
                    if (adm.status === 'perdida') { cls = 'missed'; lbl = 'Perdida'; ico = '❌'; }
                }
                if (isPast) { cls = 'missed'; lbl = 'Perdida'; ico = '❌'; }

                return `
                <div class="med-item">
                    <div class="med-icon ${cls}">${ico}</div>
                    <div class="med-details">
                        <div class="med-name">${m.nome}</div>
                        <div class="med-info">${m.dose || '—'} &middot; ${m.horario || '—'} &middot; ${m.via || 'Oral'}</div>
                    </div>
                    <div>
                        ${(adm || isPast)
                            ? `<span class="status-badge ${cls}">${lbl}</span>`
                            : `<button class="btn-register"
                                onclick="registerAdm('${m.id}','${ds}')">Registrar</button>`
                        }


                        <button class="btn-delete"
                              onclick="deleteMedication('${m.id}')">
                                     🗑️
                        </button>
                    </div>
                </div>`;
            }).join('');
        }

        function registerAdm(medId, date) {
            administrations.push({
                id:            'adm_' + Date.now(),
                medicamentoId: medId,
                date,
                status:        'tomada',
                dataHora:      new Date().toISOString(),
                cuidador:      document.getElementById('sidebar-user-name').textContent
            });
            saveAdm();
            renderSchedule(selDate);
            renderCalendar();
            renderHistory();
            updateStats();
            showToast('Administração registrada!');
        }

        //Histórico 
        function renderHistory() {
            const recent = [...administrations]
                .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
                .slice(0, 6);

            document.getElementById('history-list').innerHTML = recent.length === 0
                ? '<p style="font-size:0.8rem;color:#94a3b8;text-align:center;padding:8px 0">Nenhum registro ainda.</p>'
                : recent.map(a => {
                    const med = medications.find(m => m.id === a.medicamentoId);
                    const dt  = new Date(a.dataHora).toLocaleString('pt-BR',
                        { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
                    return `
                    <div class="history-item">
                        <div class="h-dot ${a.status === 'tomada' ? 'taken' : 'missed'}"></div>
                        <div class="h-text">${med ? med.nome : 'Medicamento'} — ${a.status}</div>
                        <div class="h-time">${dt}</div>
                    </div>`;
                }).join('');
        }

        //Stats 
        function updateStats() {
            const monthAdms = administrations.filter(a => {
                const d = new Date(a.dataHora);
                return d.getMonth() === today.getMonth() &&
                       d.getFullYear() === today.getFullYear();
            });
            const tomadas  = monthAdms.filter(a => a.status === 'tomada').length;
            const perdidas = monthAdms.filter(a => a.status === 'perdida').length;
            const total    = tomadas + perdidas;

            document.getElementById('stat-tomadas').textContent  = tomadas;
            document.getElementById('stat-perdidas').textContent = perdidas;
            document.getElementById('stat-adesao').textContent   =
                total > 0 ? Math.round((tomadas / total) * 100) + '%' : '—';
            document.getElementById('med-count').textContent     = medications.length;
        }

        //Modal de adicionar 
        function openAddModal()  { document.getElementById('add-modal').classList.add('open'); }
        function closeAddModal() { document.getElementById('add-modal').classList.remove('open'); }

        function saveMedication() {
            const nome  = document.getElementById('med-nome').value.trim();
            const alrt  = document.getElementById('add-alert');

            if (!nome) {
                alrt.textContent  = 'Informe o nome do medicamento.';
                alrt.style.display = 'block';
                return;
            }
            alrt.style.display = 'none';

            const med = {
                id:       'med_' + Date.now(),
                nome,
                dose:     document.getElementById('med-dose').value,
                via:      document.getElementById('med-via').value   || 'Oral',
                freq:     document.getElementById('med-freq').value,
                horario:  document.getElementById('med-horario').value,
                inicio:   document.getElementById('med-inicio').value,
                fim:      document.getElementById('med-fim').value,
                obs:      document.getElementById('med-obs').value,
                criadoEm: new Date().toISOString()
            };

            medications.push(med);
            saveMeds();
            closeAddModal();
            renderCalendar();
            renderSchedule(selDate);
            updateStats();
            showToast('Medicamento adicionado!');

            postToApi('/api/medicamentos', med);
            ['med-nome','med-dose','med-obs'].forEach(id =>
                document.getElementById(id).value = '');
        }

        //Modal de endpoint 
        function openApiModal()  { document.getElementById('api-modal').classList.add('open'); }
        function closeApiModal() { document.getElementById('api-modal').classList.remove('open'); }

        async function testEndpoint() {
            const url    = document.getElementById('api-test-url').value.trim();
            const result = document.getElementById('ep-result');
            if (!url) return;

            result.style.display = 'block';
            result.textContent   = 'Aguardando...';

            try {
                const res  = await fetch(url);
                const data = await res.json();
                result.textContent = JSON.stringify(data, null, 2);
            } catch (e) {
                const sim = simulateEndpointResponse(url);
                result.textContent = JSON.stringify(sim, null, 2);
                if (sim.success && sim.data) ingestApiData(sim.data, url);
            }
        }

        function simulateEndpointResponse(url) {
            const p = new URLSearchParams(url.split('?')[1] || '');
            if (url.includes('add-med') || url.includes('medicamento')) {
                return {
                    success: true,
                    message: 'Medicamento inserido (simulado)',
                    data: {
                        id:       'med_' + Date.now(),
                        nome:     p.get('nome')       || 'Medicamento GET',
                        dose:     p.get('dose')       || '',
                        horario:  p.get('horario')    || '08:00',
                        inicio:   p.get('data')       || toDateStr(today),
                        freq:     p.get('frequencia') || '1x ao dia',
                        via:      'Oral',
                        criadoEm: new Date().toISOString()
                    }
                };
            }
            if (url.includes('registrar') || url.includes('administracao')) {
                return {
                    success: true,
                    message: 'Administração registrada (simulada)',
                    data: {
                        id:            'adm_' + Date.now(),
                        medicamentoId: p.get('medicamentoId') || '',
                        date:          (p.get('dataHora') || toDateStr(today)).split('T')[0],
                        status:        'tomada',
                        dataHora:      p.get('dataHora') || new Date().toISOString(),
                        cuidador:      p.get('cuidador') || 'Cuidador'
                    }
                };
            }
            if (url.includes('agenda')) {
                const date = p.get('data') || toDateStr(today);
                const meds = getMedsForDate(new Date(date + 'T00:00:00'));
                return { success: true, data: { date, medicamentos: meds, total: meds.length } };
            }
            return { success: false, message: 'Endpoint não reconhecido' };
        }

        function ingestApiData(data, url) {
            if (data.nome && !medications.find(m => m.id === data.id)) {
                medications.push(data);
                saveMeds();
                renderCalendar(); renderSchedule(selDate); updateStats();
                showToast('Medicamento importado via GET!');
            }
            if (data.medicamentoId && !administrations.find(a => a.id === data.id)) {
                administrations.push(data);
                saveAdm();
                renderSchedule(selDate); renderCalendar(); renderHistory(); updateStats();
                showToast('Administração importada via GET!');
            }
        }

        //Utilitários 
        function toDateStr(d) { return d.toISOString().split('T')[0]; }

        function sameDay(a, b) {
            return a.getFullYear() === b.getFullYear() &&
                   a.getMonth()    === b.getMonth()    &&
                   a.getDate()     === b.getDate();
        }

        function saveMeds() {
            localStorage.setItem('sf_medications', JSON.stringify(medications));
        }

        function saveAdm() {
            localStorage.setItem('sf_administrations', JSON.stringify(administrations));
        }

        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        async function postToApi(url, body) {
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (localStorage.getItem('sf_token') || '')
                    },
                    body: JSON.stringify(body)
                });
            } catch(e) {}
        }

        function deleteMedication(id) {

        if (!confirm('Deseja excluir este medicamento?')) {
        return;
        }

         medications = medications.filter(m => m.id !== id);

         administrations = administrations.filter(
         a => a.medicamentoId !== id
        );

        saveMeds();
        saveAdm();

        renderCalendar();
        renderSchedule(selDate);
        renderHistory();
        updateStats();

        showToast('Medicamento excluído com sucesso!');
        }





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

        document.getElementById('add-modal').addEventListener('click', function(e) {
            if (e.target === this) closeAddModal();
        });

        document.getElementById('api-modal').addEventListener('click', function(e) {
            if (e.target === this) closeApiModal();
        });


