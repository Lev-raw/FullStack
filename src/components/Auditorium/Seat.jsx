import { memo } from 'react';

function Seat({ id, row, number, x, y, width, height, status, selected, onClick }) {
  const disabled = status === 'booked' || status === 'unavailable';
  const classNames = [
    'auditorium-seat',
    `auditorium-seat--${status}`,
    selected ? 'auditorium-seat--selected' : '',
  ].filter(Boolean).join(' ');

  const handleKeyDown = (event) => {
    if (disabled || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onClick(row, number);
  };

  return (
    <g
      className={classNames}
      role="button"
      aria-label={`${id}, ${selected ? 'selected' : status}`}
      aria-pressed={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : () => onClick(row, number)}
      onKeyDown={handleKeyDown}
    >
      <title>{`${row}-${number}: ${selected ? 'selected' : status}`}</title>
      <rect
        className="auditorium-seat-hit-area"
        x={x}
        y={y}
        width={width}
        height={height}
        rx="1"
      />
    </g>
  );
}

export default memo(Seat);
