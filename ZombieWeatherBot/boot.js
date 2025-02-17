const axios = require("axios");
const { Telegraf } = require("telegraf");

const TOKEN = "7577004507:AAHCi8MabqSwQBJWU00mEmLy_WUu95G9LDA";
const bot = new Telegraf(TOKEN);

console.log("Bot is starting...");

// Handle /start command
bot.start((ctx) => {
  console.log("Received /start from:", ctx.from.username || ctx.from.first_name);
  ctx.reply("Hello, I'm a weather bot! 🌤\nSend me a city name to get the weather.");
});

// Weather API URL
const API_URL = "http://api.weatherstack.com/current?access_key=e0a41d129fefcb15e48140f650d3bdb0&query=";

// Function to fetch weather data
const fetchData = async (cityName) => {
  try {
    const res = await axios.get(`${API_URL}${cityName}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Handle text messages (user sends city names)
bot.on("text", async (ctx) => {
  console.log("Received message:", ctx.message.text);

  const data = await fetchData(ctx.message.text);  // Fetch weather data

  if (!data || data.success === false || !data.location) {
    ctx.reply("❌ Enter a valid city name.");
    return;
  }

  const { current, location } = data;
  const weatherStatus = current.weather_descriptions?.[0] || "Unknown";

  const weatherEmoji =
    weatherStatus.toLowerCase().includes("clear") ? "☀️" :
    weatherStatus.toLowerCase().includes("sunny") ? "☀️" :
    weatherStatus.toLowerCase().includes("cloud") ? "☁️" :
    weatherStatus.toLowerCase().includes("overcast") ? "☁️" :
    weatherStatus.toLowerCase().includes("rain") ? "🌧" :
    weatherStatus.toLowerCase().includes("snow") ? "❄️" : "🌍";

  ctx.reply(
    `🌆 City: ${location.name}, ${location.country}\n` +
    `🌡 Temperature: ${current.temperature}°C\n` +
    `❓ Weather status: ${weatherEmoji} ${weatherStatus}`
  );
});

// Launch the bot with error handling
bot.launch()
  .then(() => console.log("Bot is running..."))
  .catch(err => console.error("Failed to start bot:", err));
