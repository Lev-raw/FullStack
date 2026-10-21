import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { saveBooking } from "../data/accountStorage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSeatCategory } from "../data/auditoriumLayout";
import "./CheckoutPage.css";

const showTitles = {
  "romeo-juliet": "Romeo & Juliet",
  "zen-katha": "Zen Katha",
};

function CheckoutPage() {
  const { state } = useLocation();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [paymentNotice, setPaymentNotice] = useState("");

  if (!state?.showId || !Array.isArray(state.selectedSeats) || state.selectedSeats.length === 0) {
    return <Navigate to="/showtime" replace />;
  }

  const { showId, selectedSeats } = state;
  const showTitle =
    showTitles[showId] ||
    showId
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  const total = selectedSeats.reduce(
    (sum, seat) => sum + (getSeatCategory(seat)?.price ?? 0),
    0,
  );

  const completePayment = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = auth.currentUser?.email || String(formData.get("email") ?? "").trim();
    const categoryNames = [...new Set(selectedSeats.map((seat) => getSeatCategory(seat)?.name).filter(Boolean))];

    try {
      saveBooking(email, {
        showId,
        showTitle,
        poster: showId === "romeo-juliet" ? "/images/juliet.png" : showId === "zen-katha" ? "/images/Zen.png" : "",
        date: "Saturday · 21 March 2026 · 7:30 PM",
        venue: "INTABCPA Mini Auditorium",
        seats: selectedSeats,
        category: categoryNames.join(", "),
        total,
      });
      setConfirmationEmail(email);
      setPaymentNotice("");
      setPaymentComplete(true);
    } catch (error) {
      console.error("Unable to save booking.", error);
      setPaymentNotice("Your booking could not be saved. Please try again.");
    }
  };

  return (
    <div className="checkout-layout">
      <Navbar />
      <main className={`checkout-page${paymentComplete ? " checkout-page--success" : ""}`}>
        {!paymentComplete && (
          <>
            <p className="checkout-breadcrumb">HOME&nbsp; › &nbsp;MY ACCOUNT&nbsp; › &nbsp;CHECKOUT</p>
            <h1>Summary / Checkout</h1>
          </>
        )}
        {paymentComplete ? (
          <section className="checkout-thank-you" role="status">
            <svg
              className="checkout-thank-you-icon"
              width="97"
              height="82"
              viewBox="0 0 97 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M30.8012 75.7815L30.4268 76.1558C25.7455 80.8372 18.404 81.0886 14.0308 76.7155L4.62275 67.3074C0.334676 63.0194 0.480258 55.8537 4.95173 51.1477C6.0748 49.8053 6.79893 48.1888 7.03337 46.5004L13.4257 28.0247C13.5241 27.7429 13.5846 27.4499 13.6205 27.1531C13.9022 24.8029 15.9309 22.8952 18.3264 22.8139C19.5913 22.7704 20.72 23.245 21.5198 24.0448C21.5481 24.0731 21.5765 24.1015 21.6049 24.1317C22.6315 25.2208 22.9151 26.8184 22.3744 28.2137L19.6688 35.2093C19.6839 35.8351 20.4345 36.0903 20.8921 35.629C20.8977 35.6233 20.9034 35.6176 20.9091 35.612L39.3943 17.1267C41.2359 15.2852 44.14 15.1283 45.8813 16.828C46.7699 17.6958 47.1877 18.8681 47.148 20.0573C47.1083 21.2295 46.6205 22.4169 45.696 23.3414L29.0561 39.9813" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M51.6572 29.9002C53.5063 28.0511 56.4085 27.9509 58.1366 29.679C59.0006 30.543 59.4071 31.7002 59.3674 32.8724C59.3277 34.0446 58.8399 35.232 57.9153 36.1584L39.2656 54.8081" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M52.6686 41.4013C54.5195 39.5522 57.418 39.452 59.146 41.18C60.0101 42.0441 60.4185 43.2012 60.3769 44.3734C60.3372 45.5456 59.8494 46.733 58.9248 47.6594L30.8047 75.7815" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M41.7991 27.2381L47.9703 21.0669C49.8194 19.2178 52.7216 19.1176 54.4497 20.8457C55.3137 21.7098 55.7202 22.8669 55.6805 24.0391C55.6408 25.2113 55.153 26.3987 54.2284 27.3232L35.2422 46.3095" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M54.2422 20.6529L57.7683 17.1267C59.6098 15.2852 62.5139 15.1264 64.2534 16.828C65.142 17.6958 65.5617 18.8681 65.5201 20.0573C65.4804 21.2295 64.9926 22.4169 64.0681 23.3414L57.9309 29.4786" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M31.1328 75.4468L32.4015 76.7155C36.7746 81.0886 44.1161 80.839 48.7975 76.1558L49.1737 75.7815" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M70.0263 29.9002C71.8772 28.0511 74.7776 27.9509 76.5056 29.679C77.3697 30.543 77.7762 31.7001 77.7365 32.8723C77.6968 34.0446 77.209 35.2319 76.2845 36.1584L57.6328 54.8081" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M71.0377 41.4012C72.8868 39.5521 75.7871 39.4519 77.5152 41.18C78.3792 42.0441 78.7876 43.2012 78.746 44.3734C78.7063 45.5456 78.2185 46.733 77.2939 47.6594L49.1719 75.7815" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M63.0689 24.3416L66.3417 21.0688C68.1908 19.2197 71.093 19.1195 72.8211 20.8476C73.6851 21.7116 74.0916 22.8687 74.0519 24.041C74.0122 25.2132 73.5244 26.4005 72.5999 27.3251L58.9453 40.9796" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M81.2188 53.9762L88.1878 59.0924" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M85.8047 44.1484L94.2012 46.2074" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M86.2891 33.311L94.835 32.0008" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82.5781 23.1164L89.9707 18.6336" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M75.2578 15.115L80.3721 8.14407" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M65.4297 10.5245L67.4887 2.12793" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M54.5915 10.0461L53.2812 1.50021" stroke="#A4895D" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2>A Big Thank You!</h2>
            <p>We&apos;ve sent a seat confirmation/tickets on email to</p>
            <p className="checkout-confirmation-email">{confirmationEmail}</p>
            <Link className="checkout-home-button" to="/">
              BACK TO HOME
            </Link>
          </section>
        ) : (
          <div className="checkout-columns">
            <section className="checkout-form-column">
              <section className="checkout-card checkout-event">
                <h2>Event Summary</h2>
                <p><strong>{showTitle}</strong></p>
                <p>Saturday · 21 March 2026 · 7:30 PM</p>
                <p>INTABCPA Mini Auditorium</p>
              </section>

              <section className="checkout-card">
                <h2>Selected Seats <span>{selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"}</span></h2>
                <ul className="checkout-seat-list">
                  {selectedSeats.map((seat) => (
                    <li key={seat}>
                      <span>Row {seat} · {getSeatCategory(seat)?.name}</span>
                      <strong>₹{(getSeatCategory(seat)?.price ?? 0).toLocaleString("en-IN")}</strong>
                    </li>
                  ))}
                </ul>
              </section>

              <form className="checkout-card checkout-payment" onSubmit={completePayment}>
                <h2>Contact Information</h2>
                <div className="checkout-fields checkout-contact-fields">
                  <label>
                    Full Name
                    <input name="name" autoComplete="name" required />
                  </label>
                  <label>
                    Email Address
                    <input name="email" type="email" autoComplete="email" defaultValue={auth.currentUser?.email ?? ""} required />
                  </label>
                  <label>
                    Contact Number
                    <input name="phone" type="tel" autoComplete="tel" required />
                  </label>
                </div>

                <h2 className="checkout-payment-heading">Payment Details <span>DEMO PAYMENT</span></h2>
                <p className="checkout-demo-note">
                  Demo checkout only. Enter any numeric card number; no charge will be made.
                </p>
                <div className="checkout-fields">
                  <label className="checkout-full-field">
                    Card Number
                    <input
                      name="cardNumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      pattern="[0-9]+([ ]+[0-9]+)*"
                      maxLength={23}
                      placeholder="Any demo card number"
                      required
                    />
                  </label>
                  <label className="checkout-full-field">
                    Cardholder Name
                    <input name="cardholder" autoComplete="cc-name" required />
                  </label>
                  <label>
                    Expiry Date
                    <input
                      name="expiry"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                      required
                    />
                  </label>
                  <label>
                    CVV
                    <input
                      name="cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      pattern="[0-9]{3,4}"
                      maxLength={4}
                      required
                    />
                  </label>
                </div>
                <button className="checkout-pay-button" type="submit">
                  PAY ₹{total.toLocaleString("en-IN")}
                </button>
                {paymentNotice && <p className="checkout-error" role="alert">{paymentNotice}</p>}
              </form>
            </section>

            <aside className="checkout-order-summary">
              <h2>Booking Summary</h2>
              <div className="checkout-order-details">
                <p>{showTitle}</p>
                <p>Sat, March 21, 2026 · 7:30 PM</p>
                <div className="checkout-order-line">
                  <span>{selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"}</span>
                  <strong>{selectedSeats.map((seat) => seat).join(", ")}</strong>
                </div>
                <div className="checkout-order-total">
                  <span>Total Due</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>
                <p className="checkout-terms">
                  This is a demo payment. Submitting this form will not charge a card.
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
