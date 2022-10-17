import runes from '../jsons/runesReforged.json';

export const getPerkIndex = (n) => {
  if (String(n).substring(0, 2) == 99) return 1;
  if (String(n).substring(0, 2) == 91) return 0;
  return String(n).charAt(1);
};

export const getRuneObj = (primaryPerkIndex, perkId, slotIndex) => {
  console.log();
  return runes[primaryPerkIndex]?.slots[slotIndex].runes.find(
    (rune) => rune.id == perkId
  );
};

export const getRuneUrl = (rune) => {
  const baseUrl =
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/';
  return baseUrl + rune.icon.toLowerCase();
};
