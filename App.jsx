import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";

export default function App() {
  const [bedTime, setBedTime] = useState("23:30");
  const [wakeTime, setWakeTime] = useState("07:30");
  const [stress, setStress] = useState(35);
  const [screen, setScreen] = useState(3);
  const [wakeups, setWakeups] = useState(1);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#030303";
    document.body.style.overflowX = "hidden";

    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.overflowX =
      "hidden";

    const root = document.getElementById(
      "root"
    );

    if (root) {
      root.style.width = "100%";
      root.style.maxWidth = "100%";
      root.style.overflowX = "hidden";
    }
  }, []);

  const [history, setHistory] = useState([
    {
      day: "Пн",
      score: 84,
      sleep: 7.8,
      productivity: 88,
    },
    {
      day: "Вт",
      score: 71,
      sleep: 6.2,
      productivity: 69,
    },
    {
      day: "Ср",
      score: 92,
      sleep: 8.3,
      productivity: 95,
    },
    {
      day: "Чт",
      score: 65,
      sleep: 5.8,
      productivity: 61,
    },
    {
      day: "Пт",
      score: 81,
      sleep: 7.4,
      productivity: 84,
    },
  ]);

  function getSleepHours(start, end) {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    return (endMinutes - startMinutes) / 60;
  }

  const sleepHours = getSleepHours(
    bedTime,
    wakeTime
  );

  const sleepScore = useMemo(() => {
    let score = 100;

    score -= Math.abs(8 - sleepHours) * 12;
    score -= stress * 0.35;
    score -= screen * 4;
    score -= wakeups * 6;

    return Math.max(15, Math.round(score));
  }, [sleepHours, stress, screen, wakeups]);

  const productivity = Math.min(
    100,
    Math.round(sleepScore * 0.9 + 10)
  );

  const recovery = Math.min(
    100,
    Math.round((sleepHours / 8) * 100)
  );

  const economicLoss = Math.max(
    0,
    Math.round((100 - productivity) * 1.6)
  );

  const aiInsight = useMemo(() => {
    if (sleepHours < 6)
      return "Обнаружен серьёзный дефицит сна. Возможна потеря концентрации и когнитивной эффективности.";

    if (stress > 70)
      return "Высокий уровень стресса ухудшает REM-фазу сна и снижает качество восстановления.";

    if (screen > 5)
      return "Избыточное экранное время ухудшает качество глубокого сна.";

    return "Показатели сна находятся в стабильной зоне восстановления.";
  }, [sleepHours, stress, screen]);

  function saveDay() {
    const newDay = {
      day: `Д${history.length + 1}`,
      score: sleepScore,
      sleep: Number(sleepHours.toFixed(1)),
      productivity,
    };

    setHistory([...history, newDay]);
  }

  return (
    <div style={app}>
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
        }}
        style={orb1}
      />

      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        style={orb2}
      />

      <div style={container}>
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          style={hero}
        >
          <h1 style={title}>
            Анализ сна и продуктивности
          </h1>

          <p style={subtitle}>
            AI-платформа анализа сна,
            когнитивной эффективности,
            восстановления организма и
            влияния сна на продуктивность и
            экономическую эффективность.
          </p>
        </motion.div>

        <div style={cardsGrid}>
          <Card
            title="Sleep Score"
            value={`${sleepScore}%`}
          />

          <Card
            title="Продуктивность"
            value={`${productivity}%`}
          />

          <Card
            title="Восстановление"
            value={`${recovery}%`}
          />

          <Card
            title="Экономический ущерб"
            value={`${economicLoss}%`}
          />

          <Card
            title="Sleep Debt"
            value={`${Math.max(
              0,
              (8 - sleepHours).toFixed(1)
            )} ч`}
          />

          <Card
            title="Фокус мозга"
            value={
              sleepScore > 80
                ? "Высокий"
                : sleepScore > 60
                ? "Средний"
                : "Низкий"
            }
          />

          <Card
            title="Deep Sleep"
            value={`${Math.round(
              recovery * 0.82
            )}%`}
          />

          <Card
            title="REM-фаза"
            value={`${Math.round(
              productivity * 0.9
            )}%`}
          />
        </div>

        <div style={mainGrid}>
          <motion.div
            whileHover={{
              y: -4,
            }}
            style={panel}
          >
            <h2 style={panelTitle}>
              Ввод данных
            </h2>

            <Input
              label="Время сна"
              type="time"
              value={bedTime}
              set={setBedTime}
            />

            <Input
              label="Время пробуждения"
              type="time"
              value={wakeTime}
              set={setWakeTime}
            />

            <Slider
              label={`Стресс: ${stress}%`}
              value={stress}
              max={100}
              set={setStress}
            />

            <Slider
              label={`Экранное время: ${screen} ч`}
              value={screen}
              max={10}
              set={setScreen}
            />

            <Slider
              label={`Пробуждения ночью: ${wakeups}`}
              value={wakeups}
              max={10}
              set={setWakeups}
            />

            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={saveDay}
              style={button}
            >
              Сохранить анализ
            </motion.button>
          </motion.div>

          <div style={rightColumn}>
            <motion.div
              whileHover={{
                y: -4,
              }}
              style={panel}
            >
              <h2 style={panelTitle}>
                AI-анализ
              </h2>

              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                style={centerOrb}
              />

              <div style={analysisBox}>
                {aiInsight}
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                y: -4,
              }}
              style={panel}
            >
              <h2 style={panelTitle}>
                Расшифровка результатов
              </h2>

              <div style={text}>
                <p>
                  <b>Sleep Score</b> —
                  общая оценка качества сна.
                </p>

                <p>
                  <b>Продуктивность</b> —
                  прогноз концентрации,
                  памяти и эффективности.
                </p>

                <p>
                  <b>Восстановление</b> —
                  степень восстановления
                  организма после сна.
                </p>

                <p>
                  <b>Экономический ущерб</b>{" "}
                  — потенциальное снижение
                  эффективности из-за
                  недосыпа.
                </p>

                <p>
                  <b>Deep Sleep</b> —
                  качество глубокого сна.
                </p>

                <p>
                  <b>REM-фаза</b> —
                  восстановление мозга и
                  когнитивных функций.
                </p>

                <p>
                  <b>Sleep Debt</b> —
                  накопленный дефицит сна.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div style={chartsGrid}>
          <ChartCard title="История сна">
            <LineChart data={history}>
              <XAxis
                dataKey="day"
                stroke="#777"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#8B5CF6"
                strokeWidth={4}
              />
            </LineChart>
          </ChartCard>

          <ChartCard title="Аналитика сна">
            <AreaChart data={history}>
              <XAxis
                dataKey="day"
                stroke="#777"
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="sleep"
                stroke="#06B6D4"
                fill="#06B6D4"
              />
            </AreaChart>
          </ChartCard>
        </div>

        <ChartCard title="Экономика сна">
          <BarChart data={history}>
            <XAxis
              dataKey="day"
              stroke="#777"
            />

            <Tooltip />

            <Bar
              dataKey="productivity"
              fill="#8B5CF6"
            />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      style={card}
    >
      <p style={cardTitle}>{title}</p>

      <h2 style={cardValue}>{value}</h2>
    </motion.div>
  );
}

