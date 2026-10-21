export const AUDITORIUM_VIEWBOX = '0 0 595 842';
export const SEAT_CATEGORIES = [
  { name: 'Premium Seats', rows: ['A', 'B', 'C'], price: 3500 },
  { name: 'Standard Seats', rows: ['D', 'E', 'F', 'G', 'H', 'I', 'J'], price: 2200 },
  { name: 'Balcony Seats', rows: ['K', 'L'], price: 1300 },
];

export const getSeatCategory = (seatId) => {
  const row = seatId.split('-')[0];
  return SEAT_CATEGORIES.find((category) => category.rows.includes(row));
};

const seatLefts = [252.203, 272, 291.805, 311.602, 331.406, 351.203, 371, 390.805, 410.602];
const rowPositions = [
  { row: 'A', y: 299.9, height: 20 },
  { row: 'B', y: 335.9, height: 20 },
  { row: 'C', y: 371.9, height: 20 },
  { row: 'D', y: 407.9, height: 20 },
  { row: 'E', y: 443.9, height: 20 },
  { row: 'F', y: 479.9, height: 20 },
  { row: 'G', y: 515.9, height: 20 },
  { row: 'H', y: 552, height: 19.9 },
  { row: 'I', y: 588, height: 19.9 },
  { row: 'J', y: 624, height: 20 },
  { row: 'K', y: 660, height: 20 },
  { row: 'L', y: 696, height: 20 },
];

const auditoriumLayout = rowPositions.map(({ row, y, height }) => ({
  row,
  seats: seatLefts.map((x, index) => {
    const number = 9 - index;
    return {
      id: `${row}-${number}`,
      number,
      x,
      y,
      width: 19.8,
      height,
    };
  }),
}));

export default auditoriumLayout;
