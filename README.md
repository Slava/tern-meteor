TernJS plugin: Meteor
===

*UPDATE*: All definitions were update to Meteor 1.0.4. There are probably some
bugs since this project moved to definitions autogeneration, if you notice any
API mismatch, report in the issues.

This is a plugin for [TernJS](http://ternjs.net) bringing support for
[Meteor](https://www.meteor.com) JavaScript Framework. Tested on Vim and Sublime
Text 2/3, reported to work on Emacs, potentially should work on Brackets,
LightTable, [Eclipse](https://github.com/angelozerr/tern.java/wiki/Tern-&-Meteor-support) and any other CodeMirror-based editors.

Checkout my presentation on Meteor Devshop 11: [Videos](https://www.youtube.com/watch?v=Lqcs6hPOcFw#t=6227) and [Slides](https://slid.es/slavakim/meteor).
The mailing thread for this project is [here on meteor-talk](https://groups.google.com/forum/#!searchin/meteor-talk/tern/meteor-talk/b_yGWIqXl7Y/UYsGCGLWu7sJ).

Gif Demos
---

Types based auto-completion:
![tern-vim-completion.gif](/demo-gifs/tern-vim-completion.gif)

Look up documentation:
![tern-vim-doc.gif](/demo-gifs/tern-vim-doc.gif)

Jump to definition:
![tern-vim-jump-to-def.gif](/demo-gifs/tern-vim-jump-to-def.gif)

Jump to references:
![tern-vim-refs.gif](/demo-gifs/tern-vim-refs.gif)

Get types information (on the bottom):
![tern-vim-types.gif](/demo-gifs/tern-vim-types.gif)

Supported features specific to Meteor
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
- parsing of handlebars template?


Installation for Sublime Text 3
---

[Go and install the separate package for ST3.](https://github.com/Slava/tern-meteor-sublime)

Installation for Vim
---

**[Demo Video of Vim](https://www.youtube.com/watch?v=TIE9ZOqlvFo)**

You check out my Vim setup which is already optimized for Meteor development:
[GitHub repo](https://github.com/Slava/vimrc). Or you can get it to your setup:

- Install [tern-vim plugin](https://github.com/marijnh/tern_for_vim) with your
  favorite package manager for Vim.
- `cd` to `.vim` folder, `tern_for_vim` plugin folder and run `npm install` to
  fetch `tern` npm module.
- Download `meteor.js` file (from this repo) to tern's folder
  `tern_for_vim/node_modules/tern/plugins`.
- In your Meteor project create a file `.tern-project` with the contents similar
  to:

```
    {
      "libs": [
        "browser",
        "jquery",
        "underscore"
      ],
      "loadEagerly": [ "*.js", "*/*.js", "*/*/*.js", "*/*/*/*.js" ],
      "dontLoad": [ ".meteor" ],
      "plugins": {
        "meteor": {}
      }
    }
```

Note: ignore files in `.meteor` folder. Load all JS if possible.


