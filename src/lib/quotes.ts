export const QUOTES: string[] = [
  'Todo lo que hay en tu vida ahora mismo que no te gusta y tú no estás haciendo por cambiarlo, lo estás aceptando.',
  'La disciplina es elegir entre lo que quieres ahora y lo que quieres de verdad.',
  'Nadie viene a salvarte. Levántate y hazlo tú.',
  'Cada vez que rompes una promesa contigo mismo, te crees un poco menos.',
  'El cuerpo obedece a la mente. Entrena la mente primero.',
  'La motivación te trae aquí. La disciplina es la que se queda.',
  'No es falta de tiempo, es falta de prioridad.',
  'Como comes, entrenas y descansas hoy es el voto que emites por quién serás mañana.',
  'La comida real no necesita etiqueta que la explique.',
  'Incomodidad hoy, elegido por ti, es mejor que incomodidad mañana, impuesta por la vida.',
  'No busques motivación. Construye el hábito y la motivación sobra.',
  'Lo que no mides, no lo mejoras. Lo que no marcas hoy, no lo repites mañana.',
  'El agua fría no te mata, te despierta. Lo mismo que la disciplina.',
  'Si esperas sentirte listo, nunca vas a empezar.',
  'Tu cuerpo es el resultado de miles de decisiones pequeñas, no de una grande.',
  'La primera victoria del día se gana en la primera hora del día.',
  'Come comida, no productos. Tu cuerpo sabe la diferencia aunque tú lo olvides.',
  'La racha no se rompe por un mal día, se rompe por rendirte después de un mal día.',
  'Nadie te va a aplaudir por levantarte temprano. Hazlo igual.',
  'El descanso también es disciplina, no premio por haber sido disciplinado.',
  'Lo difícil de hoy es lo fácil de dentro de un mes, si no dejas de hacerlo.',
  'No necesitas más información. Necesitas hacer lo que ya sabes que tienes que hacer.',
  'Cuida lo que entra por tu boca igual que cuidas lo que entra por tus ojos.',
  'La versión de ti que quieres ser ya sabe lo que toca hacer hoy.',
];

export function getRandomQuote(excludeIndex?: number): { quote: string; index: number } {
  let index = Math.floor(Math.random() * QUOTES.length);
  if (QUOTES.length > 1 && index === excludeIndex) {
    index = (index + 1) % QUOTES.length;
  }
  return { quote: QUOTES[index], index };
}
