const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export const contactConfigured = Boolean(serviceId && templateId && publicKey);

export async function sendContactEmail(email: string, message: string) {
  if (!contactConfigured) {
    throw new Error("Email delivery is not configured. Please try again later.");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: { email: email.trim(), message: message.trim() },
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(response.status === 429
        ? "Too many messages. Please wait a minute before trying again."
        : "Your message could not be sent. Please try again later.");
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Sending timed out. We could not confirm delivery. Please check before sending again.");
    }
    if (error instanceof TypeError) {
      throw new Error("Could not connect to the email service. Check your connection and try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
