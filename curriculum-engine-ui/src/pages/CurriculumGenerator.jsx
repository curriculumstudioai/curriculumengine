
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";
import { Link } from "react-router-dom";
import logo from "../assets/curriculum-studio-logo.png";
import "../App.css";

function CurriculumGenerator() {
    const [subject, setSubject] = useState("Python");
    const [level, setLevel] = useState("Beginner");
    const [weeks, setWeeks] = useState(2);

    const [objective, setObjective] = useState(
        "Students will explain what programming is and write simple Python print statements."
    );

    const [curriculumText, setCurriculumText] = useState("");

    // Reference to the formatted curriculum preview
    const curriculumRef = useRef(null);

    // Download the curriculum preview as a PDF
    const downloadPDF = () => {
        if (!curriculumRef.current) {
            return;
        }

        const options = {
            margin: 0.5,
            filename: "curriculum.pdf",
            image: {
                type: "jpeg",
                quality: 0.98,
            },
            html2canvas: {
                scale: 2,
            },
            jsPDF: {
                unit: "in",
                format: "letter",
                orientation: "portrait",
            },
        };

        html2pdf()
            .set(options)
            .from(curriculumRef.current)
            .save();
    };

    //*********NEW UPDATE -- REPLACED WITH NEW FUNCTION TO HANDLE INITIAL REQUEST TIMEOUT ERROR 7/12/2026 L.S.LEWIS

    // Generate the curriculum preview and retry once if the first request fails
    async function generatePreview() {
        try {
            setCurriculumText("Generating curriculum from AI...");

            const API_BASE_URL =
                import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    learning_objective: objective,
                    subject: subject,
                    course_level: level,
                    duration_weeks: Number(weeks),
                    organization_id: 1,
                }),
            };

            // First request
            let response = await fetch(
                `${API_BASE_URL}/generate-curriculum`,
                requestOptions
            );

            // If the first request fails, wait 3 seconds and retry once
            if (!response.ok) {
                console.log("First request failed. Retrying in 3 seconds...");

                await new Promise((resolve) => setTimeout(resolve, 3000));

                response = await fetch(
                    `${API_BASE_URL}/generate-curriculum`,
                    requestOptions
                );
            }

            const data = await response.json();

            // If the second request also fails, display the error
            if (!response.ok) {
                throw new Error(data.error || "Request failed.");
            }

            setCurriculumText(data.curriculum);
        } catch (error) {
            setCurriculumText(
                "The curriculum service is temporarily unavailable. Please try again."
            );

            console.error("Curriculum generation error:", error);
        }
    }



    function copyToClipboard() {
        navigator.clipboard.writeText(curriculumText);
        alert("Curriculum copied to clipboard.");
    }

    return (
        <div className="app">
            <header className="hero">
                <Link to="/" aria-label="Return to Curriculum Studio home page">
                    <img
                        src={logo}
                        alt="Curriculum Studio logo"
                        className="logo"
                    />
                </Link>

                <p>
                    Create | Preview | Edit | Copy - AI-Generated Curriculum Content
                </p>
            </header>
            {/*<header className="hero">*/}
            {/*    <img*/}
            {/*        src={logo}*/}
            {/*        alt="Curriculum Studio logo"*/}
            {/*        className="logo"*/}
            {/*    />*/}
            {/*    <p>Create | Preview | Edit | Copy - AI-Generated Curriculum Content</p>*/}
            {/*</header>*/}

            <main className="layout">
                <section className="panel">
                    <h2>Generate Curriculum</h2>

                    <label>Subject</label>
                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <label>Course Level</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>

                    <label>Duration in Weeks</label>
                    <input
                        type="number"
                        value={weeks}
                        onChange={(e) => setWeeks(e.target.value)}
                    />

                    <label>Learning Objective</label>
                    <textarea
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                    />

                    <button onClick={generatePreview}>
                        Generate Preview
                    </button>

                    <div className="early-access-banner">
                        <p>
                            Support Curriculum Studio and receive early access
                            for $5 per month.
                        </p>

                        <a
                            href="https://buy.stripe.com/28E7sNdtogpmdey8aqfYY00"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="subscribe-button"
                        >
                            Subscribe for $5 per Month
                        </a>
                    </div>
                </section>

                <section className="panel">
                    <div className="previewHeader">
                        <h2>Markdown Editor</h2>

                        <button
                            className="secondary"
                            onClick={copyToClipboard}
                        >
                            Copy
                        </button>
                    </div>

                    <textarea
                        className="markdownEditor"
                        value={curriculumText}
                        onChange={(e) => setCurriculumText(e.target.value)}
                        placeholder="Generated curriculum will appear here..."
                    />
                </section>

                <section className="panel preview">
                    <div className="previewHeader">
                        <h2>Teacher Preview</h2>

                        <button
                            type="button"
                            className="secondary"
                            onClick={downloadPDF}
                            disabled={!curriculumText}
                        >
                            Download PDF
                        </button>
                    </div>

                    <div ref={curriculumRef} className="teacher-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {curriculumText}
                        </ReactMarkdown>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>
                    &copy; 2026 Curriculum Studio. All rights reserved. L.S. Lewis
                </p>
            </footer>
        </div>
    );
}

export default CurriculumGenerator;






