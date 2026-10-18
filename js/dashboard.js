import { obterNinhos } from '../servicos/base-dados.js';

export function atualizarDashboard() {
    const ninhos = obterNinhos();

    // Atualizar os contadores do Dashboard.
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

    // Mostrar as ocorrências que têm coordenadas GPS.
    const contadorGPS = document.getElementById('total-georreferenciadas');
    const listaGPS = document.getElementById('lista-georreferenciadas');

    if (!contadorGPS || !listaGPS) {
        return;
    }

    const georreferenciados = ninhos.filter(ninho => {
        const latitude = Number(ninho.latitude);
        const longitude = Number(ninho.longitude);

        return ninho.latitude !== '' &&
            ninho.longitude !== '' &&
            ninho.latitude != null &&
            ninho.longitude != null &&
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180;
    });

    contadorGPS.textContent =
        `${georreferenciados.length} ocorrência(s) com coordenadas GPS`;

    listaGPS.replaceChildren();

    if (georreferenciados.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent =
            'Ainda não existem ocorrências com coordenadas GPS válidas.';
        listaGPS.appendChild(mensagem);
        return;
    }

    georreferenciados.forEach(ninho => {
        const cartao = document.createElement('article');
        cartao.className = 'cartao';

        const titulo = document.createElement('h4');
        titulo.textContent =
            `Ninho ${ninho.identificador || ninho.referencia || 'Sem número'}`;

        const detalhes = document.createElement('p');
        detalhes.textContent =
            `${ninho.freguesia || 'Freguesia não indicada'} — ` +
            `${ninho.tipoNinho || 'Tipo não indicado'} — ` +
            `Estado: ${ninho.estado || 'Não indicado'}`;

        const coordenadas = document.createElement('p');
        coordenadas.textContent =
            `Latitude: ${Number(ninho.latitude).toFixed(5)} | ` +
            `Longitude: ${Number(ninho.longitude).toFixed(5)}`;

        const mapa = document.createElement('a');
        mapa.href =
            `https://www.google.com/maps?q=${encodeURIComponent(ninho.latitude)},${encodeURIComponent(ninho.longitude)}`;
        mapa.target = '_blank';
        mapa.rel = 'noopener noreferrer';
        mapa.textContent = '📍 Abrir no Google Maps';

        cartao.append(titulo, detalhes, coordenadas, mapa);

        if (ninho.fotografia) {
            const fotografia = document.createElement('img');
            fotografia.src = ninho.fotografia;
            fotografia.alt = 'Fotografia do ninho';
            fotografia.style.maxWidth = '220px';
            fotografia.style.maxHeight = '220px';
            fotografia.style.display = 'block';
            fotografia.style.marginTop = '10px';

            cartao.appendChild(fotografia);
        }

        listaGPS.appendChild(cartao);
    });
}

