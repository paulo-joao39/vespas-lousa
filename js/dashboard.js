import { obterNinhos } from '../servicos/base-dados.js';

export function atualizarDashboard() {
    const ninhos = obterNinhos();

    const total = ninhos.length;

    const pendentes = ninhos.filter(
        ninho => ninho.estado === 'Pendente' ||
                 ninho.estado === 'Por tratar'
    ).length;

    const tratados = ninhos.filter(
        ninho => ninho.estado === 'Tratado'
    ).length;

    document.getElementById('total-ninhos').textContent = total;
    document.getElementById('ninhos-pendentes').textContent = pendentes;
    document.getElementById('ninhos-tratados').textContent = tratados;
}

