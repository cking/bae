const { Command } = require('kawaii/src/Structures/Base');
const QueueManager = require('../../managers/QueueManager');
const MenuCancellationError = require('kawaii/src/Structures/Menu').MenuCancellationError;
// import queuemanager
const queue = {};
class music extends Command {
  constructor(...args) {
    super(...args);
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
      }
    };
  }

  *play(ctx) {
    if (!ctx.suffix) return;
    console.log(ctx.msg.channel.guild.id);
    if (ctx.msg.member.voiceState.channelID === null) return 'You must be in a voice channel!';
    if (!queue[ctx.msg.channel.guild.id]) {
      const connection = yield ctx.client.joinVoiceChannel(ctx.msg.member.voiceState.channelID);
      queue[ctx.msg.channel.guild.id] = new QueueManager(ctx.client, connection, ctx.msg.channel.id);
    }

    // handle menu
    let picked = yield* queue[ctx.msg.channel.guild.id].resolver.get(ctx.suffix);
    if (typeof picked === 'undefined') return 'Error finding the song, please try again!';
    try {
      picked = JSON.parse(picked);
    } catch (e) {
      console.error(e);
    }
    if (picked.constructor === Array) {
      picked = yield* this.handleMenu(ctx, picked);
    }
    if (typeof picked === 'undefined' || picked === null) {
      return `Could not queue the song!`;
    }
    console.log('PICKED', picked);
    const song = yield* queue[ctx.msg.channel.guild.id].addToQueue(picked, ctx.author);
    console.log('song', song);
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
  pause(ctx) {
    if (ctx.msg.member.voiceState.channelID === null) return 'You must be in a voice channel!';
    if (queue[ctx.msg.channel.guild.id]) {
      queue[ctx.msg.channel.guild.id].pause();
      return `Playback paused!`;
    } else { return `Could not pause!`; }
  }
  resume(ctx) {
    if (ctx.msg.member.voiceState.channelID === null) return 'You must be in a voice channel!';
    if (queue[ctx.msg.channel.guild.id]) {
      queue[ctx.msg.channel.guild.id].resume();
      return `Playback resumed!`;
    } else { return `Could not resume!`; }
  }
  *next(ctx) {
    if (ctx.msg.member.voiceState.channelID === null) return 'You must be in a voice channel!';
    if (queue[ctx.msg.channel.guild.id]) {
      yield* queue[ctx.msg.channel.guild.id].nextSong();
      return `Skipped!`;
    } else { return `Could not skip!`; }
  }
  *execute(ctx) {
    ctx.msg.channel.createMessage({
      embed: {
        title: 'Music Commands',
        description: '`-music play`: Add a song to the queue\n`-music skip`: Skip the current song\n`-music queue`: See the current queue',
        color: 0x1093DB
      }
    });
  }
}

module.exports = music;
