// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token, guildId } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "add-role") {
    // Get roleId of already created role by:
    // 1. Enabling Developer Mode in Settings > Advanced > Developer Mode.
    // 2. Right click on a role. Click on Copy ID.
    let roleId = "968376470609227837";

    // Get role object from guild. Guild is another name for a discord server.
    var guild = client.guilds.cache.get(guildId);
    const role = await guild.roles.fetch(roleId);
    console.log("Rolename is", role.name);

    // Get ID from discord username
    const userId = client.users?.cache.find(
      (u) => u.tag === "xenowits#2679"
    )?.id;
    console.log("UserId is", userId);

    // Get user object
    const member = await guild.members.fetch(userId);

    // First check if the user already has the role
    if (member.roles.cache.has(roleId)) {
      console.log("User already has the role");
    } else {
      // Add the given role to the user
      member.roles.add(role).catch(console.error);
      // member.roles.remove(role).catch(console.error);
    }

    await interaction.reply("Done!");
  } else {
    console.log("no matching commands");
  }
});

// Login to Discord with your client's token
client.login(token);
