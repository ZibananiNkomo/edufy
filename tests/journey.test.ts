import { test } from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import { App } from "../src/App.tsx";

test("learner completes a topic, reviews mistakes, retries and explores all topics", async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  dom.window.scrollTo = () => {};
  dom.window.confirm = () => false;
  const container = document.getElementById("root")!;
  const root = createRoot(container);
  const click = async (text: string) => {
    const button = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes(text),
    );
    assert.ok(button, `Missing button: ${text}`);
    await act(async () => button.click());
  };
  const choose = async (position: number) => {
    const radio =
      container.querySelectorAll<HTMLInputElement>("input[type=radio]")[
        position
      ];
    assert.ok(radio);
    await act(async () => radio.click());
  };
  try {
    await act(async () => root.render(React.createElement(App)));
    await click("start learning");
    await click("Mathematics");
    await click("Numbers & operations");
    assert.equal(
      container.querySelector<HTMLButtonElement>(".quiz-actions button")
        ?.disabled,
      true,
    );
    await click("All topics");
    assert.ok(
      container.querySelector("fieldset"),
      "Declining leave must keep quiz open",
    );
    for (const answer of [1, 0, 1, 2]) {
      await choose(answer);
      await click(
        container.textContent?.includes("See my results")
          ? "See my results"
          : "Next question",
      );
    }
    assert.equal(
      container.querySelector(".score-circle strong")?.textContent,
      "75%",
    );
    await click("Review answers");
    assert.equal(container.querySelectorAll(".review-card").length, 4);
    assert.equal(container.querySelectorAll(".incorrect").length, 1);
    assert.ok(container.textContent?.includes("144 pencils"));
    await click("Retry mistakes");
    assert.ok(container.textContent?.includes("QUESTION 1 OF 1"));
    assert.equal(container.querySelector("input:checked"), null);
    await choose(1);
    await click("See my results");
    assert.equal(
      container.querySelector(".score-circle strong")?.textContent,
      "100%",
    );
    await click("Review answers");
    assert.ok(
      !Array.from(container.querySelectorAll("button")).some((b) =>
        b.textContent?.includes("Retry mistakes"),
      ),
    );
    await click("Back to topics");
    for (const topic of ["Fractions & decimals", "Shape & measurement"]) {
      await click(topic);
      assert.ok(container.textContent?.includes("QUESTION 1 OF 4"));
      dom.window.confirm = () => true;
      await click("All topics");
    }
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }
});
