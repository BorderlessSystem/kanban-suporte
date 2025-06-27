// Variaveis Globais para uso distintintos ou para testes
let ultimoTicketSelecionado = null;
let logado = true; // Estado fictício de login e simulação inicial de usuário logado
let usuarioAtual = "suporte-1"; // ou suporte-2, no futuro


// Referências aos elementos
const sidebar = document.querySelector('.sidebar');
const dropdownBtns = document.querySelectorAll('.dropdown-btn');
const authBtn = document.getElementById('auth-btn');
const themeToggle = document.getElementById('theme-toggle');

// Atualiza o botão de login/logout
function atualizarBotaoAuth() {
  authBtn.textContent = logado ? 'Logout' : 'Login';
}
atualizarBotaoAuth();

// Alterna a sidebar
dropdownBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Se ainda estiver recolhida, expande
    if (!sidebar.classList.contains('sidebar-expanded')) {
      sidebar.classList.add('sidebar-expanded');
    } else {
      // Caso já esteja expandida, pode abrir o submenu (aqui podemos expandir só esse depois)
      const dropdownContent = btn.nextElementSibling;
      dropdownContent.style.display =
        dropdownContent.style.display === 'block' ? 'none' : 'block';
    }
  });
});

// Alternar entre login e logout
authBtn.addEventListener('click', () => {
  if (logado) {
    logado = false;
    alert('Você saiu do sistema.');
    // Aqui você pode redirecionar para uma tela de login futura
  } else {
    logado = true;
    alert('Você entrou no sistema.');
  }
  atualizarBotaoAuth();
});

// Exibir detalhes do ticket
function showTicketDetails(ticket) {
  const sidebar = document.querySelector('.sidebar');
  const painel = document.getElementById('painel-suporte');
  sidebar.classList.add('sidebar-expanded');

  const titulo = ticket.querySelector(".ticket-title").textContent;
  const cliente = ticket.querySelector(".ticket-client").textContent;
  const data = ticket.querySelector(".ticket-datetime").textContent;

  const coluna = ticket.parentElement.parentElement.getAttribute("data-status");

  let usuarioResponsavel = "";
  if (coluna === "em-andamento") {
    usuarioResponsavel = `${usuarioAtual} (atendendo)`;
  } else if (coluna === "observacao") {
    const observador = ticket.getAttribute("data-observador") || "desconhecido";
    usuarioResponsavel = `${observador} (marcou como observação)`;
  }

  // Salvar referência
  ultimoTicketSelecionado = ticket;

  // Logs por prioridade
  const logsPorPrioridade = {
    "prioridade-baixa": [
      "Verificar acesso básico",
      "Reiniciar serviço",
      "Encaminhar ao nível 1"
    ],
    "prioridade-media": [
      "Validar dados com cliente",
      "Reproduzir erro em ambiente de teste",
      "Aguardar posicionamento externo"
    ],
    "prioridade-alta": [
      "Ação emergencial imediata",
      "Encaminhar para dev sênior",
      "Registrar incidente crítico"
    ]
  };

  const prioridadeClasse = Array.from(ticket.classList).find(c => c.startsWith("prioridade"));
  const logs = logsPorPrioridade[prioridadeClasse] || [];

  // Montar HTML do painel
  painel.innerHTML = `
    <button class="close-panel" onclick="closeTicketDetails()">×</button>
    <h2>Providências</h2>
    <hr />
    <p><strong>Erro:</strong> ${titulo}</p>
    <p><strong>Cliente:</strong> ${cliente}</p>
    <p><strong>Data/Hora:</strong> ${data}</p>
    <hr />
    <p><strong>Responsável:</strong> ${usuarioResponsavel}</p>

    <h3 style="margin-top: 20px;">Registrar Providência</h3>
    <label for="logSelecionado">Tipo de providência:</label>
    <select id="logSelecionado" style="width: 100%;">
      ${logs.map(log => `<option value="${log}">${log}</option>`).join("")}
    </select>

    <label for="campoProvidencia" style="margin-top: 10px; display: block;">
      Comentário (<span id="contador">450</span> caracteres restantes):
    </label>
    <textarea id="campoProvidencia" maxlength="450" style="width: 100%; border-radius: 8px; padding: 8px; resize: vertical;"></textarea>

    <div style="margin-top: 15px;">
      <button onclick="confirmarAcao('finalizar')">Finalizar</button>
      <button onclick="confirmarAcao('observar')">Observar</button>
      <button onclick="confirmarAcao('salvar')">Salvar</button>
    </div>
  `;

  // Ativa o painel
  painel.classList.add('visible');

  // Iniciar contador de caracteres
  setTimeout(() => {
    const textarea = document.getElementById("campoProvidencia");
    const contador = document.getElementById("contador");

    textarea.addEventListener("input", () => {
      contador.textContent = 450 - textarea.value.length;
    });
  }, 100);
}


