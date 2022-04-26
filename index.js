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
    console.log("Rolename:", role.name);

    // Read the list of discord usernames from disk
    var usernames = fs
      .readFileSync("./discord_handles.txt", "utf8")
      .toString()
      .split("\n");

    try {
      // Get all members of a discord server (guild) and cache it
      await guild.members.fetch({ cache: true, force: true });
    } catch (err) {
      console.error(err);
    }

    // Loop through each username
    for (i in usernames) {
      let name = usernames[i];
      console.log("name:", name);

      // Get ID from discord usertag. Since, we already cache ALL the members of a guild,
      // cache miss should not happen.
      const userId = client.users?.cache.find((u) => u.tag === name)?.id;
      console.log("UserId:", userId);

      if (userId == null) {
        console.log("cannot find userId");
        continue;
      }

      // Get user object
      const member = await guild.members.fetch(userId);

      if (member == null) {
        console.log("couldn't fetch member");
        continue;
      }

      // First check if the user already has the role
      if (member.roles.cache.has(roleId)) {
        console.log("User already has the role");
      } else {
        // Add the given role to the user
        member.roles.add(role).catch(console.error);
        // member.roles.remove(role).catch(console.error);
      }
    }

    await interaction.reply("Done!");
  } else {
    await interaction.reply("No matching commands");
  }
});

// Login to Discord with your client's token
client.login(token);
