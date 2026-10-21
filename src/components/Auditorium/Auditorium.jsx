import auditoriumLayout, { AUDITORIUM_VIEWBOX } from '../../data/auditoriumLayout';
import Seat from './Seat';
import './Auditorium.css';

const BACKGROUND_URL = '/auditorium/auditorium-background.png';

function Auditorium({ selectedSeats, bookedSeats, unavailableSeats, onToggleSeat }) {
  return (
    <div className="auditorium-scroll">
      <svg
        className="auditorium-map"
        viewBox={AUDITORIUM_VIEWBOX}
        role="img"
        aria-label="Mini auditorium seating plan"
        xmlns="http://www.w3.org/2000/svg"
      >
        <image
          href={BACKGROUND_URL}
          x="0"
          y="0"
          width="595"
          height="842"
          preserveAspectRatio="none"
          pointerEvents="none"
        />
        {auditoriumLayout.map(({ row, seats }) => seats.map((seat) => {
          const selected = selectedSeats.includes(seat.id);
          const status = bookedSeats.includes(seat.id)
            ? 'booked'
            : unavailableSeats.includes(seat.id)
              ? 'unavailable'
              : 'available';

          return (
            <Seat
              key={seat.id}
              {...seat}
              row={row}
              status={status}
              selected={selected}
              onClick={onToggleSeat}
            />
          );
        }))}
      </svg>
    </div>
  );
}

export default Auditorium;
