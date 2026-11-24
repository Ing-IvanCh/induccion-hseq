/* ============================================================
   EVALUACIÓN — tomada de "EVALUACIÓN DE INDUCCIÓN Y REINDUCCIÓN"
   Tipos:
     unica   : una sola respuesta. correcta = índice (empieza en 0)
     multiple: varias respuestas. correcta = [índices]; se califica
               correcta solo si marca exactamente esas
     vf      : verdadero/falso. correcta = 0 (Verdadero) o 1 (Falso)
     abierta : texto libre; no se califica, queda en el registro
   ⚠ Revise las respuestas marcadas como correctas (ver README).
   ============================================================ */
window.PS_EVALUACION = [
  { id: "p06", tipo: "unica", texto: "¿Cuál es la misión de la compañía?",
    opciones: [
      "Implementar una ruta de automatización personalizada que garantice el éxito de tu negocio.",
      "Contribuir al desarrollo de una industria más eficiente, segura y confiable a través de sistemas de automatización, control y optimización de los procesos industriales.",
      "Aumentar la eficacia de los procesos según necesidades de nuestros clientes."
    ], correcta: 1 },
  { id: "p07", tipo: "unica", texto: "¿Cuál es la visión de la compañía?",
    opciones: [
      "Liderar la optimización industrial mediante la integración de tecnología, control de procesos, ciberseguridad e inteligencia artificial.",
      "Continuar la consolidación de la organización en el mercado nacional e internacional de automatización de procesos industriales y corporativos.",
      "Impulsar la productividad, la eficiencia, la seguridad y el rendimiento de los activos para clientes de todo el mundo con soluciones que ayudan a acelerar el ritmo del cambio."
    ], correcta: 0 },
  { id: "p08", tipo: "unica", texto: "La política integral del SIG establece el compromiso de toda la organización con:",
    opciones: [
      "El cumplimiento de los requisitos legales y otros requisitos.",
      "Mejorar continuamente el sistema integrado de gestión y asegurar el manejo eficiente de los recursos naturales, humanos, técnicos y financieros.",
      "Promover el equilibrio entre el descanso y el trabajo para propiciar el desarrollo personal y profesional de los colaboradores.",
      "Garantizar entornos de trabajo saludables y seguros, en los que se fomenten la cultura de seguridad y la sana convivencia, en el marco del respeto, la dignidad y la libre expresión.",
      "Todas las anteriores."
    ], correcta: 4 },
  { id: "p09", tipo: "unica", texto: "¿Cómo está estructurado el mapa de procesos de la compañía?",
    opciones: [
      "Estratégicos (planificación estratégica, gestión de proyectos); Misionales (ventas, compras e infraestructura) y Soporte (talento humano, administración y finanzas y HSEQ).",
      "Estratégicos (planificación estratégica); Misionales (ventas) y Soporte (talento humano, administración y finanzas, infraestructura, compras, gestión de proyectos y HSEQ).",
      "Estratégicos (planificación estratégica); Misionales (ventas, compras y gestión de proyectos) y Soporte (talento humano, administración y finanzas, infraestructura, HSEQ y comunicaciones)."
    ], correcta: 2 },
  { id: "p10", tipo: "unica", texto: "¿Cómo se llama el ciclo en el que está basado el Sistema Integrado de Gestión?",
    opciones: ["PHVA (Planear-Hacer-Verificar-Actuar)", "COPASST", "SIG", "Ninguna de las anteriores"], correcta: 0 },
  { id: "p11", tipo: "unica", texto: "El código de conducta empresarial establece los principios por los cuales se rige la organización. ¿Cuáles son los pilares que lo conforman?",
    opciones: [
      "Acoso laboral, diversidad e inclusión.",
      "Trato justo con nuestros grupos de interés y competencia sana.",
      "Anticorrupción, conflicto de intereses y uso de redes sociales.",
      "Regalos, cortesías, activos de la compañía e integridad en la contabilidad.",
      "Privacidad de datos y protección de la información.",
      "Todas las anteriores."
    ], correcta: 5 },
  { id: "p12", tipo: "unica", texto: "¿Cuáles son los peligros contemplados en nuestro reglamento de higiene industrial?",
    opciones: [
      "a) Físico, biológico y de temperaturas.",
      "b) Biomecánico, locativo, fenómenos naturales y público.",
      "c) Psicosocial, químico, biológico, fenómenos naturales, biomecánico y público.",
      "d) Físico y locativo.",
      "a y b son correctas.",
      "c y d son correctas."
    ], correcta: 5 },
  { id: "p13", tipo: "vf", texto: "El Reglamento de Higiene y Seguridad Industrial es el documento en el que se establece el compromiso de Process Solutions con el cumplimiento de los requisitos legales; en él se identifican las funciones del COPASST, la empresa se compromete a designar los recursos para el SG-SST y a gestionar la salud y los riesgos laborales, y se establecen los derechos y deberes de los trabajadores y los peligros a los que estamos expuestos.",
    opciones: ["Verdadero", "Falso"], correcta: 0 },
  { id: "p14", tipo: "multiple", texto: "¿Cuáles son las funciones del Comité Paritario de Seguridad y Salud en el Trabajo (COPASST)? Seleccione todas las que correspondan.",
    opciones: [
      "Proponer la adopción de medidas y el desarrollo de actividades que procuren y mantengan la salud en los lugares y ambientes de trabajo.",
      "Rendir cuentas anualmente a la alta gerencia.",
      "Estudiar y considerar las sugerencias de los trabajadores en materia de medicina, higiene y seguridad industrial.",
      "Recibir y dar trámite a las quejas en las que se describan situaciones que puedan constituir acoso laboral, así como las pruebas que las soportan."
    ], correcta: [0, 2] },
  { id: "p15", tipo: "vf", texto: "La función principal del Comité de Convivencia Laboral es examinar de manera confidencial los casos específicos en los que se formule queja o reclamo que pudiera tipificar conductas o circunstancias de acoso laboral al interior de la empresa.",
    opciones: ["Verdadero", "Falso"], correcta: 0 },
  { id: "p16", tipo: "unica", texto: "¿Cuáles son los riesgos y amenazas a los que nos vemos expuestos en las instalaciones?",
    opciones: [
      "Sismos, vendaval, lluvias fuertes, granizadas, tormentas, incendios y fugas de gas natural.",
      "Atentado terrorista, hurto y atraco.",
      "Todas las anteriores."
    ], correcta: 2 },
  { id: "p18", tipo: "unica", texto: "¿Cuáles son los peligros asociados a las actividades relacionadas con su labor?",
    opciones: [
      "Biomecánicos: postura (prolongada, mantenida, forzada) y movimientos repetitivos.",
      "Condiciones de seguridad: superficies de trabajo (irregulares, deslizantes, con diferencia de nivel).",
      "Biológico: picaduras o mordeduras de animales venenosos, virus, bacterias, hongos, mosquitos.",
      "Físico: iluminación.",
      "Psicosocial: condiciones de la tarea (carga mental, demandas emocionales, definición de roles, monotonía, etc.).",
      "Todas las anteriores."
    ], correcta: 5 },
  { id: "p19", tipo: "unica", texto: "¿En qué momento se debe reportar al área HSEQ y al jefe inmediato si se identifican peligros, condiciones o actos inseguros, o si sucede un accidente de trabajo?",
    opciones: ["No reportar", "Inmediatamente", "En un plazo de 15 días", "En un plazo de un mes"], correcta: 1 },
  { id: "p20", tipo: "vf", texto: "Los elementos y equipos de protección personal (EPP) se deben mantener en buen estado y usar en todo momento mientras dure la exposición al peligro.",
    opciones: ["Verdadero", "Falso"], correcta: 0 },
  { id: "p21", tipo: "vf", texto: "Según el nuevo código de colores: bolsa blanca para residuos aprovechables limpios y secos (plástico, vidrio, metales, papel y cartón); negra para no aprovechables (papel higiénico, servilletas, papeles y cartones contaminados con comida); verde para orgánicos aprovechables (restos de comida, corte de césped y poda).",
    opciones: ["Verdadero", "Falso"], correcta: 0 },

  /* ---------- Preguntas abiertas (no se califican) ---------- */
  { id: "p17", tipo: "abierta", obligatoria: true, texto: "Con sus propias palabras, defina: ¿qué es un peligro? ¿Qué es un riesgo?" },
  { id: "p22", tipo: "abierta", obligatoria: true, texto: "Escriba una breve reflexión sobre la realidad ambiental que atraviesa el planeta y establezca un compromiso con el que está dispuesto a contribuir." },
  { id: "p23", tipo: "abierta", obligatoria: true, texto: "De acuerdo con la capacitación recibida, ¿qué aspectos mejoraría de la inducción y reinducción?" },
  { id: "p24", tipo: "abierta", obligatoria: false, texto: "Sugerencias, felicitaciones, críticas constructivas y oportunidades de mejora (opcional)." }
];
