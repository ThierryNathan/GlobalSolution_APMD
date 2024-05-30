document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('viagem-form');
    const tabelaViagens = document.getElementById('viagens-tabela') ? document.getElementById('viagens-tabela').querySelector('tbody') : null;
    const searchInput = document.getElementById('search-input');
    const totalizadosDiv = document.getElementById('totalizados');

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomeEmbarcacao = document.getElementById('nome-embarcacao').value;
            const dataViagem = document.getElementById('data-viagem').value;
            const localInicio = document.getElementById('local-inicio').value;
            const localDestino = document.getElementById('local-destino').value;
            const quantidadeResiduos = document.getElementById('quantidade-residuos').value;
            const descricaoViagem = document.getElementById('descricao-viagem').value;

            if (!nomeEmbarcacao || !dataViagem || !localInicio || !localDestino || !quantidadeResiduos || !descricaoViagem) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const viagem = {
                id: "id_" + new Date().getTime(),
                nomeEmbarcacao,
                dataViagem,
                localInicio,
                localDestino,
                quantidadeResiduos,
                descricaoViagem
            };

            salvarViagem(viagem);
            formulario.reset();
            alert('Viagem registrada com sucesso!');
        });
    }

    if (tabelaViagens) {
        carregarViagens();
    }

    if (totalizadosDiv) {
        carregarTotalizados();
    }

    function salvarViagem(viagem) {
        const viagens = getViagens();
        viagens.push(viagem);
        localStorage.setItem('viagens', JSON.stringify(viagens));
        if (tabelaViagens) {
            carregarViagens();
        }
        if (totalizadosDiv) {
            carregarTotalizados();
        }
    }

    function getViagens() {
        const viagens = localStorage.getItem('viagens');
        return viagens ? JSON.parse(viagens) : [];
    }

    function carregarViagens(filter = '') {
        const viagens = getViagens();
        tabelaViagens.innerHTML = '';

        viagens
            .filter(viagem => {
                return (
                    viagem.nomeEmbarcacao.toLowerCase().includes(filter.toLowerCase()) ||
                    viagem.dataViagem.includes(filter) ||
                    viagem.localInicio.toLowerCase().includes(filter.toLowerCase()) ||
                    viagem.localDestino.toLowerCase().includes(filter.toLowerCase()) ||
                    viagem.quantidadeResiduos.toString().includes(filter) ||
                    viagem.descricaoViagem.toLowerCase().includes(filter.toLowerCase())
                );
            })
            .forEach(viagem => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${viagem.nomeEmbarcacao}</td>
                    <td>${viagem.dataViagem}</td>
                    <td>${viagem.localInicio}</td>
                    <td>${viagem.localDestino}</td>
                    <td>${viagem.quantidadeResiduos + " kg"}</td>
                    <td>${viagem.descricaoViagem}</td>
                    <td><button onclick="deleteViagem('${viagem.id}')">Excluir</button></td>
                `;

                tabelaViagens.appendChild(row);
            });
    }

    window.deleteViagem = function (id) {
        const viagens = getViagens();
        const novasViagens = viagens.filter(viagem => viagem.id !== id);
        localStorage.setItem('viagens', JSON.stringify(novasViagens));
        if (tabelaViagens) {
            carregarViagens();
        }
        if (totalizadosDiv) {
            carregarTotalizados();
        }
    }

    window.filterViagens = function () {
        const filter = searchInput.value;
        carregarViagens(filter);
    }

    function carregarTotalizados() {
        const viagens = getViagens();
        const totalViagens = viagens.length;
        const totalResiduos = viagens.reduce((total, viagem) => total + parseFloat(viagem.quantidadeResiduos), 0);

        totalizadosDiv.innerHTML = `
            <p>Total de Viagens: ${totalViagens}</p>
            <p>Total de Resíduos Coletados: ${totalResiduos} kg</p>
        `;
    }
});
