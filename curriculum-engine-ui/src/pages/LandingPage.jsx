import { Link } from "react-router-dom";
import "../styles/landing-page.css";

function LandingPage() {
    return (
        <>
            <header className="site-header">
                <div className="container header-content">
                    <a href="#home" className="logo">
                        Curriculum <span>Studio</span>
                    </a>

                    <nav aria-label="Main navigation">
                        <ul className="nav-list">
                            <li>
                                <a href="#features">Features</a>
                            </li>
                            <li>
                                <a href="#how-it-works">How It Works</a>
                            </li>
                            <li>
                                <a href="#beta">Beta Access</a>
                            </li>
                        </ul>
                    </nav>

                    <a href="#beta" className="button button-small">
                        Join the Beta
                    </a>
                </div>
            </header>

            <main>
                <section className="hero" id="home">
                    <div className="container hero-content">
                        <p className="section-label">
                            AI-Assisted Curriculum Development
                        </p>

                        <h1>
                            Turn Learning Objectives into Curriculum Plans in Minutes
                        </h1>

                        <p className="hero-description">
                            Curriculum Studio helps instructors generate
                            structured, editable curriculum plans, lessons,
                            assessments, and rubrics without starting from a
                            blank page.
                        </p>

                        <div className="hero-buttons">
                            <Link to="/generate" className="button">
                                Try Curriculum Studio
                            </Link>

                            {/*<a href="/generate" className="button">*/}
                            {/*     Try Curriculum Studio*/}
                            {/*</a>*/}

                            <a href="#beta" className="button button-secondary">
                                Join the Beta
                            </a>
                        </div>

                        <p className="small-text">
                            Create a structured starting point and customize
                            every section for your learners.
                        </p>
                    </div>
                </section>

                <section className="section" id="features">
                    <div className="container">
                        <div className="section-heading">
                            <p className="section-label">Core Features</p>

                            <h2>
                                Everything you need to begin building a course
                            </h2>

                            <p>
                                Generate the major parts of your curriculum in
                                one organized workspace.
                            </p>
                        </div>

                        <div className="card-grid">
                            <article className="feature-card">
                                <h3>Curriculum Plans</h3>
                                <p>
                                    Create organized multi-week course plans
                                    based on your learning objectives.
                                </p>
                            </article>

                            <article className="feature-card">
                                <h3>Lesson Plans</h3>
                                <p>
                                    Generate daily lessons, activities,
                                    materials, and instructor notes.
                                </p>
                            </article>

                            <article className="feature-card">
                                <h3>Assessments</h3>
                                <p>
                                    Develop quizzes, projects, discussions, and
                                    other learning assessments.
                                </p>
                            </article>

                            <article className="feature-card">
                                <h3>Rubrics</h3>
                                <p>
                                    Create clear grading criteria aligned with
                                    your course objectives.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section
                    className="section alternate-section"
                    id="how-it-works"
                >
                    <div className="container">
                        <div className="section-heading">
                            <p className="section-label">How It Works</p>

                            <h2>Build your curriculum in three steps</h2>
                        </div>

                        <div className="steps-grid">
                            <article className="step">
                                <span className="step-number">1</span>
                                <h3>Enter an Objective</h3>
                                <p>
                                    Describe what students should know or be
                                    able to accomplish.
                                </p>
                            </article>

                            <article className="step">
                                <span className="step-number">2</span>
                                <h3>Generate the Curriculum</h3>
                                <p>
                                    Curriculum Studio creates a structured
                                    curriculum draft.
                                </p>
                            </article>

                            <article className="step">
                                <span className="step-number">3</span>
                                <h3>Edit and Preview</h3>
                                <p>
                                    Review, revise, and customize the generated
                                    content.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="beta-section" id="beta">
                    <div className="container beta-content">
                        <div>
                            <p className="section-label">Early Access</p>

                            <h2>Help shape Curriculum Studio</h2>

                            <p>
                                Join the beta program to receive product
                                updates, early access, and opportunities to
                                provide feedback.
                            </p>
                        </div>

                        <form className="signup-form">
                            <label htmlFor="email">Email address</label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />

                            <button type="submit" className="button">
                                Join the Beta
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="container footer-content">
                    <p>
                        © 2026 Curriculum Studio. All rights reserved.
                    </p>

                    <div className="footer-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#beta">Beta Access</a>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default LandingPage;