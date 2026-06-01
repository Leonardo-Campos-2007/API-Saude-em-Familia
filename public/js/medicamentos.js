// Pega o id_usuario salvo no login
const user = JSON.parse(localStorage.getItem('sf_user') || '{}');
const id_usuario = user.id_usuario;

// Busca medicamentos do banco ao carregar
async function fetchMedicamentos() {
    const res = await fetch(`/api/medicamentos/${id_usuario}`);
    const data = await res.json();
    return data; // array de medicamentos
}

async function saveMedication() {
    const nome = document.getElementById('med-nome').value.trim();
    const alrt = document.getElementById('add-alert');

    if (!nome) {
        alrt.textContent = 'Informe o nome do medicamento.';
        alrt.style.display = 'block';
        return;
    }
    alrt.style.display = 'none';

    const med = {
        id_usuario,
        nome,
        dosagem: document.getElementById('med-dose').value,
        via_administracao: document.getElementById('med-via').value || 'Oral',
        frequencia: document.getElementById('med-freq').value,
        horario_principal: document.getElementById('med-horario').value,
        data_inicio: document.getElementById('med-inicio').value,
        data_termino: document.getElementById('med-fim').value,
        observacoes: document.getElementById('med-obs').value
    };

    const res = await fetch('/api/cadastroMedicamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(med)
    });

    const data = await res.json();

    if (res.ok) {
        showToast('Medicamento adicionado!');
        closeAddModal();
        await reloadMeds(); // recarrega do banco
    } else {
        alrt.textContent = data.error || 'Erro ao salvar.';
        alrt.style.display = 'block';
    }
}

async function deleteMedication(id) {
    if (!confirm('Deseja excluir este medicamento?')) return;

    const res = await fetch(`/api/medicamentos/${id}`, { method: 'DELETE' });

    if (res.ok) {
        showToast('Medicamento excluído!');
        await reloadMeds();
    }
}

// Recarrega do banco e re-renderiza tudo
async function reloadMeds() {
    medications = await fetchMedicamentos();
    renderCalendar();
    renderSchedule(selDate);
    updateStats();
}