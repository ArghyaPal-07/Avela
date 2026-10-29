import assert from "node:assert/strict";
import test from "node:test";

test("EmailJS contact transport", async (t) => {
  const keys = ["NEXT_PUBLIC_EMAILJS_SERVICE_ID", "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"];
  const previous = keys.map((key) => process.env[key]);
  keys.forEach((key, index) => { process.env[key] = ["service_test", "template_test", "public_test"][index]; });
  try {
    const { sendContactEmail } = await import("../lib/contact");
    await t.test("submits only the entered email and message with public configuration", async (t) => {
      const send = t.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
        assert.equal(url, "https://api.emailjs.com/api/v1.0/email/send");
        assert.equal(options.method, "POST");
        assert.deepEqual(JSON.parse(options.body as string), {
          service_id: "service_test", template_id: "template_test", user_id: "public_test",
          template_params: { email: "visitor@example.com", message: "A contact form message." },
        });
        return new Response("OK", { status: 200 });
      });
      await sendContactEmail(" visitor@example.com ", " A contact form message. ");
      assert.equal(send.mock.callCount(), 1);
    });
    await t.test("does not report success on a rejected request", async (t) => {
      t.mock.method(globalThis, "fetch", async () => new Response("Service unavailable", { status: 503 }));
      await assert.rejects(sendContactEmail("visitor@example.com", "A message."), /could not be sent/);
    });
    await t.test("explains service throttling", async (t) => {
      t.mock.method(globalThis, "fetch", async () => new Response("Rate limited", { status: 429 }));
      await assert.rejects(sendContactEmail("visitor@example.com", "A message."), /wait a minute/);
    });
    await t.test("explains network failure", async (t) => {
      t.mock.method(globalThis, "fetch", async () => { throw new TypeError("Failed to fetch"); });
      await assert.rejects(sendContactEmail("visitor@example.com", "A message."), /Check your connection/);
    });
    await t.test("times out without claiming delivery", async (t) => {
      t.mock.timers.enable({ apis: ["setTimeout"] });
      t.mock.method(globalThis, "fetch", async (_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
        options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      }));
      const pending = sendContactEmail("visitor@example.com", "A message.");
      const rejection = assert.rejects(pending, /could not confirm delivery/);
      t.mock.timers.tick(20000);
      await rejection;
    });
  } finally {
    keys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key];
      else process.env[key] = previous[index];
    });
  }
});
