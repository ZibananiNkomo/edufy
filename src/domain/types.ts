export interface Question {
  id: string;
  country: string;
  curriculum: string | null;
  grade: number;
  subject: string;
  topic: string;
  learningObjective: string;
  type: "multiple-choice";
  difficulty: "foundation" | "developing" | "challenge";
  prompt: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  reviewStatus: "example-verified";
}
export type Answers = Record<string, string>;
export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
