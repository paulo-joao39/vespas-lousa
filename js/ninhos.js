import {
    obterNinhos,
    adicionarNinho
} from '../servicos/base-dados.js';

export function iniciarNinhos() {
    const formulario = document.getElementById('form-ninho');
    const mensagem = document.getElementById('mensagem-ninho');
    const tabela = document.getElementById('lista-ninhos');
    const seletorLocal = document.getElementById('localizacao');
    const botaoLimpar = document.getElementById('limpar-ninho');

        // Elementos da fotografia.
    const fotografiaInput = document.getElementById('fotografia');
    const fotografiaCamera = document.getElementById('fotografia-camera');
    const preVisualizacao = document.getElementById('pre-visualizacao-fotografia');
    const imagemFotografia = document.getElementById('imagem-fotografia');
    const botaoRemoverFotografia = document.getElementById('remover-fotografia');

    // Fotografia selecionada para o registo.
    let ficheiroFotografiaSelecionado = null;

    // Mostra a pré-visualização da fotografia.
    function mostrarFotografia(ficheiro) {
        if (!ficheiro) {
            limparPreVisualizacao();
            return;
        }

        if (!ficheiro.type.startsWith('image/')) {
            alert('Seleciona um ficheiro de imagem válido.');
            limparFotografiaSelecionada();
            return;
        }

        ficheiroFotografiaSelecionado = ficheiro;

        const leitor = new FileReader();

        leitor.onload = function () {
            imagemFotografia.src = leitor.result;
            preVisualizacao.hidden = false;
        };

        leitor.onerror = function () {
            alert('Não foi possível abrir a fotografia.');
            limparFotografiaSelecionada();
        };

        leitor.readAsDataURL(ficheiro);
    }

    // Escolher uma fotografia dos ficheiros.
    if (fotografiaInput) {
        fotografiaInput.addEventListener('change', function () {
            const ficheiro = fotografiaInput.files[0];

            if (ficheiro) {
                if (fotografiaCamera) {
                    fotografiaCamera.value = '';
                }

                mostrarFotografia(ficheiro);
            }
        });
    }

    // Tirar uma fotografia com a câmara do equipamento.
    if (fotografiaCamera) {
        fotografiaCamera.addEventListener('change', function () {
            const ficheiro = fotografiaCamera.files[0];

            if (ficheiro) {
                if (fotografiaInput) {
                    fotografiaInput.value = '';
                }

                mostrarFotografia(ficheiro);
            }
        });
    }

    // Limpa a fotografia selecionada.
    function limparFotografiaSelecionada() {
        ficheiroFotografiaSelecionado = null;

        if (fotografiaInput) {
            fotografiaInput.value = '';
        }

        if (fotografiaCamera) {
            fotografiaCamera.value = '';
        }

        limparPreVisualizacao();
    }

    // Remove a pré-visualização.
    function limparPreVisualizacao() {
        if (imagemFotografia) {
            imagemFotografia.removeAttribute('src');
        }

        if (preVisualizacao) {
            preVisualizacao.hidden = true;
        }
    }

    // Botão para remover a fotografia.
    if (botaoRemoverFotografia) {
        botaoRemoverFotografia.addEventListener(
            'click',
            limparFotografiaSelecionada
        );
    }

// Mostrar ou esconder o campo para indicar outra espécie de árvore.
const campoTipoArvore = document.getElementById('tipo-arvore');
const detalheOutraArvore = document.getElementById('detalhe-outra-arvore');
const campoOutraArvore = document.getElementById('outra-arvore');

function atualizarOutraArvore() {
    if (!campoTipoArvore || !detalheOutraArvore || !campoOutraArvore) {
        return;
    }

    const selecionouOutra = campoTipoArvore.value === 'Outra';

    detalheOutraArvore.hidden = !selecionouOutra;
    campoOutraArvore.required = selecionouOutra;

    if (!selecionouOutra) {
        campoOutraArvore.value = '';
    }
}

if (campoTipoArvore) {
    campoTipoArvore.addEventListener('change', atualizarOutraArvore);
    atualizarOutraArvore();
}

    // Mostra apenas os campos correspondentes ao local escolhido.
    function atualizarDetalhesLocal() {
    if (!seletorLocal) {
        return;
    }

    const local = seletorLocal.value;

    const detalhes = {
        'Árvore': 'detalhe-arvore',
        'Edifício': 'detalhe-edificio',
        'Telhado': 'detalhe-telhado',
        'Poste': 'detalhe-poste',
        'Muro': 'detalhe-outros',
        'Outros': 'detalhe-outros'
    };

    Object.values(detalhes).forEach(id => {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.hidden = true;
        }
    });

    if (detalhes[local]) {
        const elemento = document.getElementById(detalhes[local]);

        if (elemento) {
            elemento.hidden = false;
        }
    }
}

    // Limpa os campos e repõe o estado inicial do formulário.
    function limparFormulario() {
        formulario.reset();
        atualizarDetalhesLocal();
        limparFotografiaSelecionada();

        mensagem.textContent = '';
        mensagem.style.color = '';
        }

    // Atualiza a tabela com os ninhos guardados.
    function atualizarTabela() {
        const ninhos = obterNinhos();

        tabela.replaceChildren();

        ninhos.forEach(ninho => {
            const linha = document.createElement('tr');

            const valores = [
                ninho.referencia,
                ninho.data,
                ninho.freguesia,
                ninho.localizacao,
                ninho.tipoNinho || '',
                ninho.estado
            ];

            valores.forEach(valor => {
                const celula = document.createElement('td');
                celula.textContent = valor || '';
                linha.appendChild(celula);
            });

            const celulaAcoes = document.createElement('td');
            celulaAcoes.textContent = '—';
            linha.appendChild(celulaAcoes);

            tabela.appendChild(linha);
        });
    }

    // Atualiza os campos quando se muda o local do ninho.
    seletorLocal.addEventListener('change', atualizarDetalhesLocal);

    // Botão para começar um registo novo.
    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', limparFormulario);
    }

    // Mostra o campo para indicar outra unidade responsável.
    const campoUnidade = document.getElementById('unidade');
