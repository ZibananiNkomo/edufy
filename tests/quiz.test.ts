import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreQuiz, isValidAnswer } from "../src/domain/quiz.ts";
import { questions, topics } from "../src/data/mathematics.ts";

test("all correct answers score 100 percent", () => {
  const answers = Object.fromEntries(
    questions.map((q) => [q.id, q.correctAnswer]),
  );
  assert.equal(scoreQuiz(questions, answers).percentage, 100);
  assert.equal(scoreQuiz(questions, answers).incorrect, 0);
});
test("mixed answers produce accurate counts, rounded score and retry set", () => {
  const batch = questions.slice(0, 3);
  const answers = {
    [batch[0].id]: batch[0].correctAnswer,
    [batch[1].id]: "0",
    [batch[2].id]: batch[2].correctAnswer,
  };
  const result = scoreQuiz(batch, answers);
  assert.equal(result.correct, 2);
  assert.equal(result.incorrect, 1);
  assert.equal(result.percentage, 67);
  assert.deepEqual(
    result.missed.map((q) => q.id),
    [batch[1].id],
  );
  assert.equal(
    scoreQuiz(result.missed, { [batch[1].id]: batch[1].correctAnswer })
      .percentage,
    100,
  );
});
test("unanswered and invalid answers cannot earn points", () => {
  assert.equal(scoreQuiz(questions, {}).correct, 0);
  assert.equal(scoreQuiz(questions, { n1: "invalid" }).correct, 0);
  assert.equal(isValidAnswer(questions[0], "invalid"), false);
  assert.equal(isValidAnswer(questions[0], "1"), true);
  assert.equal(scoreQuiz([], {}).percentage, 0);
});
test("content has unique IDs, supported topics and valid answer keys", () => {
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  for (const q of questions) {
    assert.ok(topics.some((t) => t.id === q.topic));
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.ok(isValidAnswer(q, q.correctAnswer));
    assert.ok(q.explanation.length > 20);
    assert.equal(q.curriculum, null);
  }
});
test("answer keys match independently calculated mathematical results", () => {
  const expected = [
    String(348 + 275),
    String(24 * 6),
    String(72 / 8 + 5),
    "6,000",
    "¾",
    "⅗",
    String(36 / 4),
    (2.75 + 1.5).toFixed(2),
    `${2 * (8 + 5)} cm`,
    `${7 * 7} cm²`,
    `${180 - 50 - 60}°`,
    "2,500 m",
  ];
  questions.forEach((q, i) =>
    assert.equal(
      q.options.find((o) => o.id === q.correctAnswer)?.text,
      expected[i],
    ),
  );
});
