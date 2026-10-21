import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import "./AuthPage.css";

const googleProvider = new GoogleAuthProvider();

const authErrorMessages = {
  "auth/email-already-in-use": "An account already exists with this email address.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/invalid-login-credentials": "The email or password is incorrect.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Choose a stronger password with at least 8 characters.",
  "auth/popup-blocked": "Your browser blocked the Google sign-in window. Allow popups and try again.",
  "auth/popup-closed-by-user": "Google sign-in was canceled.",
};

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeAuthentication = async (action) => {
    setIsSubmitting(true);
    setNotice("");

    try {
      await setPersistence(auth, browserLocalPersistence);
      await action();
      navigate(location.state?.from?.pathname ?? "/");
    } catch (error) {
      console.error("Firebase authentication failed:", error);
      setNotice(
        error instanceof FirebaseError
          ? authErrorMessages[error.code] ?? "We couldn't authenticate your account. Please try again."
          : "We couldn't authenticate your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (
      isSignup &&
      formData.get("password") !== formData.get("confirmPassword")
    ) {
      setNotice("Your passwords don't match. Please try again.");
      return;
    }

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setNotice("Enter your email address and password, then try again.");
      return;
    }

    await completeAuthentication(async () => {
      if (isSignup) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const firstName = String(formData.get("firstName") ?? "").trim();
        const lastName = String(formData.get("lastName") ?? "").trim();
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`.trim(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    });
  };

  const handleGoogleSignIn = () => {
    completeAuthentication(() => signInWithPopup(auth, googleProvider));
  };

  return (
    <div className="auth-layout">
      <Navbar />
      <main className={`auth-page ${isSignup ? "auth-page-signup" : "auth-page-login"}`}>
        <section className="auth-panel" aria-labelledby="auth-heading">
          <h1 id="auth-heading">{isSignup ? "Create Your Account" : "Login Account"}</h1>
          {isSignup ? (
            <p className="auth-intro">
              Signing up for INT ABCPA is fast and free-no commitments or long-term contracts.
            </p>
          ) : (
            <p className="auth-intro">
              New to INT ABCPA? <Link to="/signup">Sign up</Link>
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup ? (
              <div className="auth-fields">
                <label>
                  First Name
                  <input name="firstName" type="text" autoComplete="given-name" placeholder="Enter" required />
                </label>
                <label>
                  Last Name
                  <input name="lastName" type="text" autoComplete="family-name" placeholder="Enter" required />
                </label>
                <label>
                  Email Address
                  <input name="email" type="email" autoComplete="email" placeholder="Enter Email" required />
                </label>
                <label>
                  Phone Number
                  <input name="phone" type="tel" autoComplete="tel" placeholder="91 +" required />
                </label>
                <label>
                  Password
                  <input name="password" type="password" autoComplete="new-password" placeholder="* * * * * * *" minLength={8} required />
                </label>
                <label>
                  Confirm Password
                  <input name="confirmPassword" type="password" autoComplete="new-password" placeholder="* * * * * * *" minLength={8} required />
                </label>
              </div>
            ) : (
              <>
              <label className="auth-login-field">
                Enter Email Address
                <input name="email" type="email" autoComplete="email" placeholder="Enter Email" required />
              </label>
              <label className="auth-login-field">
                Password
                <input name="password" type="password" autoComplete="current-password" placeholder="Enter Password" required />
              </label>
              </>
            )}

            {isSignup && (
              <label className="auth-consent">
                <input name="consent" type="checkbox" required />
                <span>
                  I agree to INTABCPA&apos;s <span className="auth-accent">Terms, Privacy Policy, and E-Sign Consent.</span>
                </span>
              </label>
            )}

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "PLEASE WAIT..." : isSignup ? "CREATE ACCOUNT" : "LOGIN ACCOUNT"}
            </button>
          </form>

          <div className="auth-divider" aria-hidden="true"><span>OR</span></div>
          <button className="auth-google" type="button" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <span className="auth-google-mark" aria-hidden="true">G</span>
            {isSubmitting ? "PLEASE WAIT..." : isSignup ? "Sign up with Google" : "Login with Google"}
          </button>
          {notice && <p className="auth-notice" role="alert">{notice}</p>}
          {isSignup && (
            <p className="auth-account-switch">
              Already have an INTABCPA account? <Link to="/login">Login</Link>.
            </p>
          )}
          <p className="auth-recaptcha">
            This site is protected by reCAPTCHA Enterprise and the <span>Google Privacy Policy</span> and <span>Terms of Service</span> apply.
          </p>
        </section>
        <img
          className="auth-image"
          src={isSignup ? "/images/auth-mask.png" : "/images/auth-double-bass.png"}
          alt={isSignup ? "Performer holding a white and black theatrical mask" : "Double bass player performing in a theatre"}
        />
      </main>
      <Footer />
    </div>
  );
}

export default AuthPage;
