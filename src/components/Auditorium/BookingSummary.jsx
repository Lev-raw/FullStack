import SeatLegend from './SeatLegend';
import { getSeatCategory, SEAT_CATEGORIES } from '../../data/auditoriumLayout';

function BookingSummary({ selectedSeats, onContinue, continueNotice }) {
  const selectedByCategory = SEAT_CATEGORIES.map((category) => ({
    ...category,
    seats: selectedSeats.filter((seat) => getSeatCategory(seat)?.name === category.name),
  }));
  const total = selectedByCategory.reduce(
    (sum, category) => sum + category.seats.length * category.price,
    0,
  );

  return (
    <section className="booking-summary" aria-labelledby="booking-summary-title">
      <div className="booking-summary-section">
        <h2 className="booking-summary-label">Seat Availability</h2>
        <SeatLegend />
      </div>
      <div className="booking-summary-section">
        <h2 className="booking-summary-label">Seat Category</h2>
        {SEAT_CATEGORIES.map((category) => (
          <div className="booking-summary-row" key={category.name}>
            <span>{category.name} (Rows {category.rows[0]}-{category.rows.at(-1)})</span>
            <strong>₹{category.price.toLocaleString('en-IN')}</strong>
          </div>
        ))}
      </div>
      <div className="booking-summary-section">
        <h2 className="booking-summary-label">Number of Seats</h2>
        <div className="booking-summary-row">
          <span>Selected</span>
          <strong>{selectedSeats.length}</strong>
        </div>
      </div>
      <div className="booking-summary-section booking-selected-section">
        <h2 className="booking-summary-label">Selected Seats</h2>
        {selectedSeats.length ? (
          <ul className="booking-selected-seats">
            {selectedSeats.map((seat) => <li key={seat}>ROW {seat}</li>)}
          </ul>
        ) : (
          <p className="booking-empty-seats">Choose seats from the plan.</p>
        )}
      </div>
      <section className="booking-summary-details" aria-labelledby="booking-summary-title">
        <h2 className="booking-summary-label" id="booking-summary-title">Summary</h2>
        <dl className="booking-summary-lines">
          {selectedByCategory.map((category) => (
            <div key={category.name}>
              <dt>{category.name}</dt>
              <dd>{category.seats.length} × ₹{category.price.toLocaleString('en-IN')}</dd>
            </div>
          ))}
          <div className="booking-summary-total">
            <dt>Total</dt>
            <dd>₹{total.toLocaleString('en-IN')}</dd>
          </div>
        </dl>
      </section>
      <button
        className="booking-continue"
        type="button"
        disabled={selectedSeats.length === 0}
        onClick={onContinue}
      >
        RESERVE SEATS
      </button>
      {continueNotice ? <p className="booking-notice" role="status">{continueNotice}</p> : null}
    </section>
  );
}

export default BookingSummary;
