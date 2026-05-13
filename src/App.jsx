import React, { useMemo, useState } from "react";

const districts = [
  "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
  "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga",
  "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
  "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
  "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada",
  "Vijayapura", "Yadgir", "Vijayanagara",
];

const talukasByDistrict = {
  "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal", "Yelahanka"],
  "Bengaluru Rural": ["Devanahalli", "Doddaballapur", "Hoskote", "Nelamangala"],
  Chikkamagaluru: ["Chikkamagaluru", "Kadur", "Tarikere", "Mudigere", "Koppa", "Narasimharajapura", "Sringeri", "Ajjampura", "Kalasa"],
  Mysuru: ["Mysuru", "Hunsur", "Nanjangud", "Piriyapatna", "T. Narasipura", "H.D. Kote"],
  Belagavi: ["Belagavi", "Athani", "Bailhongal", "Chikkodi", "Gokak", "Khanapur", "Ramdurg"],
  Ballari: ["Ballari", "Kurugodu", "Sandur", "Siruguppa"],
  Tumakuru: ["Tumakuru", "Tiptur", "Sira", "Madhugiri", "Gubbi", "Kunigal"],
  Mandya: ["Mandya", "Maddur", "Malavalli", "Nagamangala", "Pandavapura", "Srirangapatna"],
  Hassan: ["Hassan", "Arsikere", "Belur", "Channarayapatna", "Sakleshpur"],
  Dharwad: ["Dharwad", "Hubballi", "Kalghatgi", "Kundgol", "Navalgund"],
};

function getTalukas(district) {
  return talukasByDistrict[district] || [];
}

function getCategory(aqi) {
  if (aqi <= 50) return { label: "Good", color: "#16a34a", light: "#dcfce7" };
  if (aqi <= 100) return { label: "Satisfactory", color: "#65a30d", light: "#ecfccb" };
  if (aqi <= 200) return { label: "Moderate", color: "#d97706", light: "#fef3c7" };
  if (aqi <= 300) return { label: "Poor", color: "#ea580c", light: "#ffedd5" };
  return { label: "Severe", color: "#dc2626", light: "#fee2e2" };
}

const districtData = districts.map((district, index) => {
  const base = 38 + ((index * 17) % 126);

  const talukas = getTalukas(district).map((taluka, talukaIndex) => {
    const talukaAqi = Math.max(20, base + ((talukaIndex * 9) % 35) - 12);

    return {
      name: taluka,
      aqi: talukaAqi,
      pm25: Math.round(talukaAqi * 0.58),
      pm10: Math.round(talukaAqi * 0.92),
      no2: Math.round(talukaAqi * 0.21),
      o3: Math.round(talukaAqi * 0.18),
    };
  });

  return {
    district,
    aqi: base,
    pm25: Math.round(base * 0.58),
    pm10: Math.round(base * 0.92),
    no2: Math.round(base * 0.21),
    o3: Math.round(base * 0.18),
    talukas,
    trend: [
      { day: "Mon", aqi: Math.max(18, base - 11) },
      { day: "Tue", aqi: Math.max(18, base - 5) },
      { day: "Wed", aqi: base + 4 },
      { day: "Thu", aqi: Math.max(18, base - 2) },
      { day: "Fri", aqi: base + 9 },
      { day: "Sat", aqi: Math.max(18, base - 7) },
      { day: "Sun", aqi: base + 2 },
    ],
  };
});

