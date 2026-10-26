import type { Question } from "../domain/types";

interface QuestionChoicesProps {
  question: Question;
  selected: string | undefined;
  onSelect: (answer: string) => void;
}

export function QuestionChoices({
  question,
  selected,
  onSelect,
}: QuestionChoicesProps) {
  return (
    <fieldset>
      <legend>{question.prompt}</legend>
      <div className="options">
        {question.options.map((option, index) => (
          <label
            className={`option ${selected === option.id ? "selected" : ""}`}
            key={option.id}
          >
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
            />
            <span className="option-letter">
              {String.fromCharCode(65 + index)}
            </span>
            <span>{option.text}</span>
            <span className="selection-dot" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
