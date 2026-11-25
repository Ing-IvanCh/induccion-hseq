/* Editor del banco de preguntas (pestaña «Evaluación» del panel) */
window.PS_EDITOR = (() => {
  const { icono, esc } = window.PS;
  const TIPOS = [["unica", "Única respuesta"], ["multiple", "Varias respuestas"], ["vf", "Verdadero / Falso"], ["abierta", "Abierta (texto)"]];
  let banco = [], original = "", ajustes = { notaMinima: 80, mezclarPreguntas: true }, esBase = false;
  let zona = null, ctx = { clave: () => "", aviso: () => {}, alGuardar: () => {} };

  const nuevoId = () => "q" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const copia = (x) => JSON.parse(JSON.stringify(x));
  const estadoTxt = () => JSON.stringify({ banco, ajustes });
  const sucio = () => !!original && estadoTxt() !== original;

  function cargar(r) {
    banco = copia(r.preguntas || []);
    ajustes = { ...ajustes, ...(r.ajustes || {}) };
    esBase = !!r.base;
    original = estadoTxt();
  }

  function confirmarSalida() {
    try { return window.confirm("Hay cambios en las preguntas sin guardar. ¿Salir y descartarlos?"); } catch (e) { return true; }
  }

  /* ---------- Validación ---------- */
  function problemas(q) {
    const p = [];
    if (!q.texto.trim()) p.push("Escriba el enunciado de la pregunta.");
    if (q.tipo === "unica" || q.tipo === "multiple") {
      const ops = q.opciones.filter((o) => o.trim());
      if (ops.length < 2) p.push("Agregue al menos 2 opciones.");
      if (q.opciones.some((o) => !o.trim())) p.push("Hay opciones vacías: escríbalas o quítelas.");
      if (q.tipo === "unica" && !(q.correcta >= 0 && q.correcta < q.opciones.length)) p.push("Marque cuál es la respuesta correcta.");
      if (q.tipo === "multiple" && !q.correcta.length) p.push("Marque al menos una respuesta correcta.");
    }
    if (q.tipo === "abierta" && q.califica && !q.claves.length) p.push("Para que cuente en la nota, escriba palabras clave (o desmarque «Cuenta en la nota»).");
    return p;
  }

  /* ---------- Dibujo ---------- */
  function resumen() {
    const act = banco.filter((q) => q.activa);
    const cal = act.filter((q) => q.califica);
    const peso = cal.reduce((s, q) => s + (Number(q.peso) || 1), 0);
    return `<div class="kpis kpis-3">
      <div class="kpi"><span class="kpi-ico">${icono("documento")}</span><div><b>${act.length}</b><small>Preguntas activas${banco.length > act.length ? ` (${banco.length - act.length} inactivas)` : ""}</small></div></div>
      <div class="kpi"><span class="kpi-ico">${icono("check")}</span><div><b>${cal.length}</b><small>Cuentan para la nota</small></div></div>
      <div class="kpi"><span class="kpi-ico">${icono("estrella")}</span><div><b>${peso}</b><small>Puntos en total (suma de pesos)</small></div></div>
    </div>`;
  }

  function tarjeta(q, i) {
    const errs = problemas(q);
    const tipoSel = TIPOS.map(([v, t]) => `<option value="${v}" ${q.tipo === v ? "selected" : ""}>${t}</option>`).join("");
    let cuerpo = "";
    if (q.tipo === "unica" || q.tipo === "multiple") {
      const multi = q.tipo === "multiple";
      cuerpo = `<div class="ed-ops">
        <p class="ed-et">Opciones <small>· marque ${multi ? "todas las correctas" : "la correcta"}</small></p>
        ${q.opciones.map((o, k) => {
          const ok = multi ? q.correcta.includes(k) : q.correcta === k;
          return `<div class="ed-op ${ok ? "ok" : ""}">
            <label class="ed-marca" title="Respuesta correcta"><input type="${multi ? "checkbox" : "radio"}" name="ok_${i}" data-i="${i}" data-accion="correcta" data-k="${k}" ${ok ? "checked" : ""}><span>${String.fromCharCode(97 + k)}</span></label>
            <input class="ed-op-txt" data-i="${i}" data-campo="opcion" data-k="${k}" value="${esc(o)}" placeholder="Texto de la opción ${String.fromCharCode(97 + k)}" aria-label="Opción ${String.fromCharCode(97 + k)}">
            <button class="btn mini" data-i="${i}" data-accion="quitarOp" data-k="${k}" aria-label="Quitar opción" title="Quitar opción">✕</button>
          </div>`;
        }).join("")}
        <button class="btn mini" data-i="${i}" data-accion="agregarOp">+ Agregar opción</button>
      </div>`;
    } else if (q.tipo === "vf") {
      cuerpo = `<div class="ed-ops"><p class="ed-et">Respuesta correcta</p><div class="ed-vf">
        ${["Verdadero", "Falso"].map((o, k) => `<label class="ed-op ${q.correcta === k ? "ok" : ""}"><input type="radio" name="ok_${i}" data-i="${i}" data-accion="correcta" data-k="${k}" ${q.correcta === k ? "checked" : ""}> ${o}</label>`).join("")}
      </div></div>`;
    } else {
      cuerpo = `<div class="ed-claves">
        <label>Palabras clave <small>separadas por coma; sin importar tildes ni mayúsculas</small>
          <input data-i="${i}" data-campo="claves" value="${esc(q.claves.join(", "))}" placeholder="Ej.: probabilidad, daño, lesión"></label>
        <label class="ed-min">Mínimo que debe incluir<input type="number" min="1" max="20" data-i="${i}" data-campo="minClaves" value="${esc(q.minClaves)}"></label>
        <p class="ayuda">La respuesta cuenta como buena si contiene al menos ese número de palabras clave.</p>
      </div>`;
    }
    const puedeMezclar = q.tipo === "unica" || q.tipo === "multiple";
    return `<article class="ed-preg ${q.activa ? "" : "inactiva"} ${errs.length ? "con-error" : ""}" id="ed_${i}">
      <header class="ed-cab">
        <span class="num">${i + 1}</span>
        <select data-i="${i}" data-campo="tipo" aria-label="Tipo de pregunta">${tipoSel}</select>
        <label class="check ed-act"><input type="checkbox" data-i="${i}" data-campo="activa" ${q.activa ? "checked" : ""}><span>Activa</span></label>
        <span class="ed-herr">
          <button class="btn mini" data-i="${i}" data-accion="subir" ${i === 0 ? "disabled" : ""} aria-label="Subir" title="Subir">↑</button>
          <button class="btn mini" data-i="${i}" data-accion="bajar" ${i === banco.length - 1 ? "disabled" : ""} aria-label="Bajar" title="Bajar">↓</button>
          <button class="btn mini" data-i="${i}" data-accion="duplicar" title="Duplicar">${icono("copiar")}</button>
          <button class="btn mini peligro" data-i="${i}" data-accion="borrar" title="Eliminar pregunta">${icono("basura")}</button>
        </span>
      </header>
      <textarea data-i="${i}" data-campo="texto" rows="2" placeholder="Escriba la pregunta…" aria-label="Enunciado">${esc(q.texto)}</textarea>
      ${cuerpo}
      <footer class="ed-pie">
        <label class="ed-peso">Peso <input type="number" min="0.5" max="20" step="0.5" data-i="${i}" data-campo="peso" value="${esc(q.peso)}"></label>
        <label class="check"><input type="checkbox" data-i="${i}" data-campo="califica" ${q.califica ? "checked" : ""}><span>Cuenta en la nota</span></label>
        <label class="check"><input type="checkbox" data-i="${i}" data-campo="obligatoria" ${q.obligatoria ? "checked" : ""}><span>Obligatoria</span></label>
        ${puedeMezclar ? `<label class="check"><input type="checkbox" data-i="${i}" data-campo="mezclar" ${q.mezclar ? "checked" : ""}><span>Mezclar opciones</span></label>` : ""}
      </footer>
      <ul class="ed-errores" ${errs.length ? "" : "hidden"}>${errs.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
    </article>`;
  }

  function pintar(destino) {
    if (destino) zona = destino;
    if (!zona) return;
    const scroll = window.scrollY;
    zona.innerHTML = `
      ${esBase ? `<p class="aviso">Estas son las preguntas iniciales de la plataforma. Al guardar por primera vez se crea la pestaña «Preguntas» en su hoja de Google, y desde ahí se cargarán.</p>` : ""}
      ${resumen()}
      <section class="caja ed-ajustes">
        <label class="ed-min">Nota mínima para aprobar (%)<input type="number" min="1" max="100" id="edNota" value="${esc(ajustes.notaMinima)}"></label>
        <label class="check"><input type="checkbox" id="edMezclar" ${ajustes.mezclarPreguntas ? "checked" : ""}><span>Mostrar las preguntas en orden aleatorio cada vez</span></label>
        <p class="ayuda">La nota es ponderada: cada pregunta que cuenta suma su peso si la respuesta es correcta. Las opciones tipo «Todas las anteriores» o «a y b» nunca se mezclan.</p>
      </section>
      <div class="ed-lista">${banco.map(tarjeta).join("")}</div>
      <button class="btn ancho ed-agregar" data-accion="agregar">+ Agregar pregunta</button>
      <div class="ed-barra" id="edBarra" ${sucio() ? "" : "hidden"}>
        <span>Tiene cambios sin guardar</span>
        <button class="btn chico" data-accion="descartar">Descartar</button>
        <button class="btn chico primario" data-accion="guardar">${icono("check")} Guardar preguntas</button>
      </div>`;
    window.scrollTo(0, scroll);
    zona.oninput = alEscribir;
    zona.onchange = alCambiar;
    zona.onclick = alClic;
  }

  function marcarSucio() {
    const b = document.getElementById("edBarra");
    if (b) b.hidden = !sucio();
  }

  function refrescarErrores(i) {
    const card = document.getElementById("ed_" + i);
    if (!card) return;
    const errs = problemas(banco[i]);
    card.classList.toggle("con-error", !!errs.length);
    const ul = card.querySelector(".ed-errores");
    ul.hidden = !errs.length;
    ul.innerHTML = errs.map((e) => `<li>${esc(e)}</li>`).join("");
  }

  // Texto: se guarda sin redibujar para no perder el cursor
  function alEscribir(e) {
    const t = e.target, i = +t.dataset.i, campo = t.dataset.campo;
    if (t.id === "edNota") { ajustes.notaMinima = Math.min(100, Math.max(1, Number(t.value) || 80)); marcarSucio(); return; }
    if (isNaN(i) || !campo) return;
    const q = banco[i];
    if (campo === "texto") q.texto = t.value;
    else if (campo === "opcion") q.opciones[+t.dataset.k] = t.value;
    else if (campo === "claves") q.claves = t.value.split(",").map((x) => x.trim()).filter(Boolean);
    else if (campo === "peso") q.peso = Math.max(0.5, Number(t.value) || 1);
    else if (campo === "minClaves") q.minClaves = Math.max(1, Math.round(Number(t.value) || 1));
    else return;
    refrescarErrores(i); marcarSucio();
  }

  function alCambiar(e) {
    const t = e.target, i = +t.dataset.i, campo = t.dataset.campo;
    if (t.id === "edMezclar") { ajustes.mezclarPreguntas = t.checked; marcarSucio(); return; }
    if (t.dataset.accion === "correcta") {
      const q = banco[i], k = +t.dataset.k;
      if (q.tipo === "multiple") q.correcta = t.checked ? [...new Set([...q.correcta, k])].sort((a, b) => a - b) : q.correcta.filter((x) => x !== k);
      else q.correcta = k;
      pintar(); marcarSucio(); return;
    }
    if (isNaN(i) || !campo) return;
    const q = banco[i];
    if (campo === "tipo") {
      const antes = q.tipo; q.tipo = t.value;
      if (q.tipo === "vf") { q.opciones = ["Verdadero", "Falso"]; q.correcta = 0; }
      else if (q.tipo === "abierta") { q.opciones = []; q.correcta = null; q.califica = !!q.claves.length; }
      else {
        if (antes === "vf" || antes === "abierta" || !q.opciones.length) q.opciones = ["", ""];
        q.correcta = q.tipo === "multiple" ? [].concat(q.correcta ?? []).filter((x) => x !== null && x < q.opciones.length) : (Array.isArray(q.correcta) ? (q.correcta[0] ?? 0) : (q.correcta ?? 0));
      }
      pintar(); marcarSucio(); return;
    }
    if (["activa", "califica", "obligatoria", "mezclar"].includes(campo)) {
      q[campo] = t.checked;
      if (campo === "activa") t.closest(".ed-preg").classList.toggle("inactiva", !t.checked);
      refrescarErrores(i);
      zona.querySelector(".kpis").outerHTML = resumen();
      marcarSucio();
    }
  }

  async function alClic(e) {
    const b = e.target.closest("[data-accion]");
    if (!b || b.disabled || b.dataset.accion === "correcta") return;
    const acc = b.dataset.accion, i = +b.dataset.i;
    const q = banco[i];
    if (acc === "agregar") {
      banco.push({ id: nuevoId(), tipo: "unica", texto: "", opciones: ["", ""], correcta: 0, peso: 1, califica: true, obligatoria: true, mezclar: true, claves: [], minClaves: 1, activa: true });
      pintar(); marcarSucio();
      const ult = document.getElementById("ed_" + (banco.length - 1));
      ult.scrollIntoView({ behavior: "smooth", block: "center" }); ult.querySelector("textarea").focus();
      return;
    }
    if (acc === "agregarOp") { q.opciones.push(""); pintar(); marcarSucio(); document.querySelector(`#ed_${i} .ed-op:last-of-type .ed-op-txt`)?.focus(); return; }
    if (acc === "quitarOp") {
      const k = +b.dataset.k;
      q.opciones.splice(k, 1);
      if (q.tipo === "multiple") q.correcta = q.correcta.filter((x) => x !== k).map((x) => (x > k ? x - 1 : x));
      else if (q.correcta === k) q.correcta = -1; else if (q.correcta > k) q.correcta--;
      pintar(); marcarSucio(); return;
    }
    if (acc === "subir" || acc === "bajar") {
      const j = acc === "subir" ? i - 1 : i + 1;
      [banco[i], banco[j]] = [banco[j], banco[i]];
      pintar(); marcarSucio(); document.getElementById("ed_" + j)?.scrollIntoView({ block: "nearest" }); return;
    }
    if (acc === "duplicar") { banco.splice(i + 1, 0, { ...copia(q), id: nuevoId(), texto: q.texto + " (copia)" }); pintar(); marcarSucio(); return; }
    if (acc === "borrar") {
      const card = document.getElementById("ed_" + i);
      if (card.dataset.confirmar !== "1") {
        card.dataset.confirmar = "1"; b.innerHTML = "¿Eliminar?"; b.classList.add("peligro-lleno");
        setTimeout(() => { if (card.isConnected && card.dataset.confirmar === "1") { card.dataset.confirmar = ""; b.innerHTML = icono("basura"); b.classList.remove("peligro-lleno"); } }, 3000);
        return;
      }
      banco.splice(i, 1); pintar(); marcarSucio();
      ctx.aviso("Pregunta eliminada. Guarde para aplicar el cambio."); return;
    }
    if (acc === "descartar") { const o = JSON.parse(original); banco = o.banco; ajustes = o.ajustes; pintar(); return; }
    if (acc === "guardar") {
      const conError = banco.findIndex((x) => x.activa && problemas(x).length);
      if (conError >= 0) { document.getElementById("ed_" + conError).scrollIntoView({ behavior: "smooth", block: "center" }); ctx.aviso("Revise las preguntas marcadas en rojo antes de guardar."); return; }
      if (!banco.some((x) => x.activa)) { ctx.aviso("Debe quedar al menos una pregunta activa."); return; }
      b.disabled = true; b.textContent = "Guardando…";
      // Limpieza: sin opciones vacías en preguntas inactivas
      const limpio = banco.map((x) => ({ ...x, opciones: x.tipo === "unica" || x.tipo === "multiple" ? x.opciones.map((o) => o.trim()) : x.opciones, texto: x.texto.trim() }));
      try {
        const r = await window.PS.guardarPreguntas(ctx.clave(), limpio, ajustes);
        if (!r.ok) throw new Error(r.error || "No se pudo guardar");
        banco = limpio; esBase = false; original = estadoTxt();
        ctx.alGuardar(copia(banco)); pintar();
        ctx.aviso(`Preguntas guardadas (${r.guardadas}). Ya las verán los trabajadores.`);
      } catch (err) {
        b.disabled = false; b.innerHTML = `${icono("check")} Guardar preguntas`;
        ctx.aviso("Error al guardar: " + err.message);
      }
    }
  }

  return { cargar, pintar, sucio, confirmarSalida, usar: (c) => Object.assign(ctx, c) };
})();
