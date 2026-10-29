require("dotenv").config();
const axios = require("axios")

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/reaper-bot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
app.command("/reaper-bot-catfact",async ({command,ack,respond}) => {
    await ack();
    try{
        const response = await axios.get("https://catfact.ninja/fact");
        await respond({ text: `Cat Fact:\n${response.data.fact}`});
    } catch (err) {
        await respond({ text: "Failed to fetch a cat fact."})
    }
});
app.command("/reaper-bot-joke", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await respond({text:`
${response.data.setup}

${response.data.punchline}`
    });
    } catch (err) {
        await respond({ text: "Failed to fetch a joke." });
    }
});
app.command("/reaper-bot-dog",async ({command,ack,respond}) => {
    await ack();
    try {
        const response = await axios.get("https://dog.ceo/api/breeds/image/random")
        await respond({ blocks: [
            {
                type:"image",
                image_url:response.data.message,
                alt_text:"Dog picture"
            }
        ]})
    } catch (err) {
        await respond({ text: "Failed to fetch"})
    }
});
app.command("/reaper-bot-daysuntilchristmas",async ({ack,respond}) => {
    await ack();
    const today = new Date();
    const christmas = new Date(today.getFullYear(),11,24);
    if (today > christmas) {
        christmas.setFullYear(christmas.getFullYear()+1);
    }
    const christmasdifference = Math.ceil((christmas - today)/(1000*60*60*24));
    respond({ text:`It is ${christmasdifference} days left untill 24th December`})
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();