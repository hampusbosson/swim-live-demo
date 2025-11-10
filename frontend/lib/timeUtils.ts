export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
};