export default function KarnatakaAQIDashboard() {
  const [page, setPage] = useState("start");
  const [selectedDistrict, setSelectedDistrict] = useState("Chikkamagaluru");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [sortMode, setSortMode] = useState("highest");

  const selectedDistrictData =
    districtData.find((item) => item.district === selectedDistrict) || districtData[0];

  const selectedTalukaData =
    selectedDistrictData.talukas.find((item) => item.name === selectedTaluka);

  const activeData = selectedTalukaData || selectedDistrictData;
  const category = getCategory(activeData.aqi);

  const pollutantData = [
    { name: "PM2.5", value: activeData.pm25 },
    { name: "PM10", value: activeData.pm10 },
    { name: "NO2", value: activeData.no2 },
    { name: "O3", value: activeData.o3 },
  ];

  const sortedDistricts = useMemo(() => {
    return [...districtData]
      .sort((a, b) => (sortMode === "highest" ? b.aqi - a.aqi : a.aqi - b.aqi))
      .slice(0, 10);
  }, [sortMode]);

  function handleDistrictChange(event) {
    setSelectedDistrict(event.target.value);
    setSelectedTaluka("");
  }

  if (page === "start") {
    return <GetStartedPage onStart={() => setPage("dashboard")} />;
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge}>💨 Karnataka AQI Dashboard</div>

          <div style={styles.heroGrid}>
            <div>
              <h1 style={styles.title}>Karnataka AQI by District & Taluka</h1>
              <p style={styles.subtitle}>
                View AQI levels, pollutant charts, weekly trends, and taluka-wise comparison.
              </p>
            </div>

            <div style={styles.heroCard}>
              <p style={styles.mutedWhite}>Current Selection</p>
              <div style={styles.heroCardRow}>
                <div>
                  <h2 style={styles.selectedTitle}>{selectedTaluka || selectedDistrict}</h2>
                  <p style={styles.mutedWhite}>Status: {category.label}</p>
                </div>

                <div style={styles.aqiBox}>
                  <p style={styles.aqiLabel}>AQI</p>
                  <p style={styles.aqiValue}>{activeData.aqi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main style={styles.main}>
        <section style={styles.topGrid}>
          <div style={styles.card}>
            <label style={styles.label}>Select District</label>
            <select value={selectedDistrict} onChange={handleDistrictChange} style={styles.select}>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.card}>
            <label style={styles.label}>Select Taluka</label>
            <select
              value={selectedTaluka}
              onChange={(e) => setSelectedTaluka(e.target.value)}
              style={styles.select}
            >
              <option value="">Overall district AQI</option>
              {selectedDistrictData.talukas.map((taluka) => (
                <option key={taluka.name} value={taluka.name}>
                  {taluka.name}
                </option>
              ))}
            </select>
          </div>

          <MetricCard icon="📊" title="AQI" value={activeData.aqi} subtitle={category.label} />
          <MetricCard icon="🌫️" title="PM10" value={activeData.pm10} subtitle="Main Pollutant" />
        </section>

        <section style={styles.twoColumnGrid}>
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Pollutant Chart</h2>
                <p style={styles.muted}>Pollutant breakdown</p>
              </div>
              <span style={{ ...styles.statusPill, color: category.color, background: category.light }}>
                {category.label}
              </span>
            </div>
            <SimpleBarChart data={pollutantData} color={category.color} maxValue={180} />
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Weekly AQI Trend</h2>
            <p style={styles.muted}>7 day AQI graph</p>
            <SimpleLineChart data={selectedDistrictData.trend} color={category.color} />
          </div>
        </section>

        {selectedDistrictData.talukas.length > 0 && (
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Taluka Comparison</h2>
            <p style={styles.muted}>AQI comparison inside {selectedDistrict}</p>
            <HorizontalTalukaChart data={selectedDistrictData.talukas} color="#0f766e" />
          </section>
        )}

        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>District Comparison</h2>
              <p style={styles.muted}>Top 10 AQI districts</p>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                style={sortMode === "highest" ? styles.activeButton : styles.outlineButton}
                onClick={() => setSortMode("highest")}
              >
                Highest AQI
              </button>

              <button
                type="button"
                style={sortMode === "lowest" ? styles.activeButton : styles.outlineButton}
                onClick={() => setSortMode("lowest")}
              >
                Lowest AQI
              </button>
            </div>
          </div>

          <HorizontalBarChart data={sortedDistricts} color="#0f766e" />
        </section>

        <section style={styles.twoColumnGrid}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Technologies Used</h2>

            <div style={styles.infoGrid}>
              <InfoPill title="React JS" text="Frontend interface and reusable components." />
              <InfoPill title="JavaScript" text="AQI logic, district filtering, and taluka filtering." />
              <InfoPill title="HTML & CSS" text="Layout, styling, and responsive design." />
              <InfoPill title="SVG Charts" text="Custom line chart and AQI visualization." />
              <InfoPill title="AQI API Ready" text="Can connect to CPCB, OpenAQ, or WAQI API." />
              <InfoPill title="Responsive Design" text="Works on desktop, tablet, and mobile screens." />
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Architecture Diagram</h2>

            <div style={styles.archList}>
              <ArchNode icon="👤" title="User" text="Selects district and taluka from the dashboard." />
              <Connector />
              <ArchNode icon="🖥️" title="React Frontend" text="Displays AQI cards, dropdowns, charts, and comparison data." />
              <Connector />
              <ArchNode icon="⚙️" title="Data Processing Layer" text="Filters district and taluka AQI values." />
              <Connector />
              <ArchNode icon="🔌" title="AQI API" text="Can fetch live AQI data from CPCB, OpenAQ, or WAQI." />
              <Connector />
              <ArchNode icon="📊" title="Visualization Layer" text="Shows pollutant, weekly, and comparison charts." />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function GetStartedPage({ onStart }) {
  return (
    <div style={styles.startPage}>
      <div style={styles.startCard}>
        <div style={styles.badge}>💨 Karnataka AQI Monitoring</div>

        <h1 style={styles.startTitle}>Track Air Quality Across Karnataka</h1>

        <p style={styles.startSubtitle}>
          View AQI levels by district and taluka, compare pollution data, analyze weekly trends,
          and understand air quality status in one simple dashboard.
        </p>

        <button type="button" style={styles.startButton} onClick={onStart}>
          Get Started
        </button>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, subtitle }) {
  return (
    <div style={styles.card}>
      <div style={styles.metricRow}>
        <div style={styles.metricIcon}>{icon}</div>
        <div>
          <p style={styles.muted}>{title}</p>
          <p style={styles.metricValue}>{value}</p>
          <p style={styles.muted}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function SimpleBarChart({ data, color, maxValue }) {
  return (
    <div style={styles.chartBox}>
      {data.map((item) => {
        const height = Math.max(8, (item.value / maxValue) * 210);

        return (
          <div key={item.name} style={styles.verticalBarItem}>
            <div style={styles.verticalBarTrack}>
              <div style={{ ...styles.verticalBar, height, background: color }} />
            </div>
            <strong>{item.value}</strong>
            <span style={styles.muted}>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function SimpleLineChart({ data, color }) {
  const width = 640;
  const height = 260;
  const padding = 34;
  const maxAqi = Math.max(...data.map((item) => item.aqi), 200);

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (item.aqi / maxAqi) * (height - padding * 2);
    return { ...item, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div style={styles.svgWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
        <path d={path} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />

        {points.map((point) => (
          <g key={point.day}>
            <circle cx={point.x} cy={point.y} r="5" fill="white" stroke={color} strokeWidth="3" />
            <text x={point.x} y={height - 10} textAnchor="middle" fontSize="12" fill="#64748b">
              {point.day}
            </text>
            <text x={point.x} y={point.y - 12} textAnchor="middle" fontSize="12" fill="#334155">
              {point.aqi}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function HorizontalBarChart({ data, color }) {
  const maxValue = Math.max(...data.map((item) => item.aqi), 1);

  return (
    <div style={styles.horizontalChart}>
      {data.map((item) => (
        <div key={item.district} style={styles.horizontalRow}>
          <div style={styles.districtLabel}>{item.district}</div>
          <div style={styles.horizontalTrack}>
            <div
              style={{
                ...styles.horizontalBar,
                width: `${(item.aqi / maxValue) * 100}%`,
                background: color,
              }}
            />
          </div>
          <strong style={styles.horizontalValue}>{item.aqi}</strong>
        </div>
      ))}
    </div>
  );
}

function HorizontalTalukaChart({ data, color }) {
  const maxValue = Math.max(...data.map((item) => item.aqi), 1);

  return (
    <div style={styles.horizontalChart}>
      {data.map((item) => (
        <div key={item.name} style={styles.horizontalRow}>
          <div style={styles.districtLabel}>{item.name}</div>
          <div style={styles.horizontalTrack}>
            <div
              style={{
                ...styles.horizontalBar,
                width: `${(item.aqi / maxValue) * 100}%`,
                background: color,
              }}
            />
          </div>
          <strong style={styles.horizontalValue}>{item.aqi}</strong>
        </div>
      ))}
    </div>
  );
}

function InfoPill({ title, text }) {
  return (
    <div style={styles.infoPill}>
      <strong>{title}</strong>
      <p style={styles.muted}>{text}</p>
    </div>
  );
}

function ArchNode({ icon, title, text }) {
  return (
    <div style={styles.archNode}>
      <div style={styles.archIcon}>{icon}</div>
      <div>
        <h3 style={styles.archTitle}>{title}</h3>
        <p style={styles.muted}>{text}</p>
      </div>
    </div>
  );
}

function Connector() {
  return <div style={styles.connector} />;
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  startPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: "linear-gradient(135deg,#082f49 0%,#0f172a 55%,#064e3b 100%)",
    color: "white",
  },

  startCard: {
    maxWidth: 760,
    textAlign: "center",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.20)",
    borderRadius: 32,
    padding: 42,
    boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
  },

  startTitle: {
    fontSize: "clamp(42px,7vw,72px)",
    lineHeight: 1,
    margin: "24px 0 18px",
  },

  startSubtitle: {
    color: "#cbd5e1",
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 30,
  },

  startButton: {
    border: "none",
    background: "#22c55e",
    color: "white",
    borderRadius: 18,
    padding: "15px 26px",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
  },

  hero: {
    background: "linear-gradient(135deg,#082f49 0%,#0f172a 55%,#064e3b 100%)",
    color: "white",
    padding: "46px 24px",
  },

  heroInner: {
    maxWidth: 1180,
    margin: "0 auto",
  },

  badge: {
    display: "inline-flex",
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    padding: "9px 14px",
    marginBottom: 22,
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 28,
    alignItems: "end",
  },

  title: {
    fontSize: "clamp(38px,7vw,68px)",
    lineHeight: 1.02,
    margin: 0,
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 18,
    lineHeight: 1.7,
  },

  heroCard: {
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    borderRadius: 28,
    padding: 22,
  },

  heroCardRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
  },

  mutedWhite: {
    color: "#cbd5e1",
    margin: 0,
  },

  selectedTitle: {
    fontSize: 26,
    margin: "0 0 8px",
  },

  aqiBox: {
    background: "white",
    color: "#0f172a",
    borderRadius: 24,
    padding: "15px 20px",
    minWidth: 102,
    textAlign: "center",
  },

  aqiLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
  },

  aqiValue: {
    margin: 0,
    fontSize: 42,
    fontWeight: 800,
  },

  main: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "32px 24px",
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 16,
  },

  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 24,
    marginTop: 28,
  },

  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
    marginTop: 24,
  },

  label: {
    display: "block",
    color: "#475569",
    fontWeight: 700,
    marginBottom: 9,
  },

  select: {
    width: "100%",
    height: 48,
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "0 14px",
    fontSize: 16,
  },

  metricRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  metricIcon: {
    width: 48,
    height: 48,
    display: "grid",
    placeItems: "center",
    borderRadius: 16,
    background: "#f1f5f9",
    fontSize: 24,
  },

  metricValue: {
    margin: "3px 0",
    fontSize: 28,
    fontWeight: 800,
  },

  muted: {
    color: "#64748b",
    margin: 0,
    lineHeight: 1.5,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },

  sectionTitle: {
    margin: "0 0 6px",
    fontSize: 23,
  },

  statusPill: {
    borderRadius: 999,
    padding: "7px 12px",
    fontWeight: 800,
  },

  chartBox: {
    height: 280,
    display: "flex",
    alignItems: "end",
    justifyContent: "space-around",
    gap: 16,
  },

  verticalBarItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "end",
    gap: 8,
    flex: 1,
    height: "100%",
  },

  verticalBarTrack: {
    height: 220,
    width: "58%",
    minWidth: 36,
    background: "#f1f5f9",
    borderRadius: 999,
    display: "flex",
    alignItems: "end",
    overflow: "hidden",
  },

  verticalBar: {
    width: "100%",
    borderRadius: 999,
  },

  svgWrap: {
    width: "100%",
    overflow: "hidden",
    background: "#f8fafc",
    borderRadius: 20,
    border: "1px solid #e2e8f0",
    marginTop: 20,
  },

  svg: {
    width: "100%",
    height: 280,
    display: "block",
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  activeButton: {
    border: "1px solid #0f766e",
    background: "#0f766e",
    color: "white",
    borderRadius: 16,
    padding: "11px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },

  outlineButton: {
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#0f172a",
    borderRadius: 16,
    padding: "11px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },

  horizontalChart: {
    display: "grid",
    gap: 13,
    marginTop: 20,
  },

  horizontalRow: {
    display: "grid",
    gridTemplateColumns: "160px 1fr 45px",
    gap: 12,
    alignItems: "center",
  },

  districtLabel: {
    color: "#334155",
    fontWeight: 700,
    fontSize: 14,
  },

  horizontalTrack: {
    height: 20,
    background: "#f1f5f9",
    borderRadius: 999,
    overflow: "hidden",
  },

  horizontalBar: {
    height: "100%",
    borderRadius: 999,
  },

  horizontalValue: {
    textAlign: "right",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 18,
  },

  infoPill: {
    background: "#f1f5f9",
    borderRadius: 18,
    padding: 16,
  },

  archList: {
    display: "grid",
    gap: 10,
    marginTop: 16,
  },

  archNode: {
    display: "flex",
    gap: 16,
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    padding: 16,
  },

  archIcon: {
    width: 46,
    height: 46,
    display: "grid",
    placeItems: "center",
    borderRadius: 16,
    background: "#e0f2fe",
    fontSize: 24,
    flexShrink: 0,
  },

  archTitle: {
    margin: "0 0 4px",
    fontSize: 16,
  },

  connector: {
    width: 2,
    height: 20,
    marginLeft: 23,
    background: "#cbd5e1",
  },
};

const css = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  button,
  select {
    font: inherit;
  }

  @media (max-width: 900px) {
    section[style*="repeat(4"] {
      grid-template-columns: 1fr !important;
    }

    section[style*="repeat(2"] {
      grid-template-columns: 1fr !important;
    }

    div[style*="1.25fr"] {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 640px) {
    div[style*="160px 1fr 45px"] {
      grid-template-columns: 1fr !important;
    }

    div[style*="repeat(2, minmax"] {
      grid-template-columns: 1fr !important;
    }
  }
`;