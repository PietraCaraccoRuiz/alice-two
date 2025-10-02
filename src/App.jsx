import React from "react";
import Hero from "./Hero";
import MyComponent from "./MyComponent";
import "./index.css";

export default function App() {
  return (
    <main className="app">
      {/* SEÇÃO 1: HERO pinado */}
      <Hero />

      {/* SEÇÃO 2: PARALLAX — liberada do Lenis */}
      <section
        id="parallax-section"
        className="parallax-wrap"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        aria-label="Cena Parallax"
      >
        <MyComponent />
      </section>
    </main>
  );
}
