/* Panel de administración: ingreso con clave, indicadores, filtros, exportación y certificados */
{
  const C = window.PS_CONFIG, Q = window.PS_EVALUACION;
  const { icono, esc, fechaCorta } = window.PS;
  const panel = document.getElementById("panel");
  const modal = document.getElementById("modal");
  const SES = "ps_admin_clave";
  let registros = [];
  const filtro = { q: "", tipo: "", proceso: "", resultado: "", desde: "", hasta: "", todos: false };

  if (window.PS.modoDemo()) document.getElementById("avisoDemo").hidden = false;

  const claveSesion = () => { try { return sessionStorage.getItem(SES) || ""; } catch (e) { return ""; } };
  const guardarClave = (c) => { try { c ? sessionStorage.setItem(SES, c) : sessionStorage.removeItem(SES); } catch (e) {} };

  /* ---------- Ingreso ---------- */
  function vistaIngreso(msg = "") {
    document.getElementById("bSalir").hidden = true;
    panel.innerHTML = `
      <section class="tarjeta login entra">
        <div class="cab"><div><span class="pill">Panel de administración</span><h1>Ingreso</h1><p>Escriba la clave de administrador.</p></div>
          <span class="cab-ico">${icono("candado")}</span></div>
        <form id="fLogin" class="cuerpo form">
          <label>Clave<input type="password" name="clave" required autocomplete="current-password" autofocus></label>
          <p class="error" role="alert">${esc(msg)}</p>
          <button class="btn primario ancho" type="submit">Ingresar</button>
        </form>
      </section>`;
    document.getElementById("fLogin").addEventListener("submit", (e) => {
      e.preventDefault();
      entrar(e.target.elements.clave.value);
    });
  }

  async function entrar(clave) {
    panel.innerHTML = `<p class="cargando">Cargando registros…</p>`;
    try {
      const r = await window.PS.listarRegistros(clave);
      if (!r.ok) { guardarClave(""); return vistaIngreso(r.error || "Clave incorrecta."); }
      guardarClave(clave);
      registros = (r.registros || []).map(normalizar).sort((a, b) => b.fecha.localeCompare(a.fecha));
      vistaPanel();
    } catch (e) {
      vistaIngreso("No se pudo conectar con Google Sheets. Revise la URL en js/config.js.");
    }
  }

  function normalizar(r) {
    let resp = r.respuestas;
    if (typeof resp === "string") { try { resp = JSON.parse(resp); } catch (e) { resp = {}; } }
    const fecha = r.fecha instanceof Date ? r.fecha.toISOString() : String(r.fecha || "");
    return { ...r, fecha, documento: String(r.documento ?? ""), puntaje: +r.puntaje || 0, intento: +r.intento || 1,
      aprobado: r.aprobado === true || r.aprobado === "TRUE" || r.aprobado === "Sí" || r.aprobado === "SI", respuestas: resp || {} };
  }

  /* ---------- Filtros ---------- */
  function filtrados() {
    const q = filtro.q.trim().toLowerCase();
    let lista = registros.filter((r) =>
      (!q || [r.nombre, r.documento, r.cargo, r.id].some((v) => String(v || "").toLowerCase().includes(q))) &&
      (!filtro.tipo || r.tipo === filtro.tipo) &&
      (!filtro.proceso || r.proceso === filtro.proceso) &&
      (!filtro.desde || r.fecha.slice(0, 10) >= filtro.desde) &&
      (!filtro.hasta || r.fecha.slice(0, 10) <= filtro.hasta));
    if (!filtro.todos) {
      // Mejor intento por persona y tipo de actividad
      const mejor = new Map();
      for (const r of lista) {
        const k = r.documento + "|" + r.tipo, m = mejor.get(k);
        if (!m || r.puntaje > m.puntaje || (r.puntaje === m.puntaje && r.fecha > m.fecha)) mejor.set(k, r);
      }
      lista = [...mejor.values()].sort((a, b) => b.fecha.localeCompare(a.fecha));
    }
    if (filtro.resultado) lista = lista.filter((r) => (filtro.resultado === "a") === r.aprobado);
    return lista;
  }

  /* ---------- Panel ---------- */
  function vistaPanel() {
    document.getElementById("bSalir").hidden = false;
    const base = location.href.split(/[?#]/)[0].replace(/admin\.html$/, "");
    const enlaceInd = base, enlaceRe = base + "?tipo=reinduccion";
    const procesos = [...new Set([...C.PROCESOS, ...registros.map((r) => r.proceso).filter(Boolean)])];
    panel.innerHTML = `
      <section class="titulo-panel">
        <div><h1>Resultados de la inducción HSEQ</h1>
        <p class="ayuda">Estadísticas por participante (se toma su mejor intento, salvo que marque «Mostrar todos los intentos»). Los filtros aplican a todo.</p></div>
        <button class="btn" id="bActualizar">${icono("refrescar")} Actualizar</button>
      </section>
      <section class="enlaces">
        ${[["Enlace de inducción", enlaceInd], ["Enlace de reinducción", enlaceRe]].map(([t, u], i) => `
          <div class="enlace"><b>${t}</b><code id="enl${i}">${esc(u)}</code>
          <button class="btn chico" data-copiar="enl${i}">${icono("copiar")} Copiar</button></div>`).join("")}
      </section>
      <section class="kpis" id="kpis"></section>
      <section class="grid2">
        <div class="caja"><h2 class="sub">Aprobación por proceso</h2><div id="barras" class="barras"></div></div>
        <div class="caja"><h2 class="sub">Preguntas con más errores</h2><div id="errores" class="barras"></div></div>
      </section>
      <section class="caja">
        <div class="filtros">
          <label class="crece">Buscar<input id="fq" placeholder="Nombre, documento, cargo o código" value="${esc(filtro.q)}"></label>
          <label>Tipo<select id="ftipo"><option value="">Todos</option><option>Inducción</option><option>Reinducción</option></select></label>
          <label>Proceso<select id="fproc"><option value="">Todos</option>${procesos.map((p) => `<option>${esc(p)}</option>`).join("")}</select></label>
          <label>Resultado<select id="fres"><option value="">Todos</option><option value="a">Aprobado</option><option value="n">No aprobado</option></select></label>
          <label>Desde<input type="date" id="fdesde" value="${esc(filtro.desde)}"></label>
          <label>Hasta<input type="date" id="fhasta" value="${esc(filtro.hasta)}"></label>
        </div>
        <div class="filtros-pie">
          <label class="check"><input type="checkbox" id="ftodos" ${filtro.todos ? "checked" : ""}><span>Mostrar todos los intentos</span></label>
          <div class="acciones">
            <button class="btn chico" id="bLimpiar">Limpiar filtros</button>
            <button class="btn chico primario" id="bCSV">${icono("descarga")} Excel (CSV)</button>
          </div>
        </div>
        <div class="scroll"><table class="tabla stack" id="tabla"></table></div>
      </section>`;
    document.getElementById("ftipo").value = filtro.tipo;
    document.getElementById("fproc").value = filtro.proceso;
    document.getElementById("fres").value = filtro.resultado;

    const enlazar = (id, campo, ev = "input", prop = "value") =>
      document.getElementById(id).addEventListener(ev, (e) => { filtro[campo] = e.target[prop]; pintar(); });
    enlazar("fq", "q"); enlazar("ftipo", "tipo", "change"); enlazar("fproc", "proceso", "change");
    enlazar("fres", "resultado", "change"); enlazar("fdesde", "desde", "change"); enlazar("fhasta", "hasta", "change");
    enlazar("ftodos", "todos", "change", "checked");
    document.getElementById("bLimpiar").onclick = () => { Object.assign(filtro, { q: "", tipo: "", proceso: "", resultado: "", desde: "", hasta: "", todos: false }); vistaPanel(); };
    document.getElementById("bActualizar").onclick = () => entrar(claveSesion());
    document.getElementById("bCSV").onclick = exportar;
    panel.querySelectorAll("[data-copiar]").forEach((b) => b.addEventListener("click", async () => {
      const t = document.getElementById(b.dataset.copiar).textContent;
      try { await navigator.clipboard.writeText(t); b.textContent = "¡Copiado!"; }
      catch (e) { const r = document.createRange(); r.selectNodeContents(document.getElementById(b.dataset.copiar)); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = "Seleccionado"; }
      setTimeout(() => (b.innerHTML = `${icono("copiar")} Copiar`), 1800);
    }));
    pintar();
  }

  function pintar() {
    const lista = filtrados();
    const personas = new Set(lista.map((r) => r.documento)).size;
    const aprob = lista.filter((r) => r.aprobado).length;
    const pct = lista.length ? Math.round((aprob / lista.length) * 100) : 0;
    const prom = lista.length ? Math.round(lista.reduce((s, r) => s + r.puntaje, 0) / lista.length) : 0;
    const ind = lista.filter((r) => r.tipo === "Inducción").length;
    document.getElementById("kpis").innerHTML = [
      ["grupo", personas, "Participantes"],
      ["check", pct + "%", `Aprobación (${aprob} de ${lista.length})`],
      ["estrella", prom + "%", "Puntaje promedio"],
      ["documento", `${ind} / ${lista.length - ind}`, "Inducciones / reinducciones"]
    ].map(([i, v, t]) => `<div class="kpi"><span class="kpi-ico">${icono(i)}</span><div><b>${esc(v)}</b><small>${esc(t)}</small></div></div>`).join("");

    // Aprobación por proceso
    const porProc = {};
    for (const r of lista) { const p = r.proceso || "Sin proceso"; (porProc[p] ||= { n: 0, a: 0 }).n++; if (r.aprobado) porProc[p].a++; }
    const filas = Object.entries(porProc).sort((a, b) => b[1].n - a[1].n);
    document.getElementById("barras").innerHTML = filas.length ? filas.map(([p, v]) => {
      const x = Math.round((v.a / v.n) * 100);
      return `<div class="barra-fila"><span class="barra-et">${esc(p)}</span><span class="barra-pista"><span style="width:${x}%"></span></span><span class="barra-val">${x}% <small>(${v.a}/${v.n})</small></span></div>`;
    }).join("") : `<p class="vacio">Sin datos con estos filtros.</p>`;

    // Preguntas con más errores (sobre todos los intentos filtrados)
    const cuenta = {};
    for (const r of lista) String(r.fallidas || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((id) => (cuenta[id] = (cuenta[id] || 0) + 1));
    const top = Object.entries(cuenta).sort((a, b) => b[1] - a[1]).slice(0, 5);
    document.getElementById("errores").innerHTML = top.length ? top.map(([id, n]) => {
      const q = Q.find((x) => x.id === id); const x = Math.round((n / lista.length) * 100);
      return `<div class="barra-fila"><span class="barra-et" title="${esc(q?.texto)}">${esc(q ? q.texto : id)}</span><span class="barra-pista mal"><span style="width:${x}%"></span></span><span class="barra-val">${x}%</span></div>`;
    }).join("") : `<p class="vacio">Sin errores registrados.</p>`;

    const t = document.getElementById("tabla");
    if (!lista.length) { t.innerHTML = `<tbody><tr><td class="vacio">No hay registros${registros.length ? " con estos filtros" : " todavía. Envíe el enlace de inducción para empezar a recibirlos"}.</td></tr></tbody>`; return; }
    t.innerHTML = `<thead><tr><th>Fecha</th><th>Nombre</th><th>Documento</th><th>Cargo</th><th>Proceso</th><th>Tipo</th><th class="der">Puntaje</th><th class="der">Intento</th><th>Resultado</th><th>Acciones</th></tr></thead>
      <tbody>${lista.map((r, i) => `<tr>
        <td class="nw">${esc(fechaCorta(r.fecha))}</td><td><b>${esc(r.nombre)}</b></td><td>${esc(r.documento)}</td>
        <td>${esc(r.cargo)}</td><td>${esc(r.proceso)}</td><td>${esc(r.tipo)}</td>
        <td class="der">${esc(r.puntaje)}%</td><td class="der">${esc(r.intento)}</td>
        <td><span class="estado ${r.aprobado ? "si" : "no"}">${r.aprobado ? "Aprobado" : "No aprobado"}</span></td>
        <td class="nw"><button class="btn mini" data-ver="${i}">Respuestas</button>${r.aprobado ? ` <button class="btn mini primario" data-cert="${i}">Certificado</button>` : ""}</td>
      </tr>`).join("")}</tbody>`;
    const titulos = [...t.querySelectorAll("thead th")].map((th) => th.textContent);
    t.querySelectorAll("tbody tr").forEach((tr) => [...tr.cells].forEach((td, k) => (td.dataset.l = titulos[k] || "")));
    t.querySelectorAll("[data-cert]").forEach((b) => (b.onclick = () => abrirModal(window.PS.certificadoHTML(lista[+b.dataset.cert]), true)));
    t.querySelectorAll("[data-ver]").forEach((b) => (b.onclick = () => abrirModal(respuestasHTML(lista[+b.dataset.ver]), false)));
  }

  function respuestasHTML(r) {
    const fall = String(r.fallidas || "").split(",").map((s) => s.trim());
    return `<div class="detalle"><h2>${esc(r.nombre)}</h2>
      <p class="ayuda">${esc(r.tipo)} · ${esc(fechaCorta(r.fecha))} · ${esc(r.puntaje)}% · intento ${esc(r.intento)} · código ${esc(r.id)}${r.duracionMin ? ` · ${esc(r.duracionMin)} min` : ""}</p>
      <ol>${Q.map((q) => {
        const marca = q.tipo === "abierta" ? "" : fall.includes(q.id) ? `<span class="estado no">Incorrecta</span>` : `<span class="estado si">Correcta</span>`;
        return `<li><b>${esc(q.texto)}</b> ${marca}<p>${esc(r.respuestas[q.id] || "—")}</p></li>`;
      }).join("")}</ol></div>`;
  }

  function abrirModal(html, imprimible) {
    document.getElementById("modalCuerpo").innerHTML = html;
    document.getElementById("bImprimir").hidden = !imprimible;
    document.body.classList.toggle("imprime-modal", imprimible);
    modal.hidden = false;
    document.getElementById("bCerrar").focus();
  }
  const cerrarModal = () => { modal.hidden = true; document.body.classList.remove("imprime-modal"); };
  document.getElementById("bCerrar").onclick = cerrarModal;
  modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) cerrarModal(); });
  document.getElementById("bImprimir").onclick = () => { try { window.print(); } catch (e) {} };
  document.getElementById("bSalir").onclick = () => { guardarClave(""); registros = []; vistaIngreso(); };

  function exportar() {
    const cols = [
      { t: "Fecha", v: (r) => fechaCorta(r.fecha) }, { t: "Código certificado", v: (r) => r.id },
      { t: "Tipo", v: (r) => r.tipo }, { t: "Nombre", v: (r) => r.nombre }, { t: "Documento", v: (r) => r.documento },
      { t: "Cargo", v: (r) => r.cargo }, { t: "Proceso", v: (r) => r.proceso }, { t: "Empresa", v: (r) => r.empresa },
      { t: "Puntaje %", v: (r) => r.puntaje }, { t: "Correctas", v: (r) => r.correctas }, { t: "Total", v: (r) => r.total },
      { t: "Resultado", v: (r) => (r.aprobado ? "Aprobado" : "No aprobado") }, { t: "Intento", v: (r) => r.intento },
      { t: "Duración (min)", v: (r) => r.duracionMin },
      ...Q.map((q, i) => ({ t: `P${i + 1}. ${q.texto.slice(0, 60)}`, v: (r) => r.respuestas[q.id] || "" }))
    ];
    const hoy = new Date().toISOString().slice(0, 10);
    window.PS.descargar(`induccion_hseq_${hoy}.csv`, window.PS.aCSV(filtrados(), cols), "text/csv;charset=utf-8");
  }

  claveSesion() ? entrar(claveSesion()) : vistaIngreso();
}
