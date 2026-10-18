import { obterNinhos } from '../servicos/base-dados.js';

const CHAVE_TRATAMENTOS = 'vespas_lousa_tratamentos';

function obterTratamentos() {
    try {
        return JSON.parse(
            localStorage.getItem(CHAVE_TRATAMENTOS) || '[]'
        );
    } catch (erro) {
        console.error('Erro ao carregar tratamentos:', erro);
        return [];
    }
}

export function iniciarFicha() {
    const seletor = document.getElementById('selecionar-ninho-ficha');
    const conteudo = document.getElementById('conteudo-ficha');

    if (!seletor || !conteudo) {
        console.error('Os elementos da ficha não foram encontrados.');
        return;
    }

    function adicionarCampo(container, rotulo, valor) {
        const paragrafo = document.createElement('p');
        const etiqueta = document.createElement('strong');

        etiqueta.textContent = `${rotulo}: `;
        paragrafo.appendChild(etiqueta);
        paragrafo.appendChild(
            document.createTextNode(
                valor === undefined || valor === null || valor === ''
                    ? 'Não indicado'
                    : String(valor)
            )
        );

        container.appendChild(paragrafo);
    }

        function atualizarLista() {
        const valorAnterior = seletor.value;
        const ninhos = obterNinhos();

        console.log('Ficha: ninhos encontrados:', ninhos.length);

        seletor.replaceChildren();

        const opcaoInicial = document.createElement('option');
        opcaoInicial.value = '';
        opcaoInicial.textContent = 'Selecionar um ninho';
        seletor.appendChild(opcaoInicial);

        ninhos.forEach(ninho => {
            const opcao = document.createElement('option');

            opcao.value = ninho.id || '';

            const referencia =
                ninho.identificador ||
                ninho.referencia ||
                'Sem número';

            const freguesia =
                ninho.freguesia ||
                'Freguesia não indicada';

            opcao.textContent = `${referencia} — ${freguesia}`;

            seletor.appendChild(opcao);
        });

        if (
            [...seletor.options].some(
                opcao => opcao.value === valorAnterior
            )
        ) {
            seletor.value = valorAnterior;
        }

        mostrarFicha();
    }

    function mostrarFicha() {
        const id = seletor.value;
        const ninho = obterNinhos().find(item => item.id === id);

        conteudo.replaceChildren();

        if (!ninho) {
            const mensagem = document.createElement('p');
            mensagem.textContent =
                'Seleciona um ninho para consultar a respetiva ficha.';
            conteudo.appendChild(mensagem);
            return;
        }

        const titulo = document.createElement('h3');
        titulo.textContent =
            `Ficha do ninho ${ninho.identificador || ninho.referencia || 'Sem número'}`;
        conteudo.appendChild(titulo);

        const campos = [
            ['Identificador', ninho.identificador],
            ['Referência', ninho.referencia],
            ['Data da ocorrência', ninho.data],
            ['Unidade responsável', ninho.unidade],
            ['Contactante', ninho.contactante],
            ['Telefone', ninho.telefone],
            ['Morada', ninho.morada],
            ['Freguesia', ninho.freguesia],
            ['Tipo de ninho', ninho.tipoNinho],
            ['Localização', ninho.localizacao],
            ['Tipo de árvore', ninho.tipoArvore],
            ['Tipo de edifício', ninho.tipoEdificio],
            ['Tipo de telhado', ninho.tipoTelhado],
            ['Tipo de poste', ninho.tipoPoste],
            ['Zona do poste', ninho.zonaPoste],
            ['Outro local', ninho.outroLocal],
            ['Cota (m)', ninho.cota],
            ['Altura do ninho (cm)', ninho.alturaNinho],
            ['Largura do ninho (cm)', ninho.larguraNinho],
            ['Latitude', ninho.latitude],
            ['Longitude', ninho.longitude],
            ['Estado', ninho.estado],
            ['Observações', ninho.observacoes]
        ];

        campos.forEach(([rotulo, valor]) => {
            adicionarCampo(conteudo, rotulo, valor);
        });

        if (ninho.fotografia) {
            const tituloFoto = document.createElement('h4');
            tituloFoto.textContent = 'Fotografia';
            conteudo.appendChild(tituloFoto);

            const imagem = document.createElement('img');
            imagem.src = ninho.fotografia;
            imagem.alt = 'Fotografia do ninho';
            imagem.style.maxWidth = '100%';
            imagem.style.maxHeight = '400px';
            imagem.style.display = 'block';

            conteudo.appendChild(imagem);
        }

        const latitude = Number(ninho.latitude);
        const longitude = Number(ninho.longitude);

        if (
            ninho.latitude !== '' &&
            ninho.longitude !== '' &&
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 && latitude <= 90 &&
            longitude >= -180 && longitude <= 180
        ) {
            const mapa = document.createElement('a');
            mapa.href =
                `https://www.google.com/maps?q=${latitude},${longitude}`;
            mapa.target = '_blank';
            mapa.rel = 'noopener noreferrer';
            mapa.textContent = '📍 Abrir localização no Google Maps';

            conteudo.appendChild(mapa);
        }

        const tituloTratamentos = document.createElement('h3');
        tituloTratamentos.textContent = 'Histórico de tratamentos';
        conteudo.appendChild(tituloTratamentos);

        const tratamentos = obterTratamentos().filter(
            tratamento => tratamento.ninhoId === ninho.id
        );

        if (tratamentos.length === 0) {
            adicionarCampo(
                conteudo,
                'Tratamentos',
                'Não existem tratamentos registados.'
            );
        } else {
            tratamentos.forEach((tratamento, indice) => {
                const bloco = document.createElement('div');

                const subtitulo = document.createElement('h4');
                subtitulo.textContent = `Tratamento ${indice + 1}`;
                bloco.appendChild(subtitulo);

                adicionarCampo(bloco, 'Data', tratamento.data);
                adicionarCampo(bloco, 'Método', tratamento.metodo);
                adicionarCampo(bloco, 'Observações', tratamento.observacoes);

                conteudo.appendChild(bloco);
            });
        }

        const botoes = document.createElement('div');
        botoes.style.marginTop = '20px';

        const botaoImprimir = document.createElement('button');
        botaoImprimir.type = 'button';
        botaoImprimir.textContent = 'Imprimir ficha / Guardar em PDF';
        botaoImprimir.addEventListener('click', () => window.print());

        botoes.appendChild(botaoImprimir);
        conteudo.appendChild(botoes);
    }

    seletor.addEventListener('change', mostrarFicha);

    atualizarLista();

    document.addEventListener('ninhos-atualizados', atualizarLista);
}

