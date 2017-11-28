const { Plugin } = require('kawaii/src/Structures/Base');
const moment = require('moment');
const config = require('../config.json');

class ReminderPlugin extends Plugin {
  constructor(...args) {
    super(...args);
    this.name = 'reminders';
    this.r = this.client.plugins.get('r');
  }
  *addReminder(user, remind) {
    yield (this.r.table('reminders').insert({
      user: user,
      content: remind.eventTitle,
      time: remind.startDate
    }).run());
  }

  *checkReminder(client) {
    const reminders = yield(this.r.table('reminders').between(this.r.epochTime(0), this.r.now(), {index: 'time'}).run())

    for(let i = 0; i < reminders.length; i++) {
      const dm = yield client.users.get(reminders[i].user).getDMChannel();
      yield client.createMessage(dm.id, `⏰ Hey fam! Reminding you to:\n${reminders[i].content}`);
      yield this.r.table('reminders').get(reminders[i].time).delete().run();
    }
  }
}

module.exports = ReminderPlugin;
