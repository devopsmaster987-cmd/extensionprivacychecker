import { afterEach, describe, expect, it } from "vitest";
import robots from "@/app/robots";

const originalAi = process.env.ALLOW_AI_CRAWLERS;
const originalAllowed = process.env.ALLOWED_CRAWLERS;

afterEach(() => {
  if (originalAi === undefined) delete process.env.ALLOW_AI_CRAWLERS;
  else process.env.ALLOW_AI_CRAWLERS = originalAi;

  if (originalAllowed === undefined) delete process.env.ALLOWED_CRAWLERS;
  else process.env.ALLOWED_CRAWLERS = originalAllowed;
});

function rulesFor(userAgent: string) {
  const rules = robots().rules;
  return (Array.isArray(rules) ? rules : [rules]).filter((rule) => rule.userAgent === userAgent);
}

describe("robots.txt", () => {
  it("allows AI crawlers by default", () => {
    delete process.env.ALLOW_AI_CRAWLERS;
    delete process.env.ALLOWED_CRAWLERS;
    expect(rulesFor("GPTBot")[0]?.allow).toBe("/");
  });

  it("disallows AI crawlers when disabled", () => {
    process.env.ALLOW_AI_CRAWLERS = "false";
    delete process.env.ALLOWED_CRAWLERS;
    expect(rulesFor("GPTBot")[0]?.disallow).toBe("/");
  });

  it("allows additional crawlers from the environment", () => {
    delete process.env.ALLOW_AI_CRAWLERS;
    process.env.ALLOWED_CRAWLERS = "ExampleBot, OtherBot";
    expect(rulesFor("ExampleBot")[0]?.allow).toBe("/");
    expect(rulesFor("OtherBot")[0]?.allow).toBe("/");
  });

  it("lets an explicit crawler override the AI disallow switch", () => {
    process.env.ALLOW_AI_CRAWLERS = "false";
    process.env.ALLOWED_CRAWLERS = "GPTBot";
    expect(rulesFor("GPTBot")).toHaveLength(1);
    expect(rulesFor("GPTBot")[0]?.allow).toBe("/");
  });
});
