let mapa;
let dados;
let bairroSelecionado = null;
let bordaDestacada = null;

// coordenada do venha ver
const COORDENADAS_VENHA_VER = [-6.3200, -38.5000];

// coord dos bairros
const POLIGONOS_BAIRROS = {
    'Centro': [
        [-6.321389, -38.491111],  
        [-6.319723, -38.489166],    
        [-6.324445, -38.485277],  
        [-6.325834, -38.487222],  
        [-6.321389, -38.491111]   
    ],
    'Salgada': [
        [-6.325556, -38.485000],  
        [-6.323611, -38.483333],  
        [-6.324167, -38.482223],  
        [-6.326111, -38.484166],  
        [-6.325556, -38.485000]   
    ],
    'Santo Expedito': [
        [-6.317223, -38.490000],  
        [-6.315833, -38.488611],  
        [-6.316945, -38.487500],  
        [-6.318334, -38.488611],  
        [-6.317223, -38.490000]   
    ]
};

const CORES_BAIRROS = {
    'Centro': '#cc4e2fff',
    'Salgada': '#ffa500', 
    'Santo Expedito': '#006691'
};

// inicializacao
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    inicializarMapa();
    configurarEventos();
});

//dados do JSON
async function carregarDados() {
    try {
        const response = await fetch('dados_vacinacao.json');
        dados = await response.json();
        
        console.log('=== DEBUG DADOS ===');
        console.log('Dados carregados:', dados);
        
        document.getElementById('total-casas').textContent = dados.cidade.total_casas || 0;
        document.getElementById('pessoas-afetadas').textContent = dados.cidade.pessoas_afetadas || 0;
        document.getElementById('total-pets').textContent = dados.cidade.total_pets || 0;
        document.getElementById('percentual-vacinados').textContent = (dados.cidade.percentual_vacinados || 0) + '%';
        document.getElementById('especie-predominante').textContent = dados.cidade.especie_predominante || 'Não informado';
        
        console.log('Espécie predominante:', dados.cidade.especie_predominante);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar os dados. Verifique se o arquivo dados_vacinacao.json está na pasta.');
    }
}

// mapa Leaflet com satélite
function inicializarMapa() {
    mapa = L.map('map').setView(COORDENADAS_VENHA_VER, 14);
    
    // satelite do Esri World Imagery
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 18
    }).addTo(mapa);
    
    adicionarPoligonosBairros();
}

// criaçao dos poligon e pondo em cada bairro
function adicionarPoligonosBairros() {
    for (const [nomeBairro, coordenadas] of Object.entries(POLIGONOS_BAIRROS)) {
        const cor = CORES_BAIRROS[nomeBairro];
    
        const poligono = L.polygon(coordenadas, {
            color: '#ffffff',
            fillColor: cor,
            fillOpacity: 0.6,
            weight: 2,
            opacity: 0.8,
            className: `bairro-${nomeBairro.toLowerCase().replace(' ', '-')}`
        }).addTo(mapa);
        
        poligono.on('mouseover', function(e) {
            this.setStyle({ fillOpacity: 0.8, weight: 3 });
            
            if (bordaDestacada) {
                mapa.removeLayer(bordaDestacada);
            }
            
            bordaDestacada = L.polygon(coordenadas, {
                color: '#ffffffff',
                fillColor: 'transparent',
                weight: 4,
                opacity: 0.8,
                className: 'borda-destacada'
            }).addTo(mapa);
            
        });
        
        poligono.on('mouseout', function(e) {
            this.setStyle({ fillOpacity: 0.6, weight: 2 });
            
            if (bordaDestacada) {
                mapa.removeLayer(bordaDestacada);
                bordaDestacada = null;
            }
            
        });
        
        poligono.on('click', function(e) {
            selecionarBairro(nomeBairro, e.latlng);
        });
        
        poligono.bindTooltip(`
            <div style="text-align: center; padding: 5px;">
                <strong style="color: ${cor}">${nomeBairro}</strong><br>
                <small><i>Clique para ver detalhes</i></small>
            </div>
        `, {
            direction: 'top',
            offset: [0, -10],
            className: 'tooltip-bairro',
            sticky: true
        });
    }
}

// modal do bairro
function selecionarBairro(nomeBairro, latlng) {
    bairroSelecionado = nomeBairro;
    
    if (!dados || !dados.bairros[nomeBairro]) {
        alert('Dados do bairro não encontrados!');
        return;
    }
    
    const info = dados.bairros[nomeBairro];
    
    document.getElementById('titulo-bairro').textContent = `${nomeBairro}`;
    document.getElementById('bairro-casas').textContent = info.casas;
    document.getElementById('bairro-pessoas').textContent = info.pessoas;
    document.getElementById('bairro-pets').textContent = info.pets;
    document.getElementById('bairro-vacinados').textContent = info.percentual_vacinados + '%';
    document.getElementById('bairro-especie').textContent = info.especie_predominante || 'Não informado';
    
    // mostra o modal
    document.getElementById('modal-bairro').classList.remove('d-none');
    
    // Centraliza mapa
    mapa.setView(latlng, 15);
    
    }

//eventos dos botões
function configurarEventos() {
    //"ver mais" da cidade
    document.getElementById('btn-ver-mais-cidade').addEventListener('click', function() {
        mostrarGraficosCidade();
    });
    
    //"ver mais" do bairro
    document.getElementById('btn-ver-mais-bairro').addEventListener('click', function() {
        if (bairroSelecionado) {
            mostrarGraficosBairro(bairroSelecionado);
        } else {
            alert('Selecione um bairro no mapa primeiro!');
        }
    });
}