const detalheOutraUnidade = document.getElementById('detalhe-outra-unidade');
const campoOutraUnidade = document.getElementById('outra-unidade');

function atualizarOutraUnidade() {
    const selecionouOutra = campoUnidade.value === 'Outra';

    detalheOutraUnidade.hidden = !selecionouOutra;
    campoOutraUnidade.required = selecionouOutra;

    if (!selecionouOutra) {
        campoOutraUnidade.value = '';
    }
}

campoUnidade.addEventListener('change', atualizarOutraUnidade);
atualizarOutraUnidade();

    // Guarda o novo ninho.
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const dados = new FormData(formulario);

        const referencia = dados.get('referencia').trim();

        if (!referencia) {
            mensagem.textContent = 'Introduz a referência do ninho.';
            mensagem.style.color = '#c53030';
            return;
        }

        const ninhosExistentes = obterNinhos();

        const duplicado = ninhosExistentes.some(
            ninho =>
                ninho.referencia.toLowerCase() === referencia.toLowerCase()
        );

        if (duplicado) {
            mensagem.textContent =
                'Já existe um ninho com esta referência.';
            mensagem.style.color = '#c53030';
            return;
        }

        const ficheiroFotografia = ficheiroFotografiaSelecionado;

        const ninho = {
            referencia,
            data: dados.get('data'),
            unidade: dados.get('unidade') === 'Outra'
                ? dados.get('outraUnidade').trim()
                : dados.get('unidade').trim(),
            contactante: dados.get('contactante').trim(),
            telefone: dados.get('telefone').trim(),
            morada: dados.get('morada').trim(),
            freguesia: dados.get('freguesia'),
            tipoNinho: dados.get('tipoNinho'),
            localizacao: dados.get('localizacao'),
            tipoArvore: dados.get('tipoArvore'),
            tipoEdificio: dados.get('tipoEdificio'),
            tipoTelhado: dados.get('tipoTelhado'),
            tipoPoste: dados.get('tipoPoste'),
            zonaPoste: dados.get('zonaPoste'),
            outroLocal: dados.get('outroLocal'),
            cota: dados.get('cota'),
            alturaNinho: dados.get('alturaNinho'),
            larguraNinho: dados.get('larguraNinho'),
            latitude: dados.get('latitude'),
            longitude: dados.get('longitude'),
            observacoes: dados.get('observacoes').trim(),
            estado: 'Pendente'
        };

        // Guarda primeiro o registo e depois a fotografia, se existir.
        if (ficheiroFotografia) {
            const leitor = new FileReader();

            leitor.onload = function () {
                guardarNinhoComFotografia(ninho, leitor.result);
            };

            leitor.onerror = function () {
                mensagem.textContent =
                    'Não foi possível ler a fotografia.';
                mensagem.style.color = '#c53030';
            };

            leitor.readAsDataURL(ficheiroFotografia);
        } else {
            guardarNinhoComFotografia(ninho, null);
        }
    });

    function guardarNinhoComFotografia(ninho, fotografia) {
        try {
            ninho.fotografia = fotografia;

            adicionarNinho(ninho);

            atualizarTabela();

            document.dispatchEvent(
                new CustomEvent('ninhos-atualizados')
            );

            limparFormulario();

            mensagem.textContent = 'Ninho registado com sucesso!';
            mensagem.style.color = '#276749';

        } catch (erro) {
            console.error('Erro ao guardar o ninho:', erro);

            mensagem.textContent =
                'Não foi possível guardar o ninho. Verifica o espaço de armazenamento.';
            mensagem.style.color = '#c53030';
        }
    }

    // Preparação inicial.
    atualizarDetalhesLocal();
    atualizarTabela();
}
