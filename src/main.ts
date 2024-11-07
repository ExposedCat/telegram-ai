import { TelegramClient } from "@mtcute/deno";
import ollama from "npm:ollama";

const tg = new TelegramClient({
  apiId: Number(Deno.env.get("API_ID")),
  apiHash: Deno.env.get("API_HASH")!,
  updates: {
    catchUp: false,
  },
});

tg.onError((error) => console.error("[CRITICAL] Error:", error));

tg.on("new_message", async (message) => {
  if (
    message.sender.id === Number(Deno.env.get("SENDER_ID")) &&
    !message.forward &&
    message.text
  ) {
    const match = message.text.match(/^!ai(-)?(\s|\d+)((?:.|\n)+)/);
    if (match) {
      await tg.editMessage({
        message,
        text: { text: `AI is generating message...` },
      });

      const sign = match.at(1) === "-" ? -1 : 1;
      const capturedAmount = Number(match.at(2));
      const prompt = match.at(3)!.trim();
      const startMessageId = message.replyToMessage?.id;

      let history: string[] = [];
      if (
        startMessageId !== undefined
      ) {
        const amount = capturedAmount
          ? capturedAmount > 10 ? 10 : capturedAmount
          : 1;

        const messageIds = startMessageId
          ? Array.from(
            { length: amount },
            (_, i) => startMessageId + i * sign,
          )
          : [];

        if (sign < 0) {
          messageIds.reverse();
        }

        const messages = startMessageId
          ? await tg.getMessages(message.chat.id, messageIds)
          : [];

        history = messages.filter(Boolean).map((message) =>
          `${message!.sender.firstName}: ${message!.text}`
        );
      }
      const response = await ollama.chat({
        model: "llama3.1",
        messages: [
          {
            role: "system",
            content:
              `You will be given the chat history and your task is to write a new message that follows request of the user.
            Don't write anything else. Don't use any special formatting. Don't talk and no yapping. Just write a message following the request and keep it short and in the tone and language of the dialog.
            User name is ${message.sender.firstName}, but don't write it in final message, only write the content for the message.`,
          },
          ...history.map((message) => ({
            role: "user",
            content: message,
          })),
          {
            role: "user",
            content: `Request: ${prompt}`,
          },
        ],
      });
      await tg.editMessage({
        message,
        text: { text: response.message.content },
      });
    }
  }
});

try {
  const self = await tg.start({
    phone: () => tg.input("Phone > "),
    code: () => tg.input("Code > "),
    password: () => tg.input("Password > "),
  });

  console.log(`Logged in as ${self.displayName}`);
} catch (error) {
  console.error("Failed to log in", error);
}
