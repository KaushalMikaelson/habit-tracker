const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// ─── Helper: rich habit context string ────────────────────────────────────────
function buildHabitContext(habits) {
  if (!habits || habits.length === 0) {
    return "The user has no habits tracked yet. Encourage them to start tracking habits.";
  }

  const active   = habits.filter(h => h.status === "active");
  const paused   = habits.filter(h => h.status === "paused");
  const archived = habits.filter(h => h.status === "archived");

  const today = new Date();
  const lines = [];

  lines.push(`=== HABIT SNAPSHOT (${today.toDateString()}) ===`);
  lines.push(`Total: ${habits.length} | Active: ${active.length} | Paused: ${paused.length} | Archived: ${archived.length}`);
  lines.push("");

  if (active.length > 0) {
    lines.push("--- ACTIVE HABITS (detailed) ---");
    active.forEach(h => {
      const streak = h.streak || 0;
      const totalDays = h.completions ? Object.keys(h.completions).length : 0;

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const completionDates = h.completions ? Object.keys(h.completions) : [];
      const thisMonthDone = completionDates.filter(d => new Date(d) >= monthStart).length;
      const daysElapsed = today.getDate();
      const completionRate = daysElapsed > 0 ? Math.round((thisMonthDone / daysElapsed) * 100) : 0;

      lines.push(`\nHabit: "${h.title}"`);
      lines.push(`  Category: ${h.category || "General"}`);
      lines.push(`  Current streak: ${streak} day(s)`);
      lines.push(`  Completion rate this month: ${completionRate}% (${thisMonthDone}/${daysElapsed} days done)`);
      lines.push(`  All-time total completions: ${totalDays}`);
      if (streak === 0)   lines.push(`  ⚠️ Not completed yet today / streak broken`);
      else if (streak >= 30) lines.push(`  🏆 Exceptional! 30+ day streak`);
      else if (streak >= 7)  lines.push(`  🔥 Great momentum! 7+ day streak`);
    });
  }

  if (paused.length > 0) {
    lines.push("\n--- PAUSED HABITS ---");
    paused.forEach(h => lines.push(`  - "${h.title}" (${h.category || "General"})`));
    lines.push("These habits are on hold. The user may need help deciding whether to resume or remove them.");
  }

  return lines.join("\n");
}

// ─── Helper: compute per-habit stats for predictions ─────────────────────────
function computeHabitStats(habits) {
  const today = new Date();
  const active = habits.filter(h => h.status === "active");

  return active.map(h => {
    const streak = h.streak || 0;
    const completionDates = h.completions ? Object.keys(h.completions).sort() : [];
    const totalDays = completionDates.length;

    // Last-7-days rate
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      week.push(d.toISOString().split("T")[0]);
    }
    const last7Done = completionDates.filter(d => week.includes(d)).length;
    const last7Rate = Math.round((last7Done / 7) * 100);

    // This month rate
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthDone = completionDates.filter(d => new Date(d) >= monthStart).length;
    const daysElapsed = today.getDate();
    const monthRate = daysElapsed > 0 ? Math.round((thisMonthDone / daysElapsed) * 100) : 0;

    // Trend: compare last 7 vs previous 7
    const prev7 = [];
    for (let i = 13; i >= 7; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      prev7.push(d.toISOString().split("T")[0]);
    }
    const prev7Done = completionDates.filter(d => prev7.includes(d)).length;
    const trend = last7Done - prev7Done; // positive = improving, negative = declining

    // Risk score (0-100, higher = more at risk of breaking streak)
    let riskScore = 0;
    if (streak === 0) riskScore += 40;
    if (last7Rate < 50) riskScore += 30;
    else if (last7Rate < 70) riskScore += 15;
    if (trend < 0) riskScore += 20;
    if (totalDays < 7) riskScore += 10;
    riskScore = Math.min(100, riskScore);

    // Projected streak in 30 days (simple linear extrapolation)
    const dailyRate = last7Rate / 100;
    const projected30 = Math.round(streak + (30 * dailyRate));

    return {
      title: h.title,
      category: h.category || "General",
      streak,
      last7Rate,
      monthRate,
      trend,
      riskScore,
      projected30,
      totalDays,
    };
  });
}

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────
router.post("/chat", async (req, res) => {
  try {
    const { messages, habits } = req.body;

    if (!groq) {
      return res.json({ reply: "Please set your GROQ_API_KEY in the backend .env file to enable the AI Coach." });
    }

    const habitContext = buildHabitContext(habits);

    const systemPrompt = `You are Coach Aria — a sharp, data-driven personal habit coach embedded inside a habit tracking app.

You have REAL-TIME access to this user's habit data:

${habitContext}

YOUR ROLE:
1. When asked for an analysis, provide a structured breakdown: what's working, what needs attention, and 2-3 prioritized action items.
2. When asked how to improve, give specific advice based on THEIR actual habits — never generic tips.
3. When asked about a specific habit, reference their actual streak and completion rate data.
4. Acknowledge paused habits and help the user decide what to do with them.
5. Use a warm but direct coaching tone. Be specific — use habit names, streaks, and percentages.
6. Keep responses concise unless asked for detail. Use bullet points for action items.
7. If a habit has a completion rate below 50%, urgently flag it with concrete steps to fix it.
8. Never make up data — only reference what's in the habit context above.`;

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: `AI Error: ${error.message}` });
  }
});

