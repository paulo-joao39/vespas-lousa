// ========================================
// NAVEGAÇÃO ENTRE AS SECÇÕES
// Cadastro BML PJ
// ========================================

export function iniciarNavegacao() {
    const botoes = document.querySelectorAll('#menu [data-seccao]');
    const secoes = document.querySelectorAll('main .secao');

    function mostrarSecao(id) {
        // Mostrar apenas a secção selecionada
        secoes.forEach((secao) => {
            secao.hidden = secao.id !== id;
        });

        // Destacar o botão ativo
        botoes.forEach((botao) => {
            const ativo = botao.dataset.seccao === id;

            botao.classList.toggle('ativo', ativo);

            if (ativo) {
                botao.setAttribute('aria-current', 'page');
            } else {
                botao.removeAttribute('aria-current');
            }
        });
    }

    // Associar cada botão à respetiva secção
    botoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            mostrarSecao(botao.dataset.seccao);
        });
    });

    // Abrir o Dashboard ao iniciar a aplicação
    mostrarSecao('dashboard');
}