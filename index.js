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

app.command("/reaper-bot-calc",async ({command, ack, respond}) => {
    await ack();
    var commands = command.text.split(" ")
    if (commands.length == 3) {
        try {
            num1 = Number(commands[0])
            num2 = Number(commands[2])
            if (!Number.isNaN(num1) && !Number.isNaN(num2)) {
                switch(commands[1]) {
                    case "+":
                        console.log(commands[1])
                        result = num1 + num2
                        respond({text:`${command.text} = ${result}`})
                        break;
                    case "-":
                        result = num1 - num2
                        respond({text:`${command.text} = ${result}`})
                        break;
                    case "*":
                        result = num1 * num2
                        respond({text:`${command.text} = ${result}`})
                        break;
                    case "/":
                        if (num2 == 0) {
                            respond({text:"You can't divide by zero!"})
                            break;
                        }
                        result = num1 / num2
                        respond({text:`${command.text} = ${result}`})
                        break;
                    default:
                        respond({text:"No valid operator found. Accepted operators: +, -, *, /"})
                }
                

            }
            else {
                respond({text:"Both nums must be actual numbers!"})
            }
        } catch (err) {
            respond({text:"Error: Expressions failed."})
        }
        
    }
    else {
        respond({text: "Incorrect argument amount. Correct expression is num1 operator num2"})
    }
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();