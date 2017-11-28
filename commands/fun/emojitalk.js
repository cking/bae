const { Command } = require('kawaii/src/Structures/Base');
const special = {
  0: ':zero:',
  1: ':one:',
  2: ':two:',
  3: ':three:',
  4: ':four:',
  5: ':five:',
  6: ':six:',
  7: ':seven:',
  8: ':eight:',
  9: ':nine:',
  '<': ':arrow_backward:',
  '>': ':arrow_forward:',
  '!': ':exclamation:',
  '?': ':question:',
  '^': ':arrow_up_small:',
  '+': ':heavy_plus_sign:',
  '-': ':heavy_minus_sign:',
  '÷': ':heavy_division_sign:',
  '.': ':radio_button:'
};
class emojitalk extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: 'Turn a message into an emoji',
      category: 'fun'
    };
  }

  execute(ctx) {
    ctx.suffix = ctx.suffix.toLowerCase().split('');
    let done = '';
    for (let c = 0; c < ctx.suffix.length; c++) {
      if (/\s/g.test(ctx.suffix[c])) {
        done += ' ';
      } else if (/[abcdefghijklmnopqrstuvwxyz]/g.test(ctx.suffix[c])) {
        done += ctx.suffix[c].replace(ctx.suffix[c], ` :regional_indicator_${ctx.suffix[c]}:`);
      } else if (Object.keys(special).indexOf(ctx.suffix[c]) > -1) {
        done += ctx.suffix[c].replace(ctx.suffix[c], ` ${special[ctx.suffix[c]]}`);
      } else {
        done += ` ${ctx.suffix[c]} `;
      }
    }
    return done;
  }
}

module.exports = emojitalk;
