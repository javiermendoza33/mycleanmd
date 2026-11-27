import type { Post } from "@/labo/clinic/types";

/**
 * The Journal in Spanish (Nov 27 2026, Javier: "both english and full spanish version so we can get the people searching
 * … in spanish for GLPs, peptides etc"). Each article is the Spanish version of one English article — same date, same
 * image, same claims — with its OWN Spanish slug and a search-minded Spanish title (people search "semaglutida para
 * bajar de peso", not a translated English URL). `en` ties it to its English twin for hreflang and the language switch.
 *
 * Voice and glossary: see the top of content.es.ts. Drug and trial names stay as they are written in the literature.
 * ⚠️ A translation of medical copy, not yet reviewed by Monika. Nothing here adds a claim the English does not make.
 */
export type EsPost = Post & { /** slug of the English article this one translates */ en: string };

export const postsEs: EsPost[] = [
  {
    en: "glp-1-weight-loss-what-the-evidence-shows",
    slug: "semaglutida-y-tirzepatida-para-bajar-de-peso-lo-que-muestra-la-evidencia",
    title: "GLP-1 para bajar de peso: lo que realmente muestra la evidencia",
    excerpt:
      "La semaglutida y la tirzepatida son los medicamentos para bajar de peso más estudiados en una generación. Esto es lo que encontraron los grandes estudios, y lo que no.",
    date: "2026-11-10",
    image: { src: "/labo/img/services/medical-weight-loss.jpg", alt: "Manos sosteniendo un tazón en forma de corazón con verduras, fruta y proteína magra junto a ropa deportiva" },
    body: [
      {
        heading: "Dos medicamentos, dos grandes estudios",
        paragraphs: [
          "Casi todo lo que la gente llama \"GLP-1 para bajar de peso\" se reduce a dos medicamentos: la semaglutida (el principio activo de Wegovy y Ozempic) y la tirzepatida (el principio activo de Zepbound y Mounjaro). Ambos imitan hormonas intestinales que hacen más lenta la digestión y reducen el apetito. Ambos se probaron en estudios grandes, aleatorizados y controlados con placebo antes de su aprobación, que es el tipo de evidencia que de verdad dice lo que hace un medicamento y no solo lo que la gente espera que haga.",
          "El estudio de semaglutida para pérdida de peso, STEP 1, siguió durante 68 semanas a adultos sin diabetes. El grupo de semaglutida perdió en promedio cerca del 15% de su peso inicial; el grupo de placebo, alrededor del 2%. El estudio de tirzepatida, SURMOUNT-1, duró 72 semanas y encontró pérdidas promedio aún mayores con las dosis más altas, de poco más del 20%, frente a unos pocos puntos porcentuales con placebo.",
        ],
      },
      {
        heading: "Lo que eso significa para una persona",
        paragraphs: [
          "Un porcentaje en una gráfica no es lo mismo que un resultado en un cuerpo específico, y promedio no quiere decir garantizado. Algunas personas responden mucho, otras de forma modesta, y un grupo pequeño no tolera el medicamento lo suficiente como para seguir con él. Los estudios también dejaron algo muy claro: cuando la gente deja el medicamento, la mayoría recupera una parte importante del peso durante el año siguiente. La terapia con GLP-1, al menos por ahora, se comporta como el tratamiento de una condición crónica, no como un ciclo que terminas y dejas atrás.",
        ],
      },
      {
        heading: "Los efectos secundarios son reales, y casi todos digestivos",
        paragraphs: [
          "Las náuseas, el estreñimiento y el reflujo son las razones más comunes por las que la gente lo deja. Suelen ser peores durante los aumentos de dosis y ceden a medida que el cuerpo se adapta; por eso un ajuste de dosis supervisado, que responde a cómo toleras cada dosis y no a un calendario fijo, importa más de lo que la gente espera al empezar. Los riesgos poco frecuentes pero serios (enfermedad de la vesícula, pancreatitis) se vigilan y se conversan antes de empezar, junto con la contraindicación para cualquier persona con antecedentes personales o familiares de carcinoma medular de tiroides o MEN2.",
        ],
        list: [
          "Más comunes: náuseas, estreñimiento, reflujo y cansancio durante el ajuste de dosis",
          "Menos comunes pero importantes: enfermedad de la vesícula, pancreatitis",
          "Contraindicado: antecedentes personales o familiares de carcinoma medular de tiroides o MEN2",
          "No se ha estudiado su seguridad en el embarazo: se suspende antes de la concepción",
        ],
      },
      {
        heading: "Compuesto o de marca",
        paragraphs: [
          "La escasez llevó a mucha gente a la semaglutida y la tirzepatida compuestas: versiones preparadas por una farmacia de compuestos con licencia, en lugar de las fabricadas por Novo Nordisk o Eli Lilly. Los medicamentos compuestos no son productos aprobados por la FDA; no han pasado por la misma revisión de fabricación que el medicamento de marca, aunque el principio activo sea el mismo. Eso no los descalifica automáticamente (la preparación de compuestos tiene una historia larga y legítima en la medicina), pero es una diferencia real, y siempre deberías saber cuál te están dando y por qué.",
        ],
      },
      {
        heading: "El resumen honesto",
        paragraphs: [
          "La evidencia de los estudios sobre los medicamentos GLP-1 para el control de peso es inusualmente sólida para una intervención de este tipo: muestras grandes, diseño aleatorizado, comparación real con placebo y seguimiento de varios años. Eso no equivale a decir que sea adecuado para todos, ni que el número de la diapositiva del estudio sea el que verás tú. Es una herramienta real, con ventajas y desventajas reales, que funciona mejor con un seguimiento real: análisis antes de empezar, un plan de dosis que se ajusta a ti y alguien pendiente de lo que no aparece en una gráfica.",
        ],
      },
    ],
    seo: {
      title: "Semaglutida y tirzepatida (GLP-1) para bajar de peso: lo que muestra la evidencia",
      description: "Lo que encontraron los estudios STEP y SURMOUNT sobre la semaglutida y la tirzepatida, cuáles son en realidad los efectos secundarios y la diferencia entre compuesto y de marca, explicado con claridad y en español.",
    },
  },
  {
    en: "peptide-therapy-what-we-know-and-dont",
    slug: "terapia-con-peptidos-lo-que-sabemos-y-lo-que-no",
    title: "Terapia con péptidos: lo que sabemos y lo que no",
    excerpt:
      "Los péptidos se venden como remedio para todo, de la recuperación al envejecimiento. El panorama honesto es más mixto: algunos agentes tienen datos reales en humanos y otros casi ninguno.",
    date: "2026-11-11",
    image: { src: "/labo/img/misc/blog.jpg", alt: "Primer plano de piel sana e hidratada" },
    body: [
      {
        heading: "\"Péptidos\" no es una sola cosa",
        paragraphs: [
          "Un péptido es simplemente una cadena corta de aminoácidos. El término abarca desde la insulina (décadas de uso, muy bien estudiada) hasta los secretagogos de la hormona del crecimiento como CJC-1295 e ipamorelina, y agentes enfocados en la recuperación como BPC-157. Meterlos todos bajo una sola palabra de mercadeo es parte de la razón por la que la conversación sobre la evidencia se vuelve tan confusa. Cada agente debe juzgarse por sus propios datos, no por la reputación de la categoría.",
        ],
      },
      {
        heading: "Dónde la evidencia es más sólida",
        paragraphs: [
          "Los secretagogos de la hormona del crecimiento son los que tienen más datos de estudios en humanos dentro del grupo, en gran parte porque algunos se estudiaron para indicaciones legítimas de deficiencia hormonal antes de que el mercado del bienestar los descubriera. Estudios clínicos pequeños han mostrado efectos en la calidad del sueño y en los pulsos de hormona del crecimiento. Eso es real, pero también es una afirmación más acotada que \"antienvejecimiento\" o \"pérdida de grasa\"; y los estudios pequeños, incluso los buenos, no son lo mismo que los grandes estudios aleatorizados que respaldan a los medicamentos GLP-1.",
        ],
      },
      {
        heading: "Dónde la evidencia es escasa",
        paragraphs: [
          "Agentes como BPC-157, que suelen promocionarse para la reparación de tejidos y la recuperación de lesiones, están respaldados sobre todo por estudios en animales e in vitro. Eso no significa que no hagan nada (la ciencia en etapas tempranas a veces se confirma), pero sí significa que la evidencia en humanos que la mayor parte de la publicidad da a entender todavía no existe. También conviene saber que algunos de estos agentes están en un terreno regulatorio realmente incierto: varios han entrado y salido de las listas de la FDA de sustancias que las farmacias de compuestos pueden usar, y eso explica en parte por qué su disponibilidad ha cambiado en los últimos años.",
        ],
      },
      {
        heading: "El balance honesto, por agente",
        paragraphs: ["Así está la evidencia por categoría, dicho de la forma más clara posible:"],
        list: [
          "Datos más sólidos en humanos: ciertos secretagogos de la hormona del crecimiento (sueño, pulsos de hormona del crecimiento; afirmaciones más acotadas que las de la publicidad)",
          "Datos escasos o tempranos en humanos: muchos péptidos de \"reparación\" (BPC-157 y similares), en su mayoría preclínicos",
          "Situación regulatoria: cambiante; algunos agentes han entrado y salido de las listas de compuestos permitidos",
          "Ninguno de esta categoría tiene aprobación de la FDA para los usos con los que normalmente se vende",
        ],
      },
      {
        heading: "Por qué lo ofrecemos de todos modos, con condiciones",
        paragraphs: [
          "Un programa basado en un panel inicial, una meta documentada y un plan para suspender lo que no funciona es una forma razonable de usar una categoría con evidencia mixta; es algo muy distinto de un cuestionario que envía un vial sin seguimiento. Si empiezas un protocolo de péptidos aquí, te diremos con claridad qué agente usas, para qué tiene buenos datos y para qué no, y cuáles son las ventajas y desventajas antes de comenzar. Si la evidencia no respalda continuar, lo conversamos; no es una suscripción que simplemente se sigue renovando.",
        ],
      },
    ],
    seo: {
      title: "Terapia con péptidos: lo que sabemos y lo que no (BPC-157, ipamorelina, CJC-1295)",
      description: "Una mirada honesta, en español, a la evidencia en humanos detrás de la terapia con péptidos: dónde los datos son reales, dónde son escasos y por qué el panorama regulatorio sigue cambiando.",
    },
  },
  {
    en: "testosterone-therapy-for-men-what-to-know",
    slug: "terapia-de-testosterona-para-hombres-lo-que-respalda-la-ciencia",
    title: "Terapia de testosterona para hombres: lo que realmente respalda la investigación",
    excerpt:
      "Un estudio de 2023 respondió la mayor pregunta pendiente sobre la testosterona y el riesgo cardíaco. Esto es lo que encontró, y por qué el diagnóstico sigue importando más que los síntomas por sí solos.",
    date: "2026-11-12",
    image: { src: "/labo/img/misc/patient-care.jpg", alt: "Hombre relajado durante un tratamiento de cuidado de la piel" },
    body: [
      {
        heading: "La testosterona baja es un resultado de laboratorio, no una sensación",
        paragraphs: [
          "El cansancio, el bajo deseo sexual y la dificultad para ganar músculo tienen una larga lista de causas, y la testosterona es solo una de ellas. Recetar con responsabilidad empieza con dos resultados bajos confirmados, tomados por la mañana, cuando la testosterona está más alta, además de síntomas que de verdad coincidan con los análisis; no con un solo número ni con una sensación. Esa secuencia existe porque la testosterona baja de forma natural con el mal sueño, el estrés y las enfermedades, y tratar una baja temporal como una deficiencia permanente no ayuda a nadie.",
        ],
      },
      {
        heading: "La pregunta cardiovascular, y lo que por fin la respondió",
        paragraphs: [
          "Durante años, la terapia con testosterona cargó con una duda de seguridad cardiovascular sin resolver, incluida una advertencia en la etiqueta que la FDA añadió en 2015. Esa duda tuvo una respuesta real en 2023, cuando el estudio TRAVERSE, un estudio grande y aleatorizado diseñado específicamente para evaluar esto en hombres con hipogonadismo y factores de riesgo cardiovascular, no encontró un aumento en la tasa de eventos cardíacos mayores en el grupo de testosterona frente al de placebo. Es una de las evidencias más tranquilizadoras que ha llegado a este campo en mucho tiempo, aunque no elimina todas las conversaciones sobre riesgo.",
        ],
      },
      {
        heading: "Lo que la terapia de testosterona sí hace de forma confiable",
        paragraphs: [
          "En el conjunto de la evidencia, la terapia con testosterona en hombres con una deficiencia confirmada mejora de forma confiable la función sexual y las mediciones de densidad ósea, y aumenta de forma confiable el hematocrito (la concentración de glóbulos rojos), que es justamente la razón por la que el seguimiento no termina con la primera receta. Los efectos en la energía y el ánimo se reportan a menudo, pero se miden de forma menos consistente entre los estudios que los marcadores físicos.",
        ],
        list: [
          "Confiable: mejor función sexual, mayor densidad ósea, aumento del hematocrito",
          "Requiere seguimiento: hematocrito (riesgo de policitemia), PSA, lípidos",
          "Suprime: la producción natural de testosterona y la fertilidad mientras dura la terapia",
          "TRAVERSE (2023): sin aumento en la tasa de eventos cardíacos mayores frente a placebo en hombres con riesgo",
        ],
      },
      {
        heading: "La parte que en internet se saltan",
        paragraphs: [
          "La testosterona suprime la producción propia del cuerpo y, con ella, la fertilidad: algo real que considerar para quien quiera tener hijos biológicos más adelante. Además, en Estados Unidos es una sustancia controlada de la Lista III, lo que significa que un diagnóstico documentado y una revisión del programa estatal de monitoreo de recetas no son trámites burocráticos; son el mínimo legal para recetarla con responsabilidad. Un programa que se salta los análisis o el seguimiento no ofrece un atajo: se salta la parte de la evidencia que hace seguro el tratamiento.",
        ],
      },
    ],
    seo: {
      title: "Terapia de testosterona (TRT) para hombres: lo que respalda la investigación",
      description: "Lo que encontró el estudio TRAVERSE de 2023 sobre la testosterona y el riesgo cardíaco, lo que la terapia hace de forma confiable y por qué primero va el diagnóstico, no solo los síntomas. En español.",
    },
  },
  {
    en: "hormone-therapy-for-women-the-new-evidence",
    slug: "terapia-hormonal-para-la-menopausia-la-evidencia-desde-2002",
    title: "Terapia hormonal para mujeres: la evidencia desde el susto de 2002",
    excerpt:
      "Un estudio de 2002 cambió la forma en que se trató la menopausia de toda una generación de mujeres. Veinte años de investigación posterior contaron una historia más compleja.",
    date: "2026-11-13",
    image: { src: "/labo/img/misc/testimonials.jpg", alt: "Un grupo diverso de mujeres de pie, muy juntas" },
    body: [
      {
        heading: "Lo que de verdad encontró la Women's Health Initiative",
        paragraphs: [
          "La Women's Health Initiative (WHI), publicada en 2002, fue un gran estudio aleatorizado de terapia hormonal combinada. Su hallazgo principal, un aumento pequeño pero real del riesgo de cáncer de mama y cardiovascular en el grupo de terapia combinada, provocó una caída inmediata y drástica en el uso de la terapia hormonal en todo el mundo. Durante mucho tiempo, \"hormonas\" y \"riesgo\" fueron casi sinónimos en la forma de hablar de la menopausia con las pacientes.",
          "Lo que recibió mucha menos atención entonces: la participante promedio de ese estudio tenía poco más de 60 años y llevaba, en promedio, más de una década desde la menopausia. El riesgo en una mujer de 63 años que empieza la terapia hormonal por primera vez es una pregunta distinta del riesgo en una de 50 que la empieza al inicio de la menopausia, y los titulares originales no hicieron esa distinción.",
        ],
      },
      {
        heading: "La hipótesis del momento de inicio",
        paragraphs: [
          "Los reanálisis posteriores de los datos de la WHI, y estudios más recientes diseñados específicamente para ponerla a prueba, respaldan lo que hoy se conoce como la \"hipótesis del momento de inicio\" (timing hypothesis): la terapia hormonal iniciada dentro de unos 10 años desde la menopausia, o antes de los 60, tiene un perfil de riesgo más favorable, sobre todo en lo cardiovascular, que la terapia iniciada más tarde. Esto se refleja hoy en la postura de The Menopause Society (antes NAMS): para la mayoría de las mujeres sanas dentro de esa ventana, se considera que los beneficios de tratar los síntomas menopáusicos de moderados a graves superan los riesgos.",
        ],
      },
      {
        heading: "En qué ayuda de forma confiable la terapia hormonal",
        paragraphs: [
          "Los bochornos y los sudores nocturnos siguen siendo los síntomas mejor estudiados y los que mejoran de forma más confiable. La resequedad vaginal y los síntomas relacionados responden bien, muchas veces solo con estrógeno local en dosis baja. Los beneficios para la densidad ósea están bien establecidos. Muchas pacientes reportan efectos en el ánimo y la cognición, pero estos se miden de forma menos consistente entre los estudios que los síntomas físicos, un patrón que aparece en buena parte de la investigación hormonal y no solo en esta.",
        ],
        list: [
          "Bien respaldado: bochornos, sudores nocturnos, síntomas vaginales y urogenitales, densidad ósea",
          "Reportado pero medido con menos consistencia: ánimo, calidad del sueño, síntomas cognitivos",
          "El momento importa: empezar dentro de unos 10 años desde la menopausia o antes de los 60 cambia el perfil de riesgo",
          "No es igual para todas: la terapia solo con estrógeno y la combinada tienen perfiles de riesgo distintos según tengas útero o no",
        ],
      },
      {
        heading: "Por qué esto sigue necesitando una evaluación real, no un formulario",
        paragraphs: [
          "Nada de esto hace que la terapia hormonal esté libre de riesgos, y no es adecuada para todas las mujeres: los antecedentes personales de ciertos cánceres, coágulos sanguíneos o enfermedad cardiovascular cambian el cálculo. La versión honesta de esta evidencia es: para la candidata adecuada, iniciada en el momento adecuado y con el tipo de terapia adecuado para su propio historial, es uno de los tratamientos mejor respaldados de la medicina de la menopausia. Llegar a \"la candidata adecuada\" es la parte que de verdad requiere un panel de laboratorio y una conversación real, no una lista de síntomas.",
        ],
      },
    ],
    seo: {
      title: "Terapia hormonal para la menopausia: la evidencia desde 2002",
      description: "Cómo se malinterpretaron durante una generación los hallazgos de la WHI de 2002, qué dice en realidad la hipótesis del momento de inicio y en qué ayuda de forma confiable la terapia hormonal de la menopausia. En español.",
    },
  },
  {
    en: "how-telehealth-hormone-care-works",
    slug: "como-funciona-la-telesalud-hormonal-y-metabolica",
    title: "Cómo funciona de verdad la telesalud hormonal y metabólica",
    excerpt:
      "Sin examen físico y con una videollamada en lugar de una sala de espera: la telesalud cambia el formato de la atención, no el estándar. Esto es lo que significa en la práctica.",
    date: "2026-11-15",
    image: { src: "/labo/img/about/clinic.jpg", alt: "Un grupo pequeño conversando y riendo" },
    body: [
      {
        heading: "Los análisis van antes de la consulta, no después",
        paragraphs: [
          "El ingreso por telesalud para GLP-1, péptidos, testosterona o atención hormonal no empieza con una videollamada: empieza con una orden de laboratorio, enviada a un punto de toma de muestras cerca de ti. Para cuando estás en la llamada con una profesional de salud, ya hay un panel metabólico u hormonal real que revisar, no solo un cuestionario de síntomas. Ese orden importa: un plan basado en tus análisis es algo distinto de una dosis asignada a partir de tus respuestas a un formulario.",
        ],
      },
      {
        heading: "Lo que una consulta por video puede y no puede reemplazar",
        paragraphs: [
          "La telesalud es realmente buena para las partes de la atención hormonal y metabólica que dependen de la conversación y de los datos: revisar análisis, ajustar una dosis, hablar de efectos secundarios, decidir si se continúa un protocolo. No sustituye un examen físico, y una práctica de telesalud responsable lo dirá y te referirá cuando lo que la situación pide es un examen en persona, estudios de imagen o un especialista, en lugar de estirar una videollamada más allá de lo que razonablemente puede evaluar.",
        ],
      },
      {
        heading: "El calendario de consultas no es arbitrario",
        paragraphs: [
          "Las revisiones en las semanas 2, 6 y 12, y después aproximadamente cada ocho semanas, no son un ritmo de cobro: corresponden a los momentos en que suelen aparecer los efectos secundarios, en que normalmente hay que ajustar la dosis y en que toca repetir los análisis para ver si el plan está funcionando. Un programa que cambia ese calendario por un \"resurtido cuando lo pidas\" ha dejado de lado, sin decirlo, el seguimiento que hace más seguro el medicamento.",
        ],
        list: [
          "Semana 2: revisión temprana de efectos secundarios y primer ajuste de dosis si hace falta",
          "Semana 6: revisión de tolerancia y respuesta inicial",
          "Semana 12: primera reevaluación completa frente a los análisis iniciales",
          "Cada 8 semanas después: seguimiento continuo, con análisis repetidos según indicación",
        ],
      },
      {
        heading: "La licencia es un límite real, no una formalidad",
        paragraphs: [
          "Una profesional de salud solo puede tratar legalmente a un paciente que esté físicamente en un estado donde ella tiene licencia; esto es así por muy buena que sea la tecnología. Por eso el registro empieza con una pregunta sencilla sobre dónde vives, y por eso tu atención se asigna a una profesional con licencia en tu estado, en lugar de fingir que la geografía no importa.",
        ],
      },
    ],
    seo: {
      title: "Cómo funciona la telesalud hormonal y metabólica (GLP-1, péptidos, testosterona)",
      description: "Lo que implica en realidad empezar por telesalud un tratamiento con GLP-1, péptidos, testosterona o terapia hormonal: primero los análisis, un calendario real de consultas y los límites de lo que el video puede evaluar. En español.",
    },
  },
  {
    en: "compounded-medications-what-to-know",
    slug: "medicamentos-compuestos-que-son-y-que-no-son",
    title: "Medicamentos compuestos: qué son y qué no son",
    excerpt:
      "La semaglutida, la tirzepatida y los péptidos compuestos son comunes hoy en la telesalud. Esta es la diferencia real entre un medicamento compuesto y la versión de marca.",
    date: "2026-11-17",
    image: { src: "/labo/img/services/wellness-iv-therapy.jpg", alt: "Una mano enguantada sosteniendo una bolsa de suero con rodajas de fruta" },
    body: [
      {
        heading: "Lo que de verdad significa \"compuesto\"",
        paragraphs: [
          "Un medicamento compuesto lo prepara una farmacia con licencia estatal para un paciente en particular, en lugar de fabricarlo en masa una compañía farmacéutica. La preparación de compuestos es una parte legítima y muy antigua de la medicina: es como se obtiene la versión líquida de una pastilla que un niño no puede tragar, o una crema con una dosis a la medida. La práctica no es nueva ni sospechosa en sí misma. Lo nuevo es cuánto ha crecido en torno a los medicamentos GLP-1, impulsada por la escasez de los productos de marca.",
        ],
      },
      {
        heading: "La diferencia real: la aprobación de la FDA",
        paragraphs: [
          "La semaglutida y la tirzepatida de marca (Wegovy, Ozempic, Zepbound, Mounjaro) pasaron por el proceso completo de aprobación de la FDA: estudios grandes, revisión de la fabricación y vigilancia continua de la seguridad. Las versiones compuestas del mismo principio activo no han pasado por ese mismo proceso, aunque la química pretenda ser idéntica. Eso no significa automáticamente que una versión compuesta sea insegura, pero sí que una capa de verificación independiente que existe para el medicamento de marca simplemente no existe para el compuesto.",
        ],
        list: [
          "De marca: aprobado por la FDA, fabricado bajo supervisión de la FDA, con dosis consistente verificada en estudios",
          "Compuesto: preparado por una farmacia con licencia, sin aprobación individual de la FDA; la calidad depende de esa farmacia en particular",
          "Ambos pueden ser legítimos, pero no son afirmaciones intercambiables sobre seguridad o consistencia",
        ],
      },
      {
        heading: "Por qué la farmacia importa más de lo que se cree",
        paragraphs: [
          "No todas las farmacias de compuestos trabajan con el mismo estándar. Las de buena reputación tienen licencia, pasan inspecciones y preparan con principios activos de grado farmacéutico y pruebas documentadas. Las menos serias han sido el origen de incidentes reales de seguridad (errores de dosis, contaminación, concentraciones mal etiquetadas) que llegan a las noticias precisamente porque la calidad de los compuestos no es uniforme. Si te recetan un medicamento compuesto en cualquier lugar, es razonable preguntar qué farmacia lo prepara y de dónde obtiene sus ingredientes.",
        ],
      },
      {
        heading: "Cuál es la postura de esta práctica",
        paragraphs: [
          "Te diremos con claridad, en cada receta, si es el producto de marca o un preparado compuesto, qué farmacia lo prepara si es compuesto, y por qué: ya sea por costo, por disponibilidad o por una necesidad específica de dosis. Si el medicamento de marca está disponible y es adecuado para tu caso, iremos primero por esa opción. La meta no es elegir por defecto lo que sea más fácil de surtir, sino asegurarnos de que sepas de verdad qué estás tomando.",
        ],
      },
    ],
    seo: {
      title: "Semaglutida y tirzepatida compuestas: qué son los medicamentos compuestos y qué no",
      description: "La diferencia real entre los medicamentos GLP-1 compuestos y los aprobados por la FDA, por qué la calidad de la farmacia varía y qué preguntar antes de empezar con cualquiera de los dos. En español.",
    },
  },
];
