import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/common/Header';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* The Outlet will render the Home Page, Login Page, etc. below the header */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;