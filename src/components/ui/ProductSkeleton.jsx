import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] p-5 flex flex-col border border-slate-100 shadow-sm animate-pulse h-full">
      {/* Imagen fantasma */}
      <div className="h-40 w-full bg-slate-200 rounded-[1.5rem] mb-5"></div>
      
      {/* Título fantasma */}
      <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded-full w-1/2 mb-6"></div>
      
      {/* Precio y Botón fantasmas */}
      <div className="mt-auto flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded-lg w-16"></div>
        <div className="h-9 bg-slate-200 rounded-full w-20"></div>
      </div>
    </div>
  );
}