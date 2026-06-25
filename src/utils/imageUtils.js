export function optimizeImage(url) {
  if (!url) return null;

  // --- ESCUDO ANTI-XSS (Validación de Protocolo) ---
  try {
    // Intentamos construir un objeto URL. Esto fallará si es texto basura.
    const parsedUrl = new URL(url, window.location.origin);
    
    // Solo permitimos protocolos seguros (http, https) o 'blob' (para cuando subes fotos en el panel de admin)
    if (!['http:', 'https:', 'blob:'].includes(parsedUrl.protocol)) {
      console.warn('🛡️ ¡Ataque XSS bloqueado! URL maliciosa detectada:', url);
      return null; // Devolvemos null para que React muestre la caja gris de "Foto rota"
    }
  } catch (e) {
    // Si la URL está tan mal formada que ni siquiera es un enlace, la bloqueamos
    console.warn('🛡️ URL inválida bloqueada:', url);
    return null;
  }

  // Si pasó los controles de seguridad, devolvemos la URL intacta
  return url;
}