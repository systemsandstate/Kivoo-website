import { useEffect, useState, type FormEvent } from "react";

const APP_STORE_URL =
  import.meta.env.VITE_APP_STORE_URL || "https://apps.apple.com/app/kivoo";
const PLAY_STORE_URL =
  import.meta.env.VITE_PLAY_STORE_URL ||
  "https://play.google.com/store/apps/details?id=xyz.kivoo.app";
const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "hello@kivoo.org";
const CONTACT_API_URL =
  import.meta.env.VITE_CONTACT_API_URL || "/api/contact";

const FEATURES = [
  {
    icon: "/icons/get-paid.png",
    title: "Get paid",
    body: "Kivoo QR into General, or share network addresses for external USDT.",
  },
  {
    icon: "/icons/zero-fee.png",
    title: "Zero fee P2P",
    body: "General to General between Kivoo users by email or QR with no app fee.",
  },
  {
    icon: "/icons/send-external.png",
    title: "Send external",
    body: "USDT out on TRON, Ethereum, or BNB Chain when you need outside rails.",
  },
  {
    icon: "/icons/convert.png",
    title: "Convert",
    body: "Move External or Rewards into General in one clear flow.",
  },
  {
    icon: "/icons/rewards.png",
    title: "Rewards yield",
    body: "USDB yield via Flashnet, about 3.5 to 6% APY, paid daily in sats.",
  },
  {
    icon: "/icons/noncustodial.png",
    title: "Noncustodial",
    body: "Recovery phrase + PIN on your device. We never hold your seed.",
  },
] as const;

const SCREENS = [
  "/mobile-app/img/screenshots/1.png",
  "/mobile-app/img/screenshots/2.png",
  "/mobile-app/img/screenshots/3.png",
  "/mobile-app/img/screenshots/4.png",
  "/mobile-app/img/screenshots/5.png",
] as const;

const SCREEN_ALTS = [
  "Kivoo analytics",
  "Kivoo get paid from user",
  "Kivoo get paid external",
  "Kivoo settings",
  "Kivoo address book",
] as const;

const BRANDS = [
  "/mobile-app/img/brands/l1.png",
  "/mobile-app/img/brands/l2.png",
  "/mobile-app/img/brands/l3.png",
  "/mobile-app/img/brands/l4.png",
  "/mobile-app/img/brands/l5.png",
];

