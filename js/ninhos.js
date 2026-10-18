import {
    obterNinhos,
    adicionarNinho,
    atualizarRegisto
} from '../servicos/base-dados.js';

let abrirFormularioEdicao = null;

export function iniciarEdicaoNinho(id) {
    if (abrirFormularioEdicao) {
        abrirFormularioEdicao(id);
    }
}

export function iniciarNinhos() {

        // Guarda o ID do ninho que está a ser editado.
    let ninhoEmEdicao = null;

    const formulario = document.getElementById('form-ninho');

    const tituloFormulario = document.getElementById('titulo-formulario-ninho');
    const botaoGuardar = document.getElementById('botao-guardar-ninho');

    const mensagem = document.getElementById('mensagem-ninho');
    const tabela = document.getElementById('lista-ninhos');
    const seletorLocal = document.getElementById('localizacao');
    const botaoLimpar = document.getElementById('limpar-ninho');

    // Mostra o próximo número de registo do mês atual.
    function atualizarProximoNumeroRegisto() {
    const elemento = document.getElementById('proximo-numero-registo');

    if (!elemento) {
        return;
    }

    const agora = new Date();
    const anoMes = `${agora.getFullYear()}${String(
        agora.getMonth() + 1
    ).padStart(2, '0')}`;

    const ninhos = obterNinhos();

    const chaveContador = 'vespas_lousa_contador_ninhos';
    let contadores = {};

    try {
        contadores = JSON.parse(
            localStorage.getItem(chaveContador) || '{}'
        );
    } catch (erro) {
        console.error('Erro ao consultar a numeração:', erro);
    }

    const maiorExistente = ninhos.reduce((maior, ninho) => {
        const identificador = String(
            ninho.identificador || ninho.referencia || ''
        ).replace('-', '');

        const correspondencia = identificador.match(
            new RegExp(`^${anoMes}(\\d{4})$`)
        );

        if (!correspondencia) {
            return maior;
        }

        return Math.max(maior, Number(correspondencia[1]));
    }, 0);

    const ultimoNumero = Math.max(
        Number(contadores[anoMes]) || 0,
        maiorExistente
    );

    if (ultimoNumero >= 9999) {
        elemento.textContent = 'Limite mensal atingido';
        return;
    }

    elemento.textContent =
        `${anoMes}${String(ultimoNumero + 1).padStart(4, '0')}`;
}

    // O restante código da função iniciarNinhos() continua aqui.

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

        ninhoEmEdicao = null;

        if (tituloFormulario) {
            tituloFormulario.textContent = 'Registar novo ninho';
        }

        if (botaoGuardar) {
            botaoGuardar.textContent = 'Registar ninho';
        }

        mensagem.textContent = '';
        mensagem.style.color = '';
        }

        // Prepara o formulário para editar um ninho existente.
