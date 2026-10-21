import React from "react";
import IntegrityIcon from "../assets/about-abg-integrity.svg";
import CommitmentIcon from "../assets/about-abg-commitment.svg";
import PassionIcon from "../assets/about-abg-passion.svg";
import SeamlessnessIcon from "../assets/about-abg-seamlessness.svg";
import SpeedIcon from "../assets/about-abg-speed.svg";
import VisionIcon from "../assets/about-abg-vision.svg";
import MissionIcon from "../assets/about-abg-mission.svg";
import abglogo from "../assets/abglogo.svg";
import "./AboutABG.css";
import Breadcrumb from "./Breadcrumb";
import Navbar from "./Navbar";
import Footer from "./Footer";

const statistics = [
  { value: "1944", label: "Founding year" },
  { value: "10,000+", label: "Artists" },
  { value: "243", label: "Beneficiaries" },
  { value: "4,500+", label: "Performances" },
];

const historyItems = [
  {
    image: "/images/charlog.jpg",
    alt: "Archival theatre photograph",
    paragraphs: [
      `By the 1950s, it pioneered folk ballets such as Jesal Toral (1951) and staged mobile performances like Grow More Food, taking theatre to the streets atop lorries. Productions such as Dekh Teri Bambai (1959) travelled internationally, representing India at the World Theatre Festival in Paris and showcasing Mumbai’s cultural spirit to global audiences.

Across the 1960s and 70s, Indian National Theatre became synonymous with experimentation and regional authenticity. From Atmaram Bhende’s Marathi adaptations of Samuel Beckett and Karel Čapek to Mansukh Joshi’s folk epics and pioneering Parsi–English collaborations, the institution fostered a vibrant performance culture. Iconic productions including Batatyachi Chaal, Yayati, Napoleon and Santu Rangili explored themes of identity, class, modernity and memory cementing INT’s position as a cultural thought-leader. Its Raas-Garba competitions, Urdu mushairas, city-wide festivals and dance ballets turned Mumbai into a thriving artistic landscape and shaped generations of rasiks.

Collaborations between Hima Kasarkodi and Adi Marzban expanded the reach into English theatre, presenting ten plays over twenty-four years including Kiss and Tell, Wait Until Dark, and Two-Way Man.`,
    ],
  },
  {
    image: "/images/3log.png",
    alt: "Performers celebrating the legacy of Indian theatre",
    paragraphs: [
      `Across decades, Indian National Theatre trained and inspired artists such as Smita Patil, 
Amrish Puri, Sanjeev Kumar, Sarita Joshi, Amol Palekar, Ashok Saraf, Tiku Talsania, Pravin Joshi, Swaroop Sampat, Burjor Patel, Swati Chitnis, Rohini Hattangadi, Bhakti Barve, P L Deshpande, Satish Dubhashi, Shriram Lagoo, Sadashiv Amrapurkar, Mohan Agase, Atul Parchure, Shivaji Satam, Ankush Choudhari, Bharat Jadhav, Sidharth Jadhav, Sameer Chougule, Spruha Joshi, Aditi Sarangdhar , Paresh Rawal, Adwait Dadarkar, Veena Jamkar, Sukhada Ayare, Pallavi Patil, Aarti More, Rutuja Bagwe, Bhagyashree Milind, Phiroz Antia, Suhas Joshi, Atmaram Bhende, etc.

Nurturing young talent was equally central to its mission. Under the steady, imaginative leadership of Vanlata Mehta, the Children’s Theatre Academy staged eleven full-length children’s dramas, creating a foundational training space for young performers and introducing countless children to the world of theatre. This became one of Indian National Theatre’s most cherished legacies, ensuring that creativity passed organically from one generation to the next.`,
    ],
  },
  {
    image: "/images/movieroll.jpg",
    alt: "Resources from the performing arts archive",
    paragraphs: [`With the establishment of its Research Centre in 1978, it began systematically documenting and reviving India’s folk arts, preserving more than thirty forms such as Garba, Bhavai, Ras, Akhyans, Kirtans, Lavni and Powada. Through workshops, festivals, publications and a growing library and audio-visual archive, Indian National Theatre became one of India’s most respected cultural resource centres. The 1980s and 90s saw greater focus on arts education, international collaborations, and training through Kamlakar Sontakke’s Theatre Course, solidifying its role as both a performance stage and a cultural school.

By the early 2000s, Indian National Theatre stood as a pillar of India’s performing arts, an institution that had evolved with the times while remaining anchored in its founding ideals. It had grown from a flame lit in captivity to a nationally recognised platform that nurtured artists, documented traditions, and shaped the country’s theatrical landscape.`],
  },
];

const values = [
  { title: "Integrity", icon: IntegrityIcon },
  { title: "Commitment", icon: CommitmentIcon },
  { title: "Passion", icon: PassionIcon },
  { title: "Seamlessness", icon: SeamlessnessIcon },
  { title: "Speed", icon: SpeedIcon },
];

