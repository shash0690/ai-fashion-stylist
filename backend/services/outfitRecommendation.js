import outfits from "../data/outfits.json" assert { type: "json" };

/**
 * Match outfits by colorTone + style. Fallbacks to partial matches.
 */
export function getRecommendations(analysis) {
  const tone = (analysis.colorTone || "").toLowerCase();
  const style = (analysis.detectedStyle || "").toLowerCase();

  const exact = outfits.find(
    o => o.colorTone.toLowerCase() === tone && o.style.toLowerCase() === style
  );
  if (exact) return exact.outfits;

  const toneMatch = outfits.find(o => o.colorTone.toLowerCase() === tone);
  if (toneMatch) return toneMatch.outfits;

  return outfits.flatMap(o => o.outfits).slice(0, 4);
}