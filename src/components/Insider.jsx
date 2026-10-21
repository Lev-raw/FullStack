  import { useState } from "react";
  function Insider() {
    const [submitted, setSubmitted] = useState(false);
    return (
      <section className="insider" id="insider">
        <form
          className="insider-card"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <h2>INTABCAPA INSIDER</h2>
          <p className="insider-lead">
            Sign up to know what&apos;s on stage &amp; beyond
          </p>
          <label className="insider-email-label" htmlFor="insider-email">
            Enter Your Email address
          </label>
          <input
            className="insider-email"
            id="insider-email"
            name="email"
            type="email"
            required
          /> 
          <div className="insider-consent-row">
            <input id="insider-consent" type="checkbox" required />
            <label htmlFor="insider-consent">
            * I have read, understood, and accept the INT Aditya Birla Centre for Performing Arts Privacy Policy and consent to the sharing of my personal data with INT Aditya Birla Centre for Performing Arts Privacy for the purpose of receiving promotions, other relevant information and personalized services.
            </label>
          </div>
          <button className="insider-submit" type="submit">
            {submitted ? "SUBMITTED" : "SUBMIT"}
          </button>
        </form>
      </section>
    );
  }
  export default Insider;
