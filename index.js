// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { guildId, token, roleId } = require("./config.json");
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

  if (commandName === "role") {
    // Get roleId of already created role by:
    // 1. Enabling Developer Mode in Settings > Advanced > Developer Mode.
    // 2. Right click on a role. Click on Copy ID.

    // Get role object from guild. Guild is another name for a discord server.
    var guild = client.guilds.cache.get(guildId);

    // Read the list of discord userIds from disk
    var users = fs
      .readFileSync("./discord_handles.txt", "utf8")
      .toString()
      .split("\n");

    try {
      // Get all members of a discord server (guild) and cache it
      await guild.members.fetch({ cache: true, force: true });
    } catch (err) {
      console.error(err);
    }

    const toAdd = interaction.options.get("input").value === "add";

    await interaction.deferReply();
    await editRoles(users, guild, roleId, toAdd);

    await interaction.editReply(
      `${interaction.options.get("input").value} operation succeeded`
    );
  } else {
    await interaction.reply("No matching commands");
  }
});

// Login to Discord with your client's token
client.login(token);

// toAdd: If true, add roles. If false, remove roles.
const editRoles = async (users, guild, roleId, toAdd) => {
  var malformedIds = [];
  var notjoinedIds = [];
  const role = await guild.roles.fetch(roleId);

  // Loop through each userId
  for (i in users) {
    var userId;

    // check if it's a discord tag (x#y) or a discord ID
    if (isDiscordTag(users[i])) {
      // it's a discord tag
      // Since, we already cache ALL the members of a guild, cache miss should not happen.
      userId = client.users?.cache.find((u) => u.tag === users[i])?.id;
    } else if (isDiscordId(users[i])) {
      // it's a discord id (note: not validating)
      userId = users[i];
    } else {
      console.log(users[i], "is a bad discord identifier");
      malformedIds.push(users[i]);
      continue;
    }

    console.log("UserId:", userId);
    if (!userId) {
      console.log("userId absent or invalid");
      continue;
    }

    // Get user object
    let member;
    try {
      member = await guild.members.fetch(userId);
    } catch (err) {
      notjoinedIds.push(userId);
      console.log("couldn't fetch", userId, users[i]);
      continue;
    }

    if (toAdd) {
      // First check if the user already has the role
      if (member.roles.cache.has(roleId)) {
        console.log("User already has the role");
      } else {
        // Add the given role to the user
        member.roles.add(role).catch(console.error);
      }
      console.log("role added to", users[i]);
    } else {
      // delete the roles
      member.roles.remove(role).catch(console.error);
      console.log("role deleted for", users[i]);
    }
  }

  console.log("Malformed IDs", malformedIds);
  console.log("Nonjoined IDs", notjoinedIds);
};

const isDiscordTag = (user) => {
  if (user.includes("#")) {
    const splits = user.split("#");
    // valid discord tags consist of both username and usertag
    return splits[0].length > 0 && splits[1].length > 0;
  }
  return false; // can't be a tag without a hash
};

const isDiscordId = (user) => {
  return isNumeric(user) && user.length == 18;
};

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
