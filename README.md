TernJS plugin: Meteor
===

This is a plugin for [TernJS](http://ternjs.net) bringing support for
[Meteor](https://www.meteor.com) JavaScript Framework.

Videos: [for Sublime Text](https://www.youtube.com/watch?v=5cAHxpNEHTc), [for
Vim](https://www.youtube.com/watch?v=TIE9ZOqlvFo).

Supported features
---

- each file is wrapped in a scope
- global variable are global project-wise
- interface definitions converted from meteor.ts.d

Todo features
---

- correctly calculate package scope and their exports
- some auto-completion based on Templates names would be nice
- generate docs from docs.meteor.com
- load all Meteor related JS files on the load of any file


Installation for Sublime Text 2/3
---


- install Package Control (https://sublime.wbond.net/installation)
- install sublime-tern plugin (cmd+shift+p -> install package -> TernJS -> restart sublime)
- `cd` to Sublime Text packages directory (`~/Library/Application Support/Sublime Text 3/Packages` on Mac OS X)
- `cd TernJS/ternjs/plugin`
- copy over meteor.js file here
- create a new sublime project, save it, add files
- edit project configuration (menu->project->edit project)
- edit the json file in this manner:

    {
      "folders":
      [
               ... don't touch this part, leave it as it was ...
      ],
      // add this! ternjs object
      "ternjs": {
        "libs": ["browser", "underscore", "jquery"],
        "plugins": {
          "meteor": {}
        }
      }
    }


Installation for Vim
---

- Install [tern-vim plugin](https://github.com/marijnh/tern_for_vim) with your
  favorite package manager for Vim.
- `cd` to `.vim` folder, `tern_for_vim` plugin folder and run `npm install` to
  fetch `tern` npm module.
- Download `meteor.js` file (from this repo) to tern's folder called `plugins`.
- In your Meteor project create a file `.tern-project` with the contents similar
  to:

    {
      "libs": [
        "browser",
        "jquery",
        "underscore"
      ],
      "loadEagerly": [ ],
      "dontLoad": [ ".meteor" ],
      "plugins": {
        "meteor": {}
      }
    }

Note: ignore files in `.meteor` folder.