function ChartCard({
  title,
  children,
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      style={chart}
    >
      <h2 style={panelTitle}>
        {title}
      </h2>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >
        {children}
      </ResponsiveContainer>
    </motion.div>
  );
}

function Input({
  label,
  value,
  set,
  type,
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ marginBottom: 8 }}>
        {label}
      </p>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          set(e.target.value)
        }
        style={input}
      />
    </div>
  );
}

function Slider({
  label,
  value,
  set,
  max,
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p>{label}</p>

      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) =>
          set(Number(e.target.value))
        }
        style={range}
      />
    </div>
  );
}

const app = {
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100vw",
  overflowX: "hidden",
  background:
    "radial-gradient(circle at top,#111827,#030303)",
  color: "white",
  fontFamily: "Inter, sans-serif",
  position: "relative",
};

const container = {
  width: "100%",
  maxWidth: "1500px",
  margin: "0 auto",
  padding: "16px",
  boxSizing: "border-box",
  position: "relative",
  zIndex: 2,
};

const hero = {
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "32px",
  padding: "clamp(24px,5vw,70px)",
  marginBottom: "22px",
  backdropFilter: "blur(25px)",
  boxSizing: "border-box",
};

const title = {
  fontSize: "clamp(36px,8vw,86px)",
  lineHeight: 1,
  fontWeight: 900,
};

