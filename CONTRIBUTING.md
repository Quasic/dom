# Contributing and Style Guide
I mostly maintain this for my own use, but thought others may find some parts useful. If you would like to contribute, you are welcome. Apoligies if my style is annoying. I often find other styles annoying, myself. :P

Strict mode should be declared at the function level, if used, rather than on the whole file. I prefer it, but sometimes you need non-strict functionality to handle weird problems.

## Indentation and whitespace
I use a nonstandard whitespace format that makes my JavaScript look like minJS output. It helps keep diffs simpler, because indents don't change when wrapping (or unwrapping) code in an if block. I developed a similar style before I used git, so more code could fit on the screen at a time, and adjusted it to fit git's per line diffs. Tools can reformat the code, so I'm just leaving it the way I use it. Indents mark aspects of the line other than code structure, such as temporary code, or code with a hidden condition, though these sometimes overlap. Comments should be provided for code indented this way, so we don't assume it is simply code structure.

## File naming conventions
JavaScript files typically contain only one object, with one global identifier, which is the base file name. Polyfills or shims extending another global object include a prefix of the global object and a dot, just as they are referenced in JavaScript. If multiple global identifiers are created, the filename should contain them all, separated by symbols. Of course, all of these names end with the .js extension.

### Other files
Most other files don't return a named object, so the convention is less strict.

## console.entero
This was mostly for remote debugging. For most normal use, it is too bulky, except perhaps in testing or sometimes for some web sites. Conventions for it are in the wshta repo's [CONTRIBUTING.md](//quasic.github.io/CONTRIBUTING.md), if you are interested. The verbose version for browsers is in the shims folder.