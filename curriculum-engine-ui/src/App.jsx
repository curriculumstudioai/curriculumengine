
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import "./App.css";

function App() {
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

  // STEP 7 UPDATED generatePreview function
  async function generatePreview() {
    try {
      setCurriculumText("Generating curriculum from AI...");

      const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

      const response = await fetch(
          `${API_BASE_URL}/generate-curriculum`,
          {
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
          }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      setCurriculumText(data.curriculum);
    } catch (error) {
      setCurriculumText(
          "Error generating curriculum. Check your FastAPI backend, CORS settings, and API key."
      );
      console.error(error);
    }
  }




  function copyToClipboard() {
    navigator.clipboard.writeText(curriculumText);
    alert("Curriculum copied to clipboard.");
  }

  return (
      <div className="app">
        <header className="hero">
          <h1>Curriculum Studio</h1>
          <p>Create, Preview, Edit and Copy AI-Generated Curriculum Content.</p>
        </header>

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
              <ReactMarkdown>{curriculumText}</ReactMarkdown>
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

export default App;

//Commented Out 7/10/2026  LLewis
// import { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import "./App.css";
//
// import { useRef } from "react";
// import html2pdf from "html2pdf.js";
//
// function App() {
//   const [subject, setSubject] = useState("Python");
//   const [level, setLevel] = useState("Beginner");
//   const [weeks, setWeeks] = useState(2);
//   const [objective, setObjective] = useState(
//       "Students will explain what programming is and write simple Python print statements."
//   );
//
//   const [curriculumText, setCurriculumText] = useState("");
//
//   //STEP 7 UPDATED generatedPreview function
//   async function generatePreview() {
//     try {
//       setCurriculumText("Generating curriculum from AI...");
//
//       const API_BASE_URL =
//           import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
//
//       const response = await fetch(`${API_BASE_URL}/generate-curriculum`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           learning_objective: objective,
//           subject: subject,
//           course_level: level,
//           duration_weeks: Number(weeks),
//           organization_id: 1,
//         }),
//       });
//
//       const data = await response.json();
//
//       if (!response.ok) {
//         throw new Error(data.error || "Request failed.");
//       }
//
//       setCurriculumText(data.curriculum);
//     } catch (error) {
//       setCurriculumText("Error generating curriculum. Check your FastAPI backend, CORS settings, and API key.");
//       console.error(error);
//     }
//   }




  //FUNCTION REPLACED WITH NEWER FUNCTION ABOVE
  // //NEW generatePreview FUNCTION
  // async function generatePreview() {
  //   try {
  //     setCurriculumText("Generating curriculum from AI...");
  //
  //     const response = await fetch("http://localhost:3001/api/generate-curriculum", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         subject,
  //         level,
  //         weeks,
  //         objective,
  //       }),
  //     });
  //
  //     const data = await response.json();
  //
  //     if (!response.ok) {
  //       throw new Error(data.error || "Request failed.");
  //     }
  //
  //     setCurriculumText(data.curriculum);
  //   } catch (error) {
  //     setCurriculumText("Error generating curriculum. Check your backend server and API key.");
  //     console.error(error);
  //   }
  // }



//ORIGINAL FUNCTION WITH PRE-DEFINED TEXT
//   function generatePreview() {
//     const markdown = `
// # ${subject} Curriculum
//
// **Course Level:** ${level}
// **Duration:** ${weeks} weeks
//
// ## Learning Objective
// ${objective}
//
// ---
//
// ## Course Structure
//
// ### Module 1: Programming Foundations
// Students learn what programming is and how computers follow instructions.
//
// #### Lesson Plan: Introduction to Programming
// **Duration:** 90 minutes
//
// ### Activities
// 1. **Warm-Up Discussion** - What is a computer program?
// 2. **Code Demo** - Writing a simple print statement.
// 3. **Guided Practice** - Students write their first line of code.
// 4. **Independent Practice** - Students create three print statements.
// 5. **Exit Ticket** - Explain what a print statement does.
//
// ---
//
// ## Assessment
//
// ### Title
// Python Basics Check
//
// ### Instructions
// Students will answer short questions and write simple Python code.
//
// ### Points Possible
// 20 points
//
// ---
//
// ## Rubric
//
// | Category | Points | Description |
// |---|---:|---|
// | Understanding | 5 | Explains programming clearly |
// | Code Accuracy | 5 | Writes correct print statements |
// | Participation | 5 | Completes guided activities |
// | Reflection | 5 | Answers exit ticket clearly |
// `;
//
//     setCurriculumText(markdown);
//   }






//Replaced with new  code but works well 7/10/2026 Friday LLewis
//   function copyToClipboard() {
//     navigator.clipboard.writeText(curriculumText);
//     alert("Curriculum copied to clipboard.");
//   }
//
//   return (
//       <div className="app">
//         <header className="hero">
//           <h1>Curriculum Studio</h1>
//           <p>Create, Preview, Edit and Copy AI-Generated Curriculum Content.</p>
//         </header>
//
//         <main className="layout">
//           <section className="panel">
//             <h2>Generate Curriculum</h2>
//
//             <label>Subject</label>
//             <input value={subject} onChange={(e) => setSubject(e.target.value)}/>
//
//             <label>Course Level</label>
//             <select value={level} onChange={(e) => setLevel(e.target.value)}>
//               <option>Beginner</option>
//               <option>Intermediate</option>
//               <option>Advanced</option>
//             </select>
//
//             <label>Duration in Weeks</label>
//             <input
//                 type="number"
//                 value={weeks}
//                 onChange={(e) => setWeeks(e.target.value)}
//             />
//
//             <label>Learning Objective</label>
//             <textarea
//                 value={objective}
//                 onChange={(e) => setObjective(e.target.value)}
//             />
//
//             <button onClick={generatePreview}>Generate Preview</button>
//           </section>
//
//           <section className="panel">
//             <div className="previewHeader">
//               <h2>Markdown Editor</h2>
//               <button className="secondary" onClick={copyToClipboard}>
//                 Copy
//               </button>
//             </div>
//
//             <textarea
//                 className="markdownEditor"
//                 value={curriculumText}
//                 onChange={(e) => setCurriculumText(e.target.value)}
//                 placeholder="Generated curriculum will appear here..."
//             />
//           </section>
//
//           <section className="panel preview">
//             <h2>Teacher Preview</h2>
//             <ReactMarkdown>{curriculumText}</ReactMarkdown>
//           </section>
//         </main>
//         <footer className="footer">
//           <p>&copy; 2026 Curriculum Studio. All rights reserved. L.S.Lewis</p>
//         </footer>
//       </div>
//   );
// }
//
// export default App;




//First replacement 7/3/2026
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>
//
//       <div className="ticks"></div>
//
//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>
//
//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }
//
// export default App
