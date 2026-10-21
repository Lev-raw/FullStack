
import AuditoriumIcon from "../assets/audi.svg";
import TheatreIcon from "../assets/mini.svg";
import StudioIcon from "../assets/studioroom.svg";
import RehearsalIcon from "../assets/rehersal.svg";
import RecordingIcon from "../assets/audio.svg";

const rooms = [
  { name: "ADITYA BIRLA AUDITORIUM", icon: AuditoriumIcon },
  { name: "MINI THEATRE", icon: TheatreIcon },
  { name: "STUDIO ROOM", icon: StudioIcon },
  { name: "REHEARSAL STUDIO", icon: RehearsalIcon },
  { name: "AUDIO RECORDING STUDIO", icon: RecordingIcon },
];

function SpaceDirectory() {
  return (
    <section className="space-directory">
      <div className="directory-grid">
        {rooms.map((room) => (
          <a
            className="directory-card"
            href="#spaces"
            key={room.name}
          >
            <img
              className="directory-icon"
              src={room.icon}
              alt=""
            />

            <div className="dir-name">{room.name}</div>

            <span className="directory-link">
              Book Now
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default SpaceDirectory;