function IconApple() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true">
      <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z" />
    </svg>
  );
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactBusy, setContactBusy] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-in", entry.isIntersecting);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [contactSent]);

  async function onContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const website = String(data.get("website") || "").trim();
    if (!name || !email || !message) return;

    setContactBusy(true);
    setContactError(null);
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const payload = (await res.json().catch(() => null)) as {
        success?: boolean;
        error?: { message?: string };
      } | null;
      if (!res.ok || !payload?.success) {
        throw new Error(
          payload?.error?.message ||
            "Could not send your message. Please try again."
        );
      }
      form.reset();
      setContactSent(true);
    } catch (err) {
      setContactError(
        err instanceof Error
          ? err.message
          : "Could not send your message. Please try again."
      );
    } finally {
      setContactBusy(false);
    }
  }

  return (
    <>
      <header className="app-nav">
        <div className="app-nav__dock">
          <div className={`app-nav__pill${navOpen ? " is-open" : ""}`}>
            <a className="app-nav__brand" href="#home" aria-label="Kivoo home">
              <img src="/logo.png" alt="Kivoo" />
            </a>
            <button
              className="app-nav__toggle"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <i className="fas fa-bars" />
            </button>
            <nav className="app-nav__links" aria-label="Primary">
              <a href="#features" onClick={() => setNavOpen(false)}>
                Features
              </a>
              <a href="#fees" onClick={() => setNavOpen(false)}>
                Fees
              </a>
              <a href="#how" onClick={() => setNavOpen(false)}>
                How
              </a>
              <a href="#pricing" onClick={() => setNavOpen(false)}>
                Pricing
              </a>
              <a href="#contact" onClick={() => setNavOpen(false)}>
                Contact
              </a>
              <a className="app-nav__cta" href="#download" onClick={() => setNavOpen(false)}>
                Download
              </a>
            </nav>
          </div>
        </div>
      </header>

      <header className="mobile-app valign" id="home">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 valign">
              <div className="caption" data-reveal="right">
                <h1 className="mb-20">Get paid. Send money. Stay in control.</h1>
                <p>
                  The noncustodial merchant wallet for iPhone and Android. Hold dollar
                  like balances, send General to General with zero app fee. Keys stay on
                  your phone.
                </p>
                <div className="butons mt-40">
                  <a
                    href={APP_STORE_URL}
                    className="butn-gr rounded buton"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Apple Store</span>
                    <i className="icon">
                      <IconApple />
                    </i>
                  </a>
                  <a
                    href={PLAY_STORE_URL}
                    className="butn-bord-dark rounded buton"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Google Play</span>
                    <i className="icon">
                      <IconPlay />
                    </i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="img hero-phone" data-reveal="left">
                <img src="/mobile-app/img/header-img.png" alt="Kivoo app preview" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="brands pt-80 pb-80 bg-dark" data-overlay-dark="0">
        <div className="container">
          <div className="head mb-60 text-center" data-reveal="up">
            <h2>
              Built for networks merchants already use{" "}
              <span>
                6+ <img src="/mobile-app/img/shapes/border.png" alt="" className="bord-gr" />
              </span>{" "}
              rails
            </h2>
          </div>
          <div className="row justify-content-center">
            {BRANDS.map((src) => (
              <div className="col-lg col-sm-4" key={src}>
                <div className="item" data-reveal="up">
                  <div className="img">
                    <a href="#features">
                      <img src={src} alt="" className="front" />
                      <img src={src} alt="" className="back" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="circle-blur" />
      </section>

      <section className="serv-block section-padding" id="fees">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="serv-img" data-reveal="left">
                <img src="/mobile-app/img/app-img/s1-light.png" alt="Kivoo confirm send" />
              </div>
            </div>
            <div className="col-lg-6 offset-lg-1 valign">
              <div className="content" data-reveal="right">
                <h6 className="stit mb-30">
                  <span className="left" /> Kivoo to Kivoo
                </h6>
                <h2 className="mb-30">Zero transfer fee between General balances</h2>
                <p>
                  When both sides use General (USDB), sends are free of app fees. Pay by
                  email or scan a QR. Money moves inside the network instantly.
                </p>
                <div className="list-feat mt-40">
                  <ul>
                    <li className="mb-20">
                      <i className="icon">
                        <IconCheck />
                      </i>
                      No swap required for in network sends
                    </li>
                    <li className="mb-20">
                      <i className="icon">
                        <IconCheck />
                      </i>
                      Ideal for merchants, teams, and freelancers
                    </li>
                    <li className="mb-20">
                      <i className="icon">
                        <IconCheck />
                      </i>
                      External USDT still available when you need it
                    </li>
                  </ul>
                </div>
                <div className="butons mt-40">
                  <a href="#download" className="butn-gr rounded buton">
                    <span>Download free</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-80">
            <div className="col-lg-6 valign">
              <div className="content" data-reveal="left">
                <h6 className="stit mb-30">
                  <span className="left" /> Rewards
                </h6>
                <h2 className="mb-30">Earn while your balance works</h2>
                <p>
                  Rewards turn USDB yield into daily bitcoin sats via Flashnet, then
                  convert into General when you want spendable money.
                </p>
                <div className="list-feat mt-40">
                  <ul>
                    <li className="mb-20">
                      <i className="icon">
                        <IconCheck />
                      </i>
                      About 3.5 to 6% APY (indicative; rates can change)
                    </li>
                    <li className="mb-20">
                      <i className="icon">
                        <IconCheck />
                      </i>
                      Paid daily in sats
                    </li>
                    <li className="mb-20">
                      <i className="icon">
                        <IconCheck />
                      </i>
                      Convert path back to General
                    </li>
                  </ul>
                </div>
                <div className="butons mt-40">
                  <a href="#download" className="butn-bord-red rounded buton">
                    <span>Get the app</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="serv-img" data-reveal="right">
                <img src="/mobile-app/img/app-img/s2-light.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="circle-blur" />
        <div className="circle-blur two" />
      </section>

      <section className="app-services section-padding bg-gray" id="features">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="s-head text-center mb-80" data-reveal="up">
                <h6 className="stit mb-30">
                  <span className="left" /> Built for your phone
                  <span className="right" />
                </h6>
                <h2>
                  Everything merchants and freelancers need in a native iOS and Android
                  app
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {FEATURES.map((feat) => (
              <div className="col-lg-4 col-md-6" key={feat.title}>
                <div className="item mb-30" data-reveal="up">
                  <div className="item-tit mb-15">
                    <div className="icon feat-img-icon">
                      <img src={feat.icon} alt="" />
                    </div>
                    <div className="text-tit">
                      <h5>{feat.title}</h5>
                    </div>
                  </div>
                  <p>{feat.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secreen-shots section-padding" id="screens">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="s-head text-center mb-80" data-reveal="up">
                <h6 className="stit mb-30">
                  <span className="left" /> App Screenshots
                  <span className="right" />
                </h6>
                <h2>See Kivoo on your phone</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center shot-row">
            {SCREENS.map((src, i) => (
              <div className="col-lg-2 col-md-4 col-6" key={src}>
                <div className="item" data-reveal="up" data-reveal-delay={String((i % 5) + 1)}>
                  <img className="shot-img" src={src} alt={SCREEN_ALTS[i]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-process section-padding pt-0" id="how">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-10">
              <div className="s-head text-center mb-80" data-reveal="up">
                <h6 className="stit mb-30">
                  <span className="left" /> Working Process
                  <span className="right" />
                </h6>
                <h2>3 steps to get started</h2>
              </div>
            </div>
          </div>
          <div className="row process-steps">
            <div className="col-lg-4">
              <div className="item text-center md-mb50" data-reveal="up" data-reveal-delay="1">
                <span className="icon pe-7s-cloud-download" />
                <h5>Download the app</h5>
                <span className="step-number">Step 01</span>
                <p>Get Kivoo free on the App Store or Google Play for iPhone or Android.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="item text-center md-mb50" data-reveal="up" data-reveal-delay="2">
                <span className="icon pe-7s-user" />
                <h5>Create your wallet</h5>
                <span className="step-number">Step 02</span>
                <p>
                  Set a PIN and keep your recovery phrase on your device. You stay
                  noncustodial.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="item text-center" data-reveal="up" data-reveal-delay="3">
                <span className="icon pe-7s-phone" />
                <h5>Get paid and send</h5>
                <span className="step-number">Step 03</span>
                <p>
                  Share a QR, receive into General, and send to other Kivoo users with
                  zero app fee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-price section-padding" id="pricing">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="s-head text-center mb-80" data-reveal="up">
                <h6 className="stit mb-30">
                  <span className="left" /> Simple fee story
                  <span className="right" />
                </h6>
                <h2>Know when it is free, and when a network or convert fee applies</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="pric-tables">
                <div className="row">
                  <div className="col-md-6">
                    <div className="item active" data-reveal="up" data-reveal-delay="1">
                      <div className="type text-center mb-15">
                        <h5>General to General</h5>
                      </div>
                      <div className="amount text-center mb-40">
                        <h3>
                          <span>$</span> 0
                        </h3>
                      </div>
                      <div className="order mb-40">
                        <a href="#download" className="butn-gr rounded buton">
                          <span>Download free</span>
                        </a>
                      </div>
                      <div className="feat">
                        <ul>
                          <li>
                            <i className="icon">
                              <IconCheck />
                            </i>
                            Kivoo email or QR
                          </li>
                          <li>
                            <i className="icon">
                              <IconCheck />
                            </i>
                            Instant in network
                          </li>
                          <li>
                            <i className="icon">
                              <IconCheck />
                            </i>
                            No swap required
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="item" data-reveal="up" data-reveal-delay="2">
                      <div className="type text-center mb-15">
                        <h5>External and Convert</h5>
                      </div>
                      <div className="amount text-center mb-40">
                        <h3 className="amount-word">Shown</h3>
                      </div>
                      <div className="order mb-40">
                        <a href="#download" className="butn-gray rounded buton">
                          <span>Get the app</span>
                        </a>
                      </div>
                      <div className="feat">
                        <ul>
                          <li>
                            <i className="icon">
                              <IconCheck />
                            </i>
                            Network gas for USDT rails
                          </li>
                          <li>
                            <i className="icon">
                              <IconCheck />
                            </i>
                            TRC20, ERC20, BEP20
                          </li>
                          <li>
                            <i className="icon">
                              <IconCheck />
                            </i>
                            Fees shown before you confirm
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-action section-padding" id="download" data-overlay-dark="0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="box-gr" data-reveal="scale">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="img">
                      <img src="/img/mobile-app/call-img.png" alt="Download Kivoo" />
                    </div>
                  </div>
                  <div className="col-lg-6 valign">
                    <div className="cont">
                      <div className="s-head">
                        <h6 className="stit mb-30">
                          <span className="left" /> Download Apps
                        </h6>
                        <h2>Download Kivoo for iPhone or Android</h2>
                      </div>
                      <div className="butons mt-40">
                        <a
                          href={APP_STORE_URL}
                          className="butn-bg-light rounded buton"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Apple Store</span>
                          <i className="icon">
                            <IconApple />
                          </i>
                        </a>
                        <a
                          href={PLAY_STORE_URL}
                          className="butn-bord-light rounded buton"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Google Play</span>
                          <i className="icon">
                            <IconPlay />
                          </i>
                        </a>
                      </div>
                      <div className="shape-light">
                        <img src="/img/mobile-app/shapes/shape-light.png" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="s-head text-center mb-50" data-reveal="up">
                <h6 className="stit mb-30">
                  <span className="left" /> Contact
                  <span className="right" />
                </h6>
                <h2>Questions about Kivoo? Send a message</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {contactSent ? (
                <div className="contact-panel text-center" data-reveal="scale" role="status">
                  <h5>Thanks for reaching out.</h5>
                  <p>
                    We received your message and will get back to you soon. You can
                    also write us at {CONTACT_EMAIL}.
                  </p>
                  <button
                    type="button"
                    className="butn-gr rounded buton"
                    onClick={() => {
                      setContactSent(false);
                      setContactError(null);
                    }}
                  >
                    <span>Send another</span>
                  </button>
                </div>
              ) : (
                <form className="contact-panel" onSubmit={onContactSubmit} data-reveal="up">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-30">
                        <input
                          name="name"
                          type="text"
                          placeholder="Your name"
                          required
                          disabled={contactBusy}
                          autoComplete="name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-30">
                        <input
                          name="email"
                          type="email"
                          placeholder="you@company.com"
                          required
                          disabled={contactBusy}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mb-30">
                        <textarea
                          name="message"
                          rows={5}
                          placeholder="How can we help?"
                          required
                          disabled={contactBusy}
                        />
                      </div>
                    </div>
                    {/* Honeypot — hidden from users */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-10000px",
                        top: "auto",
                        width: 1,
                        height: 1,
                        overflow: "hidden",
                      }}
                    >
                      <label>
                        Website
                        <input
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </label>
                    </div>
                    {contactError ? (
                      <div className="col-12 text-center mb-20">
                        <p style={{ color: "#b42318", marginBottom: 8 }}>{contactError}</p>
                        <p style={{ color: "#666", fontSize: 14 }}>
                          Or email us at{" "}
                          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                        </p>
                      </div>
                    ) : null}
                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="butn-gr rounded buton"
                        disabled={contactBusy}
                      >
                        <span>{contactBusy ? "Sending…" : "Send message"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}            </div>
          </div>
        </div>
      </section>

      <footer className="app-footer" data-overlay-dark="0">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="item-clumn our">
                <a href="#home" className="logo-brand mb-50">
                  <img src="/logo.png" alt="Kivoo" />
                </a>
                <p>
                  Noncustodial merchant wallet for iPhone and Android. Get paid, send
                  money, and stay in control.
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="item-clumn links">
                <h5 className="title">Explore</h5>
                <ul>
                  <li>
                    <span className="icon pe-7s-angle-right" />
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <span className="icon pe-7s-angle-right" />
                    <a href="#fees">Fees</a>
                  </li>
                  <li>
                    <span className="icon pe-7s-angle-right" />
                    <a href="#how">How it works</a>
                  </li>
                  <li>
                    <span className="icon pe-7s-angle-right" />
                    <a href="#pricing">Pricing</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="item-clumn links">
                <h5 className="title">Links</h5>
                <ul>
                  <li>
                    <span className="icon pe-7s-angle-right" />
                    <a href="#download">Download</a>
                  </li>
                  <li>
                    <span className="icon pe-7s-angle-right" />
                    <a href="#contact">Contact</a>
                  </li>
                  <li>
                    <span className="icon pe-7s-angle-right" />
                    <a href="#screens">Screens</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="item-clumn links">
                <h5 className="title mb-30">Contact</h5>
                <div className="info">
                  <span>Email Address</span>
                  <h6>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-footer">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <p>© {new Date().getFullYear()} Kivoo. Noncustodial merchant wallet.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="circle-blur" />
        <div className="circle-blur two" />
      </footer>
    </>
  );
}
