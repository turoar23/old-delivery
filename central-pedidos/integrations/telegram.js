const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN_BOT;
const chat_id = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});
exports.notification = function (msg) {
    bot.sendMessage(chat_id, msg, { parse_mode: 'Markdown' });
}
exports.bot = bot;