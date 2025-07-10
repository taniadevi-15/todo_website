// utils/dateUtils.js
export const isSameDay = (d1, d2) =>
  d1.toDateString() === d2.toDateString();

export const isSameWeek = (d1, d2) => {
  const getWeek = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  };

  return getWeek(d1) === getWeek(d2) && d1.getFullYear() === d2.getFullYear();
};

export const isSameMonth = (d1, d2) =>
  d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