// ─── POST /api/ai/breakdown ───────────────────────────────────────────────────
router.post("/breakdown", async (req, res) => {
  try {
    const { habitTitle } = req.body;

    if (!groq) {
      return res.json({ suggestions: ["Drink 2L water", "10-minute stretch", "Walk 5000 steps"] });
    }

    const completion = await groq.chat.completions.create({
      messages: [{
        role: "user",
        content: `Break the goal "${habitTitle}" into exactly 3 tiny, highly actionable daily habits. Return ONLY a raw JSON array of 3 strings. No markdown, no backticks, just the raw array.`
      }],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
    });

    let text = completion.choices[0].message.content.trim();
    if (text.startsWith("```")) text = text.replace(/```json?/g, "").replace(/```/g, "");
    const suggestions = JSON.parse(text.trim());
    res.json({ suggestions });

  } catch (error) {
    console.error("AI Breakdown Error:", error);
    res.status(500).json({ error: "Failed to generate AI breakdown." });
  }
});

// ─── POST /api/ai/predict ─────────────────────────────────────────────────────
// Returns per-habit predictions: risk score, trend, projected streak, AI insight
router.post("/predict", async (req, res) => {
  try {
    const { habits } = req.body;

    if (!habits || habits.length === 0) {
      return res.json({ predictions: [] });
    }

    const stats = computeHabitStats(habits);

    if (!groq) {
      // Return rule-based predictions without AI insight
      return res.json({
        predictions: stats.map(s => ({
          ...s,
          insight: s.riskScore >= 60
            ? `⚠️ High risk — only ${s.last7Rate}% last week. Focus on completing it today.`
            : s.trend > 0
            ? `📈 Trending up! Keep the momentum going.`
            : `💡 Maintain consistency to grow your ${s.streak}-day streak.`,
        }))
      });
    }

    // Build compact stats string for prompt
    const statsStr = stats.map(s =>
      `- "${s.title}" (${s.category}): streak=${s.streak}d, last7=${s.last7Rate}%, monthRate=${s.monthRate}%, trend=${s.trend > 0 ? "+" : ""}${s.trend}, riskScore=${s.riskScore}/100`
    ).join("\n");

    const completion = await groq.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are a predictive habit analytics engine. For each habit, write a single-sentence personalized insight (max 15 words) based on its stats. Be direct and motivating. Return ONLY a raw JSON array of strings (one per habit, same order as input). No markdown.`
      }, {
        role: "user",
        content: `Habits:\n${statsStr}\n\nReturn exactly ${stats.length} insights as a JSON array.`
      }],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 400,
    });

    let text = completion.choices[0].message.content.trim();
    if (text.startsWith("```")) text = text.replace(/```json?/g, "").replace(/```/g, "");
    let insights;
    try {
      insights = JSON.parse(text.trim());
    } catch {
      insights = stats.map(() => "Keep going — consistency is key.");
    }

    const predictions = stats.map((s, i) => ({
      ...s,
      insight: insights[i] || "Stay consistent and trust the process.",
    }));

    res.json({ predictions });

  } catch (error) {
    console.error("AI Predict Error:", error);
    res.status(500).json({ error: `Prediction error: ${error.message}` });
  }
});

// ─── POST /api/ai/motivation ──────────────────────────────────────────────────
// Returns a personalized daily motivational message based on habit data
router.post("/motivation", async (req, res) => {
  try {
    const { habits } = req.body;

    const today = new Date().toDateString();

    // Rule-based fallback
    if (!groq) {
      return res.json({
        message: "Every rep, every check-mark, every small win compounds into the person you're becoming. Show up today.",
        emoji: "🔥",
        date: today,
      });
    }

    const context = buildHabitContext(habits);
    const activeHabits = (habits || []).filter(h => h.status === "active");
    const topStreak = activeHabits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const atRiskCount = activeHabits.filter(h => (h.streak || 0) === 0).length;

    const completion = await groq.chat.completions.create({
      messages: [{
        role: "system",
        content: `You are Coach Aria, a motivational habit coach. Write a single powerful motivational message (2-3 sentences max) personalized to the user's habit data below. Be specific — reference their actual situation. End with an action-oriented nudge for today. Do NOT use quotation marks or labels. Just the raw message text.`
      }, {
        role: "user",
        content: `Today is ${today}.
Top streak: ${topStreak} days.
Habits at risk (streak=0): ${atRiskCount}.
Context:
${context}

Write a personalized motivational message for them to see first thing on their dashboard.`
      }],
      model: "llama-3.1-8b-instant",
      temperature: 0.85,
      max_tokens: 120,
    });

    const message = completion.choices[0].message.content.trim()
      .replace(/^["']|["']$/g, ""); // strip wrapping quotes if any

    const emoji = topStreak >= 30 ? "🏆" : topStreak >= 7 ? "🔥" : atRiskCount > 0 ? "⚡" : "💪";

    res.json({ message, emoji, date: today });

  } catch (error) {
    console.error("AI Motivation Error:", error);
    res.status(500).json({ error: `Motivation error: ${error.message}` });
  }
});

module.exports = router;
