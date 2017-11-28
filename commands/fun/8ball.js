const { Command } = require('kawaii/src/Structures/Base');
const responses = [
  "Yes", "No", "Perhaps~", "Nyaaaa~ Uhh.. Of course!",
  "It's very likely c:", "Possibly!", "No doubt!",
  "Take a guess ;)", "Nope~", "Oh, just maybe..",
  "M-hm.", "Hm hm.. Yes!", "Uh-uh, no!", "No no.",
  "No no!", "I think not!", "I don't think so~",
  "Ha, ahhh~ No no!", "Oh.. You wish!", "Perhaps!"
]
class eightball extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: '8ball something',
      category: 'fun',
      aliases: ["8ball"]
    };
  }

  execute(ctx) {
    if(!ctx.suffix) return 'Please give me input!'
    return `🎱 **${responses[Math.floor(Math.random() * (responses.length))]}**`;
  }
}

module.exports = eightball;
