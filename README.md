# Pet Vacina Dashboard
Sistema de coleta, análise e visualização de dados sobre a posse de animais domésticos e sua situação vacinal no município de Venha-Ver/RN.
O projeto utiliza dados primários coletados em bairros selecionados da cidade e apresenta os resultados por meio de análises exploratórias e gráficos, com foco em saúde pública e prevenção de zoonoses.

## Principais Insights da Pesquisa
- Situação Geral
   - Apenas 67,6% dos pets estão vacinados no município.
   - Ainda faltam 2,4 pontos percentuais para atingir a meta de 70% de imunidade coletiva, conforme referência da Organização Mundial da Saúde (OMS).
- Comparação entre Bairros
   - A diferença entre os dois bairros é de 38,3 pontos percentuais, evidenciando uma forte desigualdade na vacinação.
   - O bairro Salgada apresenta o melhor desempenho, com 90,9% dos pets vacinados.
   - Já Santo Expedito possui apenas 52,6% de cobertura vacinal.
- Recomendação de Ação
   - Priorizar ações em Santo Expedito, com campanhas de vacinação direcionadas.
   - Estima-se que aproximadamente 9 pets ainda não foram vacinados nesse bairro, o que representa um risco sanitário local.
   
## Objetivo do Projeto
Coletar, organizar e analisar dados sobre:
- Presença de animais domésticos nas residências
- Espécies mais comuns
- Situação vacinal dos pets
- Tipo e origem das vacinas (campanha pública ou clínica veterinária)
- Estimativa de pessoas potencialmente afetadas por zoonoses

Os dados são apresentados tanto **por bairro** quanto em uma **visão geral da cidade**.

## Abrangência da Pesquisa
Bairros pesquisados:
- Centro
- Santo Expedito
- Salgada
A pesquisa foi realizada por meio de entrevistas presenciais em residências selecionadas.

## Metodologia
1. Coleta de dados primários via formulário estruturado  
2. Organização e padronização dos dados em planilhas  
3. Separação em duas tabelas:
   - Residências
   - Pets
4. Análise exploratória com Python (pandas)
5. Visualização dos dados com matplotlib
6. Integração com dashboard interativo e mapa (Leaflet)

## Principais Análises
- Quantidade de residências entrevistadas por bairro
- Número total de pets por espécie
- Proporção de pets vacinados e não vacinados
- Tipos de vacinas aplicadas
- Origem da vacinação (campanha pública × clínica)
- Comparações entre bairros
- Estimativa de pessoas potencialmente afetadas

## Tecnologias Utilizadas
- Python
- Pandas
- Matplotlib
- Leaflet
- Jupyter Notebook
- Google Sheets (organização inicial dos dados)

## Os insights apresentados no dashboard têm como objetivo apoiar decisões estratégicas em políticas públicas de saúde animal, permitindo identificar áreas prioritárias para intervenção.
