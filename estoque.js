console.log("carregado")
document.addEventListener("DOMContentLoaded", function() {
    const alimentos = [
        'Arroz', 'Feijão', 'Açúcar', 'Sal', 'Farinha de Trigo', 'Farofa',
        'Café', 'Chá', 'Achocolatado', 'Leite em Pó', 'Leite', 'Pão', 'Fermento', 'Macarrão', 'Miojo', 'Molho de Tomate',
        'Leite Condensado', 'Creme de Leite', 'Ketchup', 'Maionese', 'Mostarda', 'Milho', 'Champignon', 'Shoyo', 'Óleo',
        'Vinagre', 'Bicarbonato', 'Milho de Pipoca', 'Amendoim', 'Salgadinho', 'Bolacha de Maizena', 'Torrada',
        'Bolacha Recheada', 'Sucrilhos', 'Margarina', 'Manteiga', 'Requeijão', 'Pão de Queijo', 'Waffle', 'Luka',
        'Areia', 'Sachê', 'Higiene Pessoal', 'Sabonete', 'Pasta de Dente', 'Shampoo Renan', 'Shampoo Bruna', 'Desodorante Renan',
        'Cotonete', 'Absorvente', 'Papel Higiênico', 'Limpeza', 'Removedor', 'Alcool', 'Detergente', 'Desengordurante', 'Sabão em Pó',
        'Amaciante', 'Sabão de Coco', 'Desinfetante', 'Candida', 'Pastilha Privada', 'Esponja de Pia', 'Perfex', 'Saco de Lixo',
        'Pasta rosa', 'Veneno', 'Itens Casa', 'Guardanapo Pequeno', 'Guardanapo Rolo', 'Saco Congelar', 'Papel Aluminio', 'Filme Plastico',
        'Papel Manteiga'
    ];

    const options = ['0', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

    const tabelaBody = document.querySelector('#tabela-alimentos tbody');

    if (!tabelaBody) {
        console.error('Elemento tbody não encontrado. Verifique o seletor "#tabela-alimentos tbody" no HTML.');
        return;
    }

    function renderizarAlimentos(alimentos) {
        tabelaBody.innerHTML = ''; // Limpa a tabela existente
    
        alimentos.forEach(alimento => {
            const newRow = document.createElement('tr');
            newRow.dataset.id = alimento.id; // Adiciona o ID ao <tr>
    
            newRow.innerHTML = `
                <td>${alimento.nome}</td>
                <td><select class="quantidade">${options.map(option => `<option value="${option}" ${option == alimento.quantidade ? 'selected' : ''}>${option}</option>`).join('')}</select></td>
                <td><select class="peguei">${options.map(option => `<option value="${option}" ${option == alimento.peguei ? 'selected' : ''}>${option}</option>`).join('')}</select></td>
                <td><input type="text" class="valor-unitario" value="R$ ${alimento.valor_unitario.toFixed(2).replace('.', ',')}" oninput="formatCurrency(this)"></td>
                <td><input type="text" class="valor-atual" value="R$ ${alimento.valor_atual.toFixed(2).replace('.', ',')}" oninput="formatCurrency(this)"></td>
            `;
            tabelaBody.appendChild(newRow);
        });
    }
    

    renderizarAlimentos(alimentos);

    function verificarAlerta() {
        const rows = tabelaBody.querySelectorAll('tr');
        rows.forEach(row => {
            const quantidadeSelect = row.querySelector('select.quantidade');
            const pegueiSelect = row.querySelector('select.peguei');
            if (quantidadeSelect && pegueiSelect) {
                const quantidade = quantidadeSelect.value;
                const peguei = pegueiSelect.value;
                if (quantidade === '0' && peguei === '0') {
                    row.classList.add('alerta');
                } else {
                    row.classList.remove('alerta');
                }
            }
        });
    }

    tabelaBody.addEventListener('change', verificarAlerta);

    function formatCurrency(input) {
        let value = input.value;
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        input.value = "R$ " + value;
        updateTotal(input);
    }

    function updateTotal(input) {
        const tabelaBody = document.querySelector('#tabela-alimentos tbody');
        const isValorUnitario = input.classList.contains('valor-unitario');
        const cells = isValorUnitario
            ? tabelaBody.querySelectorAll('td input.valor-unitario')
            : tabelaBody.querySelectorAll('td input.valor-atual');

        let total = 0;
        cells.forEach(cell => {
            const valor = parseFloat(cell.value.replace(/[^\d,]/g, '').replace(',', '.'));
            if (!isNaN(valor)) {
                total += valor;
            }
        });

        const totalCell = isValorUnitario 
            ? document.getElementById('total-valor-unitario') 
            : document.getElementById('total-valor-atual');
        totalCell.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function calcularValorAtual(row) {
        const quantidade = parseFloat(row.querySelector('select.peguei').value) || 0;
        const valorUnitario = parseFloat(row.querySelector('.valor-unitario').value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        return quantidade * valorUnitario;
    }

    tabelaBody.addEventListener('change', function(event) {
        const target = event.target;
        if (target.classList.contains('peguei') || target.classList.contains('valor-unitario')) {
            const row = target.closest('tr');
            const valorAtualInput = row.querySelector('.valor-atual');
            valorAtualInput.value = `R$ ${calcularValorAtual(row).toFixed(2).replace('.', ',')}`;
            updateTotal(target);
        }
    });

    async function carregarAlimentos() {
        try {
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error('Erro ao carregar alimentos');
          }
          const data = await response.json();
          // Processar os dados
        } catch (error) {
          console.error('Erro ao carregar alimentos:', error);
        }
      }
      

  // Função para atualizar o alimento no servidor
    async function atualizarAlimento(id, dados) {
    try {
        const response = await fetch(`/alimentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar alimento no servidor.');
        }
    } catch (error) {
        console.error('Erro ao atualizar alimento:', error);
    }
}

// Adicionar um evento de 'change' para salvar dados no servidor
tabelaBody.addEventListener('change', async function(event) {
    const target = event.target;
    const row = target.closest('tr');
    const id = row.dataset.id; // Certifique-se de que o ID do alimento esteja no 'data-id' do <tr>

    const quantidade = row.querySelector('select.quantidade').value;
    const peguei = row.querySelector('select.peguei').value;
    const valorUnitario = parseFloat(row.querySelector('.valor-unitario').value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const valorAtual = calcularValorAtual(row);

    // Atualize o alimento no banco de dados SQLite via servidor
    await atualizarAlimento(id, { quantidade, peguei, valor_unitario: valorUnitario, valor_atual: valorAtual });

    // Atualize os totais
    updateTotal(target);
});
    const API_URL = 'https://brunasolemar.github.io/alimentos';

  // Função para salvar dados no Local Storage
function salvarDados(id, quantidade, peguei, valor_unitario, valor_atual) {
    const alimento = { quantidade, peguei, valor_unitario, valor_atual };
    localStorage.setItem(`alimento_${id}`, JSON.stringify(alimento));
  }
  
  // Função para carregar dados do Local Storage
  function carregarDados(id) {
    const alimento = localStorage.getItem(`alimento_${id}`);
    return alimento ? JSON.parse(alimento) : null;
  }
  
  // Função para carregar dados ao iniciar a página
  window.onload = function() {
    const id = 1; // ID do alimento
    const dados = carregarDados(id);
    if (dados) {
      document.getElementById('quantidade').value = dados.quantidade;
      document.getElementById('peguei').value = dados.peguei;
      document.getElementById('valor_unitario').value = dados.valor_unitario;
      document.getElementById('valor_atual').value = dados.valor_atual;
    }
  }
  
  // Função para salvar dados ao clicar no botão
  function salvar() {
    const id = 1; // ID do alimento
    const quantidade = document.getElementById('quantidade').value;
    const peguei = document.getElementById('peguei').value;
    const valor_unitario = document.getElementById('valor_unitario').value;
    const valor_atual = document.getElementById('valor_atual').value;
    salvarDados(id, quantidade, peguei, valor_unitario, valor_atual);
  }
  
  

    tabelaBody.addEventListener('change', async function(event) {
        const target = event.target;
        if (target.classList.contains('peguei') || target.classList.contains('valor-unitario')) {
            const row = target.closest('tr');
            const id = row.dataset.id;
            const quantidade = row.querySelector('select.quantidade').value;
            const peguei = row.querySelector('select.peguei').value;
            const valorUnitario = parseFloat(row.querySelector('.valor-unitario').value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const valorAtual = calcularValorAtual(row);

            await atualizarAlimento(id, { quantidade, peguei, valor_unitario: valorUnitario, valor_atual: valorAtual });
            updateTotal(target);
        }
    });

    carregarAlimentos();
});
