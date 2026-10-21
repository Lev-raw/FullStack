const legendItems = [
  ['available', 'Available'],
  ['selected', 'Selected'],
  ['booked', 'Booked'],
  ['unavailable', 'Unavailable'],
];

function SeatLegend() {
  return (
    <ul className="seat-legend" aria-label="Seat availability">
      {legendItems.map(([status, label]) => (
        <li key={status}>
          <span className={`seat-legend-swatch seat-legend-swatch--${status}`} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

export default SeatLegend;
