import {
    obterNinhos,
    guardarNinhos,
    eliminarNinho
} from '../servicos/base-dados.js';

import { iniciarEdicaoNinho } from './ninhos.js';

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

        const cabecalho = document.getElementById('cabecalho-ficha');

        conteudo.replaceChildren();

        if (cabecalho) {
            conteudo.appendChild(cabecalho);
        }

        if (!ninho) {
            const mensagem = document.createElement('p');
            mensagem.textContent =
                'Seleciona um ninho para consultar a respetiva ficha.';
            conteudo.appendChild(mensagem);
            return;
        }
 
        const titulo = document.createElement('h3');

        titulo.textContent =
            `FICHA Nº ${ninho.identificador || ninho.referencia || 'Sem número'}`;

        titulo.style.fontSize = '1.4rem';
        titulo.style.marginBottom = '20px';
        titulo.style.paddingBottom = '10px';
        titulo.style.borderBottom = '2px solid #276749';

        conteudo.appendChild(titulo);

        const campos = [
            ['Identificador', ninho.identificador],
            ['Referência', ninho.referencia],
            ['Data da ocorrência', ninho.data],
            ['Data do registo', ninho.criadoEm
            ? new Date(ninho.criadoEm).toLocaleDateString('pt-PT')
            : 'Não disponível'],
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
            ['Altura em relação ao chão (m)', ninho.cota],
            ['Altura do ninho (cm)', ninho.alturaNinho],
            ['Largura do ninho (cm)', ninho.larguraNinho],
            ['Latitude', ninho.latitude],
            ['Longitude', ninho.longitude],
            ['Estado', ninho.estado],
            ['Observações', ninho.observacoes]
        ];

        // Organiza os campos da ficha por secções.
const secoesFicha = [
    {
        titulo: '📋 Identificação do ninho',
        campos: [
            'Identificador',
            'Referência',
            'Data da ocorrência',
            'Unidade responsável',
            'Contactante',
            'Telefone'
        ]
    },
    {
        titulo: '📍 Localização',
        campos: [
            'Morada',
            'Freguesia',
            'Localização',
            'Tipo de árvore',
            'Tipo de edifício',
            'Tipo de telhado',
            'Tipo de poste',
            'Zona do poste',
            'Outro local',
            'Latitude',
            'Longitude'
        ]
    },
    {
        titulo: '📏 Características do ninho',
        campos: [
            'Tipo de ninho',
            'Cota (m)',
            'Altura do ninho (cm)',
            'Largura do ninho (cm)'
        ]
    },
    {
        titulo: '📝 Observações',
        campos: [
            'Observações'
        ]
    }
];

    secoesFicha.forEach(secao => {
    const bloco = document.createElement('div');

    bloco.style.marginBottom = '20px';
    bloco.style.padding = '15px';
    bloco.style.border = '1px solid #d1d5db';
    bloco.style.borderRadius = '8px';
    bloco.style.backgroundColor = '#ffffff';

    const subtitulo = document.createElement('h4');
    subtitulo.textContent = secao.titulo;
    subtitulo.style.marginTop = '0';
    subtitulo.style.marginBottom = '12px';
    subtitulo.style.color = '#276749';

    bloco.appendChild(subtitulo);

    secao.campos.forEach(rotulo => {
        const campo = campos.find(item => item[0] === rotulo);

        if (campo) {
            adicionarCampo(bloco, campo[0], campo[1]);
        }
    });

    conteudo.appendChild(bloco);
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
        tituloTratamentos.textContent = '💉 HISTÓRICO DE TRATAMENTOS';
        tituloTratamentos.style.marginTop = '25px';
        tituloTratamentos.style.marginBottom = '15px';
        tituloTratamentos.style.paddingBottom = '10px';
        tituloTratamentos.style.borderBottom = '2px solid #276749';
        tituloTratamentos.style.color = '#276749';

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

                bloco.style.marginBottom = '15px';
                bloco.style.padding = '15px';
                bloco.style.border = '1px solid #d1d5db';
                bloco.style.borderRadius = '8px';
                bloco.style.backgroundColor = '#f9fafb';

                const subtitulo = document.createElement('h4');
                subtitulo.textContent = `Tratamento ${indice + 1}`;
                bloco.appendChild(subtitulo);

                adicionarCampo(bloco, 'Data', tratamento.data);
                adicionarCampo(bloco, 'Método', tratamento.metodo);
                adicionarCampo(bloco, 'Responsável', tratamento.responsavel);
                adicionarCampo(bloco, 'Observações', tratamento.observacoes);

                conteudo.appendChild(bloco);
            });
        }

                const botoes = document.createElement('div');
        botoes.style.marginTop = '20px';
        botoes.style.display = 'flex';
        botoes.style.flexWrap = 'wrap';
        botoes.style.gap = '10px';

       const botaoEditar = document.createElement('button');

        botaoEditar.addEventListener('click', () => {
            iniciarEdicaoNinho(ninho.id);
        });

        botaoEditar.type = 'button';
        botaoEditar.textContent = '✏️ EDITAR NINHO';

        const botaoImprimir = document.createElement('button');
        botaoImprimir.type = 'button';
        botaoImprimir.textContent = '🖨️ IMPRIMIR / PDF';
        botaoImprimir.addEventListener('click', () => window.print());

        const botaoEliminar = document.createElement('button');
        botaoEliminar.type = 'button';
        botaoEliminar.textContent = '🗑️ ELIMINAR NINHO';
        botaoEliminar.addEventListener('click', () => {
            const confirmar = window.confirm(
                `Tens a certeza de que queres eliminar o ninho ${ninho.identificador || ninho.referencia || ''}? Esta ação não pode ser anulada.`
            );

            if (!confirmar) {
                return;
            }

            try {
                eliminarNinho(ninho.id);

                const tratamentosAtualizados = obterTratamentos().filter(
                    tratamento => tratamento.ninhoId !== ninho.id
                );

                localStorage.setItem(
                    CHAVE_TRATAMENTOS,
                    JSON.stringify(tratamentosAtualizados)
                );

                document.dispatchEvent(
                    new CustomEvent('ninhos-atualizados')
                );

                atualizarLista();

                alert('Ninho eliminado com sucesso.');
            } catch (erro) {
                console.error('Erro ao eliminar o ninho:', erro);
                alert('Não foi possível eliminar o ninho.');
            }
        });

        botoes.appendChild(botaoEditar);
        botoes.appendChild(botaoImprimir);
        botoes.appendChild(botaoEliminar);

        conteudo.appendChild(botoes);
    }

    seletor.addEventListener('change', mostrarFicha);

    atualizarLista();

    document.addEventListener('ninhos-atualizados', atualizarLista);
}

