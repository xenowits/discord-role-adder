// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { guildId, token, roleId } = require("./config.json");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});

var channel, guild, members;

// When the client is ready, run this code (only once)
client.once("ready", async () => {
  console.log("Ready!");
  await setChan();
  await fetchAllMembers();
});

const fetchAllMembers = async () => {
  guild = client.guilds.cache.get(guildId);
  try {
    // Get all members of a discord server (guild) and cache it
    members = await guild.members.fetch({ cache: true, force: true });
  } catch (err) {
    console.error(err);
  }
};

// The channel where threads need to be created.
var channel;
const setChan = async () => {
  channel = await client.channels.fetch("1002972486616485928");
};

const createThread = async () => {
  if (!channel) {
    console.log("channel not yet defined.");
    return;
  }

  // Tag everyone in the standup channel.
  let tagMsg = "";
  members.forEach((val, _) => {
    tagMsg = tagMsg + "<@" + val.user.id + ">" + " ";
  });
  
  channel.send(tagMsg);

  let thread = await channel.threads.create({
    name: threadName(),
    autoArchiveDuration: 60,
    reason: "Standup",
  });

  console.log(`Created thread: ${thread.name}`);

  // Add all members to the thread.
  members.forEach(async (val, _) => {
    await thread.members.add(val.user.id);
  });
};

const threadName = () => {
  var today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;

  return today;
};

const interval = 24 * 60 * 60 * 1000;

setInterval(createThread, 5000);
