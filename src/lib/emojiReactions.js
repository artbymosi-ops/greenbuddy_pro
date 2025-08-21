// src/lib/emojiReactions.js
// Základná sada reakcií + malá utilita na preklopenie stavu

export const REACTIONS = [
  { id: "like",    emoji: "👍", label: "Like" },
  { id: "love",    emoji: "❤️", label: "Love" },
  { id: "care",    emoji: "🤗", label: "Care" },
  { id: "wow",     emoji: "😮", label: "Wow" },
  { id: "laugh",   emoji: "😂", label: "Laugh" },
  { id: "sad",     emoji: "😢", label: "Sad" },
  { id: "angry",   emoji: "😡", label: "Angry" },
];

// Pomocná funkcia – lokálne prekliknutie reakcie používateľa
export function toggleReaction(state, reactionId, userId) {
  const next = { ...state };
  next[reactionId] = new Set(next[reactionId] ?? []);
  if (next[reactionId].has(userId)) next[reactionId].delete(userId);
  else next[reactionId].add(userId);
  return next;
}
