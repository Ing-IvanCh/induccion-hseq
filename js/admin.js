/* Panel de administración: ingreso con clave, indicadores, filtros, exportación y certificados */
{
  const C = window.PS_CONFIG;
  let Q = (window.PS_EVALUACION || []).map(window.PS.normalizarPregunta); // banco actual (para textos)
  let pestana = "resultados";
  const { icono, esc, fechaCorta } = window.PS;
  const panel = document.getElementById("panel");
  const modal = document.getElementById("modal");
  const SES = "ps_admin_clave";
  let registros = [];
  const sel = new Set(); // ids seleccionados para eliminar
  const filtro = { q: "", tipo: "", proceso: "", resultado: "", desde: "", hasta: "", todos: false };

  if (window.PS.modoDemo()) document.getElementById("avisoDemo").hidden = false;

  const claveSesion = () => { try { return sessionStorage.getItem(SES) || ""; } catch (e) { return ""; } };
  const editor = window.PS_EDITOR;
  editor.usar({ clave: () => claveSesion(), aviso: (t) => aviso(t), alGuardar: (b) => { Q = b; } });
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
      const [r, b] = await Promise.all([window.PS.listarRegistros(clave), window.PS.preguntasAdmin(clave).catch(() => null)]);
      if (!r.ok) { guardarClave(""); return vistaIngreso(r.error || "Clave incorrecta."); }
      guardarClave(clave);
      if (b && b.ok) { Q = b.preguntas; editor.cargar(b); }
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
    if (pestana === "evaluacion") {
      panel.innerHTML = cabecera() + `<div id="zonaEditor"></div>`;
      enlazarPestanas();
      editor.pintar(document.getElementById("zonaEditor"));
      return;
    }
    const base = location.href.split(/[?#]/)[0].replace(/admin\.html$/, "");
    const enlaceInd = base, enlaceRe = base + "?tipo=reinduccion";
    const procesos = [...new Set([...C.PROCESOS, ...registros.map((r) => r.proceso).filter(Boolean)])];
    panel.innerHTML = cabecera() + `
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
        <div class="barra-sel" id="barraSel" hidden>
          <span id="selTxt"></span>
          <button class="btn chico" id="bSelNada">Quitar selección</button>
          <button class="btn chico peligro" id="bSelBorrar">${icono("basura")} Eliminar seleccionados</button>
        </div>
        <div class="scroll"><table class="tabla stack" id="tabla"></table></div>
      </section>`;
    enlazarPestanas();
    document.getElementById("ftipo").value = filtro.tipo;
    document.getElementById("fproc").value = filtro.proceso;
    document.getElementById("fres").value = filtro.resultado;

    const enlazar = (id, campo, ev = "input", prop = "value") =>
      document.getElementById(id).addEventListener(ev, (e) => { filtro[campo] = e.target[prop]; pintar(); });
    enlazar("fq", "q"); enlazar("ftipo", "tipo", "change"); enlazar("fproc", "proceso", "change");
    enlazar("fres", "resultado", "change"); enlazar("fdesde", "desde", "change"); enlazar("fhasta", "hasta", "change");
    enlazar("ftodos", "todos", "change", "checked");
    document.getElementById("bLimpiar").onclick = () => { Object.assign(filtro, { q: "", tipo: "", proceso: "", resultado: "", desde: "", hasta: "", todos: false }); vistaPanel(); };
    document.getElementById("bCSV").onclick = exportar;
    document.getElementById("bSelNada").onclick = () => { sel.clear(); pintar(); };
    document.getElementById("bSelBorrar").onclick = () => pedirEliminar(filtrados().filter((r) => sel.has(r.id)));
    panel.querySelectorAll("[data-copiar]").forEach((b) => b.addEventListener("click", async () => {
      const t = document.getElementById(b.dataset.copiar).textContent;
      try { await navigator.clipboard.writeText(t); b.textContent = "¡Copiado!"; }
      catch (e) { const r = document.createRange(); r.selectNodeContents(document.getElementById(b.dataset.copiar)); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = "Seleccionado"; }
      setTimeout(() => (b.innerHTML = `${icono("copiar")} Copiar`), 1800);
    }));
    pintar();
  }

  function cabecera() {
    const res = pestana === "resultados";
    return `<section class="titulo-panel">
        <div><h1>${res ? "Resultados de la inducción HSEQ" : "Preguntas de la evaluación"}</h1>
        <p class="ayuda">${res ? "Estadísticas por participante (se toma su mejor intento, salvo que marque «Mostrar todos los intentos»). Los filtros aplican a todo." : "Lo que guarde aquí es lo que verán los trabajadores en su próxima evaluación. Los registros anteriores no cambian."}</p></div>
        ${res ? `<button class="btn" id="bActualizar">${icono("refrescar")} Actualizar</button>` : ""}
      </section>
      <nav class="pestanas" role="tablist">
        <button role="tab" data-pest="resultados" aria-selected="${res}">${icono("grupo")} Resultados</button>
        <button role="tab" data-pest="evaluacion" aria-selected="${!res}">${icono("documento")} Evaluación</button>
      </nav>`;
  }

  function enlazarPestanas() {
    panel.querySelectorAll("[data-pest]").forEach((b) => (b.onclick = () => {
      if (b.dataset.pest === pestana) return;
      if (pestana === "evaluacion" && editor.sucio() && !editor.confirmarSalida()) return;
      pestana = b.dataset.pest; vistaPanel();
    }));
    const ba = document.getElementById("bActualizar");
    if (ba) ba.onclick = () => entrar(claveSesion());
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
    const todosSel = lista.every((r) => sel.has(r.id));
    t.innerHTML = `<thead><tr><th class="col-sel"><input type="checkbox" id="selTodos" aria-label="Seleccionar todos" ${todosSel ? "checked" : ""}></th><th>Fecha</th><th>Nombre</th><th>Documento</th><th>Cargo</th><th>Proceso</th><th>Tipo</th><th class="der">Puntaje</th><th class="der">Intento</th><th>Resultado</th><th>Acciones</th></tr></thead>
      <tbody>${lista.map((r, i) => `<tr class="${sel.has(r.id) ? "marcada" : ""}">
        <td class="col-sel"><input type="checkbox" data-sel="${i}" aria-label="Seleccionar ${esc(r.nombre)}" ${sel.has(r.id) ? "checked" : ""}></td>
        <td class="nw">${esc(fechaCorta(r.fecha))}</td><td><b>${esc(r.nombre)}</b></td><td>${esc(r.documento)}</td>
        <td>${esc(r.cargo)}</td><td>${esc(r.proceso)}</td><td>${esc(r.tipo)}</td>
        <td class="der">${esc(r.puntaje)}%</td><td class="der">${esc(r.intento)}</td>
        <td><span class="estado ${r.aprobado ? "si" : "no"}">${r.aprobado ? "Aprobado" : "No aprobado"}</span></td>
        <td class="nw"><button class="btn mini" data-ver="${i}">Respuestas</button>${r.aprobado ? ` <button class="btn mini primario" data-cert="${i}">Certificado</button>` : ""} <button class="btn mini peligro" data-borrar="${i}" aria-label="Eliminar registro de ${esc(r.nombre)}">${icono("basura")}</button></td>
      </tr>`).join("")}</tbody>`;
    const titulos = [...t.querySelectorAll("thead th")].map((th) => th.textContent);
    t.querySelectorAll("tbody tr").forEach((tr) => [...tr.cells].forEach((td, k) => (td.dataset.l = titulos[k] || "")));
    t.querySelectorAll("[data-cert]").forEach((b) => (b.onclick = () => abrirModal(window.PS.certificadoHTML(lista[+b.dataset.cert]), true)));
    t.querySelectorAll("[data-ver]").forEach((b) => (b.onclick = () => abrirModal(respuestasHTML(lista[+b.dataset.ver]), false)));
    t.querySelectorAll("[data-borrar]").forEach((b) => (b.onclick = () => pedirEliminar([lista[+b.dataset.borrar]])));
    t.querySelectorAll("[data-sel]").forEach((c) => (c.onchange = () => { const r = lista[+c.dataset.sel]; c.checked ? sel.add(r.id) : sel.delete(r.id); pintar(); }));
    document.getElementById("selTodos").onchange = (e) => { lista.forEach((r) => (e.target.checked ? sel.add(r.id) : sel.delete(r.id))); pintar(); };
    barraSeleccion(lista);
  }

  function barraSeleccion(lista) {
    const n = lista.filter((r) => sel.has(r.id)).length;
    const b = document.getElementById("barraSel");
    if (!b) return;
    b.hidden = !n;
    document.getElementById("selTxt").textContent = `${n} seleccionado${n === 1 ? "" : "s"}`;
  }

  /* ---------- Eliminar registros ---------- */
  function pedirEliminar(filas) {
    if (!filas.length) return;
    // Sin «Mostrar todos los intentos», cada fila representa a la persona: se borran todos sus intentos de ese tipo
    const claves = new Set(filas.map((r) => r.documento + "|" + r.tipo));
    const objetivo = filtro.todos ? filas : registros.filter((r) => claves.has(r.documento + "|" + r.tipo));
    const ids = [...new Set(objetivo.map((r) => r.id))];
    const nombres = [...new Set(filas.map((r) => r.nombre))];
    const extra = !filtro.todos && ids.length > filas.length ? `<p class="ayuda">Incluye todos los intentos de ${nombres.length === 1 ? "esta persona" : "estas personas"} (${ids.length} registros en total).</p>` : "";
    abrirModal(`<div class="detalle confirmar">
      <span class="conf-ico">${icono("basura")}</span>
      <h2>¿Eliminar ${ids.length === 1 ? "este registro" : `${ids.length} registros`}?</h2>
      <p>${nombres.slice(0, 6).map(esc).join(", ")}${nombres.length > 6 ? ` y ${nombres.length - 6} más` : ""}</p>${extra}
      <p class="aviso">Se borrarán de la hoja de Google y no se pueden recuperar desde el panel. Si los necesita como evidencia, descargue antes el Excel (CSV).</p>
      <p class="error" id="errBorrar" role="alert"></p>
      <div class="nav sin-borde"><button class="btn" id="bNoBorrar">Cancelar</button><button class="btn peligro-lleno" id="bSiBorrar">${icono("basura")} Sí, eliminar</button></div>
    </div>`, false, true);
    document.getElementById("bNoBorrar").onclick = cerrarModal;
    document.getElementById("bSiBorrar").onclick = async (e) => {
      const b = e.currentTarget; b.disabled = true; b.textContent = "Eliminando…";
      try {
        const r = await window.PS.eliminarRegistros(claveSesion(), ids);
        if (!r.ok) throw new Error(r.error || "No se pudo eliminar");
        ids.forEach((id) => sel.delete(id));
        registros = registros.filter((x) => !ids.includes(x.id));
        cerrarModal(); pintar();
        aviso(`${r.eliminados} registro${r.eliminados === 1 ? "" : "s"} eliminado${r.eliminados === 1 ? "" : "s"}.`);
      } catch (err) {
        document.getElementById("errBorrar").textContent = err.message;
        b.disabled = false; b.innerHTML = `${icono("basura")} Sí, eliminar`;
      }
    };
  }

  function aviso(txt) {
    let a = document.getElementById("toast");
    if (!a) { a = document.createElement("div"); a.id = "toast"; a.className = "toast"; a.setAttribute("role", "status"); document.body.appendChild(a); }
    a.textContent = txt; a.classList.add("ver");
    clearTimeout(a._t); a._t = setTimeout(() => a.classList.remove("ver"), 3000);
  }

  function respuestasHTML(r) {
    const fall = String(r.fallidas || "").split(",").map((x) => x.trim());
    const ids = Object.keys(r.respuestas || {});
    const orden = [...Q.filter((q) => ids.includes(q.id)), ...ids.filter((id) => !Q.some((q) => q.id === id)).map((id) => ({ id, texto: `Pregunta ${id} (ya no está en el banco)`, califica: false }))];
    return `<div class="detalle"><h2>${esc(r.nombre)}</h2>
      <p class="ayuda">${esc(r.tipo)} · ${esc(fechaCorta(r.fecha))} · ${esc(r.puntaje)}% · intento ${esc(r.intento)} · código ${esc(r.id)}${r.duracionMin ? ` · ${esc(r.duracionMin)} min` : ""}</p>
      <ol>${orden.map((q) => {
        const marca = fall.includes(q.id) ? `<span class="estado no">Incorrecta</span>` : q.califica ? `<span class="estado si">Correcta</span>` : "";
        return `<li><b>${esc(q.texto)}</b> ${marca}<p>${esc(r.respuestas[q.id] || "—")}</p></li>`;
      }).join("")}</ol></div>`;
  }

  function abrirModal(html, imprimible, sinPie) {
    document.getElementById("modalCuerpo").innerHTML = html;
    document.getElementById("bImprimir").hidden = !imprimible;
    document.querySelector(".modal-caja > .nav").hidden = !!sinPie;
    document.body.classList.toggle("imprime-modal", imprimible);
    modal.hidden = false;
    (document.getElementById(sinPie ? "bNoBorrar" : "bCerrar") || document.getElementById("bCerrar")).focus();
  }
  const cerrarModal = () => { modal.hidden = true; document.body.classList.remove("imprime-modal"); };
  document.getElementById("bCerrar").onclick = cerrarModal;
  modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) cerrarModal(); });
  document.getElementById("bImprimir").onclick = () => { try { window.print(); } catch (e) {} };
  document.getElementById("bSalir").onclick = () => {
    if (editor.sucio() && !editor.confirmarSalida()) return;
    guardarClave(""); registros = []; pestana = "resultados"; vistaIngreso();
  };
  window.addEventListener("beforeunload", (e) => { if (editor.sucio()) { e.preventDefault(); e.returnValue = ""; } });

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