function AboutABG() {
  return (
    <>
      <Navbar />
      <main className="about-abg">
        <div className="about-abg__poster">
          <Breadcrumb />
          <img src="/images/mask.jpg" alt="Theatre masks" />
        </div>

        <section className="about-abg__legacy" aria-labelledby="legacy-title">
          <h1 id="legacy-title">Honouring Legacy, Shaping What’s Next</h1>
          <div className="about-abg__legacy-copy">
            <p>
              INT Aditya Birla Centre for Performing Arts carries forward the
              enduring legacy of the Indian National Theatre, one of India’s
              oldest and most influential performing arts institutions. It was
              conceived inside a Bombay prison on 5 May 1944, at the height of
              India’s freedom struggle. Indian National Theatre emerged from
              young revolutionaries who believed art could echo the heartbeat of
              a rising nation. Founded by Rohit Dave, Damu Jhaveri, Mansukh
              Joshi, M.R.A. Baig, Chandrakant Dali, Dr. G.Y. Chitnis, Narayan
              Mistri and Chandravadan Bhatt, it became a transformative force
              that revived folk traditions, shaped modern theatre, and created a
              national platform for artistic expression.
            </p>
            <p>
              From multilingual mushairas and early ballets like Mirabai (1944),
              Amrapali and Narsaiyo, to the cultural landmark production
              Discovery of India (1947), Indian National Theatre quickly became
              a hub where India’s artistic identity took shape.  From Awaz by
              Ismat Chughtai (Hindi, 1945) to Lagnani Bedi (Gujarati, 1949),
              Indian National Theatre redefined the way audiences engaged with
              theatre, drawing crowds to ticket windows rather than homes.
            </p>
          </div>
          <div className="about-abg__legacy-image">
            <img
              src="/images/honoring1.jpg"
              alt="A historic Indian National Theatre performance"
              loading="lazy"
            />
          </div>
        </section>

        <section
          className="about-abg__statistics"
          aria-labelledby="stats-title"
        >
          <h2 id="stats-title">The Statistics</h2>
          <div className="about-abg__stats-grid">
            {statistics.map(({ value, label }) => (
              <article className="about-abg__stat" key={label}>
                <p className="about-abg__stat-value">{value}</p>
                <p className="about-abg__stat-label">{label}</p>
              </article>
            ))}
          </div>

          <div className="about-abg__history">
            {historyItems.map(({ image, alt, paragraphs }) => (
              <article className="about-abg__history-item" key={image}>
                <div className="about-abg__history-image">
                  <img src={image} alt={alt} loading="lazy" />
                </div>
                <div className="about-abg__history-copy">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-abg__future" aria-labelledby="era-title">
          <div className="about-abg__era">
            <div className="about-abg__era-copy">
              <h2 id="era-title">The INTABC Era</h2>
              <p>
                A new chapter began with the Aditya Birla Group’s support,
                bringing a renewed home for the performing arts. INT Aditya
                Birla Centre for Performing Arts continues the work of Indian
                National Theatre while creating space for the next generation.
              </p>
              <p>
                With welcoming venues and a varied programme, the centre brings
                artists and audiences together to experience theatre, music and
                dance.
              </p>
            </div>
            <div className="about-abg__era-image">
              <img
                src="/images/stage.jpeg"
                alt="The centre's performance space"
                loading="lazy"
              />
            </div>
          </div>

          <div className="about-abg__looking-ahead">
            <h2>Looking Ahead</h2>
            <p>
            Today, this rich legacy continues at INT Aditya Birla Centre for Performing Arts, where tradition meets innovation, and India’s artistic heritage is reimagined for the future. Its vision is to be a global destination for the performing arts, where Indian creativity engages the world with confidence and grace.</p>
            <p>
             The Centre remains a home where creators rehearse ideas, audiences discover new worlds, and the timeless vision lives on resonant, inclusive and ever-evolving.
            </p>
          </div>
        </section>

        <section className="about-abg__purpose" aria-label="Our purpose">
          <article className="about-abg__purpose-card">
            <img
              className="about-abg__purpose-icon"
              src={VisionIcon}
              alt=""
              aria-hidden="true"
            />

            <h2>Our Vision</h2>
            <p>
              To be a global centre of excellence for the performing arts,
                inspiring audiences and nurturing artistic exchange.
            </p>
          </article>
          <div className="about-abg__purpose-image">
            <img
              src={abglogo}
              alt="INT Aditya Birla Centre for Performing Arts"
              loading="lazy"
            />
          </div>
          <article className="about-abg__purpose-card">
            <img
              className="about-abg__purpose-icon"
              src={MissionIcon}
              alt=""
              aria-hidden="true"
            />

            <h2>Our Mission</h2>
            <p>
              To foster diverse artistic expressions and empower artists through
              an enriching cultural journey.
            </p>
          </article>
        </section>

        <section className="about-abg__values" aria-labelledby="values-title">
          <h2 id="values-title">Our Values</h2>
          <p className="about-abg__values-intro">
           Rooted in Indian National Theatre’s founding spirit and the values that the Aditya Birla Groups endorses, INT Aditya Birla Centre for Performing Arts upholds authenticity, inclusivity, and artistic excellence. It believes in theatre as a catalyst for thought, emotion, and social dialogue, a craft that shapes both the individual and the collective imagination.
          </p>
          <ul className="about-abg__values-grid">
            {values.map(({ title, icon }) => (
              <li className="about-abg__value" key={title}>
                <img
                  className="about-abg__value-icon"
                  src={icon}
                  alt=""
                  aria-hidden="true"
                />
                <span>{title}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutABG;
