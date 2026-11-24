# Plataforma de Inducción y Reinducción HSEQ · Process Solutions

Página web para que cada trabajador haga su **inducción o reinducción HSEQ** desde un enlace, presente la **evaluación** (se aprueba con 80 %), descargue su **certificado en PDF**, y para que el área HSEQ tenga **todos los registros** en una hoja de Google Sheets y en un panel con indicadores.

| Página | Para quién | Qué hace |
|---|---|---|
| `index.html` | Trabajador | Registro → 40 pantallas de contenido → evaluación → certificado |
| `index.html?tipo=reinduccion` | Trabajador | Lo mismo, registrado como **Reinducción** |
| `admin.html` | Área HSEQ | Ingreso con clave, indicadores, filtros, respuestas, certificados y exportación a Excel |

**Cómo funciona:** GitHub Pages publica la página gratis. GitHub no guarda datos, así que cada evaluación se envía a una **hoja de Google Sheets** a través de Google Apps Script, también gratis. Ahí quedan los registros como evidencia del SG-SST.

```
Trabajador ──(enlace)──► GitHub Pages (index.html) ──► Apps Script ──► Google Sheets "Registros"
Área HSEQ ──(clave)───► GitHub Pages (admin.html) ◄── Apps Script ◄──┘
```

---

## Paso 1 · Crear la hoja de Google y el Apps Script (10 min)

