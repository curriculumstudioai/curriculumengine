import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate-curriculum", async (req, res) => {
    try {
        const { subject, level, weeks, objective } = req.body;

        const response = await client.responses.create({
            model: "gpt-5.5",
            input: `
Create a teacher-ready curriculum in Markdown.

Subject: ${subject}
Level: ${level}
Duration: ${weeks} weeks
Learning Objective: ${objective}

Include:
# Course Title
## Course Overview
## Learning Objective
## Weekly Modules
## Daily Lesson Plan
## Activities
## Assessment
## Rubric table

Return Markdown only.
      `,
        });

        res.json({ curriculum: response.output_text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI curriculum generation failed." });
    }
});

app.listen(3001, () => {
    console.log("AI backend running at http://localhost:3001");
});
