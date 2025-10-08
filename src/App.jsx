import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ContatoSobre from "./pages/ContatoSobre";
import Capitulos from "./pages/Capitulos";
import CapituloPage from "./components/CapituloPage/CapituloPage"
import Livro from "./components/Livro/Livro";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<ContatoSobre />} />
        <Route path="/capitulos" element={<Capitulos/>} />
        <Route path="/capitulo/:id" element={<CapituloPage />} />
        <Route path="/livro" element={<Livro />} />
      </Routes>
  );
}
