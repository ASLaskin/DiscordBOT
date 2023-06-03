const Discord = require("discord.js");
const mySecret = process.env['DISCORD_BOT_ID'];
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ffmpeg = require('ffmpeg-static');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const keepAlive = require("./server");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  const content = message.content.toLowerCase();

  switch (content) {
    case '/help':
      message.reply({
        content: `1. Rock Paper Scissors (Ex. /rock)\n2. /audio`,
      });
      break;


      
    case '/audio':
      if (!message.member.voice.channel) {
        message.reply('You need to be in a voice channel to use this command.');
        return;
      }
      const voiceChannel = message.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      const audioPlayer = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
          
        },
        
      });

      
      const audioResource = createAudioResource('Audio.mp3');
      connection.subscribe(audioPlayer);
      audioPlayer.play(audioResource);
      

      audioPlayer.on('idle', () => {
        connection.destroy();
        message.channel.send('Bot has finished playing and left the voice channel.');
      });
      break;
    case '/rock':
      playGame('rock', message);
      break;
    case '/paper':
      playGame('paper', message);
      break;
      case '/scissor':
        case '/scissors ':
          playGame('scissors', message);
          break;
        default:
          break;
      }
});



function playGame(userChoice, message) {
  const choices = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  const botChoice = choices[randomIndex];

  let result;

  if (userChoice === botChoice) {
    result = "It's a tie!";
  } else {
    switch (userChoice) {
      case 'rock':
        result = botChoice === 'scissors' ? 'You win!' : 'You lose!';
        break;
      case 'paper':
        result = botChoice === 'rock' ? 'You win!' : 'You lose!';
        break;
      case 'scissors':
        result = botChoice === 'paper' ? 'You win!' : 'You lose!';
        break;
      default:
        result = "Something went wrong!";
    }
  }

  // Send the message reply
  message.reply({
    content: `You chose ${userChoice}, I chose ${botChoice}. ${result}`,
  });

  // Conditionally send image files
  if (botChoice === "paper" || botChoice === "rock" || botChoice === "scissors") {
    message.channel.send({
      files: [{
        attachment: `resources/${botChoice}.png`,
        name: `${botChoice}.png`
      }]
    });
  }
}

keepAlive();
client.login(mySecret);
