// ========== GERENCIAMENTO DE MILITARES (CADASTRO) ==========

function carregarMilitares() {
    const militares = localStorage.getItem('militares');
    return militares ? JSON.parse(militares) : [
        { num: 1, grad: 'SGT', nome: 'FILLMANN', nomeCompleto: 'DIOGO FERNANDES FILLMANN', id: '4359658' },
        { num: 2, grad: 'SD', nome: 'MUCHA', nomeCompleto: 'PAULO RAFAEL MUCHA ANTUNES', id: '3147347' },
        { num: 3, grad: 'SD', nome: 'IGOR', nomeCompleto: 'IGOR SZIMWELSKI MARTINS', id: '3702740' },
        { num: 4, grad: 'SD', nome: 'PAIM', nomeCompleto: 'DOUGLAS PAIM DOS SANTOS', id: '3710998' },
        { num: 5, grad: 'SD', nome: 'PENGO', nomeCompleto: 'RONIMAR DE MORAES PENGO', id: '3715990' },
        { num: 6, grad: 'SD', nome: 'BITENCOURT', nomeCompleto: 'WILLIAM BITENCOURT FERNANDES', id: '4363779' },
        { num: 7, grad: 'SD', nome: 'KELVIN', nomeCompleto: 'KELVIN SILVA SEVERO', id: '4510826' },
        { num: 8, grad: 'SD', nome: 'FERRÃO', nomeCompleto: 'STEFANO LOPES FERRÃO', id: '4666771' },
        { num: 9, grad: 'SD', nome: 'KOHLER', nomeCompleto: 'ERICSON KOHLER MORAES', id: '4665414' },
        { num: 10, grad: 'SD', nome: 'JULIO', nomeCompleto: 'JULIO SAMUEL DA SILVA', id: '4764048' },
        { num: 11, grad: 'SD', nome: 'KELI', nomeCompleto: 'KELI BARZOLA', id: '4764889' },
        { num: 12, grad: '2°SGT', nome: 'HORTMANN', nomeCompleto: 'HORTMANN', id: '2323451' }
    ];
}

function salvarMilitares(militares) {
    localStorage.setItem('militares', JSON.stringify(militares));
}

function renderizarTabela() {
    const militares = carregarMilitares();
    militares.sort((a, b) => a.num - b.num);
    
    const tbody = document.getElementById('listaMilitares');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    militares.forEach((militar, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${militar.num}</strong></td>
            <td>${militar.grad}</td>
            <td>${militar.nome}</td>
            <td>${militar.nomeCompleto || militar.nome}</td>
            <td>${militar.id}</td>
            <td>
                <button class="btn-editar" onclick="editarMilitar(${index})">Editar</button>
                <button class="btn-excluir" onclick="excluirMilitar(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function adicionarMilitarCadastro() {
    const num = parseInt(document.getElementById('numAntiguidade').value);
    const grad = document.getElementById('gradCadastro').value;
    const nome = document.getElementById('nomeCadastro').value.trim().toUpperCase();
    const nomeCompleto = document.getElementById('nomeCompletoCadastro').value.trim().toUpperCase();
    const id = document.getElementById('idfuncCadastro').value.trim();
    
    if (!num || !grad || !nome || !nomeCompleto || !id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Preencha todos os campos!',
            confirmButtonColor: '#4a90e2'
        });
        return;
    }
    
    const militares = carregarMilitares();
    
    if (militares.some(m => m.num === num)) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Já existe um militar com este número de antiguidade!',
            confirmButtonColor: '#4a90e2'
        });
        return;
    }
    
    militares.push({ num, grad, nome, nomeCompleto, id });
    salvarMilitares(militares);
    
    document.getElementById('numAntiguidade').value = '';
    document.getElementById('gradCadastro').value = '';
    document.getElementById('nomeCadastro').value = '';
    document.getElementById('nomeCompletoCadastro').value = '';
    document.getElementById('idfuncCadastro').value = '';
    
    renderizarTabela();
}