function closeTicketDetails() {
  const sidebar = document.querySelector('.sidebar');
  const painel = document.getElementById('painel-suporte');

  painel.classList.remove('visible');
  sidebar.classList.remove('sidebar-expanded');
}

// Alternar entre modo claro e escuro
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Permitir soltar
window.allowDrop = function(ev) {
  ev.preventDefault();
};

// Arrastar ticket
window.drag = function(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
};

// Soltar ticket
// Alterei aqui
window.drop = function(ev) {
  ev.preventDefault();
  const ticketId = ev.dataTransfer.getData("text");
  const ticket = document.getElementById(ticketId);
  const targetColumn = ev.currentTarget;
  const sourceColumn = ticket.parentElement;

  const origem = sourceColumn.parentElement.getAttribute('data-status');
  const destino = targetColumn.parentElement.getAttribute('data-status');

  const permitido = {
    pendente: ["em-andamento", "observacao"],
    "em-andamento": ["resolvido"],
    observacao: ["resolvido"]
  };

  if (origem === destino || (permitido[origem] && permitido[origem].includes(destino))) {
    targetColumn.appendChild(ticket);

    //Observa o usuario atual que moveu o ticket para Observaçao
    if (destino === "observacao") {
      ticket.setAttribute("data-observador", usuarioAtual);
    }

    // Se o ticket foi movido para Em Atendimento ou Observação
    if (destino === "em-andamento" || destino === "observacao") {
      //ticket.addEventListener('click', () => showTicketDetails(ticket));
      ticket.onclick = () => showTicketDetails(ticket);
    }
  } else {
    alert(`Movimentação inválida de "${capitalizar(origem)}" para "${capitalizar(destino)}".`);
  }
};

function capitalizar(texto) {
  const mapa = {
    pendente: "Pendente",
    "em-andamento": "Em Atendimento",
    resolvido: "Resolvido",
    observacao: "Observação"
  };
  return mapa[texto] || texto;
}

// Listner para verificar existencia de ultimo ticket selecionado
const submenuTicket = document.getElementById('submenu-ticket');
submenuTicket.addEventListener('click', () => {
  if (ultimoTicketSelecionado) {
    showTicketDetails(ultimoTicketSelecionado);
  } else {
    alert("Nenhum ticket foi selecionado ainda.");
  }
});

// Mostra ao lado do submenu Ticket o ID do ultimo ticket selecionado
document.getElementById('ticket-preview').textContent = `(#${ticket.id.replace('ticket-', '')})`;

// Ativar detalhamento para colunas permitidas
function ativarDetalhamentoParaColunasPermitidas() {
  const colunasPermitidas = ["em-andamento", "observacao"];

  colunasPermitidas.forEach(status => {
    const coluna = document.querySelector(`[data-status="${status}"] .column-content`);
    const tickets = coluna.querySelectorAll('.ticket');

    tickets.forEach(ticket => {
      ticket.onclick = () => showTicketDetails(ticket);
    });
  });
}

// Chama a funçao para ativar detalhamento
window.addEventListener('DOMContentLoaded', () => {
  ativarDetalhamentoParaColunasPermitidas();
});

