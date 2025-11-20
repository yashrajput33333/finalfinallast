import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


export const generateSummary = async (goals) => {
  try {
    if (!goals || goals.length === 0) {
      return "No data available for summary.";
    }

    // Prepare structured input
    const avgSteps = Math.round(
      goals.reduce((sum, g) => sum + g.steps, 0) / goals.length
    );
    const avgSleep = (
      goals.reduce((sum, g) => sum + g.sleep, 0) / goals.length
    ).toFixed(1);
    const avgWater = Math.round(
      goals.reduce((sum, g) => sum + g.water, 0) / goals.length
    );

    const prompt = `
You are a health assistant AI. Based on the past ${goals.length} days of user data,
generate a positive, encouraging, and helpful weekly health summary.

DATA:
- Average steps per day: ${avgSteps}
- Average sleep (hours): ${avgSleep}
- Average water intake (glasses): ${avgWater}

Write a short summary in 5–7 sentences with emojis, motivation, and suggestions.
  `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text();
  } catch (error) {
    console.error("AI Summary Error:", error.message);
    return "Unable to generate AI summary at the moment.";
  }
};


export const generateHealthInsight = async (goal) => {
  try {
    if (!goal) {
      return "No data available.";
    }

    const prompt = `
You are a personal health assistant. Generate a short insight 
(3–4 sentences with emojis) based on the user's daily health metrics.

Today's Data:
- Steps: ${goal.steps}
- Sleep: ${goal.sleep}
- Water intake: ${goal.water}
- Notes: ${goal.notes || "No notes"}

Give helpful, simple advice.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text();
  } catch (error) {
    console.error("AI Insight Error:", error.message);
    return "Unable to generate health insight right now.";
  }
};
