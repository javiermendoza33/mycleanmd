import { PROGRAMS, type Program } from "@/labo/content";

/**
 * The Labo Method in Spanish (Nov 27 2026, Javier: "lets work on spanish version of TheLaboMethod, a button that
 * switches in Spanish"). Same shapes as the English exports in content.ts, so one page template serves both
 * languages. Prices, slugs and Stripe ids are NOT repeated here: PROGRAMS_ES is the English catalog with only the
 * words swapped, so a price change in content.ts shows up in both languages.
 *
 * Voice: Latin American Spanish, informal "tú", first person where the English speaks as the clinician.
 * Terms held constant across the site: nurse practitioner = "enfermera de práctica avanzada"; clinician =
 * "profesional de salud"; labs = "análisis"; intake = "cuestionario inicial"; compounded = "compuesto";
 * refill = "resurtido"; taper = "reducción gradual"; PCP = "médico de atención primaria".
 *
 * ⚠️ Not yet reviewed by Monika or counsel. It is a translation of copy that is itself still flagged as
 * placeholder in content.ts (prices, clinical claims), and it stays noindex with the rest until LAUNCH_READY.
 */
export const AVAILABILITY_ES = "los 50 estados";   // Nov 27 2026: was "California y Washington" (see AVAILABILITY in content.ts)

type Words = Omit<Program, "slug" | "index" | "price" | "priceMeta" | "stripePriceId">;

