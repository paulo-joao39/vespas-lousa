import {
    obterNinhos,
    adicionarNinho
} from '../servicos/base-dados.js';

export function iniciarNinhos() {
    const formulario = document.getElementById('form-ninho');
    const mensagem = document.getElementById('mensagem-ninho');
    const listaNinhos = document.getElementById('lista-ninhos');

    if (!formulario) {
        console.error('O formulário de ninhos não foi encontrado.');
        return;
    }

    // Apresentar os ninhos guardados na tabela
    function atualizarTabela() {
        if (!listaNinhos) {
            return;
        }

        const ninhos = obterNinhos();

        listaNinhos.replaceChildren();

        ninhos.forEach((ninho) => {
            const linha = document.createElement('tr');

            const valores = [
                ninho.referencia,
                ninho.data,
                ninho.freguesia,
                ninho.localizacao || '—',
                ninho.estado
            ];

            valores.forEach((valor) => {
                const celula = document.createElement('td');
                celula.textContent = valor || '—';
                linha.appendChild(celula);
            });

            listaNinhos.appendChild(linha);
        });
    }

    // Registar um novo ninho
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const dadosFormulario = new FormData(formulario);

        const ninho = {
            referencia: dadosFormulario.get('referencia').trim(),
            data: dadosFormulario.get('data'),
            freguesia: dadosFormulario.get('freguesia').trim(),
            localizacao: dadosFormulario.get('localizacao').trim(),
            estado: dadosFormulario.get('estado'),
            observacoes: dadosFormulario.get('observacoes').trim()
        };

        if (!ninho.referencia || !ninho.data || !ninho.freguesia) {
            mensagem.textContent =
                'Preenche todos os campos obrigatórios.';
            mensagem.style.color = '#c53030';
            return;
        }

        const existentes = obterNinhos();

        const referenciaDuplicada = existentes.some(
            registo =>
                registo.referencia.toLowerCase() ===
                ninho.referencia.toLowerCase()
        );

        if (referenciaDuplicada) {
            mensagem.textContent =
                'Já existe um ninho com esta referência.';
            mensagem.style.color = '#c53030';
            return;
        }

        try {
            adicionarNinho(ninho);

            mensagem.textContent =
                'Ninho registado com sucesso!';
            mensagem.style.color = '#276749';

            formulario.reset();

            // Atualizar a tabela após o registo
            atualizarTabela();

        } catch (erro) {
            console.error('Erro ao guardar o ninho:', erro);

            mensagem.textContent =
                'Não foi possível guardar o ninho.';
            mensagem.style.color = '#c53030';
        }
    });

    // Carregar os registos existentes ao abrir a secção
    atualizarTabela();
}
