import { useState } from "react";
import './CardBusca.css';
import lacoTitulo from '../../assets/laco.png';

export default function CardBusca({ busca, setBusca, qtdLetras, setQtdLetras, corPalavra, setCorPalavra, corQtd, setCorQtd }) {

  const cores = [
    { name: "Amarelo", value: "#FFFF00" },
    { name: "Verde", value: "#7CFC00" },
    { name: "Vermelho", value: "#FF6347" },
    { name: "Roxo", value: "#A020F0" },
    { name: "Azul", value: "#00BFFF" },
    { name: "Rosa", value: "#FF69B4" },
    { name: "Laranja", value: "#FFA500" },
    { name: "Ciano", value: "#00FFFF" },
  ];

  return (
    <main className="main">
      <figure>
        <img src={lacoTitulo} alt="" />
      </figure>
      <div className="corBase">
        <div className="corSegundaria">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <p>
              Pesquise palavras ou palavras por quantidade de letras. Elas serão destacadas nas cores selecionadas.
            </p>

            <label>Digite aqui a palavra que você procura:</label>
            <div className="alinhamento">
              <input
                type="text"
                placeholder="Digite a palavra..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <label>Digite quantidade de letras que você quer em uma palavra:</label>
            <div className="alinhamento">
              <input
                type="number"
                placeholder="Digite a qtd de letras..."
                value={qtdLetras}
                onChange={(e) => setQtdLetras(e.target.value)}
              />
            </div>

            <h3>Escolha a cor para palavra:</h3>
            <div className="containerCores">
              {cores.map((c) => (
                <div key={c.value} className="cor">
                  <input
                    type="radio"
                    name="corPalavra"
                    value={c.value}
                    checked={corPalavra === c.value}
                    onChange={() => setCorPalavra(c.value)}
                  />
                  <label>{c.name}</label>
                </div>
              ))}
            </div>

            <h3>Escolha a cor para quantidade de letras:</h3>
            <div className="containerCores">
              {cores.map((c) => (
                <div key={c.value} className="cor">
                  <input
                    type="radio"
                    name="corQtd"
                    value={c.value}
                    checked={corQtd === c.value}
                    onChange={() => setCorQtd(c.value)}
                  />
                  <label>{c.name}</label>
                </div>
              ))}
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}
