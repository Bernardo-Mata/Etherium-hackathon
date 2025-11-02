/**
 * @fileoverview Componente raíz de la aplicación
 * @module App
 */

import React from 'react';
import './App.css';
import { AntiMevApp } from './components/AntiMevApp';

/**
 * Componente principal de la aplicación
 * @returns {JSX.Element} Aplicación Anti-MEV Dark Pool
 */
function App() {
  return (
    <div className="App">
      <AntiMevApp />
    </div>
  );
}

export default App;