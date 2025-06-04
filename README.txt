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

-> Etapas sugeridas
1 - Estruturar o HTML base com navbar + sidebar + layout de colunas.

2 - Criar o CSS básico com responsividade e aparência clara.

3 - Implementar dark/light mode com toggle.

4 - Criar funcionalidade de login/logout fake (apenas para UI).

5 - Adicionar dropdown funcional nos menus laterais.

6 - Programar os tickets e a lógica de arrastar (drag and drop ou botões simples).

7 - Refatorar e modularizar.