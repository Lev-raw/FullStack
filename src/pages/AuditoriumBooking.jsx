import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Auditorium from "../components/Auditorium/Auditorium";
import BookingSummary from "../components/Auditorium/BookingSummary";
import Footer from "../components/Footer";
import "./AuditoriumBooking.css";

const bookedSeats = ["A-3", "A-4", "B-7", "C-2"];
const unavailableSeats = [];
const SESSION_DURATION_SECONDS = 1 * 180;
const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;
const showTitles = {
  "romeo-juliet": "Romeo & Juliet",
  "zen-katha": "Zen Katha",
  
};

function AuditoriumBooking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [continueNotice, setContinueNotice] = useState("");
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(
    SESSION_DURATION_SECONDS,
  );
  const hasSessionStarted = useRef(false);
  const hasSessionExpired = useRef(false);
  const showTitle =
    showTitles[showId] ||
    showId
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const toggleSeat = useCallback((row, seatNumber) => {
    const seatId = `${row}-${seatNumber}`;
    if (bookedSeats.includes(seatId) || unavailableSeats.includes(seatId))
      return;

    setContinueNotice("");
    setSelectedSeats((currentSeats) =>
      currentSeats.includes(seatId)
        ? currentSeats.filter((seat) => seat !== seatId)
        : [...currentSeats, seatId],
    );
  }, []);

  useEffect(() => {
    if (sessionStartedAt === null) return undefined;

    const updateRemainingTime = () => {
      const deadline = sessionStartedAt + SESSION_DURATION_MS;
      setSecondsRemaining(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
      );
    };

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(intervalId);
  }, [sessionStartedAt]);

  useEffect(() => {
    if (secondsRemaining !== 0 || hasSessionExpired.current) return;

    hasSessionExpired.current = true;
    window.alert("Session expired");
    navigate("/");
  }, [navigate, secondsRemaining]);

  const startSession = () => {
    if (hasSessionStarted.current) return;

    hasSessionStarted.current = true;
    setSessionStartedAt(Date.now());
  };

  const continueToCheckout = () => {
    if (selectedSeats.length === 0) {
      setContinueNotice("Choose at least one seat to continue.");
      return;
    }

    navigate("/checkout", { state: { showId, selectedSeats } });
  };

  return (
    <div className="booking-layout" onClick={startSession}>
      <Navbar />

      <main className="booking-page">
        <header className="booking-page-header">
          <div>
            <p className="booking-play-name">Booking for {showTitle}</p>
            <h1 className="booking-show-title">Seat Selection</h1>
            <p className="booking-show-venue">INTABCPA Mini Auditorium</p>
            <p className="booking-page-subtitle">
              Saturday · 21 March 2026 · 7:30 PM
            </p>
          </div>
          <div className="booking-header-actions">
            <div className="booking-capacity">
              <strong>{`${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`}</strong>
              <span>Session Remaining</span>
            </div>
            <button
              className="booking-back"
              type="button"
              onClick={() => navigate("/showtime")}
            >
              <span aria-hidden="true">←</span>
              Back to Shows
            </button>
          </div>
        </header>

        <div className="booking-content">
          <section className="auditorium-panel" aria-label="Choose seats">
            <Auditorium
              selectedSeats={selectedSeats}
              bookedSeats={bookedSeats}
              unavailableSeats={unavailableSeats}
              onToggleSeat={toggleSeat}
            />
          </section>
          <BookingSummary
            selectedSeats={selectedSeats}
            continueNotice={continueNotice}
            onContinue={continueToCheckout}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AuditoriumBooking;
