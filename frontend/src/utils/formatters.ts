export const formatSalary = (value: number) => {
  if (value >= 1000000) {
    return `${value / 1000000} triệu`;
  }
  return value.toLocaleString('vi-VN');
};
