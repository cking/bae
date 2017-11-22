const { Category } = require('kawaii/src/Structures/Base');
const config = require('../config.json');
class FunCategory extends Category {
  constructor(...args) {
    super(...args);

    this.name = 'fun';
    this.prefixes = Array.isArray(config.prefixes) ? config.prefixes : [config.prefixes];
  }
}

module.exports = FunCategory;
