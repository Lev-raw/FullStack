import { useEffect, useState } from "react";
import { DEFAULT_SITE_SECTIONS, fetchSiteSection } from "../api/siteSectionsApi";

function PerformanceSpaces() {
  const [active, setActive] = useState("stage");
  const [slideDirection, setSlideDirection] = useState("");
  const [content, setContent] = useState(DEFAULT_SITE_SECTIONS.performanceSpaces);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchSiteSection("performanceSpaces")
      .then((section) => {
        if (isMounted) setContent(section);
      })
      .catch((error) => {
        console.error("Unable to load Performance Spaces content.", error);
        if (isMounted) setLoadError("Performance Spaces content could not be loaded.");
      });
    return () => { isMounted = false; };
  }, []);

  const current = content.spaces[active] || Object.values(content.spaces)[0];
  const spaceKeys = Object.keys(content.spaces);
  const selectSpace = (key) => {
    if (key === active) return;
    setSlideDirection(spaceKeys.indexOf(key) > spaceKeys.indexOf(active) ? "left" : "right");
    setActive(key);
  };

  return (
    <section className="performance-spaces" id="spaces">
      <div className="performance-header">
        <h2>{content.heading}</h2>
        <div className="performance-tabs">
          {spaceKeys.map((key) => (
            <button
              className={active === key ? "active" : ""}
              key={key}
              type="button"
              onClick={() => selectSpace(key)}
            >
              {content.spaces[key].label}
            </button>
          ))}
        </div>
      </div>
      {loadError ? <p role="status">{loadError}</p> : null}
      <div className={`space-content${slideDirection ? ` space-content--slide-${slideDirection}` : ""}`}>
        <div className="space-text">
          {current.items.map((item, index) => (
            <div className="space-item" key={`${item.title}-${index}`}>
              <h3 className={index === 0 ? "active" : ""}>{item.title}</h3>
              <p>{item.text}</p>
              {index < current.items.length - 1 && (
                <div className="space-divider" />
              )}
            </div>
          ))}
        </div>
        <div className="space-image">
          <img src={current.image} alt={current.items[0]?.title || current.label} />
        </div>
      </div>
    </section>
  );
}

export default PerformanceSpaces;
