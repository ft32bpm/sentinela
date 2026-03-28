// ========== GERENCIAMENTO DE MILITARES (CADASTRO) ==========

function carregarMilitares() {
    const militares = localStorage.getItem('militares');
    return militares ? JSON.parse(militares) : [];
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
        tr.draggable = true;
        tr.dataset.index = index;
        tr.innerHTML = `
            <td style="cursor:move;"><strong>${militar.num}</strong></td>
            <td>${militar.grad}</td>
            <td>${militar.nome}</td>
            <td>${militar.nomeCompleto || militar.nome}</td>
            <td>${militar.id}</td>
            <td style="display:flex;gap:6px;">
                <button class="btn-action btn-warning" onclick="editarMilitar(${index})" title="Editar"><i data-lucide="pencil"></i></button>
                <button class="btn-action btn-danger" onclick="excluirMilitar(${index})" title="Excluir"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        
        tr.addEventListener('dragstart', handleDragStart);
        tr.addEventListener('dragover', handleDragOver);
        tr.addEventListener('drop', handleDrop);
        tr.addEventListener('dragend', handleDragEnd);
        
        tbody.appendChild(tr);
        lucide.createIcons({ nodes: [tr] });
    });
}

let draggedRow = null;

function handleDragStart(e) {
    draggedRow = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();
    
    if (draggedRow !== this) {
        const militares = carregarMilitares();
        militares.sort((a, b) => a.num - b.num);
        
        const fromIndex = parseInt(draggedRow.dataset.index);
        const toIndex = parseInt(this.dataset.index);
        
        const [movedItem] = militares.splice(fromIndex, 1);
        militares.splice(toIndex, 0, movedItem);
        
        militares.forEach((m, i) => m.num = i + 1);
        salvarMilitares(militares);
        renderizarTabela();
        atualizarSelectsMilitares();
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function adicionarMilitarCadastro() {
    const grad = document.getElementById('gradCadastro').value.trim();
    const nome = document.getElementById('nomeCadastro').value.trim().toUpperCase();
    const nomeCompleto = document.getElementById('nomeCompletoCadastro').value.trim().toUpperCase();
    const id = document.getElementById('idfuncCadastro').value.trim();
    
    if (!grad || !nome || !id) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Preencha os campos obrigatórios: Graduação, Nome e ID Funcional!',
            confirmButtonColor: '#4a90e2'
        });
        return;
    }
    
    const militares = carregarMilitares();
    const num = militares.length > 0 ? Math.max(...militares.map(m => m.num)) + 1 : 1;
    
    militares.push({ num, grad, nome, nomeCompleto: nomeCompleto || nome, id });
    salvarMilitares(militares);
    
    document.getElementById('gradCadastro').value = '';
    document.getElementById('nomeCadastro').value = '';
    document.getElementById('nomeCompletoCadastro').value = '';
    document.getElementById('idfuncCadastro').value = '';
    
    renderizarTabela();
    
    Swal.fire({
        icon: 'success',
        title: 'Adicionado!',
        text: 'Militar cadastrado com sucesso!',
        timer: 2000,
        showConfirmButton: false
    });
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

async function editarMilitar(index) {
    const militares = carregarMilitares();
    militares.sort((a, b) => a.num - b.num);
    const militar = militares[index];
    
    const result = await Swal.fire({
        title: 'Editar Militar',
        html: `
            <div style="text-align: left; padding: 10px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Graduação *</label>
                    <input type="text" id="edit-grad" value="${militar.grad}" class="swal2-input" style="margin: 0; width: 100%;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nome (Nome de Guerra) *</label>
                    <input type="text" id="edit-nome" value="${militar.nome}" class="swal2-input" style="margin: 0; width: 100%;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nome Completo</label>
                    <input type="text" id="edit-nomeCompleto" value="${militar.nomeCompleto || ''}" class="swal2-input" style="margin: 0; width: 100%;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">ID Funcional *</label>
                    <input type="text" id="edit-id" value="${militar.id}" class="swal2-input" style="margin: 0; width: 100%;">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#4a90e2',
        preConfirm: () => {
            const grad = document.getElementById('edit-grad').value.trim();
            const nome = document.getElementById('edit-nome').value.trim().toUpperCase();
            const nomeCompleto = document.getElementById('edit-nomeCompleto').value.trim().toUpperCase();
            const id = document.getElementById('edit-id').value.trim();
            
            if (!grad || !nome || !id) {
                Swal.showValidationMessage('Preencha os campos obrigatórios!');
                return false;
            }
            
            return { grad, nome, nomeCompleto: nomeCompleto || nome, id };
        }
    });
    
    if (result.isConfirmed && result.value) {
        const militaresOriginais = carregarMilitares();
        const indexOriginal = militaresOriginais.findIndex(m => 
            m.num === militar.num && m.nome === militar.nome
        );
        
        militaresOriginais[indexOriginal] = { 
            num: militar.num,
            grad: result.value.grad, 
            nome: result.value.nome,
            nomeCompleto: result.value.nomeCompleto,
            id: result.value.id 
        };
        salvarMilitares(militaresOriginais);
        renderizarTabela();
        
        Swal.fire({
            icon: 'success',
            title: 'Atualizado!',
            text: 'Militar atualizado com sucesso!',
            timer: 2000,
            showConfirmButton: false
        });
    }
}

