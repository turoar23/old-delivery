const { query } = require('express');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN_BOT;
const chat_id = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

const menu = {
    //reply_to_message_id: msg.message_id,
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [["Pedidos"], ["Historico (beta)", "Usuario (beta)"]]
    }
}
const menu_pedido = {
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [['Grupo-1'], ['Grupo-2'], ['Grupo-3'], ['Menu']]
    }
};

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = msg.chat.username; // the captured "whatever"
    bot.sendMessage(chatId, "Bienvenido al bot de reparto de Tepuy - Umbrella. Primero identificate\n ¿Como te llamas?", menu);
});

// Menu principal"
bot.onText(/Menu/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = msg.chat.username; // the captured "whatever"
    bot.sendMessage(chatId, "Menú principal", menu);
});

bot.onText(/Pedidos/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "¿Que grupo te vas a llevar?", menu_pedido);
});



exports.notification = function (msg) {
    bot.sendMessage(chat_id, msg, { parse_mode: 'Markdown' });
}

exports.bot = bot;