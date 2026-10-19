import {
    obterNinhos,
    guardarNinhos
} from '../servicos/base-dados.js';

const CHAVE_TRATAMENTOS = 'vespas_lousa_tratamentos';

function obterTratamentos() {
    try {
        const dados = localStorage.getItem(CHAVE_TRATAMENTOS);
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error('Erro ao carregar tratamentos:', erro);
        return [];
    }
}

function guardarTratamentos(tratamentos) {
    localStorage.setItem(
        CHAVE_TRATAMENTOS,
        JSON.stringify(tratamentos)
    );
}

export function iniciarTratamentos() {
    const formulario = document.getElementById('form-tratamento');
    const seletorNinho = document.getElementById('ninho-tratamento');
    const mensagem = document.getElementById('mensagem-tratamento');

    if (!formulario || !seletorNinho || !mensagem) {
        console.error('Os elementos do formulário de tratamentos não foram encontrados.');
        return;
    }

    function atualizarListaNinhos() {
        const ninhos = obterNinhos();
        const valorAnterior = seletorNinho.value;

        seletorNinho.replaceChildren();

        const opcaoInicial = document.createElement('option');
        opcaoInicial.value = '';
        opcaoInicial.textContent = 'Selecionar ninho';
        seletorNinho.appendChild(opcaoInicial);

        ninhos
            .filter(ninho => ninho.estado !== 'Tratado')
            .forEach(ninho => {
                const opcao = document.createElement('option');
                opcao.value = ninho.id;
                opcao.textContent =
                    `${ninho.referencia} — ${ninho.freguesia}`;
                seletorNinho.appendChild(opcao);
            });

        if ([...seletorNinho.options].some(opcao => opcao.value === valorAnterior)) {
            seletorNinho.value = valorAnterior;
        }
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const dados = new FormData(formulario);
        const ninhoId = dados.get('ninhoId');

        const tratamento = {
        id: crypto.randomUUID(),
        ninhoId,
        data: dados.get('data'),
        metodo: dados.get('metodo').trim(),
        responsavel: (dados.get('responsavel') || '').trim(),
        observacoes: dados.get('observacoes').trim(),
        criadoEm: new Date().toISOString()
    };

        const ninhos = obterNinhos();
        const ninho = ninhos.find(registo => registo.id === ninhoId);

        if (!ninho) {
            mensagem.textContent = 'Seleciona um ninho válido.';
            mensagem.style.color = '#c53030';
            return;
        }

        if (!tratamento.data || !tratamento.metodo) {
            mensagem.textContent = 'Preenche todos os campos obrigatórios.';
            mensagem.style.color = '#c53030';
            return;
        }

        try {
            guardarTratamentos([
                ...obterTratamentos(),
                tratamento
            ]);

            ninho.estado = 'Tratado';
            guardarNinhos(ninhos);

            mensagem.textContent = 'Tratamento registado com sucesso!';
            mensagem.style.color = '#276749';

            formulario.reset();
            atualizarListaNinhos();

            document.dispatchEvent(
                new CustomEvent('ninhos-atualizados')
            );
        } catch (erro) {
            console.error('Erro ao guardar o tratamento:', erro);
            mensagem.textContent = 'Não foi possível guardar o tratamento.';
            mensagem.style.color = '#c53030';
        }
    });

    atualizarListaNinhos();
}

