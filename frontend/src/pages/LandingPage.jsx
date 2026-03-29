import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, TrendingUp, Calendar, Zap, Target, ArrowRight, BarChart3, Clock, Sparkles } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  // Floating mockup state
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthLayout>
      {/* ================= GLOBAL STYLES & GRADIENTS ================= */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .hero-headline {
          background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #38bdf8 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 8s ease infinite;
        }
        .lp-cta-btn {
          position: relative;
          padding: 1.1rem 3rem;
          font-size: 1.05rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #38bdf8, #2563eb);
          color: #fff;
          font-weight: 700;
          font-family: inherit;
          box-shadow: 0 10px 30px rgba(37,99,235,0.3);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }
        .lp-cta-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0284c7, #1d4ed8);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .lp-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(37,99,235,0.45);
        }
        .lp-cta-btn:hover::before { opacity: 1; }
        .lp-cta-btn span, .lp-cta-btn svg {
          position: relative;
          z-index: 1;
        }
        .lp-login-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s ease;
          padding: 0.5rem 1rem;
        }
        .lp-login-btn:hover { color: #f1f5f9; }
        .lp-signup-btn {
          padding: 0.5rem 1.4rem;
          border-radius: 99px;
          border: 1px solid rgba(56,189,248,0.4);
          background: rgba(56,189,248,0.1);
          color: #38bdf8;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .lp-signup-btn:hover {
          background: rgba(56,189,248,0.2);
          box-shadow: 0 4px 15px rgba(56,189,248,0.2);
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
          
        /* Base page background */
        html, body {
           background-color: #020617;
           margin: 0;
           padding: 0;
        }
      `}</style>

      {/* Background ambient lighting */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%",
          background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)",
          filter: "blur(60px)"
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "-10%", width: "40%", height: "40%",
          background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)",
          filter: "blur(60px)"
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(2,6,23,0.7)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "1rem 2.5rem", position: "sticky", top: 0, zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #38bdf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
            }}>
              <CheckCircle2 color="#fff" size={18} strokeWidth={3} />
            </div>
            <h2 style={{ margin: 0, fontWeight: 800, color: "#f1f5f9", fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
              Habit Tracker
            </h2>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button className="lp-login-btn" onClick={() => navigate("/login")}>Log in</button>
            <button className="lp-signup-btn" onClick={() => navigate("/signup")}>Sign up</button>
          </div>
        </motion.div>

        {/* ================= HERO SECTION ================= */}
        <section style={{ width: "100%", padding: "6rem 2rem 4rem", minHeight: "90vh", display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "999px",
                background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)",
                color: "#38bdf8", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em",
                marginBottom: "1.5rem", textTransform: "uppercase",
              }}>
                <Sparkles size={14} /> Master Your Routine
              </div>
              <h1 className="hero-headline" style={{ fontSize: "4.2rem", fontWeight: 900, marginBottom: "1.2rem", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
                Small Habits.<br />Massive Results.
              </h1>
              <p style={{ fontSize: "1.2rem", lineHeight: 1.6, color: "#94a3b8", marginBottom: "3rem", maxWidth: "500px" }}>
                Build consistency, visualize your progress, and tap into AI-powered insights to create routines that actually stick.
              </p>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <button className="lp-cta-btn" onClick={() => navigate("/signup")}>
                  <span>Start for free</span> <ArrowRight size={18} />
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>
                  <TrendingUp size={16} /> No credit card required
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Animated Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: "relative", perspective: "1000px" }}
            >
              <div className="glass-card" style={{ 
                borderRadius: "24px", padding: "1.5rem", position: "relative", 
                transform: "rotateY(-5deg) rotateX(5deg)", transformStyle: "preserve-3d"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calendar size={20} color="#38bdf8" /> Today's Habits
                  </div>
                  <div style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>
                    🔥 12 Day Streak
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { name: "Morning Workout", icon: "💪", color: "#38bdf8", time: "7:00 AM" },
                    { name: "Read 10 Pages", icon: "📚", color: "#22c55e", time: "1:00 PM" },
                    { name: "Meditation", icon: "🧘", color: "#a855f7", time: "9:00 PM" }
                  ].map((habit, i) => {
                    const isActive = activeStep >= i;
                    let bgCol = "rgba(255,255,255,0.03)";
                    let borderCol = "rgba(255,255,255,0.05)";
                    let iconBg = "transparent";
                    if (isActive) {
                      if (habit.color === '#22c55e') { bgCol = 'rgba(34,197,94,0.1)'; borderCol = 'rgba(34,197,94,0.3)'; iconBg = 'rgba(34,197,94,0.15)'; }
                      else if (habit.color === '#38bdf8') { bgCol = 'rgba(56,189,248,0.1)'; borderCol = 'rgba(56,189,248,0.3)'; iconBg = 'rgba(56,189,248,0.15)'; }
                      else { bgCol = 'rgba(168,85,247,0.1)'; borderCol = 'rgba(168,85,247,0.3)'; iconBg = 'rgba(168,85,247,0.15)'; }
                    }

                    return (
                      <motion.div 
                        key={i}
                        layout
                        initial={{ background: "rgba(255,255,255,0.03)" }}
                        animate={{ background: bgCol, borderColor: borderCol }}
                        style={{ 
                          padding: "16px", borderRadius: "16px", border: "1px solid", 
                          display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                            {habit.icon}
                          </div>
                          <div>
                            <div style={{ color: "#f8fafc", fontWeight: 600, fontSize: "1rem" }}>{habit.name}</div>
                            <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Clock size={12} /> {habit.time}
                            </div>
                          </div>
                        </div>
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ 
                            scale: isActive ? 1.1 : 0.8, 
                            opacity: isActive ? 1 : 0.2,
                            color: isActive ? habit.color : "#64748b"
                          }}
                        >
                          <CheckCircle2 size={24} fill={iconBg} strokeWidth={isActive ? 2.5 : 1.5} />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Floating achievement */}
                <AnimatePresence>
                  {activeStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      style={{
                        position: "absolute", bottom: "-20px", right: "-30px",
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        padding: "12px 20px", borderRadius: "16px",
                        boxShadow: "0 10px 25px rgba(245,158,11,0.4)",
                        display: "flex", alignItems: "center", gap: "10px", color: "#fff", fontWeight: 700
                      }}
                    >
                      <span>🏆</span> All daily habits complete!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= FEATURES GRID (Replacing KPI Image) ================= */}
        <section style={{ padding: "6rem 2rem", background: "linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(2,6,23,0.6) 100%)", position: "relative" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "1rem" }}>Built for Consistency</h2>
              <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
                Everything you need to stop making excuses and start building routines that last.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {[
                { icon: <Zap color="#f59e0b" size={32} />, title: "Don't Break The Chain", desc: "Visual streaks and heatmaps keep you motivated to maintain your daily momentum.", glow: "rgba(245,158,11,0.15)" },
                { icon: <BarChart3 color="#38bdf8" size={32} />, title: "Deep Analytics", desc: "Track completion rates, identify your best days, and visualize long-term progress.", glow: "rgba(56,189,248,0.15)" },
                { icon: <Target color="#22c55e" size={32} />, title: "AI Habit Coach", desc: "Get smart predictions and personalized motivational insights based on your real data.", glow: "rgba(34,197,94,0.15)" }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="glass-card"
                  style={{ 
                    padding: "2.5rem 2rem", borderRadius: "24px", 
                    position: "relative", overflow: "hidden"
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "150px", background: `radial-gradient(circle at top left, ${feature.glow}, transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ color: "#f8fafc", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.8rem" }}>{feature.title}</h3>
                  <p style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: "0.95rem" }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= DATA VISUALIZATION SECTION (Replacing Graph Image) ================= */}
        <section style={{ padding: "8rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "5rem", alignItems: "center" }}>
            
            {/* Animated Chart UI */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="glass-card"
              style={{ borderRadius: "24px", padding: "2rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                  <h3 style={{ color: "#f8fafc", fontSize: "1.1rem", fontWeight: 600, margin: "0 0 4px 0" }}>Weekly Activity</h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>Consistency over the last 7 days</p>
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#22c55e" }}>85%</div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "12px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {[40, 65, 30, 85, 100, 75, 90].map((height, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1, type: "spring", stiffness: 50 }}
                      style={{ 
                        width: "100%", background: height === 100 ? "linear-gradient(180deg, #38bdf8, #2563eb)" : "rgba(255,255,255,0.1)", 
                        borderRadius: "8px 8px 4px 4px", position: "relative"
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day} style={{ flex: 1, textAlign: "center" }}>{day}</span>)}
              </div>
            </motion.div>

            {/* Content */}
            <div>
              <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: "99px", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Data-Driven Growth
              </div>
              <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                See your progress.<br />Stay on track.
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                Our beautiful, intuitive dashboards transform your raw habits into actionable insights. Identify your weak points, celebrate your streaks, and watch yourself improve over time.
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Weekly & Monthly heatmaps", "Completion rate analytics", "Predictive success scoring"].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#e2e8f0", fontSize: "1rem" }}>
                    <div style={{ color: "#38bdf8" }}><CheckCircle2 size={18} /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA (Replacing Top Image) ================= */}
        <section style={{ padding: "5rem 2rem 8rem" }}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ 
              maxWidth: "1000px", margin: "0 auto", borderRadius: "32px",
              background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(2,6,23,0.8) 100%)",
              border: "1px solid rgba(56,189,248,0.2)", position: "relative", overflow: "hidden",
              padding: "5rem 3rem", textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.05)"
            }}
          >
            {/* Background flourish */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: "200px", background: "radial-gradient(ellipse at top, rgba(56,189,248,0.2), transparent 70%)", pointerEvents: "none" }} />
            
            <h2 style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", marginBottom: "1.2rem", letterSpacing: "-0.02em" }}>
              Ready to level up your life?
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.2rem", maxWidth: "500px", margin: "0 auto 3rem", lineHeight: 1.6 }}>
              Join thousands of others who are building better routines and taking control of their days.
            </p>
            <button className="lp-cta-btn" style={{ padding: "1.2rem 3.5rem", fontSize: "1.1rem" }} onClick={() => navigate("/signup")}>
              <span>Get Started Now</span>
            </button>
          </motion.div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#020617", padding: "4rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "3rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <CheckCircle2 color="#38bdf8" size={20} />
                <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.1rem" }}>Habit Tracker</h3>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "280px" }}>
                The simple, powerful, and intelligent way to build routines that last.
              </p>
            </div>
            <div>
              <h4 style={{ color: "#e2e8f0", marginBottom: "1rem", fontWeight: 600 }}>Connect</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <a href="https://github.com/KaushalMikaelson" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#38bdf8"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>GitHub</a>
                <a href="https://www.linkedin.com/in/kaushal-kumar-370293281" target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#38bdf8"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>LinkedIn</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: "#e2e8f0", marginBottom: "1rem", fontWeight: 600 }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <Link to="/privacy" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}>Privacy Policy</Link>
                <Link to="/terms" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}>Terms of Service</Link>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "1200px", margin: "3rem auto 0", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "#475569", fontSize: "0.85rem" }}>
            © {new Date().getFullYear()} Habit Tracker. All rights reserved.
          </div>
        </footer>
      </div>
    </AuthLayout>
  );
}
