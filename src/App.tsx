import { QuestionChoices } from "./components/QuestionChoices";
import React, { useEffect, useRef, useState } from "react";
import { questions, topics } from "./data/mathematics";
import { isValidAnswer, scoreQuiz } from "./domain/quiz";
import type { Answers, Question } from "./domain/types";

type Screen = "home" | "subjects" | "topics" | "quiz" | "results" | "review";
export function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [active, setActive] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [topicName, setTopicName] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo(0, 0);
  }, [screen, index]);
  const result = scoreQuiz(active, answers);
  const current = active[index];
  function start(items: Question[], name: string) {
    setActive(items);
    setAnswers({});
    setIndex(0);
    setTopicName(name);
    setScreen("quiz");
  }
  function navigate(next: Screen) {
    if (
      screen === "quiz" &&
      !window.confirm("Leave this practice? Your current answers will be lost.")
    )
      return;
    setScreen(next);
  }
  const title =
    screen === "home"
      ? "Small steps.\nBrighter futures."
      : screen === "subjects"
        ? "What will you learn today?"
        : screen === "topics"
          ? "Find your next little win."
          : screen === "quiz"
            ? topicName
            : screen === "results"
              ? "Every step is progress."
              : "Let’s learn from the tricky ones.";
  return (
    <>
      <header className="header">
        <a
          href="#home"
          className="brand"
          aria-label="Edufy home"
          onClick={(e) => {
            e.preventDefault();
            navigate("home");
          }}
        >
          <span className="brand-mark">
            e<span>✦</span>
          </span>
          edufy<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={screen === "home" ? "nav-active" : ""}
            onClick={() => navigate("home")}
          >
            Home
          </button>
          <button
            className={screen !== "home" ? "nav-active" : ""}
            onClick={() => navigate("subjects")}
          >
            Learn <span aria-hidden="true">↗</span>
          </button>
        </nav>
        <span className="header-tag">A brighter way to learn</span>
      </header>
      <main>
        {screen === "home" ? (
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="live-dot" /> BIG POSSIBILITIES START HERE
              </p>
              <h1 ref={heading} tabIndex={-1}>
                Small steps.
                <br />
                <em>Brighter futures.</em>
              </h1>
              <p className="intro">
                A little practice today. A lot more confidence tomorrow. Make
                learning your own with bite-sized Grade 7 revision.
              </p>
              <button
                className="button primary"
                onClick={() => setScreen("subjects")}
              >
                Let’s start learning <span>↗</span>
              </button>
              <div className="hero-note">
                <span className="mini-check">✓</span> Free to explore{" "}
                <span className="separator">·</span> No sign-up needed
              </div>
            </div>
            <div
              className="hero-art"
              aria-label="A playful illustration of learning and progress"
              role="img"
            >
              <div className="art-orbit" />
              <span className="art-spark">✳</span>
              <div className="floating-label">
                A little better, every day <span>↗</span>
              </div>
              <div className="math-card">
                <span className="math-caption">YOUR POTENTIAL?</span>
                <strong>
                  Limitless<span>✦</span>
                </strong>
                <div className="math-line" />
                <span>Curiosity + practice = progress</span>
              </div>
              <div className="stairs">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="sun">☺</div>
              <div className="fraction">
                ½ <span>+</span> ¼ <span>=</span> ¾
              </div>
              <div className="art-bottom">Made for curious minds.</div>
            </div>
          </section>
        ) : (
          <section className="page-heading">
            <button
              className="back"
              onClick={() =>
                navigate(
                  screen === "subjects"
                    ? "home"
                    : screen === "topics"
                      ? "subjects"
                      : screen === "review"
                        ? "results"
                        : "topics",
                )
              }
            >
              ←{" "}
              {screen === "review"
                ? "Back to results"
                : screen === "subjects"
                  ? "Home"
                  : screen === "topics"
                    ? "All subjects"
                    : "All topics"}
            </button>
            <p className="eyebrow">
              GRADE 7 <span className="separator">/</span>{" "}
              {screen === "subjects" ? "YOUR LEARNING SPACE" : "MATHEMATICS"}
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {title}
            </h1>
            <p className="subheading">
              {screen === "subjects"
                ? "Pick a subject. Bring your curiosity. We’ll take it one step at a time."
                : screen === "topics"
                  ? "Choose a topic for a short, focused practice session."
                  : screen === "quiz"
                    ? "Take your time. You’ve got this."
                    : screen === "results"
                      ? "Here’s how your practice went. Keep building on what you know."
                      : "A mistake is a useful place to start. Read the explanation, then try again."}
            </p>
          </section>
        )}
        {screen === "home" && (
          <section className="home-bottom">
            <div>
              <p className="eyebrow">YOUR NEXT CHAPTER</p>
              <h2>Confidence starts with practice.</h2>
            </div>
            <div className="benefit">
              <span>01</span>
              <div>
                <h3>Learn at your pace</h3>
                <p>Short sessions. Room to think.</p>
              </div>
            </div>
            <div className="benefit">
              <span>02</span>
              <div>
                <h3>Understand the why</h3>
                <p>Helpful explanations, every time.</p>
              </div>
            </div>
          </section>
        )}
        {screen === "subjects" && (
          <section className="subject-grid" aria-label="Subjects">
            <button
              className="subject-card"
              onClick={() => setScreen("topics")}
            >
              <span className="subject-symbol">÷</span>
              <span className="pill">READY TO EXPLORE</span>
              <h2>Mathematics</h2>
              <p>A little number sense. A world of possibilities.</p>
              <div className="card-bottom">
                <span>3 topics · 12 questions</span>
                <span className="round-arrow">↗</span>
              </div>
            </button>
            <div className="coming-card">
              <span>✦</span>
              <h2>More to discover</h2>
              <p>
                Our learning library is just getting started. More subjects will
                follow.
              </p>
              <span className="pill neutral">COMING LATER</span>
            </div>
          </section>
        )}
        {screen === "topics" && (
          <section className="topic-grid" aria-label="Mathematics topics">
            {topics.map((topic) => (
              <button
                className="topic-card"
                key={topic.id}
                onClick={() =>
                  start(
                    questions.filter((q) => q.topic === topic.id),
                    topic.name,
                  )
                }
              >
                <span className={`topic-icon ${topic.color}`}>
                  {topic.icon}
                </span>
                <h2>{topic.name}</h2>
                <p>{topic.description}</p>
                <div className="card-bottom">
                  <span>4 questions · Untimed</span>
                  <span className="round-arrow">↗</span>
                </div>
              </button>
            ))}
          </section>
        )}
        {screen === "quiz" && current && (
          <section className="quiz-layout">
            <div className="quiz-card">
              <div className="question-meta">
                <span>
                  QUESTION {index + 1} OF {active.length}
                </span>
                <span>
                  {Math.round((index / active.length) * 100)}% complete
                </span>
              </div>
              <progress
                max={active.length}
                value={index}
                aria-label="Quiz progress"
              />
              <QuestionChoices
                question={current}
                selected={answers[current.id]}
                onSelect={(answer) => {
                  if (isValidAnswer(current, answer))
                    setAnswers((prev) => ({ ...prev, [current.id]: answer }));
                }}
              />
              <div className="quiz-actions">
                <span>Select one answer</span>
                <button
                  className="button primary"
                  disabled={answers[current.id] === undefined}
                  onClick={() =>
                    index + 1 < active.length
                      ? setIndex(index + 1)
                      : setScreen("results")
                  }
                >
                  {index + 1 === active.length
                    ? "See my results"
                    : "Next question"}{" "}
                  <span>→</span>
                </button>
              </div>
            </div>
            <aside className="encouragement">
              <span>✦</span>
              <h2>Give yourself room to think.</h2>
              <p>
                There’s no timer here. Read each question carefully and choose
                the answer that feels right.
              </p>
              <div>One question at a time.</div>
            </aside>
          </section>
        )}
        {screen === "results" && (
          <section className="results-card">
            <div className="score-circle">
              <strong>
                {result.percentage}
                <small>%</small>
              </strong>
              <span>YOUR SCORE</span>
            </div>
            <div className="result-copy">
              <span className="pill">PRACTICE COMPLETE ✓</span>
              <h2>
                {result.percentage === 100
                  ? "You’ve got this!"
                  : result.percentage >= 50
                    ? "You’re building momentum."
                    : "A good place to grow."}
              </h2>
              <p>
                {result.percentage === 100
                  ? "You answered every question correctly. Try another topic to keep growing."
                  : "Every question helps you learn. Review your answers and give the tricky ones another go."}
              </p>
              <div className="stats">
                <div>
                  <strong>{result.correct}</strong>
                  <span>Correct</span>
                </div>
                <div>
                  <strong>{result.incorrect}</strong>
                  <span>Incorrect</span>
                </div>
                <div>
                  <strong>{active.length}</strong>
                  <span>Questions</span>
                </div>
              </div>
              <div className="result-actions">
                <button
                  className="button primary"
                  onClick={() => setScreen("review")}
                >
                  Review answers →
                </button>
                <button
                  className="button secondary"
                  onClick={() => setScreen("topics")}
                >
                  Explore topics
                </button>
              </div>
            </div>
          </section>
        )}
        {screen === "review" && (
          <section className="review-section">
            <div className="review-summary">
              <span>
                {result.incorrect
                  ? `${result.incorrect} questions to revisit`
                  : "All answers correct — nicely done!"}
              </span>
              {result.incorrect > 0 && (
                <button
                  className="button primary"
                  onClick={() => start(result.missed, `${topicName} · Retry`)}
                >
                  Retry mistakes ↗
                </button>
              )}
            </div>
            {active.map((q, i) => {
              const correct = answers[q.id] === q.correctAnswer;
              return (
                <article className="review-card" key={q.id}>
                  <div className="review-status">
                    <span className={correct ? "correct" : "incorrect"}>
                      {correct ? "✓ Correct" : "↻ Needs another look"}
                    </span>
                    <span>QUESTION {i + 1}</span>
                  </div>
                  <h2>{q.prompt}</h2>
                  {!correct && (
                    <p className="your-answer">
                      Your answer:{" "}
                      {q.options.find((o) => o.id === answers[q.id])?.text ??
                        "Not answered"}
                    </p>
                  )}
                  <p className="correct-answer">
                    ✓ Correct answer:{" "}
                    {q.options.find((o) => o.id === q.correctAnswer)?.text}
                  </p>
                  <div className="explanation">
                    <strong>Let’s work it out</strong>
                    <p>{q.explanation}</p>
                  </div>
                </article>
              );
            })}
            <button
              className="button secondary"
              onClick={() => setScreen("topics")}
            >
              Back to topics →
            </button>
          </section>
        )}
        <div className="content-note">
          <span>ⓘ</span> Example practice questions for Grade 7 learners.
          Curriculum alignment has not been verified.
        </div>
      </main>
      <footer>
        <a
          className="footer-brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigate("home");
          }}
        >
          edufy.
        </a>
        <span>Rooted in Zimbabwe. Growing with you.</span>
        <span>
          Learn a little. Grow a lot. <span className="footer-star">✦</span>
        </span>
      </footer>
    </>
  );
}
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="error">
        <h1>Let’s start fresh.</h1>
        <p>Something interrupted this session. Reload to start again.</p>
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          Reload Edufy
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
