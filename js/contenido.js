/* ============================================================
   CONTENIDO DE LA INDUCCIÓN — tomado de "INDUCCIÓN HSEQ 2026"
   Cada objeto es una pantalla. Campos:
     bloque  : nombre del bloque (aparece en la etiqueta superior)
     titulo  : título de la pantalla
     icono   : uno de los iconos definidos en comun.js
     intro   : texto de entrada (opcional)
     items   : lista de tarjetas { t: título, d: descripción } (opcional)
     cols    : dos columnas de listas { t, lista: [] } (opcional)
     comp    : componente gráfico (clientes, acreditaciones, mapa, phva, residuos)
     pasos   : true para mostrar los items como pasos numerados
     cita    : frase destacada (opcional)
   Para agregar o quitar temas, edite este arreglo.
   ============================================================ */
window.PS_CONTENIDO = [
  /* ---------- 1. BIENVENIDA ---------- */
  { bloque: "Bienvenida", titulo: "¡Bienvenidos a la inducción HSEQ!", icono: "casco",
    intro: "Estamos encantados de tenerlos aquí mientras exploramos juntos nuestro compromiso con la seguridad, la calidad y el medio ambiente en Process Solutions. Su participación es clave para nuestro éxito en estos aspectos.",
    items: [
      { t: "Duración", d: "Entre 20 y 30 minutos. Avance a su ritmo con los botones Atrás y Siguiente." },
      { t: "Evaluación final", d: "Al terminar presentará una evaluación corta. Se aprueba con el 80 % o más." },
      { t: "Certificado", d: "Si aprueba, descarga de inmediato su certificado de participación y aprobación." }
    ] },
  { bloque: "Bienvenida", titulo: "¿Quiénes somos?", icono: "empresa",
    intro: "Somos una empresa colombiana fundada en 2008, especializada en soluciones tecnológicas de automatización, control y optimización para industrias de procesos.",
    items: [
      { t: "Experiencia", d: "Hemos liderado la implementación de tecnologías avanzadas en comunicaciones industriales, bombeo de fluidos, simulación de fluidos, software de distribución de gas, comunicación inalámbrica, sistemas de control distribuido y detección de fugas, entre otros." },
      { t: "Valor", d: "Proveemos servicios y tecnología de punta generando valor a los procesos de nuestros clientes." }
    ] },
  { bloque: "Bienvenida", titulo: "¿Qué hacemos?", icono: "engranaje",
    intro: "Soluciones de automatización:",
    items: [
      { t: "Automatización y control", d: "Automatización y control de procesos industriales (ICS)." },
      { t: "HMI y alarmas", d: "Desarrollo de interfaces HMI, gestión de alarmas y análisis de riesgos." },
      { t: "Integración", d: "Integración de sistemas de automatización, control, seguridad y optimización industrial." },
      { t: "Mantenimiento", d: "Mantenimiento y migración de sistemas de control." },
      { t: "Simulación", d: "Simulación de sistemas de transporte, distribución y procesamiento de hidrocarburos: gemelos digitales." }
    ] },
  { bloque: "Bienvenida", titulo: "Nuestros clientes", icono: "estrella", comp: "clientes",
    intro: "Trabajamos con empresas líderes de los sectores de hidrocarburos, energía, petroquímica y servicios públicos." },
  { bloque: "Bienvenida", titulo: "Nuestras acreditaciones", icono: "escudo", comp: "acreditaciones",
    intro: "Nuestro Sistema Integrado de Gestión está certificado por Bureau Veritas, y somos aliados certificados de Honeywell." },

  /* ---------- 2. DIRECCIONAMIENTO ---------- */
  { bloque: "Direccionamiento", titulo: "Nuestra misión", icono: "bandera",
    cita: "Contribuir al desarrollo de una industria más eficiente, segura y confiable a través de sistemas de automatización, control y optimización de los procesos industriales de nuestros clientes, mediante la combinación única de tecnología, experiencia, conocimiento e innovación de nuestros proveedores, consultores y empleados en un ámbito de mejoramiento continuo de la calidad, la seguridad y el desempeño ambiental, asegurando una operación sostenible y redituable." },
  { bloque: "Direccionamiento", titulo: "Nuestra visión", icono: "ojo",
    cita: "Liderar la optimización industrial mediante la integración de tecnologías de Control de Procesos, Ciberseguridad e Inteligencia Artificial, garantizando la sostenibilidad ambiental y la eficiencia operacional de nuestros clientes, impulsados por la experiencia y el desarrollo continuo de nuestro equipo humano." },
  { bloque: "Direccionamiento", titulo: "Mapa de procesos", icono: "mapa", comp: "mapa",
    intro: "Los procesos de la compañía se organizan en tres niveles. Todos trabajan juntos para convertir las necesidades del cliente en su satisfacción." },

  /* ---------- 3. SISTEMA INTEGRADO DE GESTIÓN ---------- */
  { bloque: "Sistema integrado", titulo: "¿Qué es el Sistema Integrado de Gestión (SIG)?", icono: "capas",
    intro: "Es un sistema que unifica varios sistemas de gestión en una sola estructura, para administrar mejor los procesos, la calidad, la seguridad, el ambiente y otros aspectos importantes.",
    cols: [
      { t: "Integra", lista: ["ISO 9001: gestión de la calidad", "ISO 14001: gestión ambiental", "ISO 45001: seguridad y salud en el trabajo"] },
      { t: "¿Para qué sirve?", lista: ["Mejorar la organización interna", "Reducir riesgos laborales", "Disminuir impactos ambientales", "Aumentar la satisfacción del cliente", "Cumplir requisitos legales", "Evitar duplicidad de procesos"] }
    ] },
  { bloque: "Sistema integrado", titulo: "Política integral", icono: "escudo",
    intro: "La política integral de Process Solutions asegura el cumplimiento de los requisitos legales y los compromisos con los clientes en seguridad, salud, medio ambiente y calidad, alineando sus objetivos con la misión y la visión de la empresa.",
    items: [
      { t: "Entorno seguro y saludable", d: "Prevención de riesgos laborales, del acoso laboral y sexual, y promoción del bienestar de los empleados." },
      { t: "Cero alcohol y drogas", d: "Está prohibido el consumo de alcohol y drogas." },
      { t: "Mejora continua", d: "Mejorar continuamente el SIG y asegurar el manejo eficiente de los recursos naturales, humanos, técnicos y financieros." },
      { t: "Participación", d: "Se fomenta la participación activa de los trabajadores a través del COPASST y del Comité de Convivencia Laboral (CCL)." }
    ] },
  { bloque: "Sistema integrado", titulo: "Código de conducta empresarial", icono: "balanza",
    intro: "Establece los principios por los cuales se rige la organización, para que sus miembros actúen conforme a los valores de la compañía. Sus pilares son:",
    items: [
      { t: "Respeto", d: "Prevención del acoso laboral, diversidad e inclusión." },
      { t: "Relaciones justas", d: "Trato justo con nuestros grupos de interés y competencia sana." },
      { t: "Integridad", d: "Anticorrupción, conflicto de intereses y uso responsable de redes sociales." },
      { t: "Recursos", d: "Regalos y cortesías, activos de la compañía e integridad en la contabilidad." },
      { t: "Información", d: "Privacidad de datos y protección de la información." }
    ] },
  { bloque: "Sistema integrado", titulo: "Metodología: ciclo PHVA", icono: "ciclo", comp: "phva",
    intro: "El Sistema Integrado de Gestión se basa en el ciclo PHVA: Planear, Hacer, Verificar y Actuar. Es un ciclo: al terminar, vuelve a empezar para mejorar siempre." },

  /* ---------- 4. CONCEPTOS SST ---------- */
  { bloque: "Conceptos SST", titulo: "Peligro y riesgo", icono: "alerta",
    cols: [
      { t: "Peligro", lista: ["Fuente o situación con capacidad de causar lesión, enfermedad o daño", "Ej.: electricidad, sustancias químicas, piso mojado, maquinaria en movimiento, trabajo en alturas"] },
      { t: "Riesgo", lista: ["Probabilidad de que el peligro cause daño, junto con la gravedad de ese daño", "Ej.: peligro = piso mojado; riesgo = que una persona resbale, caiga y se fracture"] }
    ] },
  { bloque: "Conceptos SST", titulo: "Acto inseguro y condición insegura", icono: "persona",
    cols: [
      { t: "Acto inseguro (la persona)", lista: ["Acción incorrecta de una persona que puede provocar un accidente", "Se previene con capacitación, supervisión y hábitos seguros", "Ej.: no usar EPP, correr en el área de trabajo, manipular maquinaria sin autorización, desactivar dispositivos de seguridad"] },
      { t: "Condición insegura (el entorno)", lista: ["Estado peligroso del lugar, las instalaciones o los equipos", "Se corrige con mantenimiento, orden y medidas de control", "Ej.: piso mojado sin señalizar, cables expuestos, herramientas defectuosas, falta de iluminación"] }
    ] },
  { bloque: "Conceptos SST", titulo: "Incidente de trabajo", icono: "rayo",
    intro: "Suceso ocurrido en el curso del trabajo o en relación con este, que tuvo el potencial de ser un accidente, pero sin lesiones a las personas ni daños a la propiedad o pérdidas en los procesos (Resolución 1401 de 2007).",
    items: [
      { t: "Ejemplo", d: "Un trabajador tropieza con un cable, pero no cae ni se lesiona." },
      { t: "Ejemplo", d: "Se desprende una herramienta desde altura, pero no golpea a nadie." },
      { t: "Ejemplo", d: "Un cortocircuito que no alcanza a causar quemaduras." },
      { t: "Ejemplo", d: "Un vehículo frena a tiempo y evita una colisión dentro de la empresa." }
    ] },
  { bloque: "Conceptos SST", titulo: "Accidente de trabajo", icono: "cruz",
    intro: "Suceso repentino que sobreviene por causa o con ocasión del trabajo, y que produce en el trabajador una lesión orgánica, una perturbación funcional o psiquiátrica, una invalidez o la muerte (Ley 1562 de 2012).",
    items: [
      { t: "Dentro del lugar de trabajo", d: "En las instalaciones de la empresa o en el sitio del cliente." },
      { t: "Durante la jornada laboral", d: "Mientras realiza sus funciones." },
      { t: "Cumpliendo órdenes del empleador", d: "Incluso fuera del lugar y del horario habitual de trabajo." }
    ] },
  { bloque: "Conceptos SST", titulo: "¿Cómo reportar un accidente o incidente?", icono: "telefono",
    intro: "El reporte se hace INMEDIATAMENTE, sin esperar. Este es el paso a paso:", pasos: true,
    items: [
      { t: "Trabajador", d: "Informa de inmediato a su jefe inmediato." },
      { t: "Jefe inmediato", d: "Informa al área HSEQ por llamada o correo electrónico." },
      { t: "Área HSEQ", d: "Incidente: se brinda atención y se diligencia el formato C-HSEQ-PR06-F02. Accidente leve: primeros auxilios, reporte a la ARL y remisión al centro médico. Accidente grave: se solicita ambulancia y se reporta a la ARL." },
      { t: "Equipo investigador", d: "COPASST, jefe inmediato, trabajador accidentado y ARL (si es grave). Investigación dentro de los 15 días y plan de acción en los 15 días siguientes (Res. 1401 de 2007)." }
    ] },
  { bloque: "Conceptos SST", titulo: "Participación en los reportes", icono: "mensaje",
    intro: "Cada reporte ayuda a prevenir un accidente. En la oficina encontrará el afiche «Conoce nuestro código QR»: escanéelo con el celular para reportar.",
    items: [
      { t: "Actos inseguros", d: "Comportamientos que pueden causar un accidente, propios o de otros." },
      { t: "Condiciones inseguras", d: "Situaciones peligrosas del lugar, las instalaciones o los equipos." },
      { t: "Incidentes", d: "Lo que pudo ser un accidente, aunque nadie haya resultado lesionado." },
      { t: "Sin miedo", d: "Reportar es un deber y un derecho. El objetivo es corregir, no buscar culpables." }
    ] },

  /* ---------- 5. REGLAMENTO Y EPP ---------- */
  { bloque: "Reglamento y EPP", titulo: "Reglamento Interno de Higiene y Seguridad Industrial", icono: "documento",
    intro: "Documento con el que la empresa se compromete a cumplir las disposiciones legales para prevenir accidentes de trabajo y enfermedades laborales, al funcionamiento del COPASST y al desarrollo del SG-SST.",
    items: [
      { t: "Peligros", d: "Identifica los peligros a los que están expuestos los trabajadores." },
      { t: "Derechos y deberes", d: "De los trabajadores en materia de seguridad y salud en el trabajo." },
      { t: "Gestión de la salud", d: "Actividades de medicina preventiva y del trabajo." },
      { t: "Gestión de los riesgos", d: "Recursos para desarrollar actividades permanentes del SG-SST." }
    ] },
  { bloque: "Reglamento y EPP", titulo: "Elementos de protección personal (EPP)", icono: "casco",
    intro: "Conjunto de elementos y dispositivos diseñados para proteger al trabajador contra accidentes y enfermedades causados por su actividad (Decreto 1072, art. 2.2.4.6.24).",
    items: [
      { t: "Uso obligatorio", d: "Se usan en todo momento mientras dure la exposición al peligro (físico, mecánico, químico, biológico, etc.)." },
      { t: "La empresa los suministra", d: "Adecuados a la naturaleza del riesgo, seguros y eficientes para el usuario." },
      { t: "Cuidado e inspección", d: "Inspecciónelos antes de usarlos, manténgalos limpios y en buen estado, y solicite el cambio cuando estén deteriorados." },
      { t: "Falta grave", d: "El no uso de los EPP constituye una falta grave." }
    ] },

  /* ---------- 6. PELIGROS ---------- */
  { bloque: "Peligros y riesgos", titulo: "Identificación de peligros y valoración de riesgos", icono: "lupa",
    intro: "Usamos la GTC 45, Guía Técnica Colombiana para la identificación de los peligros y la valoración de los riesgos en seguridad y salud en el trabajo. En las siguientes pantallas verá los riesgos a los que estamos expuestos y cómo los controlamos." },
  { bloque: "Peligros y riesgos", titulo: "Riesgo biomecánico", icono: "postura",
    intro: "Probabilidad de sufrir lesiones en músculos, huesos, articulaciones, tendones o ligamentos por esfuerzos o posturas inadecuadas.",
    cols: [
      { t: "Causas", lista: ["Levantamiento de cargas pesadas", "Movimientos repetitivos", "Posturas forzadas o prolongadas", "Empujar o halar objetos", "Trabajo prolongado sentado o de pie"] },
      { t: "Controles", lista: ["Capacitación en higiene postural", "Inspecciones y retroalimentación", "Evaluación del riesgo", "Uso de ayudas mecánicas", "Pausas activas"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo locativo", icono: "edificio",
    intro: "Peligro asociado a las condiciones físicas del lugar de trabajo que pueden provocar caídas, golpes o atrapamientos.",
    cols: [
      { t: "Causas", lista: ["Pisos mojados o resbalosos", "Superficies irregulares", "Escaleras sin pasamanos", "Falta de señalización", "Desorden", "Iluminación insuficiente", "Techos o estructuras en mal estado"] },
      { t: "Controles", lista: ["Inspecciones regulares", "Programa de mantenimiento", "Capacitación en seguridad", "Controles de ingeniería y EPP adecuados", "Orden y aseo en los puestos de trabajo"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo público", icono: "calle",
    intro: "Posibilidad de sufrir daño por situaciones externas causadas por terceros: violencia, delincuencia o alteraciones del orden público.",
    cols: [
      { t: "Cuándo ocurre", lista: ["Actividades fuera de la empresa", "Manejo de dinero o mercancía", "Atención al público", "Desplazamientos por vías públicas", "Consecuencias: lesiones, daño psicológico, pérdidas económicas e incluso la muerte"] },
      { t: "Controles", lista: ["Capacitación en autoprotección", "Protocolos de seguridad", "No manejar grandes sumas de dinero sin protección", "Uso de rutas seguras"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo eléctrico", icono: "rayo",
    intro: "Probabilidad de sufrir lesiones por contacto directo o indirecto con instalaciones, equipos o cables energizados.",
    cols: [
      { t: "Cuándo ocurre", lista: ["Contacto con cables pelados", "Manipular equipos sin desconectarlos", "Instalaciones defectuosas", "Sobrecarga de tomas", "Falta de puesta a tierra", "Consecuencias: descargas, quemaduras, paro cardíaco, caídas, incendios"] },
      { t: "Controles", lista: ["Capacitación y formación", "Elementos de protección adecuados", "Inspección y mantenimiento periódico", "Señalización"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo mecánico", icono: "engranaje",
    intro: "Probabilidad de sufrir lesiones por contacto con máquinas, herramientas o elementos en movimiento: cortes, atrapamientos, golpes o aplastamientos.",
    cols: [
      { t: "Cómo ocurre", lista: ["Contacto con partes móviles (cuchillas, engranajes, correas)", "Herramientas mal usadas o sin protección", "Equipos sin resguardos", "Golpes por objetos que se mueven o caen", "Atrapamiento entre piezas"] },
      { t: "Controles", lista: ["Capacitación al personal", "EPP adecuados", "Mantenimiento preventivo", "Procedimientos de trabajo seguro", "Herramientas en buen estado"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo biológico", icono: "virus",
    intro: "Probabilidad de enfermarse por microorganismos o agentes biológicos: virus, bacterias, hongos, parásitos o fluidos biológicos.",
    cols: [
      { t: "Cómo ocurre", lista: ["Contacto con sangre o fluidos corporales", "Manipulación de residuos biológicos", "Exposición a animales o vectores (picaduras, mordeduras, mosquitos)", "Enfermedades infecciosas"] },
      { t: "Controles", lista: ["Capacitación al personal", "EPP adecuados", "Vacunación", "Lavado de manos y desinfección", "Control de fuentes de riesgo"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo físico", icono: "sol",
    intro: "Daños a la salud por agentes físicos del ambiente laboral, a veces sin contacto directo.",
    cols: [
      { t: "Cómo ocurre", lista: ["Ruido excesivo", "Temperaturas extremas", "Vibraciones", "Radiaciones", "Presión anormal", "Iluminación deficiente"] },
      { t: "Controles", lista: ["EPP: tapones, ropa térmica, gafas", "Señalización de zonas de riesgo", "Ventilación, aislamiento y regulación de temperatura", "Rotación de personal", "Capacitación sobre agentes físicos"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo psicosocial", icono: "mente",
    intro: "Problemas de salud física o mental por la organización del trabajo o el ambiente laboral. Afecta el bienestar emocional, social y psicológico.",
    cols: [
      { t: "Cómo ocurre", lista: ["Exceso de carga laboral o jornadas largas", "Falta de control sobre las tareas", "Metas imposibles", "Acoso laboral", "Conflictos o falta de apoyo", "Inseguridad laboral"] },
      { t: "Controles", lista: ["Mejor organización y planificación del trabajo", "Ambiente sano y colaborativo", "Manejo del estrés y resolución de conflictos", "Canales de comunicación y apoyo psicológico", "Evaluar la carga laboral periódicamente"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Fenómenos naturales", icono: "nube",
    intro: "Daños por eventos naturales fuera del control humano.",
    cols: [
      { t: "Cómo ocurre", lista: ["Sismos o terremotos", "Inundaciones o deslizamientos", "Vendavales, tormentas y granizadas", "Erupciones volcánicas", "Incendios forestales"] },
      { t: "Controles", lista: ["Planes de emergencia y evacuación", "Simulacros periódicos", "Infraestructura resistente y segura", "Capacitación en protocolos de seguridad"] }
    ] },
  { bloque: "Peligros y riesgos", titulo: "Riesgo químico", icono: "quimico",
    intro: "Daños a la salud por exposición a sustancias químicas sólidas, líquidas o gaseosas, con efectos inmediatos o crónicos.",
    cols: [
      { t: "Cómo ocurre", lista: ["Polvos, humos o vapores", "Gases tóxicos o inflamables", "Líquidos corrosivos o irritantes", "Productos reactivos o explosivos", "Fugas de gas natural"] },
      { t: "Controles", lista: ["EPP: guantes, gafas, mascarillas", "Almacenamiento seguro", "Señalización de zonas", "Capacitación en manipulación segura", "Ventilación adecuada"] }
    ] },

  /* ---------- 7. COMITÉS Y EMERGENCIAS ---------- */
  { bloque: "Comités y emergencias", titulo: "Contratistas", icono: "manos",
    intro: "Decreto 1072 de 2015, artículo 2.2.4.6.28: el empleador debe garantizar que proveedores, contratistas y subcontratistas cumplan las normas de seguridad y salud en el trabajo durante el contrato.",
    items: [
      { t: "Comunicación", d: "Procurar canales de comunicación para la gestión de SST con proveedores, trabajadores en misión, contratistas y subcontratistas." },
      { t: "Afiliación", d: "Verificar antes del inicio del trabajo, y periódicamente, la afiliación al Sistema General de Riesgos Laborales." }
    ] },
  { bloque: "Comités y emergencias", titulo: "COPASST", icono: "grupo",
    intro: "Comité Paritario de Seguridad y Salud en el Trabajo: organismo interno conformado por representantes del empleador y de los trabajadores.",
    items: [
      { t: "Función", d: "Promocionar, divulgar y controlar las actividades del Sistema de Gestión de Seguridad y Salud en el Trabajo." },
      { t: "Propone", d: "Medidas y actividades que procuren y mantengan la salud en los lugares y ambientes de trabajo." },
      { t: "Escucha", d: "Estudia y considera las sugerencias de los trabajadores en materia de medicina, higiene y seguridad industrial." },
      { t: "Investiga", d: "Participa en la investigación de los accidentes de trabajo." }
    ] },
  { bloque: "Comités y emergencias", titulo: "Comité de Convivencia Laboral (CCL)", icono: "corazon",
    intro: "Medida preventiva del acoso laboral que protege a los trabajadores contra los riesgos psicosociales.",
    items: [
      { t: "Función principal", d: "Examinar de manera confidencial los casos en que se formule queja o reclamo que pueda constituir acoso laboral." },
      { t: "Quejas", d: "Recibe y da trámite a las quejas y a las pruebas que las soportan." },
      { t: "Buzón del CCL", d: "ccl_buzon@prosolutions-int.com" }
    ] },
  { bloque: "Comités y emergencias", titulo: "Plan de emergencia", icono: "sirena",
    intro: "Conjunto de acciones organizadas y definidas para prevenir, responder y controlar situaciones que pongan en peligro a las personas, las instalaciones o el medio ambiente. En nuestras instalaciones las amenazas incluyen sismos, vendavales, lluvias fuertes, granizadas, tormentas, incendios, fugas de gas natural, atentados, hurtos y atracos.",
    cols: [
      { t: "El plan contiene", lista: ["Identificación de riesgos", "Organización y responsabilidades", "Procedimientos de actuación", "Vías y rutas de evacuación"] },
      { t: "Y además", lista: ["Equipos y recursos", "Comunicación", "Simulacros y capacitación", "Evaluación y mejora"] }
    ] },

  /* ---------- 8. AMBIENTAL ---------- */
  { bloque: "Gestión ambiental", titulo: "Cambio climático", icono: "planeta",
    intro: "Modificación sostenida del clima de la Tierra causada por la actividad humana o por procesos naturales, que altera la temperatura, las lluvias y los fenómenos extremos.",
    cols: [
      { t: "Causas y consecuencias", lista: ["Quema de combustibles fósiles y emisiones de CO₂", "Deforestación y agricultura intensiva (metano y óxido nitroso)", "Aumento de la temperatura global y deshielo", "Subida del nivel del mar e inundaciones", "Más sequías, huracanes y tormentas; pérdida de biodiversidad"] },
      { t: "Lo que podemos hacer", lista: ["Reducir emisiones de gases de efecto invernadero", "Usar energías renovables", "Reforestar y conservar ecosistemas", "Optimizar el consumo de recursos y reciclar", "Educación y conciencia ambiental"] }
    ] },
  { bloque: "Gestión ambiental", titulo: "Código de colores para separar residuos", icono: "reciclar", comp: "residuos",
    intro: "Código nacional de colores para la separación en la fuente (Resolución 2184 de 2019):" },

  /* ---------- 9. CALIDAD ---------- */
  { bloque: "Gestión de calidad", titulo: "Gestión documental", icono: "carpeta",
    intro: "La información documentada del SIG está disponible en Microsoft Teams, en la carpeta «SIG», organizada por proceso.",
    items: [
      { t: "Formatos", d: "Los documentos principales están en PDF; los asociados, en archivo nativo para su uso y para generar evidencias." },
      { t: "Control", d: "Los anexos tienen código, versión y fecha de actualización; por ser informativos no llevan control de cambios." }
    ] },
  { bloque: "Gestión de calidad", titulo: "Almacenamiento de registros por proceso", icono: "nube",
    items: [
      { t: "SAP ERP", d: "Administración y Finanzas, Compras, Ventas y Gestión de Proyectos." },
      { t: "Salesforce", d: "Ventas y Gestión de Proyectos (casos de soporte)." },
      { t: "SharePoint / OneDrive / Teams", d: "Planeación Estratégica, Administración y Finanzas, HSEQ, Talento Humano, Infraestructura, Gestión de Proyectos, Compras y Ventas." },
      { t: "Server 2021", d: "Gestión de Proyectos." }
    ] },

  /* ---------- CIERRE ---------- */
  { bloque: "Cierre", titulo: "Para recordar siempre", icono: "estrella", final: true,
    cita: "En cada decisión que tomamos por la seguridad y el medio ambiente, forjamos el camino hacia un futuro más seguro y sostenible para todos.",
    items: [
      { t: "Reporte siempre", d: "Peligros, actos y condiciones inseguras, incidentes y accidentes: de inmediato." },
      { t: "Ahora sigue la evaluación", d: "Responda con calma. Se aprueba con el 80 % o más y, si no lo logra, puede repasar e intentarlo de nuevo." }
    ] }
];

/* ============================================================
   DATOS DE LOS COMPONENTES GRÁFICOS
   Logos de clientes: guarde cada logo como PNG en img/clientes/
   con el nombre indicado en "logo" (ej. img/clientes/ecopetrol.png).
   Si el archivo no existe, se muestra el nombre del cliente.
   ============================================================ */
window.PS_DATOS = {
  clientes: [
    { n: "Ecopetrol", s: "Energía e hidrocarburos", logo: "ecopetrol" },
    { n: "Cenit", s: "Transporte de hidrocarburos", logo: "cenit" },
    { n: "ODL", s: "Oleoducto de los Llanos", logo: "odl" },
    { n: "Hocol", s: "Exploración y producción", logo: "hocol" },
    { n: "GeoPark", s: "Exploración y producción", logo: "geopark" },
    { n: "Frontera Energy", s: "Exploración y producción", logo: "frontera" },
    { n: "Canacol Energy", s: "Gas natural", logo: "canacol" },
    { n: "Esenttia", s: "Petroquímica", logo: "esenttia" },
    { n: "Yara", s: "Fertilizantes", logo: "yara" },
    { n: "EPM", s: "Servicios públicos", logo: "epm" }
  ],
  acreditaciones: [
    { t: "ISO 9001:2015", s: "Gestión de la calidad", d: "Certificado CO26.05892 · Bureau Veritas" },
    { t: "ISO 14001:2015", s: "Gestión ambiental", d: "Certificado CO26.05893 · Bureau Veritas" },
    { t: "ISO 45001:2018", s: "Seguridad y salud en el trabajo", d: "Certificado CO26.05894 · Bureau Veritas" },
    { t: "Honeywell Platinum", s: "Channel Partner · Industrial Automation", d: "Distribuidor autorizado de productos de automatización industrial en Colombia" }
  ],
  mapa: {
    estrategico: ["Planeación Estratégica"],
    misionales: ["Ventas", "Compras", "Gestión de Proyectos"],
    soporte: ["Talento Humano", "Administración y Finanzas", "Infraestructura", "HSEQ", "Comunicaciones"]
  },
  phva: [
    { l: "P", t: "Planear", d: "Se definen metas y métodos, se identifican y tratan los riesgos, se motiva y capacita." },
    { l: "H", t: "Hacer", d: "Se ejecuta todo lo planeado." },
    { l: "V", t: "Verificar", d: "Se miden los indicadores frente a la meta, se analizan los resultados y se buscan oportunidades de mejora." },
    { l: "A", t: "Actuar", d: "Se eliminan las no conformidades, se toman acciones correctivas y se definen planes de mejora." }
  ],
  residuos: [
    { color: "blanca", t: "Bolsa blanca", s: "Aprovechables", d: "Plástico, vidrio, metales, papel y cartón limpios y secos." },
    { color: "verde", t: "Bolsa verde", s: "Orgánicos aprovechables", d: "Restos de comida, residuos del corte de césped y poda de jardín." },
    { color: "negra", t: "Bolsa negra", s: "No aprovechables", d: "Papel higiénico, servilletas, papeles y cartones contaminados con comida, papeles metalizados." }
  ]
};
