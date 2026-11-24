/* ============================================================
   CONFIGURACIÓN — Plataforma de Inducción HSEQ · Process Solutions
   Esto es lo único que tiene que editar para ponerla en marcha.
   ============================================================ */
window.PS_CONFIG = {
  // URL de la "Aplicación web" de Google Apps Script (termina en /exec).
  // Mientras esté vacía, la plataforma funciona en MODO DEMOSTRACIÓN:
  // los registros se guardan solo en el navegador de quien la usa.
  API_URL: "https://script.google.com/macros/s/AKfycbzIHe9ZGGdT-g-LxVHClAR42kDTP7sKWbJ3ekvZ-OYkjPlYrd8X3uyz6wbRFd4IcLYJrQ/exec",

  EMPRESA: "Process Solutions S.A.S.",
  NOTA_MINIMA: 80,            // porcentaje mínimo para aprobar
  CODIGO_CERTIFICADO: "PS-HSEQ",
  FIRMA_NOMBRE: "Área HSEQ",
  FIRMA_CARGO: "Process Solutions S.A.S.",

  PROCESOS: [
    "Planeación Estratégica PE",
    "Ventas VE",
    "Compras CO",
    "Gestión de Proyectos GP",
    "Talento Humano TH",
    "Administración y finanzas AF",
    "HSEQ",
    "Comunicaciones",
    "Contratista / Visitante"
  ],

  // Clave del panel SOLO para el modo demostración.
  // Con Google Sheets conectado, la clave real se define en Apps Script.
  CLAVE_DEMO: "demo"
};
