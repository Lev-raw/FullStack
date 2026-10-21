import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { readAccountData, readBookings, writeAccountData } from "../data/accountStorage";
import "./AccountPage.css";

const sections = [
  { id: "profile", label: "My Profile", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 6C6.175 6 5.46875 5.70625 4.88125 5.11875C4.29375 4.53125 4 3.825 4 3C4 2.175 4.29375 1.46875 4.88125 0.88125C5.46875 0.29375 6.175 0 7 0C7.825 0 8.53125 0.29375 9.11875 0.88125C9.70625 1.46875 10 2.175 10 3C10 3.825 9.70625 4.53125 9.11875 5.11875C8.53125 5.70625 7.825 6 7 6ZM0 13.231V11.5848C0 11.1719 0.120167 10.7857 0.3605 10.426C0.601 10.0665 0.924417 9.78733 1.33075 9.5885C2.27442 9.136 3.21867 8.79658 4.1635 8.57025C5.10833 8.34408 6.05383 8.231 7 8.231C7.94617 8.231 8.89167 8.34408 9.8365 8.57025C10.7813 8.79658 11.7256 9.136 12.6693 9.5885C13.0756 9.78733 13.399 10.0665 13.6395 10.426C13.8798 10.7857 14 11.1719 14 11.5848V13.231H0ZM1 12.231H13V11.5848C13 11.3629 12.9285 11.1546 12.7855 10.9598C12.6427 10.7649 12.4449 10.6002 12.1923 10.4655C11.3693 10.0668 10.5207 9.76142 9.6465 9.54925C8.77233 9.33708 7.89017 9.231 7 9.231C6.10983 9.231 5.22767 9.33708 4.3535 9.54925C3.47933 9.76142 2.63075 10.0668 1.80775 10.4655C1.55508 10.6002 1.35733 10.7649 1.2145 10.9598C1.0715 11.1546 1 11.3629 1 11.5848V12.231ZM7 5C7.55 5 8.02083 4.80417 8.4125 4.4125C8.80417 4.02083 9 3.55 9 3C9 2.45 8.80417 1.97917 8.4125 1.5875C8.02083 1.19583 7.55 1 7 1C6.45 1 5.97917 1.19583 5.5875 1.5875C5.19583 1.97917 5 2.45 5 3C5 3.55 5.19583 4.02083 5.5875 4.4125C5.97917 4.80417 6.45 5 7 5Z" fill="#7D0B15"/>
</svg>
 },
  { id: "bookings", label: "My Bookings", icon: <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.6155 18.2307C1.15517 18.2307 0.770833 18.0766 0.4625 17.7682C0.154167 17.4599 0 17.0756 0 16.6152V3.84625C0 3.38592 0.154167 3.00158 0.4625 2.69325C0.770833 2.38492 1.15517 2.23075 1.6155 2.23075H3.3845V0H4.4615V2.23075H11.6155V0H12.6155V2.23075H14.3845C14.8448 2.23075 15.2292 2.38492 15.5375 2.69325C15.8458 3.00158 16 3.38592 16 3.84625V16.6152C16 17.0756 15.8458 17.4599 15.5375 17.7682C15.2292 18.0766 14.8448 18.2307 14.3845 18.2307H1.6155ZM1.6155 17.2307H14.3845C14.5385 17.2307 14.6796 17.1667 14.8077 17.0385C14.9359 16.9103 15 16.7692 15 16.6152V7.84625H1V16.6152C1 16.7692 1.06408 16.9103 1.19225 17.0385C1.32042 17.1667 1.4615 17.2307 1.6155 17.2307ZM1 6.846H15V3.84625C15 3.69225 14.9359 3.55117 14.8077 3.423C14.6796 3.29483 14.5385 3.23075 14.3845 3.23075H1.6155C1.4615 3.23075 1.32042 3.29483 1.19225 3.423C1.06408 3.55117 1 3.69225 1 3.84625V6.846ZM8 11.3845C7.79367 11.3845 7.61383 11.3079 7.4605 11.1547C7.30733 11.0016 7.23075 10.8217 7.23075 10.6152C7.23075 10.4089 7.30733 10.2292 7.4605 10.076C7.61383 9.92283 7.79367 9.84625 8 9.84625C8.20633 9.84625 8.38617 9.92283 8.5395 10.076C8.69267 10.2292 8.76925 10.4089 8.76925 10.6152C8.76925 10.8217 8.69267 11.0016 8.5395 11.1547C8.38617 11.3079 8.20633 11.3845 8 11.3845ZM4 11.3845C3.79367 11.3845 3.61383 11.3079 3.4605 11.1547C3.30733 11.0016 3.23075 10.8217 3.23075 10.6152C3.23075 10.4089 3.30733 10.2292 3.4605 10.076C3.61383 9.92283 3.79367 9.84625 4 9.84625C4.20633 9.84625 4.38617 9.92283 4.5395 10.076C4.69267 10.2292 4.76925 10.4089 4.76925 10.6152C4.76925 10.8217 4.69267 11.0016 4.5395 11.1547C4.38617 11.3079 4.20633 11.3845 4 11.3845ZM12 11.3845C11.7937 11.3845 11.6138 11.3079 11.4605 11.1547C11.3073 11.0016 11.2308 10.8217 11.2308 10.6152C11.2308 10.4089 11.3073 10.2292 11.4605 10.076C11.6138 9.92283 11.7937 9.84625 12 9.84625C12.2063 9.84625 12.3862 9.92283 12.5395 10.076C12.6927 10.2292 12.7693 10.4089 12.7693 10.6152C12.7693 10.8217 12.6927 11.0016 12.5395 11.1547C12.3862 11.3079 12.2063 11.3845 12 11.3845ZM8 15.2308C7.79367 15.2308 7.61383 15.1542 7.4605 15.001C7.30733 14.8478 7.23075 14.668 7.23075 14.4615C7.23075 14.2552 7.30733 14.0753 7.4605 13.922C7.61383 13.7688 7.79367 13.6922 8 13.6922C8.20633 13.6922 8.38617 13.7688 8.5395 13.922C8.69267 14.0753 8.76925 14.2552 8.76925 14.4615C8.76925 14.668 8.69267 14.8478 8.5395 15.001C8.38617 15.1542 8.20633 15.2308 8 15.2308ZM4 15.2308C3.79367 15.2308 3.61383 15.1542 3.4605 15.001C3.30733 14.8478 3.23075 14.668 3.23075 14.4615C3.23075 14.2552 3.30733 14.0753 3.4605 13.922C3.61383 13.7688 3.79367 13.6922 4 13.6922C4.20633 13.6922 4.38617 13.7688 4.5395 13.922C4.69267 14.0753 4.76925 14.2552 4.76925 14.4615C4.76925 14.668 4.69267 14.8478 4.5395 15.001C4.38617 15.1542 4.20633 15.2308 4 15.2308ZM12 15.2308C11.7937 15.2308 11.6138 15.1542 11.4605 15.001C11.3073 14.8478 11.2308 14.668 11.2308 14.4615C11.2308 14.2552 11.3073 14.0753 11.4605 13.922C11.6138 13.7688 11.7937 13.6922 12 13.6922C12.2063 13.6922 12.3862 13.7688 12.5395 13.922C12.6927 14.0753 12.7693 14.2552 12.7693 14.4615C12.7693 14.668 12.6927 14.8478 12.5395 15.001C12.3862 15.1542 12.2063 15.2308 12 15.2308Z" fill="#545454"/>
</svg>
 },
  { id: "addresses", label: "My Address", icon: "♧" },
];

