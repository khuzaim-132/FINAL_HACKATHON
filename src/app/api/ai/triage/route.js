export async function POST(request) {
  try {
    const { title, description } = await request.json();

    const prompt = `Analyze this equipment issue report and provide structured output:
Title: ${title}
Description: ${description || "No details provided"}

Respond with JSON only (no markdown):
{
  "category": "electrical/mechanical/software/structural/other",
  "priority": "low/medium/high/critical",
  "possible_causes": ["cause1", "cause2"],
  "diagnostic_checks": ["check1", "check2"],
  "professional_title": "brief professional title"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      return Response.json({
        category: "other",
        priority: "medium",
        possible_causes: ["Unable to analyze automatically"],
        diagnostic_checks: ["Manual inspection required"],
        professional_title: title,
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return Response.json({
      category: result.category || "other",
      priority: result.priority || "medium",
      possible_causes: result.possible_causes || [],
      diagnostic_checks: result.diagnostic_checks || [],
      professional_title: result.professional_title || title,
    });
  } catch {
    return Response.json({
      category: "other",
      priority: "medium",
      possible_causes: ["Analysis unavailable"],
      diagnostic_checks: ["Manual inspection required"],
      professional_title: "Issue Report",
    });
  }
}