function resetarDados() {
    Swal.fire({
        title: 'Limpar todos os militares?',
        text: 'Deseja realmente excluir TODOS os militares cadastrados? Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, limpar tudo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('militares');
            salvarMilitares([]);
            renderizarTabela();
            Swal.fire({
                icon: 'success',
                title: 'Limpo!',
                text: 'Todos os militares foram removidos!',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// ========== GERAÇÃO DE ESCALA ==========

// ========== NOTAS DE ATUALIZAÇÕES ==========

async function mostrarNotasAtualizacoes() {
    // Mostrar popup de loading
    Swal.fire({
        title: '<i data-lucide="file-text"></i> Notas de Atualizações',
        html: '<div class="loading-popup"><i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i><br><br>Carregando atualizações do GitHub...</div>',
        showConfirmButton: false,
        allowOutsideClick: false,
        width: '700px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
        color: 'var(--text-primary)',
        didOpen: () => {
            lucide.createIcons();
        }
    });
    
    try {
        const response = await fetch('https://api.github.com/repos/ft32bpm/sentinela/releases');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const releases = await response.json();
        
        if (releases.length === 0) {
            Swal.fire({
                title: '<i data-lucide="file-text"></i> Notas de Atualizações',
                html: '<div class="empty-popup"><i data-lucide="inbox"></i><br><br>Nenhuma atualização encontrada</div>',
                confirmButtonText: 'Fechar',
                confirmButtonColor: 'var(--accent-primary)',
                width: '700px',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                color: 'var(--text-primary)',
                didOpen: () => {
                    lucide.createIcons();
                }
            });
            return;
        }
        
        let htmlContent = '<div class="notas-popup-container">';
        
        // Buscar dados do commit para cada release
        const releasesComCommit = await Promise.all(
            releases.slice(0, 8).map(async (release) => {
                try {
                    // Buscar dados do commit associado à tag da release
                    const commitResponse = await fetch(`https://api.github.com/repos/ft32bpm/sentinela/git/refs/tags/${release.tag_name}`);
                    if (commitResponse.ok) {
                        const tagData = await commitResponse.json();
                        const commitSha = tagData.object.sha;
                        
                        // Buscar detalhes do commit
                        const commitDetailResponse = await fetch(`https://api.github.com/repos/ft32bpm/sentinela/git/commits/${commitSha}`);
                        if (commitDetailResponse.ok) {
                            const commitDetail = await commitDetailResponse.json();
                            return {
                                ...release,
                                commitDate: commitDetail.author.date
                            };
                        }
                    }
                } catch (error) {
                    console.warn(`Não foi possível buscar commit para ${release.tag_name}:`, error);
                }
                // Fallback para a data de publicação da release
                return {
                    ...release,
                    commitDate: release.published_at
                };
            })
        );
        
        releasesComCommit.forEach((release, index) => {
            const data = new Date(release.commitDate);
            const dataFormatada = data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const versao = release.name || release.tag_name;
            const descricao = release.body || 'Sem descrição detalhada';
            
            // Usar ícones do Lucide baseado no índice
            const icones = [
                'zap',        // Raio - para atualizações importantes
                'star',       // Estrela - para novos recursos
                'rocket',     // Foguete - para melhorias de performance
                'shield',     // Escudo - para correções de segurança
                'wrench',     // Chave - para correções de bugs
                'sparkles',   // Brilho - para melhorias visuais
                'code',       // Código - para refatorações
                'plus-circle' // Plus - para adições gerais
            ];
            const icone = icones[index] || 'git-commit';
            
            htmlContent += `
                <div class="nota-popup-item">
                    <div class="nota-popup-header">
                        <div class="nota-popup-versao"><i data-lucide="${icone}"></i> ${versao}</div>
                        <div class="nota-popup-data"><i data-lucide="calendar"></i> ${dataFormatada}</div>
                    </div>
                    <div class="nota-popup-descricao">${descricao}</div>
                </div>
            `;
        });
        
        htmlContent += '</div>';
        
        // Mostrar popup com as notas
        Swal.fire({
            title: `<i data-lucide="file-text"></i> Notas de Atualizações <span style="font-size: 14px; color: var(--text-muted); font-weight: normal;">(${releasesComCommit.length} mais recentes)</span>`,
            html: htmlContent,
            confirmButtonText: '<i data-lucide="refresh-cw"></i> Atualizar Lista',
            showCancelButton: true,
            cancelButtonText: '<i data-lucide="x"></i> Fechar',
            confirmButtonColor: 'var(--accent-primary)',
            cancelButtonColor: 'var(--text-muted)',
            width: '700px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
            color: 'var(--text-primary)',
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            },
            didOpen: () => {
                lucide.createIcons();
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Recarregar as notas
                mostrarNotasAtualizacoes();
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar releases:', error);
        
        Swal.fire({
            title: '<i data-lucide="alert-triangle"></i> Erro ao Carregar',
            html: `
                <div class="error-popup">
                    <i data-lucide="wifi-off" style="width: 48px; height: 48px; margin-bottom: 16px;"></i><br>
                    Não foi possível carregar as atualizações<br><br>
                    <small style="color: var(--text-muted);">
                        <i data-lucide="globe"></i> Verifique sua conexão com a internet<br>
                        <i data-lucide="clock"></i> Tente novamente em alguns instantes
                    </small>
                </div>
            `,
            confirmButtonText: '<i data-lucide="refresh-cw"></i> Tentar Novamente',
            showCancelButton: true,
            cancelButtonText: '<i data-lucide="x"></i> Fechar',
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--text-muted)',
            width: '500px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
            color: 'var(--text-primary)',
            didOpen: () => {
                lucide.createIcons();
            }
        }).then((result) => {
            if (result.isConfirmed) {
                mostrarNotasAtualizacoes();
            }
        });
    }
}

// Função auxiliar para animação de loading (CSS keyframes)
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

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
    
    const textoAssinaturaInput = document.getElementById('textoAssinaturaInput');
    if (config.textoAssinatura !== undefined) {
        textoAssinaturaInput.value = config.textoAssinatura;
    }
    
    // Carregar logo selecionada
    const logoSelecionada = config.logoSelecionada || 'ft';
    atualizarPreviewLogo(logoSelecionada);
    
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
    const textoAssinatura = document.getElementById('textoAssinaturaInput').value.trim();
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
    
    const logoSelecionada = obterLogoAtual();
    const config = { batalhao, textoAssinatura, comandante, auxiliarPel, logoSelecionada };
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

// ========== SELETOR DE LOGO ==========

function trocarLogo(direcao) {
    const logoAtual = obterLogoAtual();
    const novaLogo = direcao === 'direita' ? 'ft' : 'bm';
    
    if (logoAtual === novaLogo) return;
    
    atualizarPreviewLogo(novaLogo);
}

function obterLogoAtual() {
    const preview = document.getElementById('logoPreview');
    if (!preview || !preview.src) return 'ft';
    // Verificar se contém "FT" no nome do arquivo
    return preview.src.toUpperCase().includes('FT') ? 'ft' : 'bm';
}

function atualizarPreviewLogo(tipo) {
    const preview = document.getElementById('logoPreview');
    const nome = document.getElementById('logoNome');
    
    if (!preview || !nome) return;
    
    preview.style.opacity = '0';
    nome.style.opacity = '0';
    
    setTimeout(() => {
        if (tipo === 'ft') {
            preview.src = 'Logo FT PNG sem fundo.png';
            nome.textContent = 'Força Tática';
        } else {
            preview.src = 'Logo BM PNG sem fundo.png';
            nome.textContent = 'Brigada Militar';
        }
        preview.style.opacity = '1';
        nome.style.opacity = '1';
    }, 200);
}

// ========== EXPORTAR DADOS ==========

function exportarDados() {
    const config = obterConfiguracoes();
    const logoSelecionada = config.logoSelecionada || 'ft';
    const logoTexto = logoSelecionada === 'ft' ? 'Força Tática' : 'Brigada Militar';
    
    const dados = {
        _info: {
            sistema: 'Sentinela - Sistema de Escala de Serviço',
            versao: '1.0',
            dataExportacao: new Date().toISOString(),
            logoSelecionada: logoTexto
        },
        militares: localStorage.getItem('militares'),
        configuracoes: localStorage.getItem('configuracoes'),
        indisponiveis: {
            folga: localStorage.getItem('indisponiveis_folga'),
            ferias: localStorage.getItem('indisponiveis_ferias'),
            le: localStorage.getItem('indisponiveis_le'),
            ltip: localStorage.getItem('indisponiveis_ltip'),
            lts: localStorage.getItem('indisponiveis_lts'),
            adido: localStorage.getItem('indisponiveis_adido'),
            rsp: localStorage.getItem('indisponiveis_rsp')
        }
    };
    
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const horaFormatada = dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
    const nomeArquivo = `sentinela-backup-${dataFormatada}-${horaFormatada}.json`;
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
    
    Swal.fire({
        icon: 'success',
        title: 'Exportado!',
        text: 'Dados exportados com sucesso!',
        timer: 2000,
        showConfirmButton: false
    });
}

function importarDados(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            
            Swal.fire({
                title: 'Importar dados?',
                html: 'Deseja realmente importar os dados? <br><strong style="color: #e74c3c;">Isso substituirá todos os dados atuais!</strong>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4a90e2',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sim, importar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (dados.militares) localStorage.setItem('militares', dados.militares);
                    if (dados.configuracoes) localStorage.setItem('configuracoes', dados.configuracoes);
                    
                    if (dados.indisponiveis) {
                        if (dados.indisponiveis.folga) localStorage.setItem('indisponiveis_folga', dados.indisponiveis.folga);
                        if (dados.indisponiveis.ferias) localStorage.setItem('indisponiveis_ferias', dados.indisponiveis.ferias);
                        if (dados.indisponiveis.le) localStorage.setItem('indisponiveis_le', dados.indisponiveis.le);
                        if (dados.indisponiveis.ltip) localStorage.setItem('indisponiveis_ltip', dados.indisponiveis.ltip);
                        if (dados.indisponiveis.lts) localStorage.setItem('indisponiveis_lts', dados.indisponiveis.lts);
                        if (dados.indisponiveis.adido) localStorage.setItem('indisponiveis_adido', dados.indisponiveis.adido);
                        if (dados.indisponiveis.rsp) localStorage.setItem('indisponiveis_rsp', dados.indisponiveis.rsp);
                    }
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Importado!',
                        text: 'Dados importados com sucesso! A página será recarregada.',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload();
                    });
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Arquivo inválido ou corrompido!',
                confirmButtonColor: '#d9534f'
            });
        }
    };
    
    reader.readAsText(arquivo);
    event.target.value = '';
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
    const countToggle = document.getElementById('count-toggle');
    if (countToggle) countToggle.textContent = `(${disponiveis.length})`;
    
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
    
    const indicatorViatura = document.createElement('span');
    indicatorViatura.className = 'save-indicator';
    titulo.appendChild(indicatorViatura);
    
    const btnRemover = document.createElement('button');
    btnRemover.innerHTML = '<i data-lucide="x"></i>';
    btnRemover.title = 'Remover Viatura';
    btnRemover.className = 'btn-action btn-danger';
    btnRemover.onclick = () => {
        if (confirm('Deseja remover esta viatura?')) {
            localStorage.removeItem(`viatura_${viaturaId}`);
            localStorage.setItem('totalViaturas', document.querySelectorAll('.viatura-section').length - 1);
            container.removeChild(section);
            atualizarNumeracaoViaturas();
            atualizarSelectsMilitares();
            atualizarMilitaresDisponiveis();
        }
    };
    
    header.appendChild(titulo);
    header.appendChild(btnRemover);
    
    const horaInicialGlobal = document.getElementById('horaInicial').value || '13:30';
    const horaFinalGlobal = document.getElementById('horaFinal').value || '01:30';

    const prefixoGroup = document.createElement('div');
    prefixoGroup.className = 'viatura-info-group';
    prefixoGroup.innerHTML = `
        <div class="form-group">
            <label>Prefixo</label>
            <input type="text" class="prefixo-viatura" placeholder="Ex: 15053">
        </div>
        <div class="form-group">
            <label>Hora Inicial</label>
            <input type="time" class="hora-inicial-viatura" value="${horaInicialGlobal}">
        </div>
        <div class="form-group">
            <label>Hora Final</label>
            <input type="time" class="hora-final-viatura" value="${horaFinalGlobal}">
        </div>
    `;
    prefixoGroup.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', () => markViaturaUnsaved(viaturaId));
    });
    
    const militaresDiv = document.createElement('div');
    militaresDiv.className = 'militares-viatura';
    
    const btnAdicionar = document.createElement('button');
    btnAdicionar.innerHTML = '<i data-lucide="user-plus"></i>';
    btnAdicionar.title = 'Adicionar Militar';
    btnAdicionar.className = 'btn-action btn-primary';
    btnAdicionar.onclick = () => adicionarMilitarViatura(viaturaId);
    
    const botoesDiv = document.createElement('div');
    botoesDiv.className = 'viatura-actions';
    
    const btnSalvar = document.createElement('button');
    btnSalvar.innerHTML = '<i data-lucide="save"></i>';
    btnSalvar.title = 'Salvar Viatura';
    btnSalvar.className = 'btn-action btn-success';
    btnSalvar.onclick = () => salvarViatura(viaturaId);
    
    const btnLimpar = document.createElement('button');
    btnLimpar.innerHTML = '<i data-lucide="eraser"></i>';
    btnLimpar.title = 'Limpar Viatura';
    btnLimpar.className = 'btn-action btn-warning';
    btnLimpar.onclick = () => limparViatura(viaturaId);
    
    botoesDiv.appendChild(btnAdicionar);
    botoesDiv.appendChild(btnSalvar);
    botoesDiv.appendChild(btnLimpar);
    
    section.appendChild(header);
    section.appendChild(prefixoGroup);
    section.appendChild(militaresDiv);
    section.appendChild(botoesDiv);
    
    container.appendChild(section);
    lucide.createIcons({ nodes: [section] });
    
    // Tentar carregar dados salvos
    const dadosSalvos = localStorage.getItem(`viatura_${viaturaId}`);
    if (dadosSalvos) {
        carregarViatura(viaturaId);
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

function adicionarMilitarViatura(viaturaId, _silent = false) {
    const viatura = document.getElementById(viaturaId);
    const container = viatura.querySelector('.militares-viatura');
    if (!_silent) markViaturaUnsaved(viaturaId);
    
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
            inputGrad.readOnly = true;
            inputNome.readOnly = true;
            inputId.readOnly = true;
            atualizarSelectsMilitares();
            atualizarFuncoesViatura(viaturaId);
            atualizarMilitaresDisponiveis();
            markViaturaUnsaved(viaturaId);
        }
    };
    
    selectFuncao.onchange = () => {
        selectFuncao.dataset.manual = 'true';
        selectFuncao.dataset.funcaoManual = selectFuncao.value;
        atualizarFuncoesViatura(viaturaId);
        markViaturaUnsaved(viaturaId);
    };
    
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
    btnEditarHorario.innerHTML = '<i data-lucide="clock"></i>';
    btnEditarHorario.title = 'Editar horário';
    btnEditarHorario.className = 'btn-action btn-clock';
    btnEditarHorario.onclick = async () => {
        const isCustom = inputHorarioCustom.value === 'true';
        const viaturaSection = document.getElementById(viaturaId);
        const horaInicialGeral = viaturaSection.querySelector('.hora-inicial-viatura')?.value || document.getElementById('horaInicial').value;
        const horaFinalGeral = viaturaSection.querySelector('.hora-final-viatura')?.value || document.getElementById('horaFinal').value;
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
                            💡 <strong>Dica:</strong> Deixe os campos vazios para usar o horário da viatura (${horaInicialGeral} - ${horaFinalGeral})
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
            btnEditarHorario.classList.add('active');
            btnEditarHorario.innerHTML = '<i data-lucide="clock-check"></i>';
            btnEditarHorario.title = `Horário personalizado: ${result.value.horaInicial} - ${result.value.horaFinal}`;
            lucide.createIcons({ nodes: [btnEditarHorario] });
            
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
            btnEditarHorario.classList.remove('active');
            btnEditarHorario.innerHTML = '<i data-lucide="clock"></i>';
            btnEditarHorario.title = 'Editar horário';
            lucide.createIcons({ nodes: [btnEditarHorario] });
            
            Swal.fire({
                icon: 'info',
                title: 'Personalização Removida',
                text: 'Usando horário padrão da escala',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };
    
    const btnRemoverMilitar = document.createElement('button');
    btnRemoverMilitar.innerHTML = '<i data-lucide="x"></i>';
    btnRemoverMilitar.title = 'Remover';
    btnRemoverMilitar.className = 'btn-action btn-danger';
    btnRemoverMilitar.onclick = () => {
        container.removeChild(div);
        atualizarSelectsMilitares();
        atualizarFuncoesViatura(viaturaId);
        atualizarMilitaresDisponiveis();
        markViaturaUnsaved(viaturaId);
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
    div.appendChild(btnRemoverMilitar);
    
    container.appendChild(div);
    lucide.createIcons({ nodes: [div] });
}

function reordenarFolga() {
    const container = document.getElementById('militaresFolga');
    const militaresCadastrados = carregarMilitares();
    const items = Array.from(container.querySelectorAll('.militar-item-indisponivel'));
    items.sort((a, b) => {
        const nomeA = a.querySelector('.nome').value;
        const nomeB = b.querySelector('.nome').value;
        const mA = militaresCadastrados.find(m => m.nome === nomeA);
        const mB = militaresCadastrados.find(m => m.nome === nomeB);
        return (mA?.num ?? 999999) - (mB?.num ?? 999999);
    });
    items.forEach(item => container.appendChild(item));
}

function adicionarMilitarIndisponivel(tipo, _silent = false) {
    const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (!_silent) markIndisponivelUnsaved(tipo);
    
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
    inputGrad.readOnly = true;
    
    const inputNome = document.createElement('input');
    inputNome.placeholder = 'NOME';
    inputNome.className = 'nome';
    inputNome.readOnly = true;
    
    const inputId = document.createElement('input');
    inputId.placeholder = 'ID FUNC';
    inputId.className = 'idfunc';
    inputId.readOnly = true;
    
    selectMilitar.onchange = function() {
        if(this.value) {
            const [grad, nome, idfunc] = this.value.split('|');
            inputGrad.value = grad;
            inputNome.value = nome;
            inputId.value = idfunc;
            atualizarSelectsMilitares();
            atualizarMilitaresDisponiveis();
            markIndisponivelUnsaved(tipo);
            if (tipo === 'folga') reordenarFolga();
        }
    };
    
    const btnRemoverInd = document.createElement('button');
    btnRemoverInd.innerHTML = '<i data-lucide="x"></i>';
    btnRemoverInd.title = 'Remover';
    btnRemoverInd.className = 'btn-action btn-danger';
    btnRemoverInd.onclick = () => {
        container.removeChild(div);
        atualizarSelectsMilitares();
        atualizarMilitaresDisponiveis();
        markIndisponivelUnsaved(tipo);
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
    
    div.appendChild(btnRemoverInd);
    
    container.appendChild(div);
    lucide.createIcons({ nodes: [div] });
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

    const militares = items.map(item => ({
        item,
        num: parseInt(item.querySelector('.num-antiguidade')?.value) || 999999,
        nome: item.querySelector('.nome')?.value || '',
        funcaoSelect: item.querySelector('.funcao')
    })).filter(m => m.nome);

    militares.sort((a, b) => a.num - b.num);
    const total = militares.length;

    // Salvar funções manuais ANTES de recriar as opções
    const manuais = {};
    militares.forEach(m => {
        if (m.funcaoSelect.dataset.manual === 'true') {
            const funcaoManual = m.funcaoSelect.dataset.funcaoManual || m.funcaoSelect.value;
            manuais[m.num] = funcaoManual;
        }
    });

    // Função automática por posição na lista ordenada por antiguidade
    function funcaoAuto(idx) {
        if (idx === 0) return 'CMDT DE EQUIPE';
        if (idx === total - 1) return 'MOTORISTA';
        if (idx === 1) return 'SEGURANÇA';
        if (idx === 2) return 'ANOTADOR';
        if (idx === 3) return 'ESTAGIÁRIO';
        return '';
    }

    militares.forEach((militar, idx) => {
        const select = militar.funcaoSelect;
        const valorAtual = select.value;
        
        select.innerHTML = '<option value="">Função</option>';
        funcoes.forEach(f => { select.innerHTML += `<option value="${f}">${f}</option>`; });

        // Verificar se há função manual salva
        if (manuais[militar.num] !== undefined) {
            select.dataset.manual = 'true';
            select.dataset.funcaoManual = manuais[militar.num];
            select.value = manuais[militar.num];
        } else if (select.dataset.manual === 'true' && valorAtual) {
            // Preservar função manual mesmo se não estava em manuais
            select.dataset.funcaoManual = valorAtual;
            select.value = valorAtual;
        } else {
            // Aplicar função automática
            select.dataset.manual = 'false';
            select.value = funcaoAuto(idx);
        }
    });

    // Ordem visual pela ordem canônica das funções
    const container = viatura.querySelector('.militares-viatura');
    const ordemFuncoes = ['CMDT DE EQUIPE', 'MOTORISTA', 'SEGURANÇA', 'ANOTADOR', 'ESTAGIÁRIO', ''];
    militares.sort((a, b) => {
        const ia = ordemFuncoes.indexOf(a.funcaoSelect.value);
        const ib = ordemFuncoes.indexOf(b.funcaoSelect.value);
        return (ia === -1 ? ordemFuncoes.length : ia) - (ib === -1 ? ordemFuncoes.length : ib);
    });
    militares.forEach(m => container.appendChild(m.item));
}

function coletarDadosViaturas() {
    const viaturas = [];
    
    document.querySelectorAll('.viatura-section').forEach((viatura, index) => {
        const prefixo = viatura.querySelector('.prefixo-viatura').value;
        const horaInicialViatura = viatura.querySelector('.hora-inicial-viatura')?.value || document.getElementById('horaInicial').value;
        const horaFinalViatura = viatura.querySelector('.hora-final-viatura')?.value || document.getElementById('horaFinal').value;
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
            viaturas.push({ numero: index + 1, prefixo, horaInicialViatura, horaFinalViatura, militares });
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
    const config = obterConfiguracoes();
    const logoSelecionada = config.logoSelecionada || 'ft';
    const logoPath = logoSelecionada === 'ft' ? 'Logo FT PNG sem fundo.png' : 'Logo BM PNG sem fundo.png';
    
    const img = new Image();
    img.src = logoPath;
    
    // Definir dimensões mantendo proporção
    let imgWidth, imgHeight;
    if (logoSelecionada === 'ft') {
        imgWidth = 60;
        imgHeight = 35;
    } else {
        // Logo BM é mais quadrada, ajustar para manter proporção
        imgHeight = 35;
        imgWidth = 35; // Proporção 1:1 aproximadamente
    }
    
    const imgX = (210 - imgWidth) / 2;
    doc.addImage(img, 'PNG', imgX, 8, imgWidth, imgHeight);
    
    // Cabeçalho abaixo da logo
    const batalhao = config.batalhao || '32º BPM';
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text(`FORÇA TÁTICA ${batalhao}`, 105, 48, { align: 'center' });
    
    const dataEscalaObj = new Date(dataEscala + 'T00:00:00');
    const dataFormatada = dataEscalaObj.toLocaleDateString('pt-BR', { 
        day: '2-digit', month: 'long', year: 'numeric' 
    });
    const diasSemanaTitulo = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
    const diaSemanaEscala = diasSemanaTitulo[dataEscalaObj.getDay()];
    doc.setFontSize(10);
    doc.text(`ESCALA DE SERVIÇO PARA O DIA ${dataFormatada.toUpperCase()} (${diaSemanaEscala})`, 105, 55, { align: 'center' });
    
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
            
            const horaIni = m.horarioCustom && m.horaInicial ? m.horaInicial : viatura.horaInicialViatura;
            const horaFin = m.horarioCustom && m.horaFinal ? m.horaFinal : viatura.horaFinalViatura;
            
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
    const textoAssinatura = config.textoAssinatura || `da Força Tática do ${batalhaoRodape}`;
    let auxiliarPelTexto = `Aux. Pel. ${textoAssinatura}`;
    let comandanteTexto = `Rsp comando ${textoAssinatura}`;
    
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
    doc.text(`Aux. Pel. ${textoAssinatura}`, 105, y + 5, { align: 'center' });
    
    y += 15;
    doc.text('VISTO EM: ____/____/____', 105, y, { align: 'center' });
    
    y += 10;
    doc.setFont('times', 'bold');
    doc.text(comandanteTexto, 15, y);
    doc.setFont('times', 'normal');
    doc.text(`Rsp comando ${textoAssinatura}`, 15, y + 5);
    
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
    const horaInicialViatura = viatura.querySelector('.hora-inicial-viatura').value;
    const horaFinalViatura = viatura.querySelector('.hora-final-viatura').value;
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
    
    const dados = { prefixo, horaInicialViatura, horaFinalViatura, militares };
    localStorage.setItem(`viatura_${viaturaId}`, JSON.stringify(dados));
    localStorage.setItem('totalViaturas', document.querySelectorAll('.viatura-section').length);
    setSaveIndicator(getViaturaIndicator(viaturaId), 'saved');
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
            atualizarSelectsMilitares();
            atualizarMilitaresDisponiveis();
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
        const { prefixo, horaInicialViatura, horaFinalViatura, militares } = JSON.parse(dados);
        const viatura = document.getElementById(viaturaId);
        
        viatura.querySelector('.prefixo-viatura').value = prefixo;
        if (horaInicialViatura) viatura.querySelector('.hora-inicial-viatura').value = horaInicialViatura;
        if (horaFinalViatura) viatura.querySelector('.hora-final-viatura').value = horaFinalViatura;
        viatura.querySelector('.militares-viatura').innerHTML = '';
        
        militares.forEach(m => {
            adicionarMilitarViatura(viaturaId, true);
            const container = viatura.querySelector('.militares-viatura');
            const items = container.querySelectorAll('.militar-item');
            const ultimoItem = items[items.length - 1];
            
            if (ultimoItem) {
                ultimoItem.querySelector('.grad').value = m.grad;
                ultimoItem.querySelector('.nome').value = m.nome;
                ultimoItem.querySelector('.idfunc').value = m.idfunc;
                ultimoItem.querySelector('.num-antiguidade').value = m.num;
                ultimoItem.querySelector('.grad').readOnly = true;
                ultimoItem.querySelector('.nome').readOnly = true;
                ultimoItem.querySelector('.idfunc').readOnly = true;
                
                if (m.horarioCustom) {
                    ultimoItem.querySelector('.horario-custom-flag').value = 'true';
                    ultimoItem.querySelector('.hora-inicial-custom').value = m.horaInicial || '';
                    ultimoItem.querySelector('.hora-final-custom').value = m.horaFinal || '';
                    ultimoItem.querySelector('.hora-inicial-custom').style.display = 'block';
                    ultimoItem.querySelector('.hora-final-custom').style.display = 'block';
                    const btnEditar = ultimoItem.querySelector('.btn-action.btn-clock');
                    if (btnEditar) {
                        btnEditar.classList.add('active');
                        btnEditar.innerHTML = '<i data-lucide="clock-check"></i>';
                        btnEditar.title = 'Horário personalizado ativo';
                        lucide.createIcons({ nodes: [btnEditar] });
                    }
                }
            }
        });
        
        // Marcar funções salvas como manuais (por num de antiguidade) antes de chamar atualizarFuncoesViatura
        militares.forEach(m => {
            if (!m.funcao) return;
            const container = viatura.querySelector('.militares-viatura');
            const item = Array.from(container.querySelectorAll('.militar-item'))
                .find(el => el.querySelector('.num-antiguidade')?.value == m.num);
            if (item) {
                const select = item.querySelector('.funcao');
                select.dataset.manual = 'true';
                select.dataset.funcaoManual = m.funcao;
            }
        });

        atualizarSelectsMilitares();
        atualizarFuncoesViatura(viaturaId);
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
            localStorage.removeItem('totalViaturas');
            
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
    atualizarMilitaresDisponiveis();
    reordenarFolga();
    markIndisponivelUnsaved('folga');
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
    setSaveIndicator(getIndisponivelIndicator(tipo), 'saved');
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
            atualizarMilitaresDisponiveis();
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
            adicionarMilitarIndisponivel(tipo, true);
            const container = document.getElementById(`militares${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
            const items = container.querySelectorAll('.militar-item-indisponivel');
            const ultimoItem = items[items.length - 1];
            
            if (ultimoItem) {
                ultimoItem.querySelector('.grad').value = m.grad;
                ultimoItem.querySelector('.nome').value = m.nome;
                ultimoItem.querySelector('.idfunc').value = m.idfunc;
                // Restaurar o select para o valor correto
                const select = ultimoItem.querySelector('select');
                if (select) {
                    const valor = `${m.grad}|${m.nome}|${m.idfunc}`;
                    // Adicionar a opção se não existir (militar já alocado em outra seção)
                    if (!select.querySelector(`option[value="${valor}"]`)) {
                        select.innerHTML += `<option value="${valor}">${m.grad} ${m.nome}</option>`;
                    }
                    select.value = valor;
                }
                if (m.motivo && ultimoItem.querySelector('.motivo')) {
                    ultimoItem.querySelector('.motivo').value = m.motivo;
                }
            }
        });
        if (tipo === 'folga') reordenarFolga();
    }
}

// ========== INDICADORES DE SALVO ==========

function setSaveIndicator(el, state) {
    // state: 'unsaved' | 'saved' | 'clear'
    if (!el) return;
    el.classList.remove('unsaved', 'saved');
    if (state === 'unsaved') {
        el.classList.add('unsaved');
    } else if (state === 'saved') {
        el.classList.add('saved');
        setTimeout(() => { el.classList.remove('saved'); }, 3000);
    }
}

function getViaturaIndicator(viaturaId) {
    return document.querySelector(`#${viaturaId} .save-indicator`);
}

function getIndisponivelIndicator(tipo) {
    return document.getElementById(`indicator-${tipo}`);
}

function markViaturaUnsaved(viaturaId) {
    setSaveIndicator(getViaturaIndicator(viaturaId), 'unsaved');
}

function markIndisponivelUnsaved(tipo) {
    setSaveIndicator(getIndisponivelIndicator(tipo), 'unsaved');
}

// ========== SALVAR DATAS ==========

function salvarDatas() {
    const dataEmissao = document.getElementById('dataEmissao').value;
    const dataEscala = document.getElementById('dataEscala').value;
    localStorage.setItem('datas', JSON.stringify({ dataEmissao, dataEscala }));
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
    
    // Carregar datas salvas ou usar data atual
    const datasSalvas = JSON.parse(localStorage.getItem('datas')) || {};
    const dataEmissaoInput = document.getElementById('dataEmissao');
    const dataEscalaInput = document.getElementById('dataEscala');
    
    if (datasSalvas.dataEmissao) {
        dataEmissaoInput.value = datasSalvas.dataEmissao;
    } else {
        dataEmissaoInput.valueAsDate = new Date();
    }
    
    if (datasSalvas.dataEscala) {
        dataEscalaInput.value = datasSalvas.dataEscala;
    } else {
        dataEscalaInput.valueAsDate = new Date();
    }
    
    // Salvar datas automaticamente ao alterar
    dataEmissaoInput.addEventListener('change', salvarDatas);
    dataEscalaInput.addEventListener('change', salvarDatas);
    
    // Carregar PRIMEIRO todos os indisponíveis
    carregarIndisponiveis('folga');
    carregarIndisponiveis('ferias');
    carregarIndisponiveis('le');
    carregarIndisponiveis('ltip');
    carregarIndisponiveis('lts');
    carregarIndisponiveis('adido');
    carregarIndisponiveis('rsp');
    
    // DEPOIS restaurar viaturas salvas ou criar primeira viatura
    const total = parseInt(localStorage.getItem('totalViaturas')) || 0;
    if (total > 0) {
        for (let i = 0; i < total; i++) {
            adicionarViatura();
        }
    } else {
        adicionarViatura();
    }
    
    renderizarTabela();
    atualizarMilitaresDisponiveis();
    
    // Inicializar visibilidade do toggle da sidebar
    const toggle = document.getElementById('sidebar-toggle');
    if (toggle) toggle.style.display = window.innerWidth <= 900 ? 'flex' : 'none';
};
