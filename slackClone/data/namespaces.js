const Namespace = require("../classes/Namespace");
const Room = require("../classes/Room");

const wikiNs = new Namespace(
  0,
  "wiki",
  "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png",
  "/wiki"
);

const mozNs = new Namespace(
  1,
  "mozilla",
  "https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png",
  "/mozilla"
);

const linuxNs = new Namespace(
  2,
  "linux",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png",
  "/linux"
);

wikiNs.addRoom(new Room(0, "New Articles", 0));
wikiNs.addRoom(new Room(1, "Editors", 0));
wikiNs.addRoom(new Room(2, "Other", 0));

mozNs.addRoom(new Room(0, "Firefox", 1));
mozNs.addRoom(new Room(1, "SeaMonkey", 1));
mozNs.addRoom(new Room(2, "SpiderMonkey", 1));
mozNs.addRoom(new Room(3, "Rust", 1));

linuxNs.addRoom(new Room(0, "Debian", 2));
linuxNs.addRoom(new Room(1, "Red Hat", 2));
linuxNs.addRoom(new Room(2, "MacOs", 2));
linuxNs.addRoom(new Room(3, "Kernal Development", 2));


const namespaces = [wikiNs, mozNs, linuxNs];

module.exports = namespaces;