function excluirMilitar(index) {
    Swal.fire({
        title: 'Confirmar exclusão',
        text: 'Deseja realmente excluir este militar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const militares = carregarMilitares();
            militares.sort((a, b) => a.num - b.num);
            const militar = militares[index];
            
            const militaresOriginais = carregarMilitares();
            const indexOriginal = militaresOriginais.findIndex(m => 
                m.num === militar.num && m.nome === militar.nome
            );
            
            militaresOriginais.splice(indexOriginal, 1);
            salvarMilitares(militaresOriginais);
            renderizarTabela();
            
            Swal.fire({
                icon: 'success',
                title: 'Excluído!',
                text: 'Militar excluído com sucesso.',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

function editarMilitar(index) {
    const militares = carregarMilitares();
    militares.sort((a, b) => a.num - b.num);
    const militar = militares[index];
    
    const novoNum = prompt('Número de Antiguidade:', militar.num);
    const novoGrad = prompt('Graduação:', militar.grad);
    const novoNome = prompt('Nome:', militar.nome);
    const novoNomeCompleto = prompt('Nome Completo:', militar.nomeCompleto || militar.nome);
    const novoId = prompt('ID Funcional:', militar.id);
    
    if (novoNum && novoGrad && novoNome && novoNomeCompleto && novoId) {
        const numInt = parseInt(novoNum);
        if (militares.some((m, i) => m.num === numInt && i !== index)) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Já existe um militar com este número de antiguidade!',
                confirmButtonColor: '#4a90e2'
            });
            return;
        }
        
        const militaresOriginais = carregarMilitares();
        const indexOriginal = militaresOriginais.findIndex(m => 
            m.num === militar.num && m.nome === militar.nome
        );
        
        militaresOriginais[indexOriginal] = { 
            num: numInt,
            grad: novoGrad, 
            nome: novoNome.toUpperCase(),
            nomeCompleto: novoNomeCompleto.toUpperCase(),
            id: novoId 
        };
        salvarMilitares(militaresOriginais);
        renderizarTabela();
    }
}

function resetarDados() {
    Swal.fire({
        title: 'Resetar dados?',
        text: 'Deseja resetar todos os dados para a lista padrão? Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, resetar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
        localStorage.removeItem('militares');
        salvarMilitares([
            { num: 1, grad: 'SGT', nome: 'FILLMANN', nomeCompleto: 'DIOGO FERNANDES FILLMANN', id: '4359658' },
            { num: 2, grad: 'SD', nome: 'MUCHA', nomeCompleto: 'PAULO RAFAEL MUCHA ANTUNES', id: '3147347' },
            { num: 3, grad: 'SD', nome: 'IGOR', nomeCompleto: 'IGOR SZIMWELSKI MARTINS', id: '3702740' },
            { num: 4, grad: 'SD', nome: 'PAIM', nomeCompleto: 'DOUGLAS PAIM DOS SANTOS', id: '3710998' },
            { num: 5, grad: 'SD', nome: 'PENGO', nomeCompleto: 'RONIMAR DE MORAES PENGO', id: '3715990' },
            { num: 6, grad: 'SD', nome: 'BITENCOURT', nomeCompleto: 'WILLIAM BITENCOURT FERNANDES', id: '4363779' },
            { num: 7, grad: 'SD', nome: 'KELVIN', nomeCompleto: 'KELVIN SILVA SEVERO', id: '4510826' },
            { num: 8, grad: 'SD', nome: 'FERRÃO', nomeCompleto: 'STEFANO LOPES FERRÃO', id: '4666771' },
            { num: 9, grad: 'SD', nome: 'KOHLER', nomeCompleto: 'ERICSON KOHLER MORAES', id: '4665414' },
            { num: 10, grad: 'SD', nome: 'JULIO', nomeCompleto: 'JULIO SAMUEL DA SILVA', id: '4764048' },
            { num: 11, grad: 'SD', nome: 'KELI', nomeCompleto: 'KELI BARZOLA', id: '4764889' },
            { num: 12, grad: '2°SGT', nome: 'HORTMANN', nomeCompleto: 'HORTMANN', id: '2323451' }
        ]);
        renderizarTabela();
        Swal.fire({
            icon: 'success',
            title: 'Resetado!',
            text: 'Dados resetados com sucesso!',
            timer: 2000,
            showConfirmButton: false
        });
        }
    });
}

// ========== GERAÇÃO DE ESCALA ==========

// ========== CONFIGURAÇÕES ==========

function carregarConfiguracoes() {
    const militares = carregarMilitares();
    const config = JSON.parse(localStorage.getItem('configuracoes')) || {};
    
    const batalhaoInput = document.getElementById('batalhaoInput');
    const comandanteSelect = document.getElementById('comandanteSelect');
    const auxiliarPelSelect = document.getElementById('auxiliarPelSelect');
    
    if (config.batalhao) {
        batalhaoInput.value = config.batalhao;
    }
    
    comandanteSelect.innerHTML = '<option value="">Selecione o Comandante</option>';
    auxiliarPelSelect.innerHTML = '<option value="">Selecione o Auxiliar Pel</option>';
    
    militares.forEach(m => {
        const nomeCompleto = m.nomeCompleto || m.nome;
        const option = `<option value="${m.grad}|${nomeCompleto}|${m.id}">${m.grad} ${m.nome} (${nomeCompleto})</option>`;
        comandanteSelect.innerHTML += option;
        auxiliarPelSelect.innerHTML += option;
    });
    
    if (config.comandante) {
        comandanteSelect.value = config.comandante;
    }
    if (config.auxiliarPel) {
        auxiliarPelSelect.value = config.auxiliarPel;
    }
}

function salvarConfiguracoes() {
    const batalhao = document.getElementById('batalhaoInput').value.trim();
    const comandante = document.getElementById('comandanteSelect').value;
    const auxiliarPel = document.getElementById('auxiliarPelSelect').value;
    
    if (!comandante || !auxiliarPel) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Selecione o Comandante e o Auxiliar Pel!',
            confirmButtonColor: '#4a90e2'
        });
        return;
    }
    
    const config = { batalhao, comandante, auxiliarPel };
    localStorage.setItem('configuracoes', JSON.stringify(config));
    Swal.fire({
        icon: 'success',
        title: 'Salvo!',
        text: 'Configurações salvas com sucesso!',
        timer: 2000,
        showConfirmButton: false
    });
}

function obterConfiguracoes() {
    return JSON.parse(localStorage.getItem('configuracoes')) || {};
}

// ========== MILITARES DISPONÍVEIS ==========

function atualizarMilitaresDisponiveis() {
    const alocados = obterMilitaresAlocados();
    const militaresCadastrados = carregarMilitares();
    
    const disponiveis = militaresCadastrados.filter(m => {
        const key = `${m.nome}|${m.id}`;
        return !alocados.has(key);
    });
    
    disponiveis.sort((a, b) => a.num - b.num);
    
    const container = document.getElementById('lista-disponiveis');
    const countBadge = document.getElementById('count-disponiveis');
    
    countBadge.textContent = disponiveis.length;
    
    if (disponiveis.length === 0) {
        container.innerHTML = '<p class="empty-message">Todos os militares estão alocados</p>';
    } else {
        container.innerHTML = '';
        disponiveis.forEach(m => {
            const div = document.createElement('div');
            div.className = 'militar-disponivel';
            div.innerHTML = `
                <div class="militar-disponivel-grad">${m.grad}</div>
                <div class="militar-disponivel-nome">${m.nome}</div>
                <div class="militar-disponivel-id">ID: ${m.id}</div>
            `;
            container.appendChild(div);
        });
    }
}

// ========== GERAÇÃO DE ESCALA ==========

const funcoes = [
    'CMDT DE EQUIPE',
    'MOTORISTA',
    'SEGURANÇA',
    'ANOTADOR',
    'ESTAGIÁRIO'
];

let contadorViaturas = 0;
let contadores = { folga: 0, ferias: 0, lts: 0, adido: 0, rsp: 0 };

// Obter militares já alocados em viaturas ou indisponibilidade
function obterMilitaresAlocados() {
    const alocados = new Set();
    
    // Militares nas viaturas
    document.querySelectorAll('.viatura-section').forEach(viatura => {
        const items = viatura.querySelectorAll('.militar-item');
        items.forEach(item => {
            const nome = item.querySelector('.nome')?.value;
            const id = item.querySelector('.idfunc')?.value;
            if (nome && id) {
                alocados.add(`${nome}|${id}`);
            }
        });
    });
    
    // Militares indisponíveis
    ['folga', 'ferias', 'le', 'ltip', 'lts', 'adido', 'rsp'].forEach(tipo => {
        const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (container) {
            const items = container.querySelectorAll('.militar-item-indisponivel');
            items.forEach(item => {
                const nome = item.querySelector('.nome')?.value;
                const id = item.querySelector('.idfunc')?.value;
                if (nome && id) {
                    alocados.add(`${nome}|${id}`);
                }
            });
        }
    });
    
    return alocados;
}

