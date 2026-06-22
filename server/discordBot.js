import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let channel = null;

client.once("ready", () => {
  console.log(`✅ Bot ready: ${client.user.tag}`);

  channel = client.channels.cache.get("1488267243635609811");
  console.log("✅ Channel found:", channel ? channel.name : "Not found");
});

client.login(process.env.DISCORD_TOKEN);

export const sendOrderNotification = (order) => {
  console.log("Preparing to send Discord notification for order:", order.orderId);

  if (!channel) return;

  channel.send(
    `<@&1488267660759138404>\n🍕 NEW ORDER!\n\n👤 ${order.delivery.first_name} ${order.delivery.last_name}\n📞 ${order.delivery.phone}\n💰 ${order.price}\n${order.items.map(item => `- ${item.name} (${item.quantity})`).join("\n")}`
  );
};