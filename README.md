# @joggee-fr/mma-ref-parser
This tool parses mixed martial arts online articles from several sources to build Wikipedia.fr references
using dedicated template [Lien web](https://fr.wikipedia.org/wiki/Mod%C3%A8le:Lien_web).

# Installation
After cloning the repository, use `npm` to install the needed dependencies.
```
$ npm install
```

As only ES modules are used, Node.js >= 14 is mandatory to run the tool.

# Usage
Assuming working directory is in the project one. The script can be directly called from command line.

```
$ ./src/cli.js "https://mmajunkie.usatoday.com/2018/04/derrick-lewis-vs-francis-ngannou-booked-ufc-226-las-vegas"
```

Or `npm` tool can also be used.
```
$ npm run parse "https://mmajunkie.usatoday.com/2018/04/derrick-lewis-vs-francis-ngannou-booked-ufc-226-las-vegas"
```

# Supported websites
* [MMA Fighting](https://www.mmafighting.com/)
* [MMA Junkie](https://mmajunkie.usatoday.com/)
