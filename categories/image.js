const { Category } = require('kawaii/src/Structures/Base');
const config = require('../config.json');
class ImageCategory extends Category {
  constructor(...args) {
    super(...args);

    this.name = 'image';
    this.prefixes = Array.isArray(config.prefixes) ? config.prefixes : [config.prefixes];
  }
}

module.exports = ImageCategory;
