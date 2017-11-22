/* eslint-disable max-len */
const responses = [
  function(author, target) {
    return {
      id: 0,
      message: `**${author}:** to **${target}** I leave... a boot to the head.\n**${target}:** A what?!\n*${author} threw a 👢 at ${target}'s head*`,
    };
  },
  function(author, target) {
    return {
      id: 1,
      message: `**${target}:** Hey, I don't want no boot to the head.\n**${author}:** to dear ${target}, who has never worked a day in his drunken life --\n**${target}:** I'm covering up my head!\n**${author}:** -- I leave my wine cellar and three crates of my finest whiskey.\n**${target}:** Really?\n**${author}:** And a boot on the head\n*${author} threw a 👢 at ${target}'s head*`
    };
  },
  function(author, target) {
    return {
      id: 2,
      message: `**${target}:** This is so predictable.\n**${author}:** I leave a boot to the head.\n*${author} threw a 👢 at ${target}'s head*\n**${target}:** Uh! I knew it.`,
    };
  },
  function(author, target) {
    return {
      id: 3,
      message: `**${target}:** Oh, ah, I don't want nuthin'.\n**${author}:** -- who took care of me faithfully these many many years, who cared, made me laugh, brought me tea --\n**${target}:** Oh, I didn't mind.\n**${author}:** To ${target}, I bequeath... a boot to the head.\n*${author} threw a 👢 at ${target}'s head*`,
    };
  },
  function(author, target) {
    return {
      id: 4,
      message: `**${author}:** I leave you ${target}, a lifetime supply of ice cream --\n**${target}:** t-that's all?\n**${author}:** That's all...\n**${target}:** but what flavour is it?\n**${author}:** boot to the head.\n*${author} threw a 👢 at ${target}'s head*`,
    };
  }
];
exports.response = (author, target) =>
  responses[Math.floor(Math.random() * responses.length)](author, target);
/* eslint-enable max-len */
