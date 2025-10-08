import { useState } from "react";
import './CardBusca.css';
import lacoTitulo from '../../assets/laco.png';

export default function CardBusca() {
    return (
        <>
            <main className="main">
                <figure>
                    <img src={lacoTitulo} alt="" />
                </figure>
                <div className="corBase">
                    <div className="corSegundaria">
                        <form className="form" action="">
                            <p>Nessa área você pode pesquisar palavras ou quantas letras você quer ver em uma parte do livro. Ela irá aparecer diretamente no livro, onde é possivel trocar a sua cor de destaque.</p>

                            <label htmlFor="">Digite aqui a palavra que você procura:</label>
                            <div className="alinhamento">
                                <input type="text" name="" id="" placeholder="Digite a palavra..." />
                                <button className="btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                    </svg>
                                </button>
                            </div>

                            <label htmlFor="">Digite quantidade de letras você quer em uma palavra:</label>
                            <div className="alinhamento">
                                <input type="number" name="" id="" placeholder="Digite a qtd de letras..." />
                                <button className="btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                    </svg>
                                </button>
                            </div>

                            <div className="alinhamentoInfos">
                                <div className="mostraInfos">
                                    <label htmlFor=""></label>
                                    <h2>Quantidade de Palavras Repetidas</h2>
                                </div>
                                <div className="mostraInfos">
                                    <label htmlFor=""></label>
                                    <h2>Quantidade de Letras na pagina</h2>
                                </div>
                            </div>

                            <h3 className="opCores">Escolha a cor de destaque</h3>
                            <div className="containerCores">
                                <div className="cor">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Amarelo</label>
                                </div>

                                <div className="cor1">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Verde</label>
                                </div>

                                <div className="cor2">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Vermelho</label>
                                </div>

                                <div className="cor3">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Roxo</label>
                                </div>

                                <div className="cor5">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Azul</label>
                                </div>

                                <div className="cor6">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Rosa</label>
                                </div>

                                <div className="cor7">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Laranja</label>
                                </div>

                                <div className="cor8">
                                    <input type="radio" name="radio" id="radio" checked />
                                    <label htmlFor="">Ciano</label>
                                </div>

                            </div>


                        </form>
                    </div>
                </div>

            </main>

        </>
    )
}
