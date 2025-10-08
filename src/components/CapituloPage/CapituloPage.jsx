import React, { useState } from "react";
import { useParams } from "react-router-dom";
import capitulos from "../../data/capitulosData";
import CardBusca from "../CardBusca/CardBusca";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Livro from "../Livro/Livro";
import './CapituloPage.css';

export default function CapituloPage() {
  const { id } = useParams();
  const capitulo = capitulos.find((c) => c.capitulo === Number(id));

  const [busca, setBusca] = useState('');
  const [qtdLetras, setQtdLetras] = useState('');
  const [corPalavra, setCorPalavra] = useState('#FFFF00'); // amarelo default
  const [corQtd, setCorQtd] = useState('#FF69B4');         // rosa default

  if (!capitulo) return <p>Capítulo não encontrado</p>;

  return (
    <div className="capituloPage" style={{ backgroundImage: `url(${capitulo.fundo})` }}>
      <Navbar />
      <h2 className="titulo">{capitulo.titulo}</h2>

      <div className="conteudoPapitulo">
        <CardBusca
          busca={busca} setBusca={setBusca}
          qtdLetras={qtdLetras} setQtdLetras={setQtdLetras}
          corPalavra={corPalavra} setCorPalavra={setCorPalavra}
          corQtd={corQtd} setCorQtd={setCorQtd}
        />
        <Livro
          busca={busca} qtdLetras={qtdLetras}
          corPalavra={corPalavra} corQtd={corQtd}
        />
      </div>

      <Footer />
    </div>
  );
}