abrirFormularioEdicao = function (id) {
    const ninho = obterNinhos().find(n => n.id === id);

    if (!ninho) {
        mensagem.textContent = 'Não foi possível encontrar o ninho.';
        mensagem.style.color = 'red';
        return;
    }

    // Abre a secção dos ninhos.
    const botaoNavegacao = document.querySelector('[data-seccao="ninhos"]');
    if (botaoNavegacao) {
        botaoNavegacao.click();
    }

    ninhoEmEdicao = ninho.id;

    if (tituloFormulario) {
        tituloFormulario.textContent = 'Editar ninho';
    }

    if (botaoGuardar) {
        botaoGuardar.textContent = 'Guardar alterações';
    }

    mensagem.textContent = '';

    // Preenche os campos com os dados existentes.
    const campos = [
    'data',
    'contactante',
    'telefone',
    'morada',
    'freguesia',
    'tipoNinho',
    'localizacao',
    'tipoArvore',
    'tipoEdificio',
    'tipoTelhado',
    'tipoPoste',
    'zonaPoste',
    'outroLocal',
    'cota',
    'alturaNinho',
    'larguraNinho',
    'latitude',
    'longitude',
    'observacoes',
    'estado'
];

    campos.forEach(nome => {
        const campo = formulario.elements.namedItem(nome);
        if (campo) {
            campo.value = ninho[nome] || '';
        }
    });

    // Preenche a unidade responsável.
    const campoUnidade = formulario.elements.namedItem('unidade');
    const campoOutraUnidade = document.getElementById('outra-unidade');

    if (campoUnidade) {
        const existeOpcao = Array.from(campoUnidade.options)
            .some(opcao => opcao.value === ninho.unidade);

        campoUnidade.value = existeOpcao ? ninho.unidade : 'Outra';

        if (!existeOpcao && campoOutraUnidade) {
            campoOutraUnidade.value = ninho.unidade || '';
        }

        atualizarOutraUnidade();
    }

    // Preenche o tipo de árvore.
    const campoArvore = formulario.elements.namedItem('tipoArvore');
    const campoOutraArvore = document.getElementById('outra-arvore');

    if (campoArvore) {
        const existeOpcao = Array.from(campoArvore.options)
            .some(opcao => opcao.value === ninho.tipoArvore);

        campoArvore.value = existeOpcao ? ninho.tipoArvore : 'Outra';

        if (!existeOpcao && campoOutraArvore) {
            campoOutraArvore.value = ninho.tipoArvore || '';
        }

        atualizarOutraArvore();


    }

    atualizarDetalhesLocal();

    // Mantém a fotografia atual e apresenta-a.
    if (ninho.fotografia) {
        const imagem = document.getElementById('imagem-fotografia');
        const preVisualizacao = document.getElementById('pre-visualizacao-fotografia');

        if (imagem && preVisualizacao) {
            imagem.src = ninho.fotografia;
            preVisualizacao.hidden = false;
        }
    }

    formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

    // Atualiza a tabela com os ninhos guardados.
    function atualizarTabela() {
        const ninhos = obterNinhos();

        tabela.replaceChildren();

        ninhos.forEach(ninho => {
            const linha = document.createElement('tr');
        const valores = [
            ninho.identificador || '',
            ninho.referencia || '',
            ninho.data || '',
            ninho.freguesia || '',
            ninho.localizacao || '',
            ninho.tipoNinho || '',
            ninho.estado || ''
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

        

        const ficheiroFotografia = ficheiroFotografiaSelecionado;

        const ninho = {
            referencia: '',
            identificador: '',
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
            tipoArvore: dados.get('tipoArvore') === 'Outra'
                ? dados.get('outraArvore').trim()
                : dados.get('tipoArvore'),
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
            estado: dados.get('estado') || 'Pendente'
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
        if (ninhoEmEdicao) {
            const ninhoOriginal = obterNinhos().find(
                n => n.id === ninhoEmEdicao
            );

            if (!ninhoOriginal) {
                throw new Error('Não foi possível encontrar o ninho original.');
            }

            ninho.fotografia = fotografia || ninhoOriginal.fotografia || null;

            // Preserva o número, a referência e o estado atuais.
            ninho.identificador = ninhoOriginal.identificador;
            ninho.referencia = ninhoOriginal.referencia;
            ninho.estado = ninhoOriginal.estado;

            atualizarRegisto('ninhos', ninhoEmEdicao, ninho);

        } else {
            ninho.fotografia = fotografia;
            adicionarNinho(ninho);
        }

        atualizarTabela();
        atualizarProximoNumeroRegisto();

        document.dispatchEvent(
            new CustomEvent('ninhos-atualizados')
        );

        const estavaEmEdicao = ninhoEmEdicao !== null;

        limparFormulario();

        mensagem.textContent = estavaEmEdicao
            ? 'Ninho atualizado com sucesso!'
            : 'Ninho registado com sucesso!';

        mensagem.style.color = '#276749';

    } catch (erro) {
        console.error('Erro ao guardar o ninho:', erro);

        mensagem.textContent =
            'Não foi possível guardar o ninho. Verifica o espaço de armazenamento.';
        mensagem.style.color = '#c53030';
    }
}

        // Obter a localização GPS do equipamento.
    const botaoGPS = document.getElementById('obter-localizacao-gps');
    const campoLatitude = document.getElementById('latitude');
    const campoLongitude = document.getElementById('longitude');
    const mensagemGPS = document.getElementById('mensagem-gps');

    if (botaoGPS) {
        botaoGPS.addEventListener('click', function () {
            if (!navigator.geolocation) {
                mensagemGPS.textContent =
                    'Este equipamento não suporta localização GPS.';
                return;
            }

            mensagemGPS.textContent = 'A obter localização...';
            botaoGPS.disabled = true;

            navigator.geolocation.getCurrentPosition(
                function (posicao) {
                    const latitude = posicao.coords.latitude;
                    const longitude = posicao.coords.longitude;

                    campoLatitude.value = latitude.toFixed(5);
                    campoLongitude.value = longitude.toFixed(5);

                    mensagemGPS.textContent =
                        'Localização obtida com sucesso!';

                    botaoGPS.disabled = false;
                },
                function (erro) {
                    let mensagem = 'Não foi possível obter a localização.';

                    if (erro.code === 1) {
                        mensagem =
                            'Autorização de localização recusada. Permite o acesso à localização.';
                    } else if (erro.code === 2) {
                        mensagem =
                            'Localização indisponível. Tenta novamente.';
                    } else if (erro.code === 3) {
                        mensagem =
                            'O GPS demorou demasiado tempo. Tenta novamente.';
                    }

                    mensagemGPS.textContent = mensagem;
                    botaoGPS.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });
    }

    // Preparação inicial.
    atualizarDetalhesLocal();
    atualizarTabela();
    atualizarProximoNumeroRegisto();
}
