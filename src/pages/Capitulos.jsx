import { Link } from 'react-router-dom';
import './Capitulos.css';
import capitulo01 from '../assets/capitulo01.png';
import capitulo02 from '../assets/capitulo02.png';
import capitulo03 from '../assets/capitulo03.png';
import capitulo04 from '../assets/capitulo04.png';
import capitulo05 from '../assets/capitulo05.png';
import capitulo06 from '../assets/capitulo06.png';
import capitulo07 from '../assets/capitulo07.png';
import capitulo08 from '../assets/capitulo08.png';
import capitulo09 from '../assets/capitulo09.png';
import capitulo10 from '../assets/capitulo10.png';
import capitulo11 from '../assets/capitulo11.png';
import capitulo12 from '../assets/capitulo12.png';

export default function Capitulos() {
    return (
        <>
            <section className="titulo">
                <h1>Capítulos</h1>
            </section>

            <div className="containerCapitulos">
                <Link to="/capitulo/1" className="cardCapitulo">
                    <img src={capitulo01} alt="Capítulo 1" />
                    <h3>Capítulo 1 – Dentro da Toca do Coelho</h3>
                </Link>

                <Link to="/capitulo/2" className="cardCapitulo">
                    <img src={capitulo02} alt="Capítulo 2" />
                    <h3>Capítulo 2 – Uma Piscina de Lágrimas</h3>
                </Link>

                <Link to="/capitulo/3" className="cardCapitulo">
                    <img src={capitulo03} alt="Capítulo 3" />
                    <h3>Capítulo 3 – A Corrida Maluca e uma História Caudelosa</h3>
                </Link>

                <Link to="/capitulo/4" className="cardCapitulo">
                    <img src={capitulo04} alt="Capítulo 4" />
                    <h3>Capítulo 4 – Bill, a Lagartixa-Bala</h3>
                </Link>

                <Link to="/capitulo/5" className="cardCapitulo">
                    <img src={capitulo05} alt="Capítulo 5" />
                    <h3>Capítulo 5 – Conselhos de uma Taturana</h3>
                </Link>

                <Link to="/capitulo/6" className="cardCapitulo">
                    <img src={capitulo06} alt="Capítulo 6" />
                    <h3>Capítulo 6 – Porca e Pimenta</h3>
                </Link>

                <Link to="/capitulo/7" className="cardCapitulo">
                    <img src={capitulo07} alt="Capítulo 7" />
                    <h3>Capítulo 7 – Um Chá das Cinco Muito Louco</h3>
                </Link>

                <Link to="/capitulo/8" className="cardCapitulo">
                    <img src={capitulo08} alt="Capítulo 8" />
                    <h3>Capítulo 8 – O Croqué da Rainha</h3>
                </Link>

                <Link to="/capitulo/9" className="cardCapitulo">
                    <img src={capitulo09} alt="Capítulo 9" />
                    <h3>Capítulo 9 – A História do Jabuti de Mentira</h3>
                </Link>

                <Link to="/capitulo/10" className="cardCapitulo">
                    <img src={capitulo10} alt="Capítulo 10" />
                    <h3>Capítulo 10 – A Quadrilha das Lagostas</h3>
                </Link>

                <Link to="/capitulo/11" className="cardCapitulo">
                    <img src={capitulo11} alt="Capítulo 11" />
                    <h3>Capítulo 11 – Quem Roubou as Tortas?</h3>
                </Link>

                <Link to="/capitulo/12" className="cardCapitulo">
                    <img src={capitulo12} alt="Capítulo 12" />
                    <h3>Capítulo 12 - Evidências de Alice</h3>
                </Link>
            </div>
        </>
    );
}
