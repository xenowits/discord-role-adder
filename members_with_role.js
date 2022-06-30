// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token, guildId } = require("./config.json");
const fs = require("fs");

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS],
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "role") {
    let roleId = "933433583425683476";

    // Get role object from guild. Guild is another name for a discord server.
    var guild = client.guilds.cache.get(guildId);

    try {
      // Get all members of a discord server (guild) and cache it
      await guild.members.fetch({ cache: true, force: true });
    } catch (err) {
      console.error(err);
    }

    try {
      const role = await guild.roles.fetch(roleId);
      await guild.roles.cache.get(roleId).members.map((m) => m.user.tag);
      let x = role.members.map((m) => m.user.id);
      for (let i = 0; i < x.length; i += 1) {
        fs.appendFile("discord_handles.txt", `${x[i]}\n`, function (err) {
          if (err) throw err;
          console.log("Saved!");
        });
      }
    } catch (err) {
      console.log(err);
    }

    await interaction.reply("ok");
  }
});