//mostra gráficos da cidade
function mostrarGraficosCidade() {
    const modal = new bootstrap.Modal(document.getElementById('modal-graficos'));
    const titulo = document.getElementById('modal-graficos-titulo');
    const conteudo = document.getElementById('conteudo-graficos');
    
    titulo.textContent = 'Gráficos Comparativos da Cidade';
    
    conteudo.innerHTML = `
        <div class="row">
            <div class="col-md-12">
                <h5>Comparação entre os 3 Bairros</h5>
                <img src="${dados.graficos.cidade}" 
                     class="grafico-img" 
                     alt="Gráfico comparativo da cidade"
                     onerror="this.src='https://via.placeholder.com/800x300/cccccc/666666?text=Gráfico+não+encontrado'">
            </div>
        </div>
    `;
    
    modal.show();
}

//mostra gráficos do bairro
function mostrarGraficosBairro(nomeBairro) {
    const modal = new bootstrap.Modal(document.getElementById('modal-graficos'));
    const titulo = document.getElementById('modal-graficos-titulo');
    const conteudo = document.getElementById('conteudo-graficos');
    
    titulo.textContent = `Gráficos - ${nomeBairro}`;
    
    const nomeArquivo = dados.graficos.bairros[nomeBairro];
    console.log(`Tentando carregar: ${nomeArquivo} para ${nomeBairro}`);
    
    //gráficos
    conteudo.innerHTML = `
        <div class="row">
            <div class="col-md-12">
                <img src="${nomeArquivo}" 
                     class="grafico-img" 
                     alt="Gráficos do ${nomeBairro}"
                     onerror="this.src='https://via.placeholder.com/800x400/cccccc/666666?text=Gráfico+não+encontrado'">
                <p class="text-muted mt-2">
                    <small>Clique na imagem para ampliar (se necessário)</small>
                </p>
            </div>
        </div>
    `;
    
    modal.show();

}

// insights da pesquisa
function gerarInsights() {
    if (!dados || !dados.cidade || !dados.bairros) {
        console.log("Aguardando dados para gerar insights...");
        return;
    }
    
    console.log("Gerando insights com dados:", dados);
    
    const totalVacinados = parseFloat(dados.cidade.percentual_vacinados) || 0;
    const metaOMS = 70;
    
    let insight1;
    if (totalVacinados >= metaOMS) {
        insight1 = `<strong>Meta da OMS atingida!</strong> ${totalVacinados.toFixed(1)}% dos pets estão vacinados contra raiva.`;
    } else {
        const falta = metaOMS - totalVacinados;
        insight1 = `Apenas ${totalVacinados.toFixed(1)}% dos pets estão vacinados. <strong>Faltam ${falta.toFixed(1)}%</strong> para atingir a meta de 70% imunidade coletiva estabelecida pela Organização Mundial da Saúde (OMS).`;
    }
    
    document.getElementById('insight-geral').innerHTML = insight1;
    
    const bairrosArray = Object.entries(dados.bairros);   
    if (bairrosArray.length > 0) {
        //encontra melhor e pior bairro
        const melhor = bairrosArray.reduce((a, b) => 
            (parseFloat(a[1].percentual_vacinados) > parseFloat(b[1].percentual_vacinados)) ? a : b
        );
        
        const pior = bairrosArray.reduce((a, b) => 
            (parseFloat(a[1].percentual_vacinados) < parseFloat(b[1].percentual_vacinados)) ? a : b
        );
        
        const diferenca = (parseFloat(melhor[1].percentual_vacinados) - parseFloat(pior[1].percentual_vacinados)).toFixed(1);
        
        let insight2;
        if (diferenca > 20) {
            insight2 = `${melhor[0]} lidera com ${melhor[1].percentual_vacinados}% de vacinação, enquanto ${pior[0]} tem apenas ${pior[1].percentual_vacinados}% (diferença de ${diferenca}%).`;
        } else {
            insight2 = `${melhor[0]} tem a melhor taxa (${melhor[1].percentual_vacinados}%), ${pior[0]} a menor (${pior[1].percentual_vacinados}%).`;
        }
        
        document.getElementById('insight-comparativo').innerHTML = insight2;
        
        const totalPetsPior = parseInt(pior[1].pets) || 0;
        const percentualPior = parseFloat(pior[1].percentual_vacinados) || 0;
        const naoVacinadosPior = Math.round(totalPetsPior * (100 - percentualPior) / 100);
        
        let insight3;
        if (naoVacinadosPior > 0) {
            insight3 = `Focar em ${pior[0]}: Priorizar campanhas neste bairro, onde aproximadamente <strong>${naoVacinadosPior} pets</strong> ainda não foram vacinados.`;
        } else {
            insight3 = `Manter campanhas: Todos os bairros estão com boa cobertura vacinal. Focar em conscientização contínua.`;
        }
        
        document.getElementById('insight-acao').innerHTML = insight3;
    }
    
    console.log("insights gerados");
}

//gerar dados e chamar insight
async function carregarDados() {
    try {
        const response = await fetch('dados_vacinacao.json');
        dados = await response.json();
        
        // Dados da cidade
        document.getElementById('total-casas').textContent = dados.cidade.total_casas || 0;
        document.getElementById('pessoas-afetadas').textContent = dados.cidade.pessoas_afetadas || 0;
        document.getElementById('total-pets').textContent = dados.cidade.total_pets || 0;
        document.getElementById('percentual-vacinados').textContent = (dados.cidade.percentual_vacinados || 0) + '%';
        document.getElementById('especie-predominante').textContent = dados.cidade.especie_predominante || 'Não informado';
        
        console.log('Espécie predominante:', dados.cidade.especie_predominante);
        
        gerarInsights();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar os dados.');
    }
}