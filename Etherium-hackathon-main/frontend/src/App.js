// src/App.js

import React from 'react';
import './App.css';

// 1. Importa el componente OrderForm
import OrderForm from './OrderForm'; 

function App() {
  return (
    // 2. Renderiza el OrderForm
    // El div con className="App" y los estilos básicos de App.css se mantienen.
    <div className="App">
      <OrderForm />
    </div>
  );
}

export default App;