// Adicionar viatura
function adicionarViatura() {
    const container = document.getElementById('viaturasContainer');
    const viaturaId = `viatura_${contadorViaturas++}`;
    
    const section = document.createElement('div');
    section.className = 'form-section viatura-section';
    section.id = viaturaId;
    
    const header = document.createElement('div');
    header.className = 'viatura-header';
    
    const titulo = document.createElement('h2');
    titulo.textContent = `ÁGUIA ${contadorViaturas}`;
    
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover Viatura';
    btnRemover.className = 'btn-remover-viatura';
    btnRemover.onclick = () => {
        if (confirm('Deseja remover esta viatura?')) {
            container.removeChild(section);
            atualizarNumeracaoViaturas();
        }
    };
    
    header.appendChild(titulo);
    header.appendChild(btnRemover);
    
    const prefixoGroup = document.createElement('div');
    prefixoGroup.className = 'form-group';
    prefixoGroup.innerHTML = `
        <label>Prefixo Viatura:</label>
        <input type="text" class="prefixo-viatura" placeholder="Ex: 15053">
    `;
    
    const militaresDiv = document.createElement('div');
    militaresDiv.className = 'militares-viatura';
    
    const btnAdicionar = document.createElement('button');
    btnAdicionar.textContent = '+ Adicionar Militar';
    btnAdicionar.onclick = () => adicionarMilitarViatura(viaturaId);
    
    const botoesDiv = document.createElement('div');
    botoesDiv.style.marginTop = '10px';
    
    const btnSalvar = document.createElement('button');
    btnSalvar.textContent = 'Salvar Viatura';
    btnSalvar.onclick = () => salvarViatura(viaturaId);
    btnSalvar.style.marginRight = '10px';
    
    const btnLimpar = document.createElement('button');
    btnLimpar.textContent = 'Limpar Viatura';
    btnLimpar.onclick = () => limparViatura(viaturaId);
    
    botoesDiv.appendChild(btnSalvar);
    botoesDiv.appendChild(btnLimpar);
    
    section.appendChild(header);
    section.appendChild(prefixoGroup);
    section.appendChild(militaresDiv);
    section.appendChild(btnAdicionar);
    section.appendChild(botoesDiv);
    
    container.appendChild(section);
    
    // Tentar carregar dados salvos
    const dadosSalvos = localStorage.getItem(`viatura_${viaturaId}`);
    if (dadosSalvos) {
        carregarViatura(viaturaId);
    } else {
        // Adicionar alguns militares iniciais
        for (let i = 0; i < 3; i++) {
            adicionarMilitarViatura(viaturaId);
        }
    }
}

function atualizarNumeracaoViaturas() {
    const viaturas = document.querySelectorAll('.viatura-section');
    viaturas.forEach((viatura, index) => {
        const titulo = viatura.querySelector('h2');
        titulo.textContent = `ÁGUIA ${index + 1}`;
    });
    contadorViaturas = viaturas.length;
}