const subtitle = {
  color: "#a1a1aa",
  marginTop: "18px",
  lineHeight: 1.7,
  maxWidth: "800px",
  fontSize: "clamp(14px,2vw,22px)",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  width: "100%",
  marginBottom: "22px",
};

const card = {
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "26px",
  padding: "22px",
  boxSizing: "border-box",
  minWidth: 0,
  backdropFilter: "blur(20px)",
};

const cardTitle = {
  color: "#a1a1aa",
  fontSize: "14px",
};

const cardValue = {
  marginTop: "12px",
  fontSize: "clamp(26px,5vw,52px)",
  wordBreak: "break-word",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",
  gap: "20px",
  width: "100%",
  marginBottom: "22px",
  alignItems: "start",
};

const rightColumn = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
  minWidth: 0,
};

const panel = {
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "30px",
  padding: "22px",
  boxSizing: "border-box",
  width: "100%",
  minWidth: 0,
  backdropFilter: "blur(20px)",
};

const panelTitle = {
  fontSize: "clamp(24px,4vw,34px)",
  marginBottom: "18px",
};

const input = {
  width: "100%",
  padding: "15px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,.08)",
  background: "rgba(255,255,255,.04)",
  color: "white",
  boxSizing: "border-box",
  fontSize: "16px",
};

const range = {
  width: "100%",
  marginTop: "10px",
};

const button = {
  width: "100%",
  padding: "18px",
  borderRadius: "18px",
  border: "none",
  marginTop: "10px",
  background:
    "linear-gradient(135deg,#06B6D4,#8B5CF6)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  boxSizing: "border-box",
};

const centerOrb = {
  width: "130px",
  height: "130px",
  borderRadius: "999px",
  margin: "18px auto",
  background:
    "linear-gradient(135deg,#06B6D4,#8B5CF6)",
  boxShadow:
    "0 0 90px rgba(139,92,246,.45)",
};

const analysisBox = {
  background: "rgba(255,255,255,.04)",
  padding: "18px",
  borderRadius: "18px",
  color: "#d4d4d8",
  lineHeight: 1.8,
};

const text = {
  color: "#d4d4d8",
  lineHeight: 2,
  wordBreak: "break-word",
};

const chartsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",
  gap: "20px",
  width: "100%",
  marginBottom: "20px",
};

const chart = {
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "30px",
  padding: "22px",
  height: "420px",
  width: "100%",
  boxSizing: "border-box",
  minWidth: 0,
  backdropFilter: "blur(20px)",
};

const orb1 = {
  position: "fixed",
  width: "500px",
  height: "500px",
  borderRadius: "999px",
  background: "rgba(139,92,246,.15)",
  filter: "blur(120px)",
  top: "-200px",
  right: "-150px",
};

const orb2 = {
  position: "fixed",
  width: "450px",
  height: "450px",
  borderRadius: "999px",
  background: "rgba(6,182,212,.12)",
  filter: "blur(120px)",
  bottom: "-200px",
  left: "-150px",
};