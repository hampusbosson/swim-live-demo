export const getRowColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-300/50 border-l-4 border-yellow-500"; // Gold
    case 2:
      return "bg-gray-300/50 border-l-4 border-gray-500"; // Silver
    case 3:
      return "bg-amber-600/30 border-l-4 border-amber-700"; // Bronze
    default:
      return "";
  }
};
