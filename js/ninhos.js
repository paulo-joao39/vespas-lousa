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
    const preVisualizacao = document.getElementById('pre-visualizacao-fotografia');
    const imagemFotografia = document.getElementById('imagem-fotografia');
    const botaoRemoverFotografia = document.getElementById('remover-fotografia');

    // Mostra a fotografia selecionada.
    if (fotografiaInput) {
        fotografiaInput.addEventListener('change', function () {
            const ficheiro = fotografiaInput.files[0];

            if (!ficheiro) {
                limparPreVisualizacao();
                return;
            }

            if (!ficheiro.type.startsWith('image/')) {
                alert('Seleciona um ficheiro de imagem válido.');
                fotografiaInput.value = '';
                limparPreVisualizacao();
                return;
            }

            const leitor = new FileReader();

            leitor.onload = function () {
                imagemFotografia.src = leitor.result;
                preVisualizacao.hidden = false;
            };

            leitor.readAsDataURL(ficheiro);
        });
    }

    // Remove a fotografia selecionada.
    if (botaoRemoverFotografia) {
        botaoRemoverFotografia.addEventListener('click', function () {
            fotografiaInput.value = '';
            limparPreVisualizacao();
        });
    }

    function limparPreVisualizacao() {
        if (imagemFotografia) {
            imagemFotografia.removeAttribute('src');
        }

        if (preVisualizacao) {
            preVisualizacao.hidden = true;
        }
    }

    if (!formulario || !mensagem || !tabela) {
        console.error('Elementos do formulário de ninhos não encontrados.');
        return;
    }

    // Mostra apenas os campos correspondentes ao local escolhido.
    function atualizarDetalhesLocal() {
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
            document.getElementById(id).hidden = true;
        });

        if (detalhes[local]) {
            document.getElementById(detalhes[local]).hidden = false;
        }
    }

    // Limpa os campos e repõe o estado inicial do formulário.
    function limparFormulario() {
        formulario.reset();
        atualizarDetalhesLocal();

        mensagem.textContent = '';
        mensagem.style.color = '';

        // Limpa também eventuais fotografias selecionadas.
        const fotografia = document.getElementById('fotografia');
        if (fotografia) fotografia.value = '';
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

        const fotografiaInput = document.getElementById('fotografia');
        const ficheiroFotografia =
            fotografiaInput.files && fotografiaInput.files[0];

        const ninho = {
            referencia,
            data: dados.get('data'),
            unidade: dados.get('unidade').trim(),
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
