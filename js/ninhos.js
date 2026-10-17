import {
    obterNinhos,
    adicionarNinho
} from '../servicos/base-dados.js';

export function iniciarNinhos() {
    const formulario = document.getElementById('form-ninho');
    const mensagem = document.getElementById('mensagem-ninho');

    if (!formulario) {
        console.error('O formulário de ninhos não foi encontrado.');
        return;
    }

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
        } catch (erro) {
            console.error('Erro ao guardar o ninho:', erro);

            mensagem.textContent =
                'Não foi possível guardar o ninho.';
            mensagem.style.color = '#c53030';
        }
    });
}
