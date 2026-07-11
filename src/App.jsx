import React from 'react';
import Routing from './route/Routing';

// React Toastify ke styles aur container import karein
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';

function App() {
  return (
    <>
    <Navbar />
      <Routing />
      {/* Yeh container alerts ko screen par render karega */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"
      />
      <Footer />
    </>
  );
}

export default App;