function adicionarMilitarViatura(viaturaId) {
    const viatura = document.getElementById(viaturaId);
    const container = viatura.querySelector('.militares-viatura');
    
    const div = document.createElement('div');
    div.className = 'militar-item';
    
    const alocados = obterMilitaresAlocados();
    const militaresCadastrados = carregarMilitares();
    
    const selectMilitar = document.createElement('select');
    selectMilitar.innerHTML = '<option value="">Selecione</option>';
    militaresCadastrados.forEach(m => {
        const key = `${m.nome}|${m.id}`;
        if (!alocados.has(key)) {
            selectMilitar.innerHTML += `<option value="${m.grad}|${m.nome}|${m.id}|${m.num}">${m.grad} ${m.nome}</option>`;
        }
    });
    
    const inputGrad = document.createElement('input');
    inputGrad.placeholder = 'GRAD';
    inputGrad.className = 'grad';
    
    const inputNome = document.createElement('input');
    inputNome.placeholder = 'NOME';
    inputNome.className = 'nome';
    
    const inputId = document.createElement('input');
    inputId.placeholder = 'ID FUNC';
    inputId.className = 'idfunc';
    
    const inputNum = document.createElement('input');
    inputNum.type = 'hidden';
    inputNum.className = 'num-antiguidade';
    
    const selectFuncao = document.createElement('select');
    selectFuncao.className = 'funcao';
    selectFuncao.innerHTML = '<option value="">Função</option>';
    
    selectMilitar.onchange = function() {
        if(this.value) {
            const [grad, nome, idfunc, num] = this.value.split('|');
            inputGrad.value = grad;
            inputNome.value = nome;
            inputId.value = idfunc;
            inputNum.value = num;
            atualizarSelectsMilitares();
            atualizarFuncoesViatura(viaturaId);
            atualizarMilitaresDisponiveis();
        }
    };
    
    selectFuncao.onchange = () => atualizarFuncoesViatura(viaturaId);
    
    inputNome.onchange = () => {
        atualizarSelectsMilitares();
        atualizarMilitaresDisponiveis();
    };
    inputId.onchange = () => {
        atualizarSelectsMilitares();
        atualizarMilitaresDisponiveis();
    };
    
    // Campos de horário personalizado (ocultos inicialmente)
    const inputHoraInicial = document.createElement('input');
    inputHoraInicial.type = 'time';
    inputHoraInicial.className = 'hora-inicial-custom';
    inputHoraInicial.style.display = 'none';
    
    const inputHoraFinal = document.createElement('input');
    inputHoraFinal.type = 'time';
    inputHoraFinal.className = 'hora-final-custom';
    inputHoraFinal.style.display = 'none';
    
    const inputHorarioCustom = document.createElement('input');
    inputHorarioCustom.type = 'hidden';
    inputHorarioCustom.className = 'horario-custom-flag';
    inputHorarioCustom.value = 'false';
    
    const btnEditarHorario = document.createElement('button');
    btnEditarHorario.innerHTML = '🕐';
    btnEditarHorario.title = 'Editar horário';
    btnEditarHorario.className = 'btn-editar-horario';
    btnEditarHorario.onclick = async () => {
        const isCustom = inputHorarioCustom.value === 'true';
        const horaInicialGeral = document.getElementById('horaInicial').value;
        const horaFinalGeral = document.getElementById('horaFinal').value;
        const horaInicialAtual = inputHoraInicial.value || horaInicialGeral;
        const horaFinalAtual = inputHoraFinal.value || horaFinalGeral;
        const nomeAtual = inputNome.value || 'este militar';
        
        const result = await Swal.fire({
            title: `Horário Personalizado - ${nomeAtual}`,
            html: `
                <div style="text-align: left; padding: 10px;">
                    <p style="margin-bottom: 15px; color: var(--text-secondary); font-size: 14px;">
                        ${isCustom ? '⚠️ Horário personalizado está <strong>ATIVO</strong>' : 'ℹ️ Usando horário padrão da escala'}
                    </p>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-primary);">Horário Inicial:</label>
                        <input type="time" id="swal-hora-inicial" value="${horaInicialAtual}" 
                               style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-tertiary); color: var(--text-primary); font-size: 14px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-primary);">Horário Final:</label>
                        <input type="time" id="swal-hora-final" value="${horaFinalAtual}" 
                               style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-tertiary); color: var(--text-primary); font-size: 14px;">
                    </div>
                    <div style="padding: 12px; background: rgba(6, 182, 212, 0.1); border-left: 3px solid var(--accent-primary); border-radius: 4px; margin-top: 15px;">
                        <small style="color: var(--text-secondary);">
                            💡 <strong>Dica:</strong> Deixe os campos vazios para usar o horário padrão da escala (${horaInicialGeral} - ${horaFinalGeral})
                        </small>
                    </div>
                </div>
            `,
            showCancelButton: true,
            showDenyButton: isCustom,
            confirmButtonText: 'Aplicar Horário',
            denyButtonText: 'Remover Personalização',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'var(--accent-primary)',
            denyButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--text-muted)',
            width: '500px',
            didOpen: () => {
                document.getElementById('swal-hora-inicial').focus();
            },
            preConfirm: () => {
                const horaInicial = document.getElementById('swal-hora-inicial').value;
                const horaFinal = document.getElementById('swal-hora-final').value;
                
                if (!horaInicial || !horaFinal) {
                    Swal.showValidationMessage('Por favor, preencha ambos os horários');
                    return false;
                }
                
                return { horaInicial, horaFinal };
            }
        });
        
        if (result.isConfirmed && result.value) {
            // Aplicar horário personalizado
            inputHorarioCustom.value = 'true';
            inputHoraInicial.value = result.value.horaInicial;
            inputHoraFinal.value = result.value.horaFinal;
            inputHoraInicial.style.display = 'block';
            inputHoraFinal.style.display = 'block';
            btnEditarHorario.style.background = 'var(--warning)';
            btnEditarHorario.innerHTML = '🕐✓';
            btnEditarHorario.title = `Horário personalizado: ${result.value.horaInicial} - ${result.value.horaFinal}`;
            
            Swal.fire({
                icon: 'success',
                title: 'Horário Aplicado!',
                text: `${result.value.horaInicial} - ${result.value.horaFinal}`,
                timer: 2000,
                showConfirmButton: false
            });
        } else if (result.isDenied) {
            // Remover personalização
            inputHorarioCustom.value = 'false';
            inputHoraInicial.style.display = 'none';
            inputHoraFinal.style.display = 'none';
            inputHoraInicial.value = '';
            inputHoraFinal.value = '';
            btnEditarHorario.style.background = 'var(--info)';
            btnEditarHorario.innerHTML = '🕐';
            btnEditarHorario.title = 'Editar horário';
            
            Swal.fire({
                icon: 'info',
                title: 'Personalização Removida',
                text: 'Usando horário padrão da escala',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };
    
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = () => {
        container.removeChild(div);
        atualizarSelectsMilitares();
        atualizarFuncoesViatura(viaturaId);
        atualizarMilitaresDisponiveis();
    };
    
    div.appendChild(selectMilitar);
    div.appendChild(inputGrad);
    div.appendChild(inputNome);
    div.appendChild(inputId);
    div.appendChild(inputNum);
    div.appendChild(selectFuncao);
    div.appendChild(inputHoraInicial);
    div.appendChild(inputHoraFinal);
    div.appendChild(inputHorarioCustom);
    div.appendChild(btnEditarHorario);
    div.appendChild(btnRemover);
    
    container.appendChild(div);
}

function adicionarMilitarIndisponivel(tipo) {
    const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    
    const div = document.createElement('div');
    div.className = 'militar-item-indisponivel';
    
    const alocados = obterMilitaresAlocados();
    const militaresCadastrados = carregarMilitares();
    
    const selectMilitar = document.createElement('select');
    selectMilitar.innerHTML = '<option value="">Selecione</option>';
    militaresCadastrados.forEach(m => {
        const key = `${m.nome}|${m.id}`;
        if (!alocados.has(key)) {
            selectMilitar.innerHTML += `<option value="${m.grad}|${m.nome}|${m.id}">${m.grad} ${m.nome}</option>`;
        }
    });
    
    const inputGrad = document.createElement('input');
    inputGrad.placeholder = 'GRAD';
    inputGrad.className = 'grad';
    
    const inputNome = document.createElement('input');
    inputNome.placeholder = 'NOME';
    inputNome.className = 'nome';
    
    const inputId = document.createElement('input');
    inputId.placeholder = 'ID FUNC';
    inputId.className = 'idfunc';
    
    selectMilitar.onchange = function() {
        if(this.value) {
            const [grad, nome, idfunc] = this.value.split('|');
            inputGrad.value = grad;
            inputNome.value = nome;
            inputId.value = idfunc;
            atualizarSelectsMilitares();
            atualizarMilitaresDisponiveis();
        }
    };
    
    inputNome.onchange = () => {
        atualizarSelectsMilitares();
        atualizarMilitaresDisponiveis();
    };
    inputId.onchange = () => {
        atualizarSelectsMilitares();
        atualizarMilitaresDisponiveis();
    };
    
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = () => {
        container.removeChild(div);
        atualizarSelectsMilitares();
        atualizarMilitaresDisponiveis();
    };
    
    div.appendChild(selectMilitar);
    div.appendChild(inputGrad);
    div.appendChild(inputNome);
    div.appendChild(inputId);
    
    // Adicionar campo motivo apenas para férias, lts e adido (não para folga)
    if (tipo !== 'folga') {
        const inputMotivo = document.createElement('input');
        inputMotivo.placeholder = 'Motivo/Observação';
        inputMotivo.className = 'motivo';
        div.appendChild(inputMotivo);
    }
    
    div.appendChild(btnRemover);
    
    container.appendChild(div);
}

function atualizarSelectsMilitares() {
    const alocados = obterMilitaresAlocados();
    const militaresCadastrados = carregarMilitares();
    
    // Atualizar selects nas viaturas (apenas o select de militar, não o de função)
    document.querySelectorAll('.viatura-section .militar-item').forEach(item => {
        const select = item.querySelector('select:first-child');
        if (select) {
            const valorAtual = select.value;
            select.innerHTML = '<option value="">Selecione</option>';
            
            militaresCadastrados.forEach(m => {
                const key = `${m.nome}|${m.id}`;
                const valor = `${m.grad}|${m.nome}|${m.id}|${m.num}`;
                const valorAtualSemNum = valorAtual.split('|').slice(0, 3).join('|');
                const valorSemNum = `${m.grad}|${m.nome}|${m.id}`;
                if (!alocados.has(key) || valorSemNum === valorAtualSemNum) {
                    select.innerHTML += `<option value="${valor}" ${valorSemNum === valorAtualSemNum ? 'selected' : ''}>${m.grad} ${m.nome}</option>`;
                }
            });
        }
    });
    
    // Atualizar selects de indisponibilidade
    ['folga', 'ferias', 'le', 'ltip', 'lts', 'adido', 'rsp'].forEach(tipo => {
        const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (container) {
            container.querySelectorAll('.militar-item-indisponivel select').forEach(select => {
                const valorAtual = select.value;
                select.innerHTML = '<option value="">Selecione</option>';
                
                militaresCadastrados.forEach(m => {
                    const key = `${m.nome}|${m.id}`;
                    const valor = `${m.grad}|${m.nome}|${m.id}`;
                    if (!alocados.has(key) || valor === valorAtual) {
                        select.innerHTML += `<option value="${valor}" ${valor === valorAtual ? 'selected' : ''}>${m.grad} ${m.nome}</option>`;
                    }
                });
            });
        }
    });
}

function atualizarFuncoesViatura(viaturaId) {
    const viatura = document.getElementById(viaturaId);
    const items = Array.from(viatura.querySelectorAll('.militar-item'));
    
    // Coletar militares com número de antiguidade
    const militares = items.map(item => ({
        item: item,
        num: parseInt(item.querySelector('.num-antiguidade')?.value) || 999999,
        nome: item.querySelector('.nome')?.value || '',
        funcaoSelect: item.querySelector('.funcao')
    })).filter(m => m.nome);
    
    // Ordenar por antiguidade
    militares.sort((a, b) => a.num - b.num);
    
    const totalMilitares = militares.length;
    
    // Atualizar os selects de função e atribuir automaticamente
    militares.forEach((militar, idx) => {
        const select = militar.funcaoSelect;
        
        // Limpar e adicionar opção vazia
        select.innerHTML = '<option value="">Função</option>';
        
        // Adicionar todas as funções
        funcoes.forEach(f => {
            select.innerHTML += `<option value="${f}">${f}</option>`;
        });
        
        // Atribuir função automaticamente baseado na posição
        let funcaoSugerida = null;
        
        if (idx === 0) {
            // 1º mais antigo: CMDT DE EQUIPE
            funcaoSugerida = 'CMDT DE EQUIPE';
        } else if (idx === totalMilitares - 2 && totalMilitares >= 2) {
            // Penúltimo: MOTORISTA
            funcaoSugerida = 'MOTORISTA';
        } else if (idx === 1) {
            // 2º mais antigo: SEGURANÇA
            funcaoSugerida = 'SEGURANÇA';
        } else if (idx === 2 && totalMilitares >= 5) {
            // 3º mais antigo (se houver 5 ou mais): ANOTADOR
            funcaoSugerida = 'ANOTADOR';
        } else if (idx === totalMilitares - 1) {
            // Último
            if (totalMilitares >= 5) {
                // Se houver 5 ou mais: ESTAGIÁRIO
                funcaoSugerida = 'ESTAGIÁRIO';
            } else if (totalMilitares === 4) {
                // Se houver 4: ANOTADOR
                funcaoSugerida = 'ANOTADOR';
            }
        }
        
        if (funcaoSugerida) {
            select.value = funcaoSugerida;
        }
    });
    
    // Reorganizar visualmente na ordem correta
    const container = viatura.querySelector('.militares-viatura');
    const ordemVisual = [];
    
    // Definir ordem visual: CMDT, MOTORISTA, SEGURANÇA, ANOTADOR, ESTAGIÁRIO
    militares.forEach((militar, idx) => {
        if (idx === 0) {
            // CMDT DE EQUIPE - primeiro
            ordemVisual[0] = militar.item;
        } else if (idx === totalMilitares - 2 && totalMilitares >= 2) {
            // MOTORISTA - segundo
            ordemVisual[1] = militar.item;
        } else if (idx === 1) {
            // SEGURANÇA - terceiro
            ordemVisual[2] = militar.item;
        } else if (idx === 2 && totalMilitares >= 5) {
            // ANOTADOR - quarto
            ordemVisual[3] = militar.item;
        } else if (idx === totalMilitares - 1) {
            // ESTAGIÁRIO/ANOTADOR - último
            ordemVisual[totalMilitares - 1] = militar.item;
        } else {
            // Outros militares
            ordemVisual.push(militar.item);
        }
    });
    
    // Remover nulls e reorganizar no DOM
    ordemVisual.filter(item => item).forEach(item => {
        container.appendChild(item);
    });
}

function coletarDadosViaturas() {
    const viaturas = [];
    
    document.querySelectorAll('.viatura-section').forEach((viatura, index) => {
        const prefixo = viatura.querySelector('.prefixo-viatura').value;
        const militares = [];
        
        viatura.querySelectorAll('.militar-item').forEach(item => {
            const grad = item.querySelector('.grad').value;
            const nome = item.querySelector('.nome').value;
            const idfunc = item.querySelector('.idfunc').value;
            const funcao = item.querySelector('.funcao').value;
            const horarioCustom = item.querySelector('.horario-custom-flag')?.value === 'true';
            const horaInicial = horarioCustom ? item.querySelector('.hora-inicial-custom')?.value : null;
            const horaFinal = horarioCustom ? item.querySelector('.hora-final-custom')?.value : null;
            
            if (grad && nome && idfunc) {
                militares.push({ grad, nome, idfunc, funcao, horarioCustom, horaInicial, horaFinal });
            }
        });
        
        if (militares.length > 0) {
            viaturas.push({ numero: index + 1, prefixo, militares });
        }
    });
    
    return viaturas;
}

function coletarDadosIndisponiveis(tipo) {
    const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    const dados = [];
    
    if (container) {
        container.querySelectorAll('.militar-item-indisponivel').forEach(item => {
            const grad = item.querySelector('.grad').value;
            const nome = item.querySelector('.nome').value;
            const idfunc = item.querySelector('.idfunc').value;
            const motivo = item.querySelector('.motivo')?.value || '';
            
            if (grad && nome && idfunc) {
                dados.push({ grad, nome, idfunc, motivo });
            }
        });
    }
    
    return dados;
}

async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const dataEmissao = document.getElementById('dataEmissao').value;
    const dataEscala = document.getElementById('dataEscala').value;
    const horaInicial = document.getElementById('horaInicial').value;
    const horaFinal = document.getElementById('horaFinal').value;
    
    const viaturas = coletarDadosViaturas();
    const folga = coletarDadosIndisponiveis('folga');
    const ferias = coletarDadosIndisponiveis('ferias');
    const le = coletarDadosIndisponiveis('le');
    const ltip = coletarDadosIndisponiveis('ltip');
    const lts = coletarDadosIndisponiveis('lts');
    const adido = coletarDadosIndisponiveis('adido');
    const rsp = coletarDadosIndisponiveis('rsp');
    
    if (viaturas.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Nenhuma viatura',
            text: 'Adicione pelo menos uma viatura com militares!',
            confirmButtonColor: '#4a90e2'
        });
        return;
    }
    
    // Verificar se há militares disponíveis
    const alocados = obterMilitaresAlocados();
    const militaresCadastrados = carregarMilitares();
    const disponiveis = militaresCadastrados.filter(m => {
        const key = `${m.nome}|${m.id}`;
        return !alocados.has(key);
    });
    
    if (disponiveis.length > 0) {
        const nomes = disponiveis.map(m => `${m.grad} ${m.nome}`).join('<br>');
        const result = await Swal.fire({
            title: 'Militares disponíveis!',
            html: `<p>Existem <strong>${disponiveis.length} militar(es)</strong> disponível(is) sem função:</p><div style="text-align: left; margin: 15px 0; padding: 15px; background: #2a2d3a; border: 1px solid #3a3d4a; border-radius: 4px; border-left: 3px solid #4a90e2;">${nomes}</div><p>Deseja continuar gerando o PDF mesmo assim?</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4a90e2',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, gerar PDF',
            cancelButtonText: 'Cancelar'
        });
        
        if (!result.isConfirmed) {
            return;
        }
    }
    
    // Logo centralizada
    const img = new Image();
    img.src = 'Logo FT PNG sem fundo.png';
    const imgWidth = 60;
    const imgHeight = 35;
    const imgX = (210 - imgWidth) / 2;
    doc.addImage(img, 'PNG', imgX, 8, imgWidth, imgHeight);
    
    // Cabeçalho abaixo da logo
    const config = obterConfiguracoes();
    const batalhao = config.batalhao || '32º BPM';
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text(`FORÇA TÁTICA ${batalhao}`, 105, 48, { align: 'center' });
    
    const dataFormatada = new Date(dataEscala + 'T00:00:00').toLocaleDateString('pt-BR', { 
        day: '2-digit', month: 'long', year: 'numeric' 
    });
    doc.setFontSize(10);
    doc.text(`ESCALA DE SERVIÇO PARA O DIA ${dataFormatada.toUpperCase()}`, 105, 55, { align: 'center' });
    
    let y = 63;
    
    // Cabeçalho da tabela
    doc.setFontSize(9);
    doc.setFont('times', 'bold');
    doc.rect(15, y, 20, 8); doc.text('GRAD', 25, y + 5, { align: 'center' });
    doc.rect(35, y, 40, 8); doc.text('NOME ME', 55, y + 5, { align: 'center' });
    doc.rect(75, y, 25, 8); doc.text('ID. FUNC', 87.5, y + 5, { align: 'center' });
    doc.rect(100, y, 20, 8); doc.text('HORA', 110, y + 3.5, { align: 'center' }); doc.text('INICIAL', 110, y + 6.5, { align: 'center' });
    doc.rect(120, y, 20, 8); doc.text('HORA', 130, y + 3.5, { align: 'center' }); doc.text('FINAL', 130, y + 6.5, { align: 'center' });
    doc.rect(140, y, 25, 8); doc.text('VTR', 152.5, y + 5, { align: 'center' });
    doc.rect(165, y, 30, 8); doc.text('FUNÇÃO', 180, y + 5, { align: 'center' });
    y += 8;
    
    // Viaturas
    viaturas.forEach(viatura => {
        doc.setFont('times', 'bold');
        doc.rect(15, y, 180, 6);
        doc.text(`ÁGUIA ${viatura.numero} - ${viatura.prefixo}`, 105, y + 4, { align: 'center' });
        y += 6;
        
        const alturaEquipe = viatura.militares.length * 6;
        const yInicialVtr = y;
        
        doc.setFont('times', 'normal');
        viatura.militares.forEach((m, idx) => {
            doc.rect(15, y, 20, 6); doc.text(m.grad, 25, y + 4, { align: 'center' });
            doc.rect(35, y, 40, 6); doc.text(m.nome, 37, y + 4);
            doc.rect(75, y, 25, 6); doc.text(m.idfunc, 87.5, y + 4, { align: 'center' });
            
            const horaIni = m.horarioCustom && m.horaInicial ? m.horaInicial : horaInicial;
            const horaFin = m.horarioCustom && m.horaFinal ? m.horaFinal : horaFinal;
            
            doc.rect(100, y, 20, 6); doc.text(horaIni, 110, y + 4, { align: 'center' });
            doc.rect(120, y, 20, 6); doc.text(horaFin, 130, y + 4, { align: 'center' });
            doc.rect(165, y, 30, 6); if(m.funcao) doc.text(m.funcao, 180, y + 4, { align: 'center' });
            y += 6;
        });
        
        doc.rect(140, yInicialVtr, 25, alturaEquipe);
        doc.text(viatura.prefixo, 152.5, yInicialVtr + (alturaEquipe / 2) + 1.5, { align: 'center' });
        
        y += 2;
    });
    
    // Indisponíveis
    const indisponiveis = [
        { titulo: 'INTERVALO DE ESCALA', dados: folga, semMotivo: true },
        { titulo: 'FÉRIAS', dados: ferias, semMotivo: false },
        { titulo: 'LE', dados: le, semMotivo: false },
        { titulo: 'LTIP', dados: ltip, semMotivo: false },
        { titulo: 'LTS', dados: lts, semMotivo: false },
        { titulo: 'ADIDO', dados: adido, semMotivo: false },
        { titulo: 'RSP', dados: rsp, semMotivo: false }
    ].filter(item => item.dados.length > 0); // Filtrar apenas itens com dados
    
    indisponiveis.forEach(item => {
        doc.setFont('times', 'bold');
        doc.rect(15, y, 180, 6);
        doc.setTextColor(255, 0, 0);
        doc.text(item.titulo, 105, y + 4, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        y += 6;
        
        doc.setFont('times', 'normal');
        item.dados.forEach(m => {
            doc.rect(15, y, 20, 6); doc.text(m.grad, 25, y + 4, { align: 'center' });
            doc.rect(35, y, 40, 6); doc.text(m.nome, 37, y + 4);
            doc.rect(75, y, 25, 6); doc.text(m.idfunc, 87.5, y + 4, { align: 'center' });
            
            if (item.semMotivo) {
                // INTERVALO DE ESCALA: sem coluna de motivo
                doc.rect(100, y, 95, 6); doc.text(item.titulo, 147.5, y + 4, { align: 'center' });
            } else {
                // FÉRIAS, LTS, ADIDO: com coluna de motivo
                doc.rect(100, y, 40, 6); doc.text(item.titulo, 120, y + 4, { align: 'center' });
                doc.rect(140, y, 55, 6); if(m.motivo) doc.text(m.motivo, 142, y + 4);
            }
            y += 6;
        });
        y += 2;
    });
    
    // Resumo
    const totalEmpregado = viaturas.reduce((sum, v) => sum + v.militares.length, 0);
    const totalIndisponivel = ferias.length + le.length + ltip.length + lts.length + adido.length + rsp.length;
    const totalDisponivel = folga.length;
    
    y += 4;
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    
    // EFETIVO EXISTENTE
    doc.rect(15, y, 45, 6);
    doc.text('EFETIVO EXISTENTE: ' + (totalEmpregado + totalIndisponivel + totalDisponivel), 37.5, y + 4, { align: 'center' });
    
    // INDISPONÍVEL
    doc.rect(60, y, 45, 6);
    doc.text('INDISPONÍVEL: ' + totalIndisponivel, 82.5, y + 4, { align: 'center' });
    
    // EFETIVO DISPONÍVEL
    doc.rect(105, y, 45, 6);
    doc.text('EFETIVO DISPONÍVEL: ' + totalDisponivel, 127.5, y + 4, { align: 'center' });
    
    // EFETIVO EMPREGADO
    doc.rect(150, y, 45, 6);
    doc.text('EFETIVO EMPREGADO: ' + totalEmpregado, 172.5, y + 4, { align: 'center' });
    
    y += 6;
    
    // Rodapé
    const batalhaoRodape = config.batalhao || '32º BPM';
    let auxiliarPelTexto = 'Aux. Pel. da Força Tática 32BPM';
    let comandanteTexto = `Rep comando da Força Tática do ${batalhaoRodape}`;
    
    if (config.auxiliarPel) {
        const [grad, nomeCompleto] = config.auxiliarPel.split('|');
        auxiliarPelTexto = `${nomeCompleto} – ${grad} PM`;
    }
    
    if (config.comandante) {
        const [grad, nomeCompleto] = config.comandante.split('|');
        comandanteTexto = `${nomeCompleto} – ${grad} PM`;
    }
    
    y += 20;
    doc.setFont('times', 'normal');
    const dataEmissaoFormatada = new Date(dataEmissao + 'T00:00:00').toLocaleDateString('pt-BR', { 
        day: '2-digit', month: 'long', year: 'numeric' 
    });
    doc.text(`Sapiranga, RS, ${dataEmissaoFormatada}`, 195, y, { align: 'right' });
    
    y += 10;
    doc.setFont('times', 'bold');
    doc.text(auxiliarPelTexto, 105, y, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.text('Aux. Pel. da Força Tática 32BPM', 105, y + 5, { align: 'center' });
    
    y += 15;
    doc.text('VISTO EM: ____/____/____', 105, y, { align: 'center' });
    
    y += 10;
    doc.setFont('times', 'bold');
    doc.text(comandanteTexto, 15, y);
    doc.setFont('times', 'normal');
    doc.text('Rep comando da Força Tática do 32º BPM', 15, y + 5);
    
    // Gerar nome do arquivo com data e dia da semana
    const dataObj = new Date(dataEscala + 'T00:00:00');
    const dia = dataObj.getDate();
    const meses = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();
    const diasSemana = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
    const diaSemana = diasSemana[dataObj.getDay()];
    const nomeArquivo = `${dia} DE ${mes} DE ${ano} - ${diaSemana}.pdf`;
    
    doc.save(nomeArquivo);
}

// ========== SALVAR E LIMPAR VIATURAS ==========

function salvarViatura(viaturaId) {
    const viatura = document.getElementById(viaturaId);
    const prefixo = viatura.querySelector('.prefixo-viatura').value;
    const militares = [];
    
    viatura.querySelectorAll('.militar-item').forEach(item => {
        const grad = item.querySelector('.grad').value;
        const nome = item.querySelector('.nome').value;
        const idfunc = item.querySelector('.idfunc').value;
        const funcao = item.querySelector('.funcao').value;
        const num = item.querySelector('.num-antiguidade').value;
        const horarioCustom = item.querySelector('.horario-custom-flag')?.value === 'true';
        const horaInicial = item.querySelector('.hora-inicial-custom')?.value || '';
        const horaFinal = item.querySelector('.hora-final-custom')?.value || '';
        
        if (grad && nome && idfunc) {
            militares.push({ grad, nome, idfunc, funcao, num, horarioCustom, horaInicial, horaFinal });
        }
    });
    
    const dados = { prefixo, militares };
    localStorage.setItem(`viatura_${viaturaId}`, JSON.stringify(dados));
    Swal.fire({
        icon: 'success',
        title: 'Salvo!',
        text: 'Viatura salva com sucesso!',
        timer: 2000,
        showConfirmButton: false
    });
}

function limparViatura(viaturaId) {
    Swal.fire({
        title: 'Confirmar limpeza',
        text: 'Deseja realmente limpar todos os dados desta viatura?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, limpar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem(`viatura_${viaturaId}`);
            const viatura = document.getElementById(viaturaId);
            viatura.querySelector('.prefixo-viatura').value = '';
            viatura.querySelector('.militares-viatura').innerHTML = '';
            for (let i = 0; i < 3; i++) {
                adicionarMilitarViatura(viaturaId);
            }
            Swal.fire({
                icon: 'success',
                title: 'Limpo!',
                text: 'Viatura limpa com sucesso!',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

function carregarViatura(viaturaId) {
    const dados = localStorage.getItem(`viatura_${viaturaId}`);
    if (dados) {
        const { prefixo, militares } = JSON.parse(dados);
        const viatura = document.getElementById(viaturaId);
        
        viatura.querySelector('.prefixo-viatura').value = prefixo;
        viatura.querySelector('.militares-viatura').innerHTML = '';
        
        militares.forEach(m => {
            adicionarMilitarViatura(viaturaId);
            const container = viatura.querySelector('.militares-viatura');
            const items = container.querySelectorAll('.militar-item');
            const ultimoItem = items[items.length - 1];
            
            if (ultimoItem) {
                ultimoItem.querySelector('.grad').value = m.grad;
                ultimoItem.querySelector('.nome').value = m.nome;
                ultimoItem.querySelector('.idfunc').value = m.idfunc;
                ultimoItem.querySelector('.num-antiguidade').value = m.num;
                
                if (m.horarioCustom) {
                    ultimoItem.querySelector('.horario-custom-flag').value = 'true';
                    ultimoItem.querySelector('.hora-inicial-custom').value = m.horaInicial || '';
                    ultimoItem.querySelector('.hora-final-custom').value = m.horaFinal || '';
                    ultimoItem.querySelector('.hora-inicial-custom').style.display = 'block';
                    ultimoItem.querySelector('.hora-final-custom').style.display = 'block';
                    const btnEditar = ultimoItem.querySelector('.btn-editar-horario');
                    if (btnEditar) {
                        btnEditar.style.background = 'var(--warning)';
                        btnEditar.title = 'Horário personalizado ativo';
                    }
                }
            }
        });
        
        atualizarSelectsMilitares();
        atualizarFuncoesViatura(viaturaId);
        
        // Restaurar as funções salvas após atualizar
        militares.forEach((m, index) => {
            const container = viatura.querySelector('.militares-viatura');
            const items = container.querySelectorAll('.militar-item');
            if (items[index] && m.funcao) {
                items[index].querySelector('.funcao').value = m.funcao;
            }
        });
    }
}

function limparDadosDoDia() {
    Swal.fire({
        title: 'Limpar dados do dia?',
        text: 'Deseja realmente limpar TODOS os dados do dia (Viaturas e Intervalo de Escala)?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, limpar tudo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpar viaturas
            document.querySelectorAll('.viatura-section').forEach(viatura => {
                const viaturaId = viatura.id;
                localStorage.removeItem(`viatura_${viaturaId}`);
            });
            
            // Limpar intervalo de escala
            localStorage.removeItem('indisponiveis_folga');
            
            // Recarregar página para resetar interface
            location.reload();
        }
    });
}

// ========== SALVAR E LIMPAR INDISPONÍVEIS ==========

function adicionarRestantesFolga() {
    const militaresCadastrados = carregarMilitares();
    militaresCadastrados.sort((a, b) => a.num - b.num);
    
    const alocados = obterMilitaresAlocados();
    
    const militaresRestantes = militaresCadastrados.filter(m => {
        const key = `${m.nome}|${m.id}`;
        return !alocados.has(key);
    });
    
    if (militaresRestantes.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Todos alocados',
            text: 'Todos os militares já estão alocados!',
            confirmButtonColor: '#4a90e2'
        });
        return;
    }
    
    militaresRestantes.forEach(m => {
        adicionarMilitarIndisponivel('folga');
        const container = document.getElementById('militaresFolga');
        const items = container.querySelectorAll('.militar-item-indisponivel');
        const ultimoItem = items[items.length - 1];
        
        if (ultimoItem) {
            ultimoItem.querySelector('.grad').value = m.grad;
            ultimoItem.querySelector('.nome').value = m.nome;
            ultimoItem.querySelector('.idfunc').value = m.id;
        }
    });
    
    atualizarSelectsMilitares();
    Swal.fire({
        icon: 'success',
        title: 'Adicionados!',
        text: `${militaresRestantes.length} militar(es) adicionado(s) à folga por ordem de antiguidade!`,
        timer: 2000,
        showConfirmButton: false
    });
}

function salvarIndisponiveis(tipo) {
    const dados = coletarDadosIndisponiveis(tipo);
    localStorage.setItem(`indisponiveis_${tipo}`, JSON.stringify(dados));
    const nomes = { folga: 'INTERVALO DE ESCALA', ferias: 'FÉRIAS', le: 'LE', ltip: 'LTIP', lts: 'LTS', adido: 'ADIDO', rsp: 'RSP' };
    Swal.fire({
        icon: 'success',
        title: 'Salvo!',
        text: `${nomes[tipo]} salvo com sucesso!`,
        timer: 2000,
        showConfirmButton: false
    });
}

function limparIndisponiveis(tipo) {
    const nomes = { folga: 'INTERVALO DE ESCALA', ferias: 'FÉRIAS', le: 'LE', ltip: 'LTIP', lts: 'LTS', adido: 'ADIDO', rsp: 'RSP' };
    Swal.fire({
        title: 'Confirmar limpeza',
        text: `Deseja realmente limpar todos os dados de ${nomes[tipo]}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, limpar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem(`indisponiveis_${tipo}`);
            const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
            if (container) {
                container.innerHTML = '';
            }
            atualizarSelectsMilitares();
            Swal.fire({
                icon: 'success',
                title: 'Limpo!',
                text: `${nomes[tipo]} limpo com sucesso!`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

function carregarIndisponiveis(tipo) {
    const dados = localStorage.getItem(`indisponiveis_${tipo}`);
    if (dados) {
        const militares = JSON.parse(dados);
        militares.forEach(m => {
            adicionarMilitarIndisponivel(tipo);
            const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
            const items = container.querySelectorAll('.militar-item-indisponivel');
            const ultimoItem = items[items.length - 1];
            
            if (ultimoItem) {
                ultimoItem.querySelector('.grad').value = m.grad;
                ultimoItem.querySelector('.nome').value = m.nome;
                ultimoItem.querySelector('.idfunc').value = m.idfunc;
                if (m.motivo && ultimoItem.querySelector('.motivo')) {
                    ultimoItem.querySelector('.motivo').value = m.motivo;
                }
            }
        });
    }
}

// ========== INICIALIZAÇÃO ==========

function mostrarAba(tipo) {
    // Remover classe active de todos os botões e conteúdos
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar classe active no botão e conteúdo selecionado
    event.target.classList.add('active');
    document.getElementById(`tab-${tipo}`).classList.add('active');
}

function migrarDadosAntigos() {
    const militares = carregarMilitares();
    let atualizado = false;
    
    militares.forEach(m => {
        if (!m.nomeCompleto) {
            m.nomeCompleto = m.nome;
            atualizado = true;
        }
    });
    
    if (atualizado) {
        salvarMilitares(militares);
    }
}

window.onload = function() {
    migrarDadosAntigos();
    
    if (!localStorage.getItem('militares')) {
        salvarMilitares(carregarMilitares());
    }
    
    document.getElementById('dataEmissao').valueAsDate = new Date();
    document.getElementById('dataEscala').valueAsDate = new Date();
    
    // Adicionar primeira viatura
    adicionarViatura();
    
    // Carregar dados salvos de folga
    carregarIndisponiveis('folga');
    
    // Carregar dados salvos de férias, lts, adido e rsp
    carregarIndisponiveis('ferias');
    carregarIndisponiveis('le');
    carregarIndisponiveis('ltip');
    carregarIndisponiveis('lts');
    carregarIndisponiveis('adido');
    carregarIndisponiveis('rsp');
    
    renderizarTabela();
    atualizarMilitaresDisponiveis();
};