function editarNinho(ninho) {
    const campos = [
        ['data', 'Data da ocorrência'],
        ['unidade', 'Unidade responsável'],
        ['contactante', 'Contactante'],
        ['telefone', 'Telefone'],
        ['morada', 'Morada'],
        ['freguesia', 'Freguesia'],
        ['tipoNinho', 'Tipo de ninho'],
        ['localizacao', 'Localização'],
        ['tipoArvore', 'Tipo de árvore'],
        ['tipoEdificio', 'Tipo de edifício'],
        ['tipoTelhado', 'Tipo de telhado'],
        ['tipoPoste', 'Tipo de poste'],
        ['zonaPoste', 'Zona do poste'],
        ['outroLocal', 'Outro local'],
        ['cota', 'Cota (m)'],
        ['alturaNinho', 'Altura do ninho (cm)'],
        ['larguraNinho', 'Largura do ninho (cm)'],
        ['latitude', 'Latitude'],
        ['longitude', 'Longitude'],
        ['estado', 'Estado'],
        ['observacoes', 'Observações']
    ];

    const formulario = document.createElement('form');
    formulario.style.marginTop = '20px';

    const titulo = document.createElement('h3');
    titulo.textContent = 'Editar dados do ninho';
    formulario.appendChild(titulo);

    campos.forEach(([chave, rotulo]) => {
        const etiqueta = document.createElement('label');
        etiqueta.textContent = rotulo;
        etiqueta.style.display = 'block';
        etiqueta.style.marginTop = '10px';

        let campo;

        if (chave === 'observacoes') {
            campo = document.createElement('textarea');
            campo.rows = 4;
        } else {
            campo = document.createElement('input');
            campo.type = 'text';
        }

        campo.name = chave;
        campo.value = ninho[chave] ?? '';
        campo.style.display = 'block';
        campo.style.width = '100%';

        etiqueta.appendChild(campo);
        formulario.appendChild(etiqueta);
    });

    const guardar = document.createElement('button');
    guardar.type = 'submit';
    guardar.textContent = 'Guardar alterações';
    guardar.style.marginTop = '15px';

    const cancelar = document.createElement('button');
    cancelar.type = 'button';
    cancelar.textContent = 'Cancelar';
    cancelar.style.marginLeft = '10px';
    cancelar.addEventListener('click', () => mostrarFicha());

    formulario.append(guardar, cancelar);

    conteudo.appendChild(formulario);

    formulario.addEventListener('submit', evento => {
        evento.preventDefault();

        const alteracoes = {};

        campos.forEach(([chave]) => {
            alteracoes[chave] = formulario.elements[chave].value.trim();
        });

        try {
            const ninhos = obterNinhos();
            const indice = ninhos.findIndex(item => item.id === ninho.id);

            if (indice === -1) {
                alert('Não foi possível encontrar este ninho.');
                return;
            }

            ninhos[indice] = {
                ...ninhos[indice],
                ...alteracoes
            };

            guardarNinhos(ninhos);

            document.dispatchEvent(
                new CustomEvent('ninhos-atualizados')
            );

            alert('Ninho atualizado com sucesso!');
            atualizarLista();
            seletor.value = ninho.id;
            mostrarFicha();
        } catch (erro) {
            console.error('Erro ao guardar o ninho:', erro);
            alert('Não foi possível guardar as alterações.');
        }
    });
}

