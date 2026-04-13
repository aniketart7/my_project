import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy",
});

router.post("/extract-health", async (req, res) => {
  try {
    const { imageBase64, testName, fields } = req.body as {
      imageBase64: string;
      testName: string;
      fields: Array<{ key: string; label: string; unit: string }>;
    };

    if (!imageBase64 || !testName || !fields) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const fieldDescriptions = fields
      .map((f) => `- ${f.label} (${f.unit || "no unit"}) → key: "${f.key}"`)
      .join("\n");

    const prompt = `You are a medical data extraction assistant helping pregnant women track their health test results.

Extract the following values from this medical report/lab result image for the test: "${testName}"

Fields to extract:
${fieldDescriptions}

Return a JSON object with exactly these keys. Use the exact key names shown.
If a value is not found or unclear, use an empty string "".
Only return the JSON object, no other text.

Example format: {"key1": "value1", "key2": "value2"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64.startsWith("data:")
                  ? imageBase64
                  : `data:image/jpeg;base64,${imageBase64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";

    let extracted: Record<string, string> = {};
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0]);
      }
    } catch {
      extracted = {};
    }

    res.json({ extracted, raw: content });
  } catch (err) {
    console.error("Extract health error:", err);
    res.status(500).json({ error: "Failed to extract data from image" });
  }
});

export default router;
