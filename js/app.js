/* Flujo del trabajador: registro → pantallas → evaluación → resultado y certificado */
{
  const C = window.PS_CONFIG, S = window.PS_CONTENIDO;
  // Banco de preguntas: se carga desde Google Sheets mientras la persona lee el contenido
  let Q = [], AJ = { notaMinima: C.NOTA_MINIMA, mezclarPreguntas: true };
  const carga = window.PS.cargarPreguntas().then((r) => {
    Q = r.preguntas; AJ = r.ajustes;
    document.querySelectorAll("[data-nota]").forEach((el) => (el.textContent = AJ.notaMinima));
  });
  const { icono, esc, fechaLarga } = window.PS;
  const app = document.getElementById("app");
  const GUARDA = "ps_induccion_progreso";

  // Tipo de actividad según el enlace: ?tipo=reinduccion o #reinduccion
  const qs = new URLSearchParams(location.search);
  const esRe = /reinduc/i.test(qs.get("tipo") || "") || /reinduc/i.test(location.hash);
  const TIPO = esRe ? "Reinducción" : "Inducción";
  document.getElementById("barraTipo").textContent = TIPO;
  if (window.PS.modoDemo()) document.getElementById("avisoDemo").hidden = false;

  let estado = cargar() || { vista: "registro", paso: 0, datos: {}, respuestas: {}, inicio: null };
  if (estado.datos.tipo && estado.datos.tipo !== TIPO) estado = { vista: "registro", paso: 0, datos: {}, respuestas: {}, inicio: null };

  function cargar() { try { return JSON.parse(localStorage.getItem(GUARDA)); } catch (e) { return null; } }
  function guardar() { try { localStorage.setItem(GUARDA, JSON.stringify(estado)); } catch (e) {} }
  function limpiar() { try { localStorage.removeItem(GUARDA); } catch (e) {} }

  const calificables = () => Q.filter((q) => q.califica);
  const mezclar = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const totalPasos = S.length + 2; // pantallas + registro + evaluación

  function progreso(n, etiqueta) {
    document.getElementById("progreso").style.width = Math.round((n / totalPasos) * 100) + "%";
    document.getElementById("barraPaso").textContent = etiqueta || "";
  }
  function mostrar(html) {
    app.innerHTML = html;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    app.focus({ preventScroll: true });
  }

  /* ---------- 1. Registro ---------- */
  function vistaRegistro() {
    progreso(0, "");
    const d = estado.datos;
    const opciones = C.PROCESOS.map((p) => `<option ${d.proceso === p ? "selected" : ""}>${esc(p)}</option>`).join("");
    mostrar(`
      <section class="tarjeta entra">
        <div class="cab">
          <div><span class="pill">Registro · ${TIPO}</span>
          <h1>${TIPO} en Seguridad, Salud en el Trabajo, Calidad y Ambiente</h1>
          <p>Bienvenido(a) a Process Solutions. Conozca cómo cuidamos su vida y su salud en el trabajo.</p>
          <div class="chips"><span>${S.length} pantallas cortas</span><span>20 a 30 min</span><span>Evaluación final · aprueba con <b data-nota>${AJ.notaMinima}</b>%</span></div></div>
          <span class="cab-ico">${icono("escudo")}</span>
        </div>
        <form id="fReg" class="cuerpo form" novalidate>
          <h2 class="sub">Sus datos</h2>
          <p class="ayuda">Aparecerán tal cual en su certificado. Todos los campos marcados con * son obligatorios.</p>
          <label>Nombres y apellidos *<input name="nombre" required autocomplete="name" value="${esc(d.nombre)}"></label>
          <div class="fila2">
            <label>Número de documento *<input name="documento" required inputmode="numeric" value="${esc(d.documento)}"></label>
            <label>Cargo *<input name="cargo" required value="${esc(d.cargo)}"></label>
          </div>
          <div class="fila2">
            <label>Proceso al que pertenece *<select name="proceso" required><option value="">Seleccione…</option>${opciones}</select></label>
            <label>Empresa<input name="empresa" value="${esc(d.empresa || C.EMPRESA)}"></label>
          </div>
          <div class="fila2">
            <label>Tipo de actividad<input value="${TIPO}" disabled></label>
            <label>Fecha<input value="${esc(fechaLarga())}" disabled></label>
          </div>
          <label class="check"><input type="checkbox" name="acepto" required ${d.acepto ? "checked" : ""}>
            <span>Autorizo a Process Solutions S.A.S. el tratamiento de mis datos personales para el registro de esta actividad, conforme a la Ley 1581 de 2012.</span></label>
          <p class="error" id="errReg" role="alert"></p>
          <button class="btn primario ancho" type="submit">Comenzar la ${TIPO.toLowerCase()} ${icono("flecha")}</button>
        </form>
      </section>`);
    document.getElementById("fReg").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const datos = Object.fromEntries(f.entries());
      datos.nombre = (datos.nombre || "").trim().replace(/\s+/g, " ");
      datos.documento = (datos.documento || "").replace(/[^\dA-Za-z]/g, "");
      if (!datos.nombre || !datos.documento || !datos.cargo || !datos.proceso) {
        document.getElementById("errReg").textContent = "Complete los campos obligatorios."; return;
      }
      if (!datos.acepto) { document.getElementById("errReg").textContent = "Debe autorizar el tratamiento de datos para continuar."; return; }
      estado.datos = { ...datos, acepto: true, tipo: TIPO };
      estado.inicio = estado.inicio || new Date().toISOString();
      estado.vista = "pantalla"; estado.paso = 0; guardar(); render();
    });
  }

  /* ---------- 2. Pantallas de contenido ---------- */
  const D = window.PS_DATOS || {};
  const BLOQUES = [...new Set(S.map((x) => x.bloque))];

  const comps = {
    clientes: () => `<div class="clientes">${D.clientes.map((c) => `
      <div class="cliente${c.fondo ? " fondo-" + esc(c.fondo) : ""}"><img src="img/clientes/${esc(c.logo)}.png" alt="${esc(c.n)}" data-logo hidden>
      <b>${esc(c.n)}</b><small>${esc(c.s)}</small></div>`).join("")}</div>`,
    acreditaciones: () => `<div class="acred">${D.acreditaciones.map((a) => `
      <div class="sello"><span class="sello-ico">${icono("escudo")}</span><div><b>${esc(a.t)}</b><span>${esc(a.s)}</span><small>${esc(a.d)}</small></div></div>`).join("")}</div>`,
    mapa: () => {
      const caja = (l) => l.map((x) => `<span class="proc">${esc(x)}</span>`).join("");
      return `<div class="mapa">
        <div class="mapa-fila"><span class="mapa-et">Estratégico</span><div class="mapa-cajas">${caja(D.mapa.estrategico)}</div></div>
        <div class="mapa-fila mision"><span class="mapa-et">Misionales</span>
          <div class="mapa-cajas flujo">${D.mapa.misionales.map((x) => `<span class="proc fuerte">${esc(x)}</span>`).join(`<span class="fl">${icono("flecha")}</span>`)}</div>
          <p class="mapa-nota">Necesidades del cliente → Satisfacción del cliente</p></div>
        <div class="mapa-fila"><span class="mapa-et">Soporte</span><div class="mapa-cajas">${caja(D.mapa.soporte)}</div></div>
      </div>`;
    },
    phva: () => `<div class="phva">${D.phva.map((x, k) => `
      <div class="phva-c c${k}"><span class="phva-l">${esc(x.l)}</span><div><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div></div>`).join("")}
      <p class="phva-nota">${icono("ciclo")} Después de Actuar, el ciclo vuelve a empezar: así se logra la mejora continua.</p></div>`,
    residuos: () => `<div class="residuos">${D.residuos.map((r) => `
      <div class="bolsa ${esc(r.color)}"><span class="bolsa-tapa"></span><b>${esc(r.t)}</b><span class="bolsa-s">${esc(r.s)}</span><p>${esc(r.d)}</p></div>`).join("")}</div>`
  };

  function vistaPantalla() {
    const i = estado.paso, s = S[i];
    estado.max = Math.max(estado.max || 0, i);
    progreso(i + 1, `Pantalla ${i + 1} de ${S.length}`);
    const nBloque = BLOQUES.indexOf(s.bloque) + 1;
    const enBloque = S.filter((x) => x.bloque === s.bloque);
    const posBloque = enBloque.indexOf(s) + 1;
    const items = (s.items || []).map((it, k) => `
      <li class="item${s.pasos ? " paso" : ""}" style="--d:${k * 50}ms">
        <span class="item-ico">${s.pasos ? k + 1 : icono(s.final ? "check" : s.icono)}</span>
        <div><b>${esc(it.t)}</b><p>${esc(it.d)}</p></div></li>`).join("");
    const cols = s.cols ? `<div class="cols">${s.cols.map((c) => `
      <div class="col"><h3>${esc(c.t)}</h3><ul>${c.lista.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></div>`).join("")}</div>` : "";
    mostrar(`
      <section class="tarjeta entra" aria-labelledby="tit">
        <header class="cab">
          <span class="cab-ico">${icono(s.icono)}</span>
          <div><p class="etiqueta">Bloque ${nBloque} de ${BLOQUES.length} · ${esc(s.bloque)}${enBloque.length > 1 ? ` · ${posBloque}/${enBloque.length}` : ""}</p>
          <h1 id="tit">${esc(s.titulo)}</h1></div>
        </header>
        <div class="cuerpo">
          ${s.intro ? `<p class="intro">${esc(s.intro)}</p>` : ""}
          ${s.cita ? `<blockquote class="cita">${esc(s.cita)}</blockquote>` : ""}
          ${items ? `<ul class="items${s.pasos ? " pasos" : ""}">${items}</ul>` : ""}
          ${cols}${s.comp && comps[s.comp] ? comps[s.comp]() : ""}
        </div>
        <nav class="nav">
          <button class="btn" id="bAtras">${icono("atras")} Atrás</button>
          <span class="nav-cuenta">${i + 1} / ${S.length}</span>
          <button class="btn primario" id="bSig">${s.final ? "Ir a la evaluación" : "Siguiente"} ${icono("flecha")}</button>
        </nav>
      </section>`);
    app.querySelectorAll("img[data-logo]").forEach((im) => {
      im.addEventListener("load", () => { im.hidden = false; im.parentElement.classList.add("con-logo"); });
      im.addEventListener("error", () => im.remove());
    });
    document.getElementById("bAtras").onclick = () => {
      if (estado.paso === 0) estado.vista = "registro"; else estado.paso--;
      guardar(); render();
    };
    document.getElementById("bSig").onclick = () => {
      if (estado.paso < S.length - 1) estado.paso++; else estado.vista = "evaluacion";
      guardar(); render();
    };
  }

  /* ---------- Barra lateral de avance ---------- */
  function lateral() {
    const el = document.getElementById("lateral");
    const v = estado.vista, max = estado.max || 0;
    const actualB = v === "pantalla" ? BLOQUES.indexOf(S[estado.paso].bloque) : -1;
    const primerPaso = (b) => S.findIndex((x) => x.bloque === b);
    const fin = v === "evaluacion" || v === "resultado";
    const hecho = (k) => fin || (actualB >= 0 && k < actualB);
    const filas = [
      { t: "Registro", est: v === "registro" ? "actual" : "hecho" },
      ...BLOQUES.map((b, k) => ({ t: b, ir: primerPaso(b), est: k === actualB ? "actual" : hecho(k) ? "hecho" : v === "pantalla" && primerPaso(b) <= max ? "visto" : "" })),
      { t: "Evaluación", est: v === "evaluacion" ? "actual" : v === "resultado" ? "hecho" : "" },
      { t: "Certificado", est: v === "resultado" ? "actual" : "" }
    ];
    el.innerHTML = `<p class="lat-tit">Su avance</p><ol class="pasos-lat">${filas.map((f, k) => {
      const puede = f.ir !== undefined && (f.est === "hecho" || f.est === "visto") && v === "pantalla";
      const marca = f.est === "hecho" ? icono("check") : k;
      return `<li class="${f.est}">${puede ? `<button data-ir="${f.ir}">` : "<span>"}<i>${marca}</i>${esc(f.t)}${puede ? "</button>" : "</span>"}</li>`;
    }).join("")}</ol>`;
    el.querySelectorAll("[data-ir]").forEach((b) => (b.onclick = () => { estado.paso = +b.dataset.ir; guardar(); render(); }));
  }

  /* ---------- 3. Evaluación ---------- */
  async function vistaEvaluacion() {
    progreso(totalPasos - 1, "Evaluación");
    if (!Q.length) { mostrar(`<section class="tarjeta"><div class="cuerpo"><p class="cargando">Cargando la evaluación…</p></div></section>`); await carga; }
    const R = estado.respuestas;
    // Orden aleatorio por intento; se guarda para que recargar la página no lo cambie
    const ids = Q.map((q) => q.id);
    if (!estado.orden || estado.orden.length !== ids.length || estado.orden.some((id) => !ids.includes(id))) {
      estado.orden = AJ.mezclarPreguntas ? mezclar(ids) : ids;
      estado.ordenOps = {};
      Q.forEach((q) => { const idx = q.opciones.map((_, k) => k); estado.ordenOps[q.id] = q.mezclar && q.tipo !== "vf" ? mezclar(idx) : idx; });
      guardar();
    }
    const lista = estado.orden.map((id) => Q.find((q) => q.id === id));
    const nCal = calificables().length;
    let n = 0;
    const html = lista.map((q) => {
      n++;
      let campo;
      if (q.tipo === "abierta") {
        campo = `<textarea name="${q.id}" rows="3" maxlength="1500" placeholder="Escriba su respuesta…">${esc(R[q.id] || "")}</textarea>`;
      } else {
        const multi = q.tipo === "multiple";
        campo = `<div class="ops">${(estado.ordenOps[q.id] || q.opciones.map((_, k) => k)).map((k) => {
          const o = q.opciones[k];
          const marcado = multi ? (R[q.id] || []).includes(k) : R[q.id] === k;
          return `<label class="op"><input type="${multi ? "checkbox" : "radio"}" name="${q.id}" value="${k}" ${marcado ? "checked" : ""}><span>${esc(o)}</span></label>`;
        }).join("")}</div>`;
      }
      const req = q.obligatoria;
      return `<fieldset class="preg" id="f_${q.id}"><legend><span class="num">${n}</span>${esc(q.texto)}${req ? " *" : ""}</legend>${campo}</fieldset>`;
    }).join("");
    mostrar(`
      <section class="tarjeta entra">
        <div class="cab">
          <div><span class="pill">Evaluación · ${TIPO}</span><h1>Evaluación de ${TIPO.toLowerCase()}</h1>
          <p>${Q.length} preguntas${nCal < Q.length ? `, ${nCal} cuentan para la nota` : ""}. Necesita ${AJ.notaMinima}% para aprobar.</p></div>
          <span class="cab-ico">${icono("documento")}</span>
        </div>
        <form id="fEval" class="cuerpo" novalidate>${html}
          <div class="eval-pie">
            <span id="contador" class="contador"></span>
            <p class="error" id="errEval" role="alert"></p>
            <div class="nav sin-borde">
              <button type="button" class="btn" id="bVolver">${icono("atras")} Repasar</button>
              <button type="submit" class="btn primario" id="bEnviar">Enviar respuestas ${icono("flecha")}</button>
            </div>
          </div>
        </form>
      </section>`);
    const form = document.getElementById("fEval");
    const leer = () => {
      for (const q of Q) {
        if (q.tipo === "abierta") R[q.id] = form.elements[q.id].value;
        else if (q.tipo === "multiple") R[q.id] = [...form.querySelectorAll(`input[name="${q.id}"]:checked`)].map((x) => +x.value);
        else { const x = form.querySelector(`input[name="${q.id}"]:checked`); R[q.id] = x ? +x.value : undefined; }
      }
    };
    const faltantes = () => lista.filter((q) => {
      const v = R[q.id];
      if (!q.obligatoria) return false;
      if (q.tipo === "abierta") return !(v || "").trim();
      if (q.tipo === "multiple") return !(v && v.length);
      return v === undefined;
    });
    const contar = () => { leer(); document.getElementById("contador").textContent = `Respondidas ${Q.length - faltantes().length} de ${Q.length}`; guardar(); };
    form.addEventListener("input", contar); form.addEventListener("change", contar); contar();
    document.getElementById("bVolver").onclick = () => { leer(); estado.vista = "pantalla"; estado.paso = S.length - 1; guardar(); render(); };
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); leer();
      form.querySelectorAll(".preg").forEach((f) => f.classList.remove("falta"));
      const f = faltantes();
      if (f.length) {
        f.forEach((q) => document.getElementById("f_" + q.id).classList.add("falta"));
        document.getElementById("errEval").textContent = `Faltan ${f.length} pregunta(s) por responder.`;
        document.getElementById("f_" + f[0].id).scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const b = document.getElementById("bEnviar"); b.disabled = true; b.textContent = "Enviando…";
      await calificar();
    });
  }

  async function calificar() {
    const R = estado.respuestas;
    const fallidas = [];
    let buenas = 0, pesoBueno = 0, pesoTotal = 0;
    for (const q of calificables()) {
      pesoTotal += q.peso;
      if (window.PS.esCorrecta(q, R[q.id])) { buenas++; pesoBueno += q.peso; } else fallidas.push(q.id);
    }
    const puntaje = pesoTotal ? Math.round((pesoBueno / pesoTotal) * 100) : 100;
    const aprobado = puntaje >= AJ.notaMinima;
    const texto = (q) => {
      const v = R[q.id];
      if (q.tipo === "abierta") return (v || "").trim();
      if (q.tipo === "multiple") return (v || []).map((k) => q.opciones[k]).join(" | ");
      return v === undefined ? "" : q.opciones[v];
    };
    const respuestas = {};
    Q.forEach((q) => (respuestas[q.id] = texto(q)));
    const d = estado.datos;
    const reg = {
      id: window.PS.codigoCertificado(), fecha: new Date().toISOString(), tipo: TIPO,
      nombre: d.nombre, documento: d.documento, cargo: d.cargo, proceso: d.proceso, empresa: d.empresa || C.EMPRESA,
      puntaje, correctas: buenas, total: calificables().length, aprobado,
      duracionMin: estado.inicio ? Math.max(1, Math.round((Date.now() - new Date(estado.inicio)) / 60000)) : "",
      fallidas: fallidas.join(", "), respuestas
    };
    const res = await window.PS.guardarRegistro(reg);
    reg.intento = res.intento || "";
    estado.resultado = { reg, guardado: res, fallidas };
    estado.vista = "resultado"; guardar(); render();
  }

  /* ---------- 4. Resultado ---------- */
  function vistaResultado() {
    progreso(totalPasos, "Resultado");
    const { reg, guardado, fallidas } = estado.resultado;
    const aviso = guardado.pendiente
      ? `<p class="aviso">No hubo conexión para guardar el registro. Se enviará automáticamente la próxima vez que abra esta página; si no, avise al área HSEQ.</p>`
      : guardado.demo ? `<p class="aviso">Modo demostración: el registro quedó guardado solo en este navegador.</p>` : "";
    if (reg.aprobado) {
      mostrar(`
        <section class="tarjeta entra">
          <div class="cab ok"><div><span class="pill">Resultado</span><h1>¡Felicitaciones, aprobó!</h1>
            <p>Obtuvo ${reg.puntaje}% (${reg.correctas} de ${reg.total} correctas). Su registro quedó guardado.</p></div>
            <span class="cab-ico">${icono("check")}</span></div>
          <div class="cuerpo">${aviso}${window.PS.certificadoHTML(reg)}</div>
          <nav class="nav">
            <button class="btn" id="bNueva">${icono("salir")} Terminar</button>
            <button class="btn primario" id="bPdf">${icono("descarga")} Descargar PDF</button>
          </nav>
          <p class="ayuda centro">En la ventana de impresión elija «Guardar como PDF».</p>
        </section>`);
      document.getElementById("bPdf").onclick = () => { try { window.print(); } catch (e) {} };
      document.getElementById("bNueva").onclick = () => { limpiar(); estado = { vista: "registro", paso: 0, datos: {}, respuestas: {}, inicio: null }; render(); };
    } else {
      const lista = fallidas.map((id) => { const q = Q.find((x) => x.id === id); return q ? `<li>${esc(q.texto)}</li>` : ""; }).join("");
      mostrar(`
        <section class="tarjeta entra">
          <div class="cab mal"><div><span class="pill">Resultado</span><h1>Aún no alcanza el ${AJ.notaMinima}%</h1>
            <p>Obtuvo ${reg.puntaje}% (${reg.correctas} de ${reg.total} correctas). Su intento quedó registrado. Repase el contenido y vuelva a intentarlo.</p></div>
            <span class="cab-ico">${icono("refrescar")}</span></div>
          <div class="cuerpo">${aviso}<h2 class="sub">Preguntas para repasar</h2><ul class="repaso">${lista}</ul></div>
          <nav class="nav">
            <button class="btn" id="bRepasar">${icono("atras")} Repasar el contenido</button>
            <button class="btn primario" id="bReintentar">Intentar de nuevo ${icono("refrescar")}</button>
          </nav>
        </section>`);
      const reiniciar = (vista) => { estado.respuestas = {}; estado.resultado = null; estado.orden = null; estado.ordenOps = null; estado.vista = vista; estado.paso = 0; guardar(); render(); };
      document.getElementById("bRepasar").onclick = () => reiniciar("pantalla");
      document.getElementById("bReintentar").onclick = () => reiniciar("evaluacion");
    }
  }

  function render() {
    document.body.dataset.vista = estado.vista;
    ({ registro: vistaRegistro, pantalla: vistaPantalla, evaluacion: vistaEvaluacion, resultado: vistaResultado }[estado.vista] || vistaRegistro)();
    lateral();
  }

  document.addEventListener("keydown", (e) => {
    if (estado.vista !== "pantalla" || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") document.getElementById("bSig")?.click();
    if (e.key === "ArrowLeft") document.getElementById("bAtras")?.click();
  });

  window.PS.reenviarPendientes();
  render();
}