const showTitles = {
  "romeo-juliet": "Romeo & Juliet",
  "zen-katha": "Zen Katha",
};

const posters = {
  "romeo-juliet": "/images/juliet.png",
  "zen-katha": "/images/Zen.png",
};

const emptyAddress = {
  type: "Home",
  line1: "",
  line2: "",
  city: "",
  pincode: "",
  phone: "",
  isDefault: false,
};

function AccountPage() {
  const { section = "profile" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notice, setNotice] = useState("");
  const [addressFormOpen, setAddressFormOpen] = useState(true);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressDraft, setAddressDraft] = useState(emptyAddress);

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    if (!currentUser) {
      setAuthReady(true);
      return;
    }
    const [firstName = "", ...lastNameParts] = (currentUser.displayName ?? "").split(" ");
    const defaultProfile = {
      firstName,
      lastName: lastNameParts.join(" "),
      email: currentUser.email ?? "",
      phone: "",
      birthday: "",
      city: "",
      gender: "",
    };

    try {
      setProfile({ ...defaultProfile, ...readAccountData(currentUser.uid, "profile", {}) });
      setAddresses(readAccountData(currentUser.uid, "addresses", []));
      setBookings(readBookings(currentUser.email));
      setNotice("");
    } catch (error) {
      console.error("Unable to load account information.", error);
      setNotice("Your account information could not be loaded. Please reload and try again.");
    }
    setAuthReady(true);
  }), []);

  if (!authReady) {
    return <div className="account-layout"><Navbar /><main className="account-loading">Loading your account…</main><Footer /></div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!sections.some((item) => item.id === section)) {
    return <Navigate to="/account/profile" replace />;
  }

  const saveProfile = (event) => {
    event.preventDefault();
    try {
      writeAccountData(user.uid, "profile", profile);
      setNotice("Your profile has been saved.");
    } catch (error) {
      console.error("Unable to save profile.", error);
      setNotice("Your profile could not be saved. Please try again.");
    }
  };

  const saveAddress = (event) => {
    event.preventDefault();
    const address = {
      id: editingAddressId ?? `address-${Date.now()}`,
      ...addressDraft,
      line1: addressDraft.line1.trim(),
      line2: addressDraft.line2.trim(),
      city: addressDraft.city.trim(),
      pincode: addressDraft.pincode.trim(),
      phone: addressDraft.phone.trim(),
    };
    const nextAddresses = editingAddressId
      ? addresses.map((item) => item.id === editingAddressId ? address : item)
      : [...addresses, address];
    const makeDefault = address.isDefault || nextAddresses.length === 1 || !nextAddresses.some((item) => item.isDefault);
    if (makeDefault) {
      nextAddresses.forEach((item) => { item.isDefault = item.id === address.id; });
    }

    try {
      writeAccountData(user.uid, "addresses", nextAddresses);
      setAddresses(nextAddresses);
      setEditingAddressId(null);
      setAddressDraft(emptyAddress);
      setAddressFormOpen(false);
      setNotice("Your address has been saved.");
    } catch (error) {
      console.error("Unable to save address.", error);
      setNotice("Your address could not be saved. Please try again.");
    }
  };

  const editAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressDraft({ ...address });
    setAddressFormOpen(true);
  };

  const deleteAddress = (addressId) => {
    const nextAddresses = addresses.filter((address) => address.id !== addressId);
    if (addresses.find((address) => address.id === addressId)?.isDefault && nextAddresses.length) {
      nextAddresses[0].isDefault = true;
    }
    try {
      writeAccountData(user.uid, "addresses", nextAddresses);
      setAddresses(nextAddresses);
      setNotice("The address has been removed.");
    } catch (error) {
      console.error("Unable to remove address.", error);
      setNotice("The address could not be removed. Please try again.");
    }
  };

  const signOutFromAccount = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Unable to sign out from Firebase:", error);
      setNotice("You could not be logged out. Please try again.");
    }
  };

  return (
    <div className="account-layout">
      <Navbar />
      <main className="account-page">
        <p className="account-breadcrumb">HOME&nbsp; › &nbsp;<span>MY ACCOUNT</span></p>
        <div className="account-grid">
          <aside className="account-sidebar">
            <h1>My Account</h1>
            <nav aria-label="My account">
              {sections.map((item) => (
                <Link className={section === item.id ? "is-active" : ""} key={item.id} to={`/account/${item.id}`}>
                  <span aria-hidden="true">{item.icon}</span>{item.label}
                </Link>
              ))}
              <button type="button" onClick={signOutFromAccount}><span aria-hidden="true">⇥</span>Logout</button>
            </nav>
          </aside>

          <section className="account-content">
            {section === "profile" && profile && (
              <form className="account-profile-form" onSubmit={saveProfile}>
                <h2>My Profile</h2>
                <div className="account-fields">
                  <label>First Name<input name="firstName" autoComplete="given-name" value={profile.firstName} onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} /></label>
                  <label>Last Name<input name="lastName" autoComplete="family-name" value={profile.lastName} onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} /></label>
                  <label>Email Address<input name="email" type="email" autoComplete="email" value={profile.email} readOnly /></label>
                  <label>Phone Number<input name="phone" type="tel" autoComplete="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
                  <label>Birthday Date<input name="birthday" type="date" value={profile.birthday} onChange={(event) => setProfile({ ...profile, birthday: event.target.value })} /></label>
                  <label>City<input name="city" autoComplete="address-level2" value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} /></label>
                  <label>Gender<select name="gender" value={profile.gender} onChange={(event) => setProfile({ ...profile, gender: event.target.value })}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option></select></label>
                </div>
                <button className="account-primary-button" type="submit">Save</button>
              </form>
            )}

            {section === "bookings" && (
              <div className="account-bookings">
                <h2>My Bookings</h2>
                {bookings.length ? bookings.map((booking) => (
                  <article className="account-booking-card" key={booking.id}>
                    <img src={booking.poster || posters[booking.showId] || "/images/stage.jpeg"} alt={`${booking.showTitle} poster`} />
                    <div className="account-booking-details">
                      <div className="account-booking-title">
                        <div><h3>{booking.showTitle || showTitles[booking.showId] || "Show"}</h3><p>Screen 1</p></div>
                        <span>M-Ticket</span>
                      </div>
                      <p className="account-booking-date">{booking.date}</p>
                      <p className="account-booking-venue">{booking.venue}</p>
                      <p className="account-booking-seats">▧ &nbsp;{booking.category || "Standard"} &nbsp; {booking.seats.join(", ")}</p>
                      <div className="account-booking-cost"><span>Ticket Price</span><strong>₹{Number(booking.total).toLocaleString("en-IN")}</strong></div>
                      <div className="account-booking-cost"><span>Convenience fees</span><strong>₹0.00</strong></div>
                      <div className="account-booking-cost account-booking-total"><span>Amount Paid</span><strong>₹{Number(booking.total).toLocaleString("en-IN")}</strong></div>
                    </div>
                  </article>
                )) : (
                  <div className="account-empty-state">
                    <p>You don’t have any bookings yet.</p>
                    <Link to="/showtime">Explore upcoming shows</Link>
                  </div>
                )}
              </div>
            )}

            {section === "addresses" && (
              <div className="account-addresses">
                <h2>My Address</h2>
                {addresses.length > 0 && (
                  <div className="account-address-list">
                    {addresses.map((address) => (
                      <article className={`account-address-card${address.isDefault ? " is-default" : ""}`} key={address.id}>
                        <h3><span aria-hidden="true">{address.isDefault ? "◉" : "◯"}</span>Address {addresses.indexOf(address) + 1}{address.isDefault ? " · Default" : ""}</h3>
                        <p>{address.line1}<br />{address.line2 && <>{address.line2}<br /></>}{address.city}, {address.pincode}</p>
                        <p>Contact Number: {address.phone}</p>
                        <div className="account-address-actions">
                          <button type="button" onClick={() => editAddress(address)}>Edit</button>
                          <button type="button" onClick={() => deleteAddress(address.id)}>Remove</button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                <button className="account-add-address" type="button" onClick={() => { setAddressFormOpen((open) => !open); setEditingAddressId(null); setAddressDraft(emptyAddress); }}>
                  <span aria-hidden="true">{addressFormOpen ? "−" : "+"}</span>{editingAddressId ? "Edit Address" : "Add New Address"}
                </button>
                {addressFormOpen && (
                  <form className="account-address-form" onSubmit={saveAddress}>
                    <fieldset>
                      <legend>Address Type:</legend>
                      <label><input type="radio" name="type" value="Home" checked={addressDraft.type === "Home"} onChange={() => setAddressDraft({ ...addressDraft, type: "Home" })} />Home</label>
                      <label><input type="radio" name="type" value="Office" checked={addressDraft.type === "Office"} onChange={() => setAddressDraft({ ...addressDraft, type: "Office" })} />Office</label>
                      <label className="account-default-toggle"><input type="checkbox" name="isDefault" checked={addressDraft.isDefault} onChange={(event) => setAddressDraft({ ...addressDraft, isDefault: event.target.checked })} />Set as default address</label>
                    </fieldset>
                    <label>Address Line 1<input name="line1" value={addressDraft.line1} onChange={(event) => setAddressDraft({ ...addressDraft, line1: event.target.value })} placeholder="Building Name, House Number, flat no." required /></label>
                    <label>Address Line 2<input name="line2" value={addressDraft.line2} onChange={(event) => setAddressDraft({ ...addressDraft, line2: event.target.value })} placeholder="Road name, area, colony" /></label>
                    <div className="account-address-fields">
                      <label>City<input name="city" value={addressDraft.city} onChange={(event) => setAddressDraft({ ...addressDraft, city: event.target.value })} placeholder="Mumbai" required /></label>
                      <label>Pincode<input name="pincode" value={addressDraft.pincode} onChange={(event) => setAddressDraft({ ...addressDraft, pincode: event.target.value })} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="400064" required /></label>
                      <label>Phone Number<input name="phone" value={addressDraft.phone} onChange={(event) => setAddressDraft({ ...addressDraft, phone: event.target.value })} type="tel" autoComplete="tel" placeholder="+91 1234567890" required /></label>
                    </div>
                    <button className="account-primary-button" type="submit">Save</button>
                  </form>
                )}
              </div>
            )}

            {notice && <p className="account-notice" role="status">{notice}</p>}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AccountPage;
