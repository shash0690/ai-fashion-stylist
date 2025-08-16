// JSON file ko require() se import karna
const outfits = require("../data/outfits.json");

// Example function jo user features ke basis par outfit suggestions deta hai
function getOutfitSuggestions(userFeatures) {
  // Aapka filter ya logic yahan dalein. Example:
  return outfits.filter(outfit => {
    // Sample condition: yeh aap apne hisab se customize kar sakte hain
    return outfit.category === userFeatures.preferredCategory;
  });
}

// Export function taaki aap isko backend me use kar saken
module.exports = { getOutfitSuggestions };
