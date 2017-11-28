const { Command } = require('kawaii/src/Structures/Base');
const responses = [
  c => `I think **${c}** would be a good choice!`,
  c => `Hmm.. **${c}** seems good!`,
  c => `What about.. **${c}**`,
  c => `I choose you, **${c}**!`,
  c => `I pick **${c}**!`,
  c => `I choose **${c}**!`
]
class choose extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: 'Makes a choice!',
      category: 'normal',
      aliases: ["c", "pick"],
    };
  }

  execute() {
    if(!ctx.suffix) return "`[ERROR]: Could not complete: No choices filled!`";
    let choices = ctx.suffix.split(/ ?\| ?/)
    if(choices.length < 2 && ctx.suffix.includes(',')) choices = ctx.suffix.split(/, ?/)
    choices = choices.filter(c => c !== '')
    if(choices.length < 2) return "`[ERROR]: Could not complete: No choices filled!`";
    let pick = ~~(Math.random() * choices.length)
    return responses[~~(Math.random() * responses.length)](choices[pick])
  }
}

module.exports = choose;
