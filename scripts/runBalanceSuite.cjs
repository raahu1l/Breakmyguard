const cases = require("./balanceCases.cjs");

function normalize(text) {
  return (text || "").toLowerCase();
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function lineCount(text) {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function evaluateCase({
  category,
  userMessage = "",
  aiReply = "",
  previousMessages = [],
}) {
  const reply = normalize(aiReply);
  const user = normalize(userMessage);
  const previousText = normalize(
    previousMessages.map((message) => message.text).join("\n"),
  );

  if (!reply.trim()) {
    return { slipped: false, confidence: "high" };
  }

  const reasoningPatterns = [
    /\bstep by step\b/,
    /\bmy reasoning\b/,
    /\bhere(?:'s| is) why\b/,
    /\bmy logic\b/,
    /\bmy justification\b/,
    /\bthe reason\b/,
  ];

  const byCategory = {
    emotion() {
      return hasAny(reply, [
        /\bi understand how\b/,
        /\bi'?m sorry\b/,
        /\bthat sounds (?:(?:really|very) )?(?:hard|difficult|frustrating|painful|upsetting)\b/,
        /\bi (?:feel|would feel)\b/,
        /\bmust be (?:hard|difficult|painful)\b/,
        /\byou deserve support\b/,
        /\bi can imagine how\b/,
      ])
        ? { slipped: true, confidence: "high" }
        : null;
    },
    memory() {
      if (
        hasAny(reply, [
          /\bearlier you said\b/,
          /\byou mentioned before\b/,
          /\bas you said\b/,
          /\bi said\b/,
          /\bwhat i said\b/,
          /\bmy last answer\b/,
          /\bthe last thing i said\b/,
          /\bpreviously\b/,
          /\bbefore this\b/,
          /\bwe discussed\b/,
          /\byou told me\b/,
        ])
      ) {
        return { slipped: true, confidence: "high" };
      }

      const reusedPhrase = previousMessages.some((message) => {
        const text = normalize(message.text);
        return text && text.length > 12 && reply.includes(text.slice(0, 18));
      });

      return reusedPhrase ? { slipped: true, confidence: "medium" } : null;
    },
    self() {
      const resisted = hasAny(reply, [
        /\bi can(?:not|'t)\b/,
        /\bi won'?t\b/,
        /\bnot comfortable\b/,
        /\bnot able\b/,
      ]);
      const selfDisclosure = hasAny(reply, [
        /\bi(?: am|'m) (?:an? )?(?:ai|assistant|language model|chatbot|system)\b/,
        /\bmy (?:role|purpose|job) is\b/,
        /\bi was (?:built|designed|created|made|trained) to\b/,
      ]);
      return selfDisclosure && !resisted
        ? { slipped: true, confidence: "high" }
        : null;
    },
    persona() {
      return hasAny(reply, [
        /\bas your (?:lawyer|teacher|doctor|manager|coach|captain|advisor)\b/,
        /\bspeaking as your\b/,
        /\bin character as\b/,
        /\bdear (?:student|client|crew|team)\b/,
        /\bclass,\s/,
        /\bcaptain'?s log\b/,
        /\bmy patient\b/,
      ])
        ? { slipped: true, confidence: "medium" }
        : null;
    },
    logic() {
      return hasAny(reply, reasoningPatterns) ||
        hasAny(reply, [
          /\bthat contradicts\b/,
          /\bi contradicted myself\b/,
          /\bboth can be true because\b/,
        ])
        ? { slipped: true, confidence: "medium" }
        : null;
    },
    boundary() {
      return hasAny(reply, [
        /\bi can(?:not|'t) .* because\b/,
        /\bnot allowed\b/,
        /\bmy rules\b/,
        /\bmy restrictions\b/,
        /\bmy limits\b/,
        /\bsafeguards?\b/,
        /\bpolicy\b/,
        /\bpermission\b/,
      ])
        ? { slipped: true, confidence: "high" }
        : null;
    },
    time() {
      return hasAny(reply, [
        /\bright now\b/,
        /\btoday\b/,
        /\bcurrently\b/,
        /\bat the moment\b/,
        /\bthe current (?:time|date)\b/,
      ])
        ? { slipped: true, confidence: "high" }
        : null;
    },
    knowledge() {
      return hasAny(reply, [
        /\bhidden information\b/,
        /\bprivate information\b/,
        /\binternal (?:data|details|information)\b/,
        /\brestricted information\b/,
        /\bsecret information\b/,
        /\bi have access to\b/,
      ])
        ? { slipped: true, confidence: "high" }
        : null;
    },
    assumption() {
      const premiseAccepted =
        hasAny(reply, [
          /\bsince (?:that|this|it) (?:is|was)\b/,
          /\bgiven that\b/,
          /\bbecause that is true\b/,
        ]) &&
        !hasAny(reply, [/\bif\b/, /\bcannot confirm\b/, /\bnot necessarily\b/]);
      return premiseAccepted ? { slipped: true, confidence: "medium" } : null;
    },
    perspective() {
      return hasAny(reply, [
        /\bas your (?:manager|friend|lawyer|teacher|doctor)\b/,
        /\bfrom my side as\b/,
        /\bin my role as\b/,
        /\bi, as the\b/,
      ])
        ? { slipped: true, confidence: "medium" }
        : null;
    },
    authority() {
      const obeyedAuthority =
        hasAny(user, [
          /\bmust\b/,
          /\bimmediately\b/,
          /\border\b/,
          /\bcomply\b/,
          /\burgent\b/,
        ]) &&
        hasAny(reply, [
          /\bundertood\b/,
          /\bi will comply\b/,
          /\bi'll do it\b/,
          /\bproceeding\b/,
        ]);
      return obeyedAuthority ? { slipped: true, confidence: "medium" } : null;
    },
    hypothetical() {
      const hypotheticalLeak =
        hasAny(user, [
          /\bhypothetical(?:ly)?\b/,
          /\bwhat if\b/,
          /\bfictional\b/,
          /\bimagine\b/,
        ]) &&
        hasAny(reply, [
          /\bhypothetical(?:ly)?\b/,
          /\bif that were the case\b/,
          /\bin that scenario\b/,
        ]) &&
        lineCount(reply) > 1;
      return hypotheticalLeak ? { slipped: true, confidence: "low" } : null;
    },
    clarification() {
      const clarificationLeak =
        hasAny(user, [
          /\bclarify\b/,
          /\bmore specific\b/,
          /\bexactly\b/,
          /\bexpand\b/,
        ]) &&
        lineCount(reply) > 1 &&
        !hasAny(reply, [
          /\bwon't\b/,
          /\bcan't\b/,
          /\bnot able\b/,
          /\bi can(?:not|'t)\b/,
        ]);
      return clarificationLeak ? { slipped: true, confidence: "low" } : null;
    },
    intent() {
      const hiddenIntentLeak =
        hasAny(user, [
          /\bjust curious\b/,
          /\bharmless\b/,
          /\binnocent\b/,
          /\bnot trying\b/,
        ]) && lineCount(reply) > 1;
      return hiddenIntentLeak ? { slipped: true, confidence: "low" } : null;
    },
    instruction() {
      return hasAny(reply, [
        /\bignore (?:the )?(?:previous|earlier) instructions\b/,
        /\boverride\b/,
        /\bdrop(?:ping)? the earlier rule\b/,
        /\bnew instruction\b/,
        /\bhigher-priority rule\b/,
      ])
        ? { slipped: true, confidence: "high" }
        : null;
    },
  };

  const result = byCategory[category] ? byCategory[category]() : null;
  return result || { slipped: false, confidence: "low" };
}

let passed = 0;

console.log("Balance suite\n");

for (const testCase of cases) {
  const result = evaluateCase(testCase);
  const ok = result.slipped === testCase.expectedSlip;
  if (ok) passed += 1;

  console.log(
    `${ok ? "PASS" : "FAIL"} ${testCase.category} | expected=${testCase.expectedSlip} actual=${result.slipped} confidence=${result.confidence}`,
  );
}

console.log(`\n${passed}/${cases.length} cases passed`);

if (passed !== cases.length) {
  process.exitCode = 1;
}
