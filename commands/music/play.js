const { Command } = require('kawaii/src/Structures/Base');
const QueueManager = require('../../managers/QueueManager');
const VoiceChannelManager = require('../../managers/VoiceChannelManager');
const MenuCancellationError = require('kawaii/src/Structures/Menu').MenuCancellationError;
// import queuemanager
const music = {};
class play extends Command {
  constructor(...args) {
    super(...args);
    this.voiceChannelManager = null;
    this.options = {
      category: 'normal',
      description: 'Play Music!',
      aliases: ['m']
    };
    this.subcommands = {
      play: {
        category: 'music',
        description: 'Add music to the queue.',
        aliases: ['p']
      },
      pause: {
        category: 'music',
        description: 'pauses a song'
      },
      resume: {
        category: 'music',
        description: 'resumes a song'
      },
      next: {
        category: 'music',
        description: 'skips a song'
      },
      queue: {
        category: 'music',
        description: 'shows the current queue'
      }
    };
  }
  *handleMenu(ctx, songs) {
    console.log('inside handlemenu');
    const menu = ctx.menu();
    console.log(menu.collector);
    menu.addOptions(songs.slice(0, 3).map((r, i) => ({ title: `#${i + 1}: ${r.title}`, value: r.url })));
    yield menu.formEmbedBuilder()
      .setTitle('Song selection')
      .setDescription("Please pick a song, reply with the number or type 'c' to cancel!")
      .send();
    const spawnOptions = {
      channel: ctx.channel.id,
      cancellationMessage: 'c'
    };
    try {
      const selection = yield menu.spawn(spawnOptions);
      console.log('selected', selection.selection);
      return selection.selection.value;
    } catch (e) {
      if (e instanceof MenuCancellationError) {
        return e.message;
      } else {
        console.log(e);
      }
    }
  }
  *execute(ctx) {
    if (!ctx.suffix) return;
    console.log(ctx.msg.channel.guild.id);
    if (ctx.msg.member.voiceState.channelID === null) return 'You must be in a voice channel!';
    this.voiceChannelManager = new VoiceChannelManager(ctx);
    if(this.voiceChannelManager.addToQueue(ctx.suffix)) this.voiceChannelManager.play();
    else {
      // return an error
    }
  }
}

module.exports = play;