const WORDS: Record<string, Words> = {
  "glp-1-weight-management": {
    name: "Control de peso con GLP-1",
    navBlurb: "Semaglutida y tirzepatida, dosificadas según tus análisis.",
    cardBlurb: "Semaglutida o tirzepatida, dosificadas según tus análisis y ajustadas por una profesional de salud que está pendiente de tus efectos secundarios.",
    lede: "Terapia con GLP-1 bajo supervisión médica para adultos que quieren que el medicamento se maneje como debe ser: primero análisis reales, un plan de dosis real y alguien a quien llamar cuando la semana cuatro se pone difícil.",
    priceNote: "Medicamento, consultas y mensajes incluidos. Los análisis de laboratorio se cobran aparte.",
    leftHeading: "Para quién es",
    leftItems: [
      "Adultos con un IMC de 30 o más, o de 27 con una condición relacionada",
      "Personas que ya han bajado de peso y lo han recuperado",
      "Quienes ya usan un GLP-1 y quieren una supervisión clínica más cercana",
      "Pacientes que quieren orientación de nutrición y fuerza junto con el medicamento",
      "No es apropiado durante el embarazo, ni con antecedentes de carcinoma medular de tiroides o MEN2",
    ],
    rightHeading: "Cómo es el tratamiento",
    rightItems: [
      { key: "Análisis", value: "A1c, insulina en ayunas, lípidos, panel metabólico completo (CMP), hemograma (CBC), TSH y un panel metabólico inicial" },
      { key: "Medicamento", value: "Semaglutida y tirzepatida, compuestas o de marca, según la disponibilidad y tu respuesta" },
      { key: "Ajuste de dosis", value: "La dosis sube solo cuando tu tolerancia y tus resultados lo justifican, nunca por calendario fijo" },
      { key: "Seguimiento", value: "Revisión en las semanas 2, 6 y 12, y después cada ocho semanas" },
      { key: "Salida", value: "Un plan escrito de mantenimiento y reducción gradual antes de que lo necesites" },
    ],
    noteHeading: "Una nota sobre los GLP-1 compuestos",
    noteBody: "La semaglutida y la tirzepatida compuestas las preparan farmacias con licencia estatal y no son productos aprobados por la FDA. Te diré con claridad qué presentación recibes, por qué y cuáles son las ventajas y desventajas. Si el medicamento de marca está disponible y es adecuado para ti, iremos por esa opción.",
    pricingBullets: [
      "Semaglutida o tirzepatida incluida",
      "Plan de ajuste de dosis revisado en cada paso",
      "Revisiones en las semanas 2, 6 y 12",
      "Orientación de nutrición y fuerza",
      "Plan escrito de mantenimiento y reducción gradual",
    ],
    pricingNote: "Semaglutida o tirzepatida, consultas y mensajes incluidos",
  },
  "peptide-therapy": {
    name: "Terapia con péptidos",
    navBlurb: "Recuperación, sueño, reparación de tejidos y apoyo metabólico.",
    cardBlurb: "Protocolos específicos para recuperación, calidad del sueño, reparación de tejidos y apoyo metabólico, basados en un panel inicial.",
    lede: "Los péptidos son útiles y están sobrevalorados casi en la misma medida. Este programa parte de tus análisis y tus metas, usa solo agentes que puedo respaldar y suspende lo que no funciona.",
    priceNote: "Incluye supervisión clínica y coordinación con la farmacia. El costo del péptido varía.",
    leftHeading: "Por qué viene la gente",
    leftItems: [
      "Recuperación lenta después de entrenar o de una lesión",
      "Sueño de mala calidad a pesar de tener buenos hábitos",
      "Composición corporal que no cambia solo con dieta",
      "Dolor de articulaciones y tejidos blandos después de una lesión antigua",
      "Metas generales de longevidad y rendimiento con un enfoque basado en datos",
    ],
    rightHeading: "Cómo trabajamos",
    rightItems: [
      { key: "Punto de partida", value: "IGF-1, panel metabólico y hormonal completo, marcadores inflamatorios" },
      { key: "Selección", value: "Agentes elegidos según tu meta y tu historial, usados en ciclos y no de forma indefinida" },
      { key: "Farmacia", value: "Solo de farmacias de compuestos con licencia estatal en EE. UU." },
      { key: "Revisión", value: "Análisis de control a las 8 a 12 semanas para confirmar el efecto, no solo cómo te sientes" },
      { key: "Suspensión", value: "Si un protocolo no produce un cambio medible, lo suspendemos" },
    ],
    noteHeading: "Lo que no voy a hacer",
    noteBody: "No receto péptidos que han sido retirados de la preparación de compuestos, que carecen de datos creíbles de seguridad en humanos o que se promocionan con afirmaciones que nadie puede sustentar. Si leíste sobre algo y quieres mi opinión honesta, pregúntame en tu consulta.",
    pricingBullets: [
      "Protocolo creado a partir de tu panel inicial",
      "Solo farmacias de compuestos con licencia en EE. UU.",
      "Análisis de control a las 8 a 12 semanas",
      "En ciclos, no de forma indefinida",
      "El costo del péptido varía según el agente",
    ],
    pricingNote: "Diseño del protocolo, supervisión y coordinación con la farmacia",
  },
  "testosterone-for-men": {
    name: "Testosterona para hombres",
    navBlurb: "Evaluación completa, tratamiento cuando está indicado y seguimiento real.",
    cardBlurb: "Evaluación endocrina completa, tratamiento cuando está indicado y el seguimiento que una terapia de testosterona responsable realmente exige.",
    lede: "La terapia con testosterona bien hecha es una relación clínica a largo plazo, no una suscripción a un vial. Eso significa confirmar el diagnóstico, proteger la fertilidad si te importa y vigilar el hematocrito y el estradiol con un calendario.",
    priceNote: "Medicamento, insumos, consultas y mensajes incluidos. Los análisis de laboratorio se cobran aparte.",
    leftHeading: "Síntomas que vale la pena investigar",
    leftItems: [
      "Cansancio que el sueño no resuelve",
      "Pérdida de erecciones matutinas o menor deseo sexual",
      "Fuerza y masa muscular en descenso a pesar de entrenar",
      "Ánimo bajo, irritabilidad o falta de motivación",
      "Se requieren dos mediciones matutinas de testosterona total antes de cualquier decisión de tratamiento",
    ],
    rightHeading: "El protocolo",
    rightItems: [
      { key: "Evaluación", value: "Testosterona total y libre, LH, FSH, SHBG, estradiol, prolactina, PSA, hemograma (CBC), panel metabólico (CMP), lípidos" },
      { key: "Tratamiento", value: "Cipionato o enantato de testosterona inyectable, o tópico si lo prefieres" },
      { key: "Fertilidad", value: "Hablamos de HCG u otras alternativas antes de empezar si quizá quieras tener hijos" },
      { key: "Seguimiento", value: "Análisis a las 6 semanas, a las 12 semanas y después cada 6 meses. Hematocrito y PSA en cada toma" },
      { key: "Ajuste", value: "La dosis y la frecuencia cambian según los niveles valle y los síntomas en conjunto" },
    ],
    noteHeading: "Sustancia controlada, manejada con cuidado",
    noteBody: "La testosterona es una sustancia controlada de la Lista III. Recetarla requiere un diagnóstico documentado, una consulta por video y una revisión del programa estatal de monitoreo de recetas. No puedo recetarla en una primera consulta sin análisis, y rechazaré el tratamiento cuando no esté indicado.",
    pricingBullets: [
      "Medicamento e insumos de inyección incluidos",
      "Evaluación endocrina completa interpretada",
      "Hematocrito y PSA vigilados en cada toma",
      "Preservación de la fertilidad conversada desde el inicio",
      "Análisis a las 6 semanas, a las 12 semanas y luego cada seis meses",
    ],
    pricingNote: "Medicamento, insumos y revisión de los análisis de seguimiento",
  },
  "hormone-therapy-for-women": {
    name: "Terapia hormonal para mujeres",
    navBlurb: "Atención de la perimenopausia y la menopausia, tomada en serio.",
    cardBlurb: "Atención de la perimenopausia y la menopausia por alguien que toma tus síntomas en serio y los trata.",
    lede: "A la mayoría de las mujeres que describen bochornos, sueño interrumpido y niebla mental ya les dijeron que aguanten. La terapia hormonal moderna es más segura y se entiende mejor que en los titulares de hace veinte años, y es una opción razonable para la mayoría de las pacientes.",
    priceNote: "Medicamento, consultas y mensajes incluidos. Los análisis de laboratorio se cobran aparte.",
    leftHeading: "Lo que tratamos",
    leftItems: [
      "Bochornos y sudores nocturnos",
      "Sueño interrumpido y despertar temprano",
      "Cambios de ánimo, ansiedad y niebla mental",
      "Resequedad vaginal y dolor en las relaciones sexuales",
      "Pérdida de masa muscular, preocupación por la densidad ósea y bajo deseo sexual",
    ],
    rightHeading: "Enfoque del tratamiento",
    rightItems: [
      { key: "Evaluación", value: "Historial completo, puntaje de síntomas, FSH, estradiol, tiroides, lípidos, hemograma (CBC), panel metabólico (CMP)" },
      { key: "Estrógeno", value: "De preferencia parche o gel transdérmico; oral cuando es apropiado" },
      { key: "Progesterona", value: "Progesterona micronizada oral para toda persona con útero" },
      { key: "Testosterona", value: "Dosis baja para el deseo sexual y la energía cuando está indicada, conversada abiertamente" },
      { key: "Revisión", value: "Revisión a las seis semanas, y después análisis y revisión de síntomas cada seis meses" },
    ],
    noteHeading: "Sobre el riesgo, con honestidad",
    noteBody: "La terapia hormonal tiene contraindicaciones reales y beneficios reales, y el balance depende de tu edad, del tiempo desde la menopausia y de tu historial personal y familiar. Te explicaré lo que aplica a tu caso en lugar de recitarte estadísticas poblacionales.",
    pricingBullets: [
      "Estradiol transdérmico y progesterona oral",
      "Testosterona en dosis baja cuando está indicada",
      "Puntaje de síntomas en cada revisión",
      "Revisión a las seis semanas y luego análisis cada seis meses",
      "Estrógeno vaginal incluido cuando se necesita",
    ],
    pricingNote: "Estrógeno, progesterona y testosterona en dosis baja según indicación",
  },
};

