export const ambulanceCategories = [
  { id: "BLS", name: "Basic Life Support" },
  { id: "ALS", name: "Advanced Life Support" },
  { id: "ICU", name: "Intensive Care" },
  { id: "PT", name: "Patient Transport" },
  { id: "NEO", name: "Neonatal" },
] as const;

export type AmbulanceCategoryId = (typeof ambulanceCategories)[number]["id"];

export function getAmbulanceCategory(id?: string) {
  return ambulanceCategories.find((category) => category.id === id);
}
