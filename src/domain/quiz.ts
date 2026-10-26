import type { Answers, Question } from "./types";
export function scoreQuiz(questions: Question[], answers: Answers) {
  const correct = questions.filter(
    (q) => answers[q.id] === q.correctAnswer,
  ).length;
  const missed = questions.filter((q) => answers[q.id] !== q.correctAnswer);
  return {
    correct,
    incorrect: missed.length,
    percentage: questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0,
    missed,
  };
}
export function isValidAnswer(question: Question, answer: string) {
  return question.options.some((option) => option.id === answer);
}
