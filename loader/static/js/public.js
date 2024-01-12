function getLevelInf(level) {
  const levelList = [
    {
      value: "S",
      color: "#FF5733",
    },
    {
      value: "A",
      color: "#7948EA",
    },
    {
      value: "B",
      color: "#2A82E4",
    },
    {
      value: "C",
      color: "#43CF7C",
    },
    {
      value: "D",
      color: "#808080",
    },
  ];
  return levelList.find((x) => x.value === level) || false;
}

export { getLevelInf };