/** The English catalog with the words swapped; a program with no Spanish entry yet falls back to English. */
export const PROGRAMS_ES: Program[] = PROGRAMS.map((p) => ({ ...p, ...(WORDS[p.slug] ?? {}), priceMeta: `${p.price} / mes` }));

export const HOW_SHORT_ES = [
  { n: "01", title: "Cuestionario inicial", body: "Diez minutos de historial, metas y medicamentos en el portal seguro." },
  { n: "02", title: "Análisis", body: "Una orden para un panel que te toman en un laboratorio cerca de ti, o usamos uno reciente." },
  { n: "03", title: "Consulta por video", body: "Revisamos tus resultados juntos y acordamos un plan." },
  { n: "04", title: "Tratamiento", body: "El medicamento llega a tu casa. Ajustamos según cambien tus números." },
];

export const HOW_LONG_ES = [
  {
    n: "01", title: "Cuestionario inicial", meta: "UNOS 10 MINUTOS",
    body: "Creas una cuenta en el portal de pacientes y completas tu historial médico: medicamentos actuales, tratamientos anteriores, antecedentes familiares y lo que de verdad esperas cambiar.",
    detail: "Aquí también subes los análisis que ya tengas. Si tu panel es reciente y completo, quizá no haga falta repetirlo.",
  },
  {
    n: "02", title: "Análisis de laboratorio", meta: "DE 2 A 5 DÍAS",
    body: "Escribo la orden para el panel que requiere tu programa y te lo toman en un laboratorio cerca de ti, en el horario que te convenga.",
    detail: "Con frecuencia los análisis se pueden cobrar a tu seguro. Si prefieres, puedes usar tu propio laboratorio o a tu médico de atención primaria para la toma.",
  },
  {
    n: "03", title: "Consulta por video", meta: "DE 30 A 45 MINUTOS",
    body: "Revisamos cada marcador relevante de tu panel, no solo los que salen marcados, y te explico qué creo que está causando tus síntomas.",
    detail: "Después acordamos un protocolo juntos. Saldrás de la consulta sabiendo qué tomas, por qué, qué vigilar y cuándo volvemos a revisar.",
  },
  {
    n: "04", title: "Tratamiento y seguimiento", meta: "CONTINUO",
    body: "El medicamento llega a tu puerta desde una farmacia con licencia. Los cambios de dosis se basan en análisis de control y en cómo te va de verdad.",
    detail: "Los mensajes por el portal están incluidos, son ilimitados y los respondo yo en un día hábil. Las consultas de seguimiento están incluidas en tu cuota mensual.",
  },
];

