export const hooks = [
  "Your partner's loyalty is written in the stars.",
  "The universe conspires to bring you closer to your true love.",
  "Your emotional depth is your superpower in relationships.",
  "Communication flows effortlessly when you speak from the heart.",
  "Trust is the foundation of your lasting connections.",
  "Your intuition guides you to soul-aligned partnerships.",
  "Passion and stability dance together in your love life.",
  "You attract partners who mirror your highest self.",
  "Forgiveness and understanding strengthen your bonds.",
  "Your love story is written in the constellations.",
  "Today's alignment favors deep emotional connections.",
  "Your chart reveals hidden strengths in partnership dynamics.",
  "The cosmos supports your commitment to authentic relationships.",
  "Your vulnerability invites profound intimacy with the right person.",
  "Shared values create unshakeable bonds under this transit.",
  "Your chart shows natural affinity for long-term commitment.",
  "Emotional security is highlighted in your current planetary alignment.",
  "You're magnetically drawn to relationships that encourage growth.",
  "The stars indicate a period of relational harmony and understanding.",
  "Your communication style creates instant rapport with compatible souls."
];

export function getRandomHook() {
  const index = Math.floor(Math.random() * hooks.length);
  return hooks[index];
}