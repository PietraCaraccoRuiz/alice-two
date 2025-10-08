import React from 'react'
import icon from '/icon.png'

const NavBar = () => {
    return (
        <header className="alice-header">
            <div className="header-content">
                <img
                    src={icon}
                    alt="Ícone Gato de Cheshire"
                    className="header-cat-icon"
                />
                <nav className="navbar">
                    <ul>
                        <li><a href="\">Home</a></li>
                        <li><a href="#sobre">Sobre Nós</a></li>
                        <li><a href="\capitulos">Capítulos</a></li>
                        <li><a href="#contato">Contato</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default NavBar