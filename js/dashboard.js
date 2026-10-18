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
    if (ninho.estado !== 'Tratado') {
        return false;
    }
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

       const cartao = document.createElement('article');
cartao.className = 'cartao';

const titulo = document.createElement('h4');
titulo.textContent =
    `Ninho ${ninho.identificador || ninho.referencia || 'Sem número'}`;

titulo.style.cursor = 'pointer';
titulo.style.color = '#24558a';
titulo.title = 'Clique para consultar todos os dados do ninho';

const resumo = document.createElement('p');
resumo.textContent =
    `${ninho.freguesia || 'Freguesia não indicada'} — ` +
    `${ninho.tipoNinho || 'Tipo não indicado'} — ` +
    `Estado: ${ninho.estado || 'Não indicado'}`;

const detalhes = document.createElement('div');
detalhes.style.display = 'none';

const adicionarDado = (rotulo, valor) => {
    const paragrafo = document.createElement('p');
    paragrafo.textContent = `${rotulo}: ${valor || 'Não indicado'}`;
    detalhes.appendChild(paragrafo);
};

adicionarDado('Identificador', ninho.identificador);
adicionarDado('Referência', ninho.referencia);
adicionarDado('Freguesia', ninho.freguesia);
adicionarDado('Tipo de ninho', ninho.tipoNinho);
adicionarDado('Estado', ninho.estado);
adicionarDado('Latitude', ninho.latitude);
adicionarDado('Longitude', ninho.longitude);

if (ninho.fotografia) {
    const fotografia = document.createElement('img');
    fotografia.src = ninho.fotografia;
    fotografia.alt = 'Fotografia do ninho';
    fotografia.style.maxWidth = '100%';
    fotografia.style.maxHeight = '350px';
    fotografia.style.display = 'block';
    fotografia.style.marginTop = '10px';

    detalhes.appendChild(fotografia);
}

const mapa = document.createElement('a');
mapa.href =
    `https://www.google.com/maps?q=${encodeURIComponent(ninho.latitude)},${encodeURIComponent(ninho.longitude)}`;
mapa.target = '_blank';
mapa.rel = 'noopener noreferrer';
mapa.textContent = '📍 Abrir no Google Maps';

detalhes.appendChild(mapa);

titulo.addEventListener('click', () => {
    detalhes.style.display =
        detalhes.style.display === 'none' ? 'block' : 'none';
});

cartao.append(titulo, resumo, detalhes);
listaGPS.appendChild(cartao);
    });
}

