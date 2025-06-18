import type { OutbreakData } from "@/types/types";

const middleEastCountries = [
  "Bahrain",
  "Egypt",
  "Iran",
  "Iraq",
  "Israel",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Oman",
  "Palestine",
  "Qatar",
  "Saudi Arabia",
  "Syria",
  "United Arab Emirates",
  "Yemen",
  "UAE",
];

function containsMiddleEastPlace(text: string): boolean {
  if (!text) return false;

  const plainText = text.replace(/<[^>]*>/g, "").toLowerCase();

  return middleEastCountries.some((country) =>
    plainText.includes(country.toLowerCase())
  );
}

export async function fetchMiddleEastOutbreaks(): Promise<OutbreakData[]> {
  try {
    const response = await fetch(
      "https://www.who.int/api/news/diseaseoutbreaknews"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const filtered =
      data?.value?.filter((item: OutbreakData) => {
        const title = item.Title || "";
        const overview = item.Overview || "";
        return (
          containsMiddleEastPlace(title) || containsMiddleEastPlace(overview)
        );
      }) || [];

    return filtered.sort(
      (a, b) =>
        new Date(b.PublicationDate).getTime() -
        new Date(a.PublicationDate).getTime()
    );
  } catch (error) {
    console.error("Error fetching outbreak data:", error);
    throw error;
  }
}