export const INCLUDED_ES = [
  "Consultas por video con tu profesional de salud",
  "Mensajes ilimitados por el portal",
  "Órdenes de laboratorio e interpretación",
  "Medicamento enviado desde una farmacia con licencia",
  "Todos los ajustes de dosis y resurtidos",
  "Protocolo escrito que puedes conservar",
  "Notas compartidas con tu médico de atención primaria si lo pides",
  "Cancela cuando quieras",
];

export const CLINICIAN_ES = {
  quote: "Creé esta práctica porque me cansé de ver cómo a la gente le entregaban una receta sin que nadie revisara sus análisis, su historial ni su vida.",
  body: `La atención está disponible en ${AVAILABILITY_ES}. Cada protocolo lo escribe, lo revisa y lo ajusta una profesional de salud con licencia en tu estado, conforme cambian tus números.`,
};

export const EXTRA_PRICING_ES = [
  { name: "Consulta inicial", price: "$149", note: "Pago único. Se acredita a tu primer mes si comienzas un programa." },
  { name: "Paneles de laboratorio", price: "$99 – $249", note: "Depende del panel. Muchos pacientes usan su seguro o un análisis reciente." },
  { name: "Lo que no se cobra", price: "$0", note: "Consultas de seguimiento, ajustes de dosis, mensajes del portal, solicitudes de resurtido y envío." },
];