1. Entre a [sheets.google.com](https://sheets.google.com) con la cuenta de Google de la empresa y cree una hoja nueva. Llámela **Registros Inducción HSEQ**.
2. En el menú, vaya a **Extensiones → Apps Script**.
3. Borre lo que aparece en `Código.gs` y pegue **todo** el contenido del archivo `apps-script/Codigo.gs`.
4. En la línea `const CLAVE_ADMIN = 'CambieEstaClave2026';` ponga **su propia clave** para el panel. No use la que viene.
5. Guarde el proyecto (icono de disquete) y póngale un nombre, por ejemplo *Inducción HSEQ*.
6. Haga clic en **Implementar → Nueva implementación**.
   - En el engranaje de *Seleccionar tipo*, elija **Aplicación web**.
   - **Ejecutar como:** Yo (su correo).
   - **Quién tiene acceso:** **Cualquier persona**. Es necesario para que los trabajadores puedan enviar su evaluación sin iniciar sesión. Aun así, nadie puede leer los datos sin la clave del panel.
   - Clic en **Implementar** y luego en **Autorizar acceso**. Google mostrará la advertencia «Google no verificó esta app»: haga clic en *Configuración avanzada → Ir a Inducción HSEQ (no seguro) → Permitir*. Es normal en los scripts propios.
7. Copie la **URL de la aplicación web**. Termina en `/exec`.

> La hoja **Registros** se crea sola con el primer envío.

## Paso 2 · Conectar la página con la hoja (1 min)

Abra `js/config.js` y pegue la URL entre las comillas:

```js
API_URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
```

Mientras `API_URL` esté vacía, la plataforma funciona en **modo demostración**: guarda los registros solo en el navegador y la clave del panel es `demo`.

## Paso 3 · Subir a GitHub y publicar (10 min)

1. Entre a [github.com](https://github.com) y cree un repositorio nuevo (**New repository**), por ejemplo `induccion-hseq`. Debe ser **Public**, porque GitHub Pages gratis exige repositorios públicos. Los datos de los trabajadores no quedan en GitHub, quedan en su Google Sheets.
2. En el repositorio, haga clic en **Add file → Upload files** y arrastre **todo el contenido** de esta carpeta: `index.html`, `admin.html`, las carpetas `css`, `js`, `img` y `apps-script`, y este `README.md`. Luego haga clic en **Commit changes**.
   - Arrastre el *contenido* de la carpeta, no la carpeta misma: `index.html` debe quedar en la raíz del repositorio.
3. Vaya a **Settings → Pages**. En *Build and deployment → Branch* elija **main** y **/(root)** y haga clic en **Save**.
4. Espere 1 o 2 minutos y recargue. Aparecerá su dirección:
   `https://SU-USUARIO.github.io/induccion-hseq/`

## Paso 4 · Probar y enviar los enlaces

1. Abra `https://SU-USUARIO.github.io/induccion-hseq/admin.html`, entre con su clave y copie los dos enlaces que aparecen arriba:
   - **Inducción:** `https://SU-USUARIO.github.io/induccion-hseq/`
   - **Reinducción:** `https://SU-USUARIO.github.io/induccion-hseq/?tipo=reinduccion`
2. Haga una inducción de prueba completa y revise que aparezca la fila en Google Sheets y en el panel. Después puede borrar esa fila de la hoja.
3. Envíe los enlaces por WhatsApp o correo. Guarde el enlace del panel solo para el área HSEQ.

---

## ¿Cómo entro al panel de administrador?

Hay dos formas:

- **Enlace directo:** `https://SU-USUARIO.github.io/induccion-hseq/admin.html`. Guárdelo en favoritos.
- **Desde la inducción:** abajo a la derecha de cualquier pantalla está el enlace **«Acceso administrador»**.

La **clave** es la que escribió en `CLAVE_ADMIN` dentro de `apps-script/Codigo.gs` (Paso 1, punto 4). Mientras la plataforma esté en modo demostración, la clave es `demo`.

## Logos de los clientes

La pantalla «Nuestros clientes» muestra el nombre y el sector de cada cliente. Para que aparezca el logo en vez del nombre:

1. Guarde cada logo en **PNG** (fondo blanco o transparente) dentro de `img/clientes/`, con estos nombres: `ecopetrol.png`, `cenit.png`, `odl.png`, `hocol.png`, `geopark.png`, `frontera.png`, `canacol.png`, `esenttia.png`, `yara.png`, `epm.png`.
2. Súbalos a GitHub en esa misma carpeta (**Add file → Upload files**).

La página los detecta sola: cuando un logo no existe, sigue mostrando el nombre. Para agregar o quitar clientes, edite `PS_DATOS.clientes` al final de `js/contenido.js`.

## Cambiar contenido después

| Quiero cambiar… | Archivo |
|---|---|
| Textos de las pantallas, agregar o quitar temas | `js/contenido.js` |
| Clientes, acreditaciones, mapa de procesos, PHVA, residuos | `PS_DATOS`, al final de `js/contenido.js` |
| Preguntas, opciones o respuesta correcta | `js/evaluacion.js` |
| Nota mínima, nombre de quien firma, lista de procesos | `js/config.js` |
| Clave del panel | `apps-script/Codigo.gs` (o la propiedad `CLAVE_ADMIN` del script) |
| Colores (azul marino #14387F, azul medio #0072B1, cian #00A8E0) | primeras líneas de `css/estilos.css` |

Para editar en GitHub, abra el archivo, haga clic en el lápiz ✏️, cambie el texto y luego **Commit changes**. La página se actualiza en 1 o 2 minutos.

**Si cambia `Codigo.gs`:** pegue el código nuevo en Apps Script y haga **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar**. Así la URL sigue siendo la misma.

## ⚠ Respuestas correctas que debe revisar el área HSEQ

El formulario de Google original no tenía marcadas las respuestas correctas, así que se definieron según la presentación de inducción. Revise estas preguntas en `js/evaluacion.js`:

| Pregunta | Respuesta configurada | Por qué revisarla |
|---|---|---|
| P12. Peligros del reglamento | «c y d son correctas» | La presentación incluye todos los peligros de c) y d). Además se corrigió «Psicológico» por «Psicosocial» |
| P14. Funciones del COPASST | Opciones 1 y 3 | «Recibir quejas de acoso laboral» es función del Comité de Convivencia. «Rendir cuentas anuales a la alta gerencia» se dejó como incorrecta |
| P18. Peligros de su labor | «Todas las anteriores» | En el formulario era de selección múltiple. Aquí quedó de respuesta única, con «Todas las anteriores» como correcta |
| P09. Mapa de procesos | Opción 3 | Tomada de la diapositiva «Mapa de proceso» |

Otros cambios frente al formulario:

- Las dos frases «En sus palabras, describe qué es HSEQ / SIG» eran descripciones de sección en el formulario, así que no se incluyeron como preguntas.
- Se agregó una pantalla sobre el **código de conducta**, porque la evaluación lo pregunta (P11) y la presentación no lo explicaba.
- La pregunta 1 (fecha) y la 2 (tipo de actividad) se llenan solas.

## Notas

- **Intentos:** si alguien no aprueba, puede repasar y volver a intentarlo. Todos los intentos quedan en la hoja. El panel muestra el mejor intento de cada persona, o todos si marca «Mostrar todos los intentos».
- **Certificado:** se descarga con «Guardar como PDF» en la ventana de impresión. Desde el panel puede volver a generar el de cualquier persona aprobada.
- **Sin internet:** si el envío falla, el registro queda guardado en el navegador del trabajador y se reenvía la próxima vez que abra la página.
- **Datos personales:** el registro pide autorización de tratamiento de datos (Ley 1581 de 2012). Comparta la hoja de Google solo con el área HSEQ.
- **Seguridad:** la clave del panel se valida en Apps Script, no en la página, así que no queda expuesta en GitHub.
