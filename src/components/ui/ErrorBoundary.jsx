import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Komorebi atrapó un error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-6 shadow-sm border border-red-100">
            <AlertTriangle size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Ups, algo se rompió</h1>
          <p className="text-slate-500 mb-8 max-w-md font-medium">
            Nuestros duendes programadores tropezaron con un cable. No te preocupes, ya estamos reparándolo.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="bg-slate-800 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-slate-700 transition-all shadow-md flex items-center gap-2"
          >
            <Home size={18} /> Volver al Inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}