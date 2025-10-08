import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import livroData from '../../data/livro.json';
import './Livro.css';

const Pagina = React.forwardRef(({ paragrafos, numero, busca, qtdLetras, corPalavra, corQtd }, ref) => {

  const getParagraphClass = (paragrafo) => {
    const texto = paragrafo.trim();
    if (texto.startsWith('—')) return 'dialogo';
    if (texto.length > 0 && texto.split(' ').length < 8) return 'poema-linha';
    return '';
  };

  const highlightText = (text) => {
    if (!busca && !qtdLetras) return text;

    const words = text.split(/(\s+)/); // mantém espaços
    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,;!?]/g, '');
      const matchBusca = busca && cleanWord.toLowerCase().includes(busca.toLowerCase());
      const matchQtd = qtdLetras && cleanWord.length === Number(qtdLetras);

      if (matchBusca && matchQtd) {
        return <mark key={i} style={{ background: `linear-gradient(${corPalavra}, ${corQtd})` }}>{word}</mark>;
      }
      if (matchBusca) return <mark key={i} style={{ backgroundColor: corPalavra }}>{word}</mark>;
      if (matchQtd) return <mark key={i} style={{ backgroundColor: corQtd }}>{word}</mark>;

      return word;
    });
  };

  return (
    <div className="pagina" ref={ref}>
      <div className="conteudo-pagina">
        <div className="texto-paragrafos">
          {paragrafos.map((paragrafo, idx) => (
            <p key={idx} className={getParagraphClass(paragrafo)}>
              {highlightText(paragrafo)}
            </p>
          ))}
        </div>
        <div className="numero-pagina">{numero}</div>
      </div>
    </div>
  );
});

function Livro({ busca, qtdLetras, corPalavra, corQtd }) {
  const bookRef = useRef(null);
  const todasAsPaginas = livroData.capitulos.flatMap(capitulo => capitulo.paginas);
  const [size, setSize] = useState({ width: 450, height: 600 });
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = newWidth * 1.33;
        setSize({ width: newWidth, height: newHeight });
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="livro-container-figma" ref={containerRef}>
      {size.width > 0 && (
        <div className="livro-wrapper">
          <HTMLFlipBook
            width={size.width}
            height={size.height}
            size="stretch"
            showCover={true}
            className="livro-componente"
            ref={bookRef}
          >
            <div className="pagina-capa" data-density="hard"></div>
            {todasAsPaginas.map((pagina) => (
              <Pagina
                key={pagina.numero_pagina}
                numero={pagina.numero_pagina}
                paragrafos={pagina.paragrafos}
                busca={busca}
                qtdLetras={qtdLetras}
                corPalavra={corPalavra}
                corQtd={corQtd}
              />
            ))}
            <div className="pagina-capa" data-density="hard"></div>
          </HTMLFlipBook>

          <button className="btn-nav-figma btn-prev-figma" onClick={() => bookRef.current.pageFlip().flipPrev()}>
            <span>&#10140;</span>
          </button>
          <button className="btn-nav-figma btn-next-figma" onClick={() => bookRef.current.pageFlip().flipNext()}>
            <span>&#10140;</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Livro;
