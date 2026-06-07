export function optimizeImage(url) {
  if (!url) return null;
  
  // Como la transformación al vuelo es PRO, devolvemos la URL original intacta.
  // El navegador se encargará del rendimiento usando loading="lazy" que ya agregamos en el HTML.
  return url;
}