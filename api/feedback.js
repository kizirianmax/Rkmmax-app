// api/feedback.js

// CORS headers
function applyCORS(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (applyCORS(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { type, feedback, email, url, userAgent, timestamp, viewport, language } = body;

    if (!feedback || !type) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    // Create GitHub issue if token is configured
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || "kizirianmax/Rkmmax-app";

    if (githubToken) {
      const issueTitle = `[${type.toUpperCase()}] ${feedback.substring(0, 80)}${feedback.length > 80 ? "..." : ""}`;
      
      const issueBody = `
## Tipo
${getTypeEmoji(type)} ${type}

## Descrição
${feedback}

## Contexto
- **URL:** ${url}
- **E-mail:** ${email || "Não fornecido"}
- **Data:** ${timestamp}
- **Viewport:** ${viewport}
- **Idioma:** ${language}
- **User Agent:** ${userAgent}

---
*Este issue foi criado automaticamente pelo sistema de feedback.*
      `.trim();

      const labels = [type === "bug" ? "bug" : type === "feature" ? "enhancement" : "question"];

      try {
        const response = await fetch(`https://api.github.com/repos/${githubRepo}/issues`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            title: issueTitle,
            body: issueBody,
            labels,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("GitHub API error:", errorData);
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const issue = await response.json();
        console.log("✅ GitHub issue created:", issue.html_url);

        return res.status(200).json({
          ok: true,
          message: "Feedback received and issue created",
          issueUrl: issue.html_url,
        });
      } catch (githubError) {
        console.error("Failed to create GitHub issue:", githubError);
        // Don't fail the request if GitHub is down
      }
    }

    // Fallback: just log the feedback
    console.log("📝 Feedback received:", { type, email, feedback: feedback.substring(0, 100) });

    return res.status(200).json({
      ok: true,
      message: "Feedback received",
    });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}

function getTypeEmoji(type) {
  const emojis = {
    bug: "🐛",
    feature: "💡",
    question: "❓",
    other: "💬",
  };
  return emojis[type] || "📝";
}

