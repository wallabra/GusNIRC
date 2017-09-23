// Generated by CoffeeScript 1.12.6
var choice, evaluators, fs, irc, lastQs, namespace, nukers, util,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

fs = require("fs");

irc = require("../irc.js");

util = require("util");

nukers = ["host:unaffiliated/gustavo6046", "ident:~Gustavo604", "ident:Gustavo604", "host:www.terrenodefogo.blogspot.com"];

evaluators = ["host:unaffiliated/gustavo6046", "ident:~Gustavo604", "ident:Gustavo604", "host:www.terrenodefogo.blogspot.com"];

lastQs = [];

namespace = {};

choice = function(l) {
  return l[Math.floor(l.length * Math.random())];
};

module.exports = [
  {
    name: "sadface",
    matcher: new irc.MessageMatcher("\\]\\=$"),
    perform: function(msg, custom, conn) {
      var choices;
      choices = ["Aww, are you sad? ]=", "I'm happy! [= Want some of it?", "Pick One!  ]=sad [=happy", "Prefix or emotion? Specify!", "My life for your happiness... or as the Deutsch say, 'Mein Leben für deine Freude', or as they say in Portuguese, 'minha vida pela sua alegria'... I can say it in so many ways... (anyways, it is [=, not ]= if you are happy!!)"];
      return msg.reply(choices[Math.floor(Math.random() * choices.length)]);
    }
  }, {
    name: "happyface",
    matcher: new irc.MessageMatcher("(\\[\\=|\\=\\])$"),
    perform: function(msg, custom, conn) {
      var choices;
      choices = ["I'm glad you are happy! =]", "Oh yay whatever I did made you happy! =D", "Pick One!  ]=sad [=happy", "I enjoy your happiness... it kind of spreads to me...", "\x01ACTION hugs " + msg.data.privmsg.nickname + "\x01"];
      return msg.reply(choices[Math.floor(Math.random() * choices.length)]);
    }
  }, {
    name: "action",
    matcher: new irc.PrefixedMatcher("action ([^ ]+) (.+)"),
    perform: function(msg, custom, conn) {
      return conn.send("PRIVMSG " + custom[0] + " :\x01ACTION " + custom[1] + "\x01");
    }
  }, {
    name: "eval",
    matcher: new irc.PrefixedMatcher("eval (.+)"),
    perform: function(msg, custom, conn) {
      var err, ref, ref1;
      if ((ref = "host:" + msg.data.privmsg.hostname, indexOf.call(evaluators, ref) < 0) && (ref1 = "ident:" + msg.data.privmsg.ident, indexOf.call(evaluators, ref1) < 0)) {
        msg.reply("[ EPERM ]");
      } else {
        try {
          return msg.reply(util.inspect(eval(custom[0])));
        } catch (error) {
          err = error;
          msg.reply(err);
          return console.log(err);
        }
      }
    }
  }, {
    name: "nuke",
    matcher: new irc.PrefixedMatcher("nukaholic"),
    perform: function(msg, custom, conn) {
      var ref, ref1;
      if ((ref = "host:" + msg.data.privmsg.hostname, indexOf.call(nukers, ref) < 0) && (ref1 = "ident:" + msg.data.privmsg.ident, indexOf.call(nukers, ref1) < 0)) {
        console.log(msg.data.privmsg.hostname, nukers);
        return msg.reply("[ACCESS TO NUKES REFUSED. *POW* UR DED M8.]");
      } else {
        return msg.reply("    _.-^^---....,,--\n_--                  --_\n<                        >)\n|                         |\n \\._                   _./\n   ```--. . , ; .--'''\n         | |   |\n      .-=||  | |=-.\n      `-=#$%&%$#=-'\n         | ;  :|\n_____.,-#%&$@%#&#~,._____");
      }
    }
  }, {
    name: "historyKill.add",
    matcher: new irc.PrefixedMatcher("addhkill (\\-?\\d+) (.+)"),
    perform: function(msg, custom, conn) {
      var eras, n;
      eras = JSON.parse(fs.readFileSync("histokill.json"));
      n = +custom[0];
      if (indexOf.call(Object.keys(eras), n) >= 0) {
        eras[n].push(custom[1]);
      } else {
        eras[n] = [custom[1]];
      }
      fs.writeFileSync("histokill.json", JSON.stringify(eras));
      return msg.reply(msg.data.privmsg.nickname + ": Successfully added killing method to year " + 0 + ".");
    }
  }, {
    name: "historyKill",
    matcher: new irc.PrefixedMatcher("histokill (\\-?\\d+) (.+)"),
    perform: function(msg, custom, conn) {
      var eras, i, j, len, m, n, ref;
      eras = JSON.parse(fs.readFileSync("histokill.json"));
      i = 0;
      ref = Object.keys(eras).filter(function(x) {
        return !isNan(x);
      }).sort(function(a, b) {
        return +a - +b;
      });
      for (j = 0, len = ref.length; j < len; j++) {
        n = ref[j];
        if (n > parseInt(custom[0])) {
          m = eras[Object.keys(eras).filter(function(x) {
            return !isNan(x);
          }).sort(function(a, b) {
            return +a - +b;
          })[i - 1]];
          msg.reply(m[Math.floor(m.length * Math.random())].replace("%k", msg.data.privmsg.nickname).replace("%o", custom[1]));
          return;
        }
        i++;
      }
      m = eras["default"];
      return msg.reply(m[Math.floor(m.length * Math.random())].replace("%k", msg.data.privmsg.nickname).replace("%o", custom[1]));
    }
  }, {
    name: "8ball",
    matcher: new irc.PrefixedMatcher("8ball (.+)"),
    perform: function(msg, custom, conn) {
      return msg.reply(choice([
        "Maybe? Who knows.", "Of course! I am sure it is!", "I think it is, but who knows...", "The chance is null! Absolutely no!", "The chance is blergh! Blergh!", "Blergh please no!", (function() {
          if (custom[0].toUpperCase().indexOf("BUSH DID 9/11") <= -1) {
            return (function() {
              var ref;
              if (ref = custom[0].toUpperCase(), indexOf.call(lastQs.map(function(x) {
                return x.toUpperCase();
              }), ref) < 0) {
                lastQs.push(custom[0]);
              }
              return "The answers equals 'Bush did 9/11'.";
            })();
          } else {
            return "Aliens, Area 51, Bush... Obama...... Trump!! It all makes sense now!" + ((function() {
              if (lastQs.length > 0) {
                return " " + lastQs.map(function(x) {
                  return x + "!!";
                }).join(" ");
              } else {
                return "";
              }
            })()) + " TO YOUR SHELTERS, QUICK!!";
          }
        })(), "Not like that has any chance, heh."
      ]));
    }
  }, {
    name: "r_a_g_e",
    matcher: new irc.PrefixedMatcher("rage (.+)"),
    perform: function(msg, custom, conn) {
      return msg.reply("\x034,7\x02\x1D " + (custom[0].split("").join(" ")) + " ");
    }
  }
];