export const PRICING_FOOTNOTE_ES =
  "Los precios corresponden al programa descrito y pueden cambiar. La disponibilidad y el precio de los medicamentos compuestos varían según la farmacia. Nada de lo aquí indicado es una cotización ni una garantía de tratamiento.";

export const FAQ_ES = [
  { q: "¿En qué estados atienden?", a: `La atención está disponible en ${AVAILABILITY_ES}. Las reglas de telesalud exigen que estés físicamente en un estado donde tu profesional de salud tenga licencia en el momento de la consulta, así que te asignamos una profesional con licencia donde vives. Si te mudas o viajas, avísanos, porque afecta quién puede atenderte ese día.` },
  { q: "¿Lo cubre el seguro?", a: "La cuota del programa es de pago directo. Con frecuencia los análisis se pueden cobrar a tu seguro, y escribiré órdenes que te permitan usar tu propio laboratorio o tu plan. Hay recibos detallados (superbills) disponibles si quieres pedir un reembolso fuera de la red." },
  { q: "¿Puedo usar análisis que ya tengo?", a: "Muchas veces, sí. Si tu panel es reciente y suficientemente completo, lo usaremos en lugar de repetir la toma. Envíalo por el portal antes de tu primera consulta y te diré qué falta, si falta algo." },
  { q: "¿Qué tan rápido puedo empezar?", a: "La mayoría de los pacientes completa el cuestionario inicial, se hace los análisis en pocos días y tiene un protocolo dentro de las 24 horas siguientes a la llegada de los resultados. Las sustancias controladas, como la testosterona, requieren primero una consulta por video y una revisión del programa de monitoreo de recetas." },
  { q: "¿Quién receta mi medicamento?", a: "Yo. Cada receta de este sitio la escribo yo después de una consulta por video y de revisar tus análisis. Nada se genera automáticamente a partir de un formulario." },
  { q: "¿De dónde viene el medicamento?", a: "De farmacias con licencia estatal en EE. UU., incluidas farmacias de compuestos con licencia cuando un preparado compuesto es apropiado. Te diré qué farmacia surte tu receta y si el producto está aprobado por la FDA o es compuesto." },
  { q: "¿Y si necesito contactarte entre consultas?", a: "Escríbeme por el portal. Está incluido en tu cuota, no hay cargo por mensaje y respondo en un día hábil. Cualquier urgencia debe ir a tu médico de atención primaria o a una sala de emergencias." },
  { q: "¿Puedo cancelar?", a: "Cualquier mes, sin penalización y sin permanencia. Si dejas un programa hormonal o de GLP-1, te daré un plan escrito de reducción gradual o de mantenimiento para que no tengas que improvisar." },
  { q: "¿Trabajas con mi médico de atención primaria?", a: "Con gusto. Con tu consentimiento envío las notas de las consultas y los resultados de laboratorio a tu médico para que tu expediente se mantenga completo. La atención coordinada da mejores resultados y menos análisis duplicados." },
];

/** The header nav in Spanish. The Journal is left out on purpose: its articles are English only for now (footer links to it). */
export const METHOD_NAV_ES = [
  { label: "Programas", href: "/programs" },
  { label: "Precios", href: "/pricing" },
  { label: "Cómo funciona", href: "/how-it-works" },
  { label: "Preguntas", href: "/faq" },
] as const;

export const FOOTER_DISCLAIMER_ES = `Los servicios clínicos los prestan profesionales de salud con licencia en el estado del paciente; la atención está disponible en ${AVAILABILITY_ES}. Este sitio web no ofrece consejo médico.`;
export const TAGLINE_ES = "Atención hormonal, de peso y de péptidos, por video.";
