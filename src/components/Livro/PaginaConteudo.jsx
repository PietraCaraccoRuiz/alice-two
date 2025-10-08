import React, { useState, forwardRef } from 'react';

// Função para destacar o texto
const destacarTexto = (texto, filtro) => {
  if (!texto || !filtro) return texto;
  const regex = new RegExp(`([ .,?!:;“”()'"\n])`, 'g');

  return texto.split(regex).map((segmento, index) => {
    const palavraLimpa = segmento.replace(/[.,?!:;“”()'"\n]/g, "").toLowerCase();
    let estiloDestaque = {};

    if (filtro.palavra && palavraLimpa === filtro.palavra.toLowerCase()) {
      estiloDestaque = { backgroundColor: "rgba(63, 144, 229, 0.3)", borderRadius: "3px", padding: "0 2px" };
    } else if (filtro.nLetras && palavraLimpa.length === parseInt(filtro.nLetras)) {
      estiloDestaque = { backgroundColor: "rgba(255, 230, 100, 0.7)", borderRadius: "3px", padding: "0 2px" };
    }

    return <span key={index} style={estiloDestaque}>{segmento}</span>;
  });
};


const PaginaConteudo = forwardRef(({ pagina, isFirstPageOfChapter, side }, ref) => {
  const [filtro] = useState({ palavra: 'alice', nLetras: 5 });

  const pageSideClass = side === 'left' ? 'pagina-lado-esquerdo' : 'pagina-lado-direito';

  return (
    <div className={`pagina-conteudo ${pageSideClass}`} ref={ref}>
      {isFirstPageOfChapter && (
        <div className="cabecalhoPagina">
          <h2 className="tituloCapitulo">
            <em>{pagina.titulo_capitulo}</em>
          </h2>
        </div>
      )}

      <div className="texto-pagina">
        {pagina.paragrafos.map((paragrafo, index) => (
          <p
            key={index}
            className={isFirstPageOfChapter && index === 0 ? 'primeiro-paragrafo-capitulo' : ''}
          >
            {destacarTexto(paragrafo, filtro)}
          </p>
        ))}
      </div>

      <div className="numero-pagina-rodape">{pagina.numero_pagina}</div>
    </div>
  );
});

export default PaginaConteudo;