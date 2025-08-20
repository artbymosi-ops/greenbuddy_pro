// src/lib/plantTypes.js
export const TASK_TYPES = {
  water:  { label: "Gießen",   icon: "💧", color: "#5bbf7a" },
  feed:   { label: "Düngen",   icon: "🧪", color: "#5c9bd6" },
  spray:  { label: "Sprühen",  icon: "💨", color: "#8a7dd6" },
  repot:  { label: "Umtopfen", icon: "🪴", color: "#d69f5c" },
};
export const TYPE_KEYS = Object.keys(TASK_TYPES);
