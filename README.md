
# InvestLab

Plataforma web educacional voltada à simulação e comparação de investimentos de longo prazo.

## Sobre o projeto

O InvestLab está sendo desenvolvido como um projeto acadêmico para aplicar conhecimentos de desenvolvimento web e matemática financeira.

A proposta é permitir que o usuário informe um valor inicial, aportes mensais, prazo e uma taxa de rentabilidade hipotética para visualizar uma projeção do seu patrimônio.

## Funcionalidades previstas

- Simulação de investimentos com juros compostos.
- Comparação entre CDB, LCI/LCA, Tesouro Direto e criptomoedas.
- Visualização da evolução patrimonial por meio de gráficos.
- Dashboard com indicadores financeiros.
- Histórico de simulações salvo no navegador.

## Tecnologias

- HTML5
- CSS3
- Tailwind CSS (integração pendente)
- JavaScript
- Chart.js
- LocalStorage

## Status

Em desenvolvimento. Atualizado em **11 de novembro de 2026**, conforme as etapas implementadas e confirmadas durante a construção do projeto.

### Funcionalidades implementadas

- Formulário com investimento inicial, aporte mensal, prazo em anos, taxa anual hipotética e modalidade.
- Máscara monetária nos campos de investimento inicial e aporte, com leitura numérica para os cálculos.
- Validação dos dados e mensagens de erro na própria página.
- Função reutilizável de juros compostos com aportes no final de cada mês.
- Exibição do patrimônio final bruto, total investido, rendimentos e rentabilidade acumulada, com formatação brasileira e cores para ganhos e perdas.
- Gráfico de evolução mensal com duas linhas: patrimônio bruto e total investido.
- Histórico com gravação em `localStorage`, listagem, exclusão e carregamento de simulações no formulário.
- Comparação de duas ou mais simulações salvas, incluindo três simultaneamente, em tabela e gráfico de barras. A tabela apresenta os parâmetros de cada cenário.
- Limpeza da comparação quando o histórico é reconstruído após salvar ou excluir registros.
- CDB com taxa prefixada ou percentual de um CDI anual hipotético configurável. As premissas são preservadas ao salvar e carregar.
- Identificação do tipo de CDB e das premissas de CDI nos resultados, no histórico e na tabela comparativa.
- Modalidade genérica de criptomoedas com taxa hipotética positiva ou negativa.

### Etapa atual

A seleção específica de Bitcoin e Ethereum está em desenvolvimento e ainda não está disponível. A correção dos erros de sintaxe e de ordem de inicialização não representa a conclusão dessa funcionalidade. O próximo passo é verificar sua exibição e funcionamento antes de marcá-la como concluída.

### Limites da versão atual

- Os resultados são **brutos**: ainda não há desconto de impostos ou custos.
- O CDI é constante e hipotético. A taxa anual estimada usa a aproximação didática `(1 + CDI / 100) ** (percentualDoCDI / 100) - 1`, em decimal; não reproduz a apuração diária de um produto real.
- LCI/LCA e Tesouro Direto utilizam a taxa anual informada, sem regras específicas de tributação ou indexação implementadas.
- Criptomoedas utilizam a taxa hipotética digitada, sem consulta de cotações. A seleção específica de Bitcoin ou Ethereum ainda não está disponível.
- Os cenários salvos podem ter aportes, taxas e prazos diferentes. Um patrimônio final maior, isoladamente, não indica uma modalidade melhor.
- O histórico fica no navegador e na origem em que foi salvo; não há sincronização entre dispositivos.
- A validação realizada até aqui é manual. Ainda não há uma suíte automatizada de testes para esta versão.

### Próximas entregas

- Concluir e testar a seleção de Bitcoin e Ethereum, incluindo a identificação do ativo ao salvar, carregar e comparar simulações.
- Implementar e documentar estimativas de impostos e custos aplicáveis, distinguindo valores brutos e líquidos.
- Completar as premissas específicas das modalidades, incluindo a opção indexada do Tesouro Direto.
- Construir o dashboard com distribuição dos investimentos, definindo a alocação da carteira sem somar cenários alternativos como se fossem aplicações simultâneas.
- Integrar Tailwind CSS e revisar responsividade, acessibilidade e experiência de uso.
- Ampliar os testes, incluindo entradas extremas, falhas de armazenamento e carregamento dos gráficos.
- Atualizar a documentação de apresentação, preparar o repositório GitHub e publicar em GitHub Pages, Vercel ou Netlify.

Funcionalidades opcionais, como IA integrada, inflação e metas financeiras, ficam para depois dos requisitos obrigatórios.

## Objetivo

Construir uma aplicação simples, intuitiva e responsiva que ajude a compreender como o tempo, os aportes e as taxas influenciam o crescimento do patrimônio.

## Aviso educacional

Os resultados serão estimativas baseadas em hipóteses e não representarão garantia de rentabilidade ou recomendação de investimento.
