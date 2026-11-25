/**
 * Plataforma de Inducción HSEQ · Process Solutions
 * Backend en Google Apps Script: guarda cada evaluación como una fila
 * en la hoja "Registros" y entrega los datos al panel de administración.
 *
 * Instalación (detalle en README.md):
 *  1. Cree una hoja de cálculo de Google → Extensiones → Apps Script.
 *  2. Pegue este código, cambie CLAVE_ADMIN y guarde.
 *  3. Implementar → Nueva implementación → Aplicación web
 *     Ejecutar como: Yo · Quién tiene acceso: Cualquier persona.
 *  4. Copie la URL que termina en /exec y péguela en js/config.js (API_URL).
 */

// Cambie esta clave. Es la que se escribe en el panel de administración.
// Mientras siga siendo 'CambieEstaClave2026', el panel NO mostrará datos.
const CLAVE_ADMIN = 'CambieEstaClave2026';

// Solo si el script NO se creó desde la hoja (Extensiones → Apps Script):
// pegue aquí el ID de la hoja (el texto entre /d/ y /edit en su dirección).
const ID_HOJA = '';

const HOJA = 'Registros';
const BASE = [
  ['fecha', 'Fecha'], ['id', 'Código certificado'], ['tipo', 'Tipo'], ['nombre', 'Nombre'],
  ['documento', 'Documento'], ['cargo', 'Cargo'], ['proceso', 'Proceso'], ['empresa', 'Empresa'],
  ['puntaje', 'Puntaje %'], ['correctas', 'Correctas'], ['total', 'Total'], ['aprobado', 'Aprobado'],
  ['intento', 'Intento'], ['duracionMin', 'Duración (min)'], ['fallidas', 'Preguntas falladas']
];
const PREFIJO = 'Resp. ';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.accion === 'registrar') return json(registrar(body.registro));
    if (body.accion === 'listar') {
      const clave = claveAdmin();
      if (!clave || clave === 'CambieEstaClave2026') return json({ ok: false, error: 'Falta configurar la clave del panel en Apps Script' });
      if (String(body.clave) !== clave) return json({ ok: false, error: 'Clave incorrecta' });
      return json({ ok: true, registros: listar() });
    }
    if (body.accion === 'eliminar') {
      const clave = claveAdmin();
      if (!clave || clave === 'CambieEstaClave2026') return json({ ok: false, error: 'Falta configurar la clave del panel en Apps Script' });
      if (String(body.clave) !== clave) return json({ ok: false, error: 'Clave incorrecta' });
      return json(eliminar(body.ids));
    }
    return json({ ok: false, error: 'Acción no válida' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, servicio: 'Inducción HSEQ Process Solutions' });
}

function claveAdmin() {
  // Opcional: defina la propiedad CLAVE_ADMIN en Configuración del proyecto → Propiedades del script
  return PropertiesService.getScriptProperties().getProperty('CLAVE_ADMIN') || CLAVE_ADMIN;
}

function hoja() {
  const libro = ID_HOJA ? SpreadsheetApp.openById(ID_HOJA) : SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName(HOJA);
  if (!h) {
    h = libro.insertSheet(HOJA);
    h.appendRow(BASE.map(c => c[1]));
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, BASE.length).setFontWeight('bold').setBackground('#14387F').setFontColor('#FFFFFF');
  }
  return h;
}

function registrar(r) {
  if (!r || !r.nombre || !r.documento) return { ok: false, error: 'Datos incompletos' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const h = hoja();
    let encabezados = h.getRange(1, 1, 1, h.getLastColumn()).getValues()[0];

    // Agrega columnas para preguntas nuevas
    const resp = r.respuestas || {};
    Object.keys(resp).forEach(k => {
      if (encabezados.indexOf(PREFIJO + k) === -1) {
        h.getRange(1, encabezados.length + 1).setValue(PREFIJO + k).setFontWeight('bold').setBackground('#14387F').setFontColor('#FFFFFF');
        encabezados.push(PREFIJO + k);
      }
    });

    // Número de intento: registros previos del mismo documento y tipo
    const iDoc = encabezados.indexOf('Documento'), iTipo = encabezados.indexOf('Tipo');
    let previos = 0;
    if (h.getLastRow() > 1) {
      h.getRange(2, 1, h.getLastRow() - 1, encabezados.length).getValues().forEach(f => {
        if (String(f[iDoc]) === String(r.documento) && f[iTipo] === r.tipo) previos++;
      });
    }
    r.intento = previos + 1;

    const fila = encabezados.map(t => {
      const base = BASE.find(c => c[1] === t);
      if (base) {
        const v = r[base[0]];
        if (base[0] === 'fecha') return new Date(v || Date.now());
        if (base[0] === 'aprobado') return v ? 'Sí' : 'No';
        return v === undefined || v === null ? '' : v;
      }
      if (t.indexOf(PREFIJO) === 0) return resp[t.slice(PREFIJO.length)] || '';
      return '';
    });
    h.appendRow(fila);
    // El documento se guarda como texto para no perder ceros ni formato
    h.getRange(h.getLastRow(), iDoc + 1).setNumberFormat('@').setValue(String(r.documento));
    return { ok: true, intento: r.intento };
  } finally {
    lock.releaseLock();
  }
}

function listar() {
  const h = hoja();
  if (h.getLastRow() < 2) return [];
  const datos = h.getRange(1, 1, h.getLastRow(), h.getLastColumn()).getValues();
  const enc = datos.shift();
  return datos.map(f => {
    const r = { respuestas: {} };
    enc.forEach((t, i) => {
      const base = BASE.find(c => c[1] === t);
      let v = f[i];
      if (v instanceof Date) v = v.toISOString();
      if (base) r[base[0]] = base[0] === 'aprobado' ? (v === 'Sí' || v === true) : v;
      else if (String(t).indexOf(PREFIJO) === 0) r.respuestas[String(t).slice(PREFIJO.length)] = v;
    });
    return r;
  });
}

function eliminar(ids) {
  if (!Array.isArray(ids) || !ids.length) return { ok: false, error: 'No hay registros para eliminar' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const h = hoja();
    if (h.getLastRow() < 2) return { ok: true, eliminados: 0 };
    const enc = h.getRange(1, 1, 1, h.getLastColumn()).getValues()[0];
    const iId = enc.indexOf('Código certificado');
    const valores = h.getRange(2, iId + 1, h.getLastRow() - 1, 1).getValues();
    const buscar = ids.map(String);
    let eliminados = 0;
    // De abajo hacia arriba para no correr las filas
    for (let i = valores.length - 1; i >= 0; i--) {
      if (buscar.indexOf(String(valores[i][0])) !== -1) { h.deleteRow(i + 2); eliminados++; }
    }
    return { ok: true, eliminados: eliminados };
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
