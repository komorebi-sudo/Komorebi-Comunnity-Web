import React from 'react';
import { optimizeImage } from '../../utils/imageUtils';

export default function OptimizedImage({ src, alt, className }) {
  // Si no hay imagen, devolvemos el diseño de "foto rota"
  if (!src) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 text-center bg-slate-50 border-2 border-dashed border-slate-200 ${className}`}>
        <span className="text-[11px] font-bold text-slate-400 mb-1 leading-tight">Ups aqui deberia haber una foto hermosa...</span>
        <span className="text-[9px] text-slate-400/80 font-medium">alguien sera despedido hoy</span>
      </div>
    );
  }

  // Si hay imagen, devolvemos la etiqueta optimizada
  return (
    <img 
      src={optimizeImage(src)} 
      alt={alt} 
      loading="lazy" 
      className={className} 
    />
  );
}