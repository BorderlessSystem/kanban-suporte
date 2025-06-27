index.html: Arquivo principal que carrega todo o app.

style.css: Estilos globais do app.

script.js: Arquivo que inicializa a lógica principal e importa os componentes.

Dentro de /src:

    components/:

        navbar.js: Código do menu superior.

        sidebar.js: Código do menu lateral com dropdowns.

        kanban.js: Criação das 4 colunas e lógica de movimentação dos tickets.

    utils/: 
        theme.js: Alternância entre tema claro e escuro.

    data/: 
        tickets.json: Dados mockados dos tickets (para testes iniciais sem backend).

🧭 Sugestão de próximos passos (em ordem lógica):
1 - Salvar estado dos tickets no localStorage

    Tickets continuam existindo após reload

    Inclui status, posição e último visualizado

2 - Adicionar botão “Novo Ticket”

    Gera novo card na coluna “Pendente”

    Formulário simples com título, cliente, prioridade

3 - Editar tickets diretamente no painel

    Campo de edição (título, cliente, data)

    Botão “Salvar alterações”

4 - Filtrar e ordenar tickets por prioridade

    Ex: mostrar primeiro os tickets de prioridade alta

5 - Criação de usuários fictícios e autenticação básica

    Diferenciar suporte, admin e cliente (mais pra frente)

6 - Integração com Firebase (back-end leve)

    Substituir localStorage por banco real

    Tempo real com Firestore

7 - Inserçao de (meta de time) 

    Dentro do ticket seguindo regra de prioridade (Ex: Codigo Azul (ate 15 min.))
