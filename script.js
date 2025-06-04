// Variaveis Globais para uso distintintos ou para testes
let ultimoTicketSelecionado = null;
let logado = true; // Estado fictício de login e simulação inicial de usuário logado

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

  // Expande o sidebar
  sidebar.classList.add('sidebar-expanded');

  // Preenche o painel com os dados
  painel.innerHTML = `
    <button class="close-panel" onclick="closeTicketDetails()">×</button>
    <h3>Ticket Selecionado</h3>
    <p><strong>Erro:</strong> ${ticket.querySelector(".ticket-title").textContent}</p>
    <p><strong>Cliente:</strong> ${ticket.querySelector(".ticket-client").textContent}</p>
    <p><strong>Data/Hora:</strong> ${ticket.querySelector(".ticket-datetime").textContent}</p>
  `;

  // Mostra o painel com efeito
  painel.classList.add('visible');

  // Ultimo tickett aberto no suporte
  ultimoTicketSelecionado = ticket;
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

