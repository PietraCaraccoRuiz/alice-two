import React from 'react'
import './Cartas.css'

const Cartas = () => {
    return (
        <div className='carta'>
            <section className='hero'>
                <div className='hero-cards'>
                    <div className='card' id="hero-card-1">
                        <div className='card-title'>
                            <span>Plan</span>
                            <span>01</span>
                        </div>
                        <div className='card-title'>
                            <span>01</span>
                            <span>Plan</span>
                        </div>
                    </div>
                    <div className='card' id="hero-card-2">
                        <div className='card-title'>
                            <span>Plan</span>
                            <span>02</span>
                        </div>
                        <div className='card-title'>
                            <span>02</span>
                            <span>Plan</span>
                        </div>
                    </div>
                    <div className='card' id="hero-card-3">
                        <div className='card-title'>
                            <span>Plan</span>
                            <span>03</span>
                        </div>
                        <div className='card-title'>
                            <span>03</span>
                            <span>Plan</span>
                        </div>
                    </div>
                </div>
            </section>
            <section className='about'>
                <h1>Kepp scolling</h1>
            </section>
            <section className='services'>
                <div className="services-header">
                    <h1>SLla oq ue sei la o que</h1>
                </div>
            </section>
            <section className='cards'>
                <div className="cards-container">
                    <div className="card" id='card-1'>
                        <div className="card-wrapper">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <div className='card-title'>
                                        <span>Plan</span>
                                        <span>01</span>
                                    </div>
                                    <div className="card-copy">
                                        <p>1</p>
                                        <p>2</p>
                                        <p>3</p>
                                        <p>4</p>
                                        <p>5</p>
                                        <p>6</p>
                                    </div>
                                </div>
                                <div className="flip-card-back">
                                    <div className='card-title'>
                                        <span>Plan</span>
                                        <span>01</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card" id='card-2'>
                        <div className="card-wrapper">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <div className='card-title'>
                                        <span>Plan</span>
                                        <span>01</span>
                                    </div>
                                    <div className="card-copy">
                                        <p>1</p>
                                        <p>2</p>
                                        <p>3</p>
                                        <p>4</p>
                                        <p>5</p>
                                        <p>6</p>
                                    </div>
                                </div>
                                <div className="flip-card-back">
                                    <div className='card-title'>
                                        <span>Plan</span>
                                        <span>01</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card" id='card-3'>
                        <div className="card-wrapper">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <div className='card-title'>
                                        <span>Plan</span>
                                        <span>01</span>
                                    </div>
                                    <div className="card-copy">
                                        <p>1</p>
                                        <p>2</p>
                                        <p>3</p>
                                        <p>4</p>
                                        <p>5</p>
                                        <p>6</p>
                                    </div>
                                </div>
                                <div className="flip-card-back">
                                    <div className='card-title'>
                                        <span>Plan</span>
                                        <span>01</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='outro'>
                <h1>A vei vai se fudsee</h1>
            </section>
        </div>

    )
}

export default Cartas