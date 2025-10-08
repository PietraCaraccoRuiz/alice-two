import React, { useEffect, useRef, useState } from "react";
import "./SobreContato.css";
import icon from "../assets/icon.png";
import alice from "../assets/alice.jfif";
import chapeleiro from "../assets/chapeleiro.png";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function SobreContato() {
    const [stars, setStars] = useState([]);
    const heroRef = useRef(null);

    useEffect(() => {
        const arr = Array.from({ length: 550 }).map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: 0.6 + Math.random() * 4,
            delay: Math.random() * 10,
            duration: 1 + Math.random() * 3,
            opacity: 0.25 + Math.random() * 0.9,
        }));
        setStars(arr);
    }, []);

    const handleMouseMoveHero = (e) => {
        const el = heroRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const maxT = 14;
        const maxR = 6;
        const tx = Math.max(Math.min(dx * maxT, maxT), -maxT);
        const ty = Math.max(Math.min(dy * maxT, maxT), -maxT);
        const rot = Math.max(Math.min(dx * maxR, maxR), -maxR);
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(1.02)`;
    };

    const handleMouseLeaveHero = () => {
        const el = heroRef.current;
        if (!el) return;
        el.style.transform = "translate(0,0) rotate(0) scale(1)";
    };

    return (
        <div className="alice-page-container">
            {/* Estrelas de fundo */}
            {stars.map((s, i) => (
                <div
                    className="star"
                    key={i}
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        animationDuration: `${s.duration}s`,
                        animationDelay: `${s.delay}s`,
                        opacity: s.opacity,
                    }}
                />
            ))}

            <NavBar />

            {/* Conteúdo principal */}
            <main className="main-content">
                <div id="sobre" className="history-section glass-card">
                    <h2 className="section-title">
                        Através do Espelho: Nossa História
                    </h2>

                    <div className="history-content-wrapper">
                        <div className="history-text-content">
                            <p>
                                Bem-vindo ao nosso cantinho mágico de leitura, um lugar onde a
                                curiosidade é a chave e a imaginação não têm limites. Nascemos de
                                um sonho, assim como o de Alice, de criar um espaço onde as
                                histórias ganham vida e cada livro é um convite para uma nova
                                aventura.
                            </p>
                            <p>
                                Nossa missão é simples: inspirar o amor pela leitura, oferecendo
                                um refúgio da realidade onde cada página virada é um passo mais
                                fundo na toca do coelho. Acreditamos no poder das palavras para
                                transformar, encantar e nos fazer questionar o impossível.
                            </p>
                        </div>
                        <div
                            className="history-image-wrapper"
                            onMouseMove={handleMouseMoveHero}
                            onMouseLeave={handleMouseLeaveHero}
                        >
                            <img
                                ref={heroRef}
                                src={alice}
                                alt="Ilustração da Alice no País das Maravilhas"
                                className="hero-image"
                            />
                        </div>
                    </div>
                </div>

                <div id="contato" className="contact-section glass-card">
                    <img
                        src={chapeleiro}
                        alt="Personagem Chapeleiro Maluco"
                        className="mad-hatter-image"
                    />
                    <div className="contact-form-wrapper">
                        <h2>Contato</h2>
                        <form className="contact-form">
                            <div className="form-field">
                                <label htmlFor="contact-name">Nome</label>
                                <input id="contact-name" className="input-glass" type="text" />
                            </div>
                            <div className="form-field">
                                <label htmlFor="contact-surname">Sobrenome</label>
                                <input
                                    id="contact-surname"
                                    className="input-glass"
                                    type="text"
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="contact-email">E-mail</label>
                                <input
                                    id="contact-email"
                                    className="input-glass"
                                    type="email"
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="contact-phone">Telefone</label>
                                <input id="contact-phone" className="input-glass" type="tel" />
                            </div>
                            <div className="form-field full-width">
                                <label htmlFor="contact-message">Mensagem</label>
                                <textarea
                                    id="contact-message"
                                    className="input-glass"
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-button full-width">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Rodapé */}
            <Footer />
        </div>
    );
}