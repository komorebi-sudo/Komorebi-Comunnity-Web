import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  // Utilizamos el nombre oficial de tu marketplace
  const siteName = "Kuramachi"; 
  
  // Si pasas un título (ej: "Camiseta Otaku"), se verá como: "Camiseta Otaku | Kuramachi"
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  
  // Valores por defecto por si alguna página no tiene información
  const defaultDesc = "Descubre tiendas locales increíbles y encuentra magia.";
  const defaultImage = "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1200&auto=format&fit=crop"; // Pon aquí una URL de un banner por defecto de tu plataforma

  return (
    <Helmet>
      {/* Título de la pestaña del navegador */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      
      {/* Meta-etiquetas para WhatsApp, Facebook, LinkedIn (Open Graph) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      {url && <meta property="og:url" content={url} />}

      {/* Meta-etiquetas para X (Twitter) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}