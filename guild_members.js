/**
 * This is a simple script to find all members of a particular discord server (guild).
 * It spits out the discord handles (name#id) as a log as well it saves to a file.
 * To save to a file, create a file in the root and name it `all_members.txt`. This script
 * can be run by `/role <ANYTHING_HERE>`.
 */

// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token, guildId } = require("./config.json");
const fs = require("fs");

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

const isABot = (user) => {
  botIDs = ["914954766038208553", "874664394959761441", "968834656814399538"];
  return botIDs.includes(user.id);
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "role") {
    // Get role object from guild. Guild is another name for a discord server.
    var guild = client.guilds.cache.get(guildId);

    // Read the list of discord userIds from disk
    var users = fs
      .readFileSync("./discord_external.txt", "utf8")
      .toString()
      .split("\n");

    try {
      // Get all members of a discord server (guild) and cache it
      members = await guild.members.fetch({ cache: true, force: true });
      resp = "";
      members.forEach((val, _) => {
        if (isABot(val.user)) {
        } else {
          discordName = val.user.username + "#" + val.user.discriminator;
          resp = resp.concat(discordName + "\n");
          fs.appendFileSync("all_members.txt", discordName + "\n");
        }
      });
    } catch (err) {
      console.error(err);
    }

    console.log(resp);

    await interaction.deferReply();

    await interaction.editReply("ok");
  } else {
    await interaction.reply("No matching commands");
  }
});

// Login to Discord with your client's token
client.login(token);
