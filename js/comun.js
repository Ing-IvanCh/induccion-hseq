/* Utilidades compartidas: iconos, conexión con Google Sheets y certificado */
(function () {
  const C = window.PS_CONFIG;

  /* ---------- Iconos (trazos SVG, 24x24) ---------- */
  const P = {
    casco: '<path d="M3 17h18M5 17v-3a7 7 0 0 1 14 0v3"/><path d="M10 7.5V5h4v2.5"/>',
    empresa: '<path d="M4 21V5l8-2v18M12 9l8 2v10M8 9h.01M8 13h.01M8 17h.01M16 14h.01M16 18h.01"/>',
    engranaje: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    estrella: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    bandera: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    ojo: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    mapa: '<rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="11" width="6" height="4" rx="1"/><rect x="15" y="11" width="6" height="4" rx="1"/><path d="M12 7v2M6 11V9h12v2M6 15v3M18 15v3"/>',
    capas: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    balanza: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7h6zM19 7l-3 7h6z"/>',
    ciclo: '<path d="M20 12a8 8 0 0 1-14 5.3M4 12A8 8 0 0 1 18 6.7"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    alerta: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    persona: '<circle cx="12" cy="6" r="3"/><path d="M6 21v-5a6 6 0 0 1 12 0v5"/>',
    rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    cruz: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>',
    telefono: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mensaje: '<path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
    documento: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>',
    lupa: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    postura: '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M8 10h8M9 21l3-7 3 7"/>',
    edificio: '<path d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6"/>',
    calle: '<path d="M7 3 4 21M17 3l3 18M12 4v3M12 10v3M12 16v3"/>',
    virus: '<circle cx="12" cy="12" r="5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M5 19l3.5-3.5M15.5 8.5 19 5"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    mente: '<path d="M9 21v-3a7 7 0 1 1 7-7v1l2 3h-2v3h-3v3"/>',
    nube: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18z"/>',
    quimico: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
    manos: '<path d="m3 12 4-4 4 2 3-3 7 5-4 4"/><path d="m7 12 5 5 3-3"/>',
    grupo: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20v-1a6 6 0 0 1 12 0v1M14 20v-1a4 4 0 0 1 8 0v1"/>',
    corazon: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    sirena: '<path d="M6 18v-6a6 6 0 0 1 12 0v6M4 18h16v3H4zM12 2v2M3 7l1.5 1M21 7l-1.5 1"/>',
    planeta: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    reciclar: '<path d="M7 19H4l3-5M17 19h3l-3-5M9 6l3-4 3 4"/><path d="M7 19h10M5.5 11.5 9 6M18.5 11.5 15 6"/>',
    carpeta: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    atras: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    descarga: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    copiar: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    salir: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
    basura: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    refrescar: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'
  };
  const icono = (n, cls = "ico") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.estrella}</svg>`;

  /* ---------- Texto seguro ---------- */
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fechaLarga = (iso) => {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  };
  const fechaCorta = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  /* ---------- Almacenamiento ---------- */
  const DEMO_KEY = "ps_induccion_demo_registros";
  const PEND_KEY = "ps_induccion_pendientes";
  const leerLS = (k) => { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } };
  const escribirLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const modoDemo = () => !C.API_URL;

  async function llamar(cuerpo) {
    // text/plain evita la verificación CORS previa que Apps Script no responde
    const r = await fetch(C.API_URL, { method: "POST", body: JSON.stringify(cuerpo) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }

  async function guardarRegistro(reg) {
    if (modoDemo()) {
      const todos = leerLS(DEMO_KEY);
      reg.intento = todos.filter((x) => x.documento === reg.documento && x.tipo === reg.tipo).length + 1;
      todos.push(reg);
      escribirLS(DEMO_KEY, todos);
      return { ok: true, intento: reg.intento, demo: true };
    }
    try {
      const res = await llamar({ accion: "registrar", registro: reg });
      if (!res.ok) throw new Error(res.error || "Error al guardar");
      return res;
    } catch (e) {
      // Sin conexión: se guarda en el navegador y se reintenta en la próxima visita
      const pend = leerLS(PEND_KEY); pend.push(reg); escribirLS(PEND_KEY, pend);
      return { ok: false, pendiente: true, error: e.message };
    }
  }

  async function reenviarPendientes() {
    if (modoDemo()) return;
    const pend = leerLS(PEND_KEY);
    if (!pend.length) return;
    const quedan = [];
    for (const reg of pend) {
      try { const r = await llamar({ accion: "registrar", registro: reg }); if (!r.ok) quedan.push(reg); }
      catch (e) { quedan.push(reg); }
    }
    escribirLS(PEND_KEY, quedan);
  }

  async function listarRegistros(clave) {
    if (modoDemo()) {
      if (clave !== C.CLAVE_DEMO) return { ok: false, error: "Clave incorrecta" };
      return { ok: true, registros: leerLS(DEMO_KEY), demo: true };
    }
    return llamar({ accion: "listar", clave });
  }

  async function eliminarRegistros(clave, ids) {
    if (modoDemo()) {
      if (clave !== C.CLAVE_DEMO) return { ok: false, error: "Clave incorrecta" };
      const todos = leerLS(DEMO_KEY), quedan = todos.filter((r) => !ids.includes(r.id));
      escribirLS(DEMO_KEY, quedan);
      return { ok: true, eliminados: todos.length - quedan.length };
    }
    return llamar({ accion: "eliminar", clave, ids });
  }

  /* ---------- Banco de preguntas ---------- */
  const PREG_KEY = "ps_induccion_preguntas_cache";
  const PREG_DEMO = "ps_induccion_demo_preguntas";
  const AJ_DEMO = "ps_induccion_demo_ajustes";
  const ajustesBase = () => ({ notaMinima: C.NOTA_MINIMA, mezclarPreguntas: true });

  // Completa los campos que las preguntas antiguas (evaluacion.js) no traen
  function normalizarPregunta(q) {
    const tipo = q.tipo || "unica";
    const opciones = tipo === "vf" ? ["Verdadero", "Falso"] : tipo === "abierta" ? [] : (q.opciones || []);
    const refiere = opciones.some((o) => /anteriores|son correctas|\b[a-f] y [a-f]\b/i.test(o));
    return {
      id: String(q.id), tipo, texto: q.texto || "", opciones,
      correcta: tipo === "multiple" ? [].concat(q.correcta ?? []) : tipo === "abierta" ? null : (q.correcta ?? 0),
      peso: Number(q.peso) || 1,
      // Por defecto: las abiertas sin palabras clave no cuentan
      califica: q.califica !== undefined ? !!q.califica : (tipo !== "abierta" || !!(q.claves && q.claves.length)),
      obligatoria: q.obligatoria !== undefined ? !!q.obligatoria : true,
      mezclar: q.mezclar !== undefined ? !!q.mezclar && !refiere : !refiere,
      claves: q.claves || [], minClaves: Number(q.minClaves) || 1,
      activa: q.activa !== false
    };
  }
  const preguntasBase = () => (window.PS_EVALUACION || []).map(normalizarPregunta);

  // Para el trabajador: preguntas activas y ajustes
  async function cargarPreguntas() {
    if (modoDemo()) {
      const dem = leerLS(PREG_DEMO);
      let aj; try { aj = JSON.parse(localStorage.getItem(AJ_DEMO)); } catch (e) {}
      return { preguntas: (dem.length ? dem.map(normalizarPregunta) : preguntasBase()).filter((q) => q.activa), ajustes: { ...ajustesBase(), ...(aj || {}) } };
    }
    try {
      const r = await llamar({ accion: "preguntas" });
      if (!r.ok) throw new Error(r.error);
      const out = { preguntas: (r.preguntas ? r.preguntas.map(normalizarPregunta) : preguntasBase()).filter((q) => q.activa), ajustes: { ...ajustesBase(), ...(r.ajustes || {}) } };
      try { localStorage.setItem(PREG_KEY, JSON.stringify(out)); } catch (e) {}
      return out;
    } catch (e) {
      // Sin conexión: última copia conocida o las preguntas incluidas
      try { const c = JSON.parse(localStorage.getItem(PREG_KEY)); if (c && c.preguntas) return c; } catch (x) {}
      return { preguntas: preguntasBase(), ajustes: ajustesBase() };
    }
  }

  // Para el panel: todas, incluidas las inactivas
  async function preguntasAdmin(clave) {
    if (modoDemo()) {
      if (clave !== C.CLAVE_DEMO) return { ok: false, error: "Clave incorrecta" };
      const dem = leerLS(PREG_DEMO);
      let aj; try { aj = JSON.parse(localStorage.getItem(AJ_DEMO)); } catch (e) {}
      return { ok: true, preguntas: dem.length ? dem.map(normalizarPregunta) : preguntasBase(), ajustes: { ...ajustesBase(), ...(aj || {}) }, base: !dem.length };
    }
    const r = await llamar({ accion: "preguntasAdmin", clave });
    if (!r.ok) return r;
    return { ok: true, preguntas: r.preguntas ? r.preguntas.map(normalizarPregunta) : preguntasBase(), ajustes: { ...ajustesBase(), ...(r.ajustes || {}) }, base: !r.preguntas };
  }

  async function guardarPreguntas(clave, preguntas, ajustes) {
    if (modoDemo()) {
      if (clave !== C.CLAVE_DEMO) return { ok: false, error: "Clave incorrecta" };
      escribirLS(PREG_DEMO, preguntas);
      try { localStorage.setItem(AJ_DEMO, JSON.stringify(ajustes)); } catch (e) {}
      return { ok: true, guardadas: preguntas.length };
    }
    return llamar({ accion: "guardarPreguntas", clave, preguntas, ajustes });
  }

  // Quita tildes y mayúsculas para comparar palabras clave
  const plano = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function esCorrecta(q, v) {
    if (q.tipo === "abierta") {
      if (!q.claves.length) return false;
      const txt = plano(v);
      return q.claves.filter((k) => txt.includes(plano(k))).length >= Math.min(q.minClaves, q.claves.length);
    }
    if (q.tipo === "multiple") return JSON.stringify([...(v || [])].sort((a, b) => a - b)) === JSON.stringify([...q.correcta].sort((a, b) => a - b));
    return v === q.correcta;
  }

  function codigoCertificado() {
    const a = new Date().getFullYear();
    const r = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${C.CODIGO_CERTIFICADO}-${a}-${r}`;
  }

  /* ---------- Certificado ---------- */
  function certificadoHTML(r) {
    const tipo = r.tipo === "Reinducción" ? "Reinducción" : "Inducción";
    return `
    <article class="cert" aria-label="Certificado">
      <div class="cert-marco">
        <header class="cert-top">
          <img src="img/logo.png" alt="Process Solutions" class="cert-logo">
          <span class="cert-cod">Código: ${esc(r.id)}</span>
        </header>
        <p class="cert-sup">Certificado de participación y aprobación</p>
        <p class="cert-txt">${esc(C.EMPRESA)} certifica que</p>
        <h2 class="cert-nombre">${esc(r.nombre)}</h2>
        <p class="cert-txt">identificado(a) con documento N.° <b>${esc(r.documento)}</b>, en el cargo de <b>${esc(r.cargo || "—")}</b>
        del proceso <b>${esc(r.proceso)}</b>, participó y aprobó la</p>
        <h3 class="cert-curso">${tipo} en Seguridad, Salud en el Trabajo, Calidad y Ambiente (HSEQ)</h3>
        <p class="cert-txt">realizada el ${esc(fechaLarga(r.fecha))}, con un puntaje de <b>${esc(r.puntaje)} %</b>.</p>
        <footer class="cert-pie">
          <div class="cert-firma"><span class="linea"></span><b>${esc(C.FIRMA_NOMBRE)}</b><small>${esc(C.FIRMA_CARGO)}</small></div>
          <div class="cert-sello"><b>${esc(r.puntaje)}%</b><small>Aprobado</small></div>
        </footer>
      </div>
    </article>`;
  }

  function aCSV(filas, columnas) {
    const celda = (v) => { const s = String(v ?? ""); return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const lineas = [columnas.map((c) => celda(c.t)).join(";")];
    for (const f of filas) lineas.push(columnas.map((c) => celda(c.v(f))).join(";"));
    return "﻿" + lineas.join("\r\n");
  }

  function descargar(nombre, contenido, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  window.PS = { icono, esc, fechaLarga, fechaCorta, guardarRegistro, reenviarPendientes, listarRegistros, eliminarRegistros, cargarPreguntas, preguntasAdmin, guardarPreguntas, normalizarPregunta, esCorrecta, codigoCertificado, certificadoHTML, aCSV, descargar, modoDemo };
})();
