const fs = require('fs.extra');

var globalStyles = {};
var variables = {};

let config = {
  rootFolder: "/opt/development/meportal-static/vue/src",
  scan: ['styles', 'icons','components',],
  fileTypes: ['vue', 'scss'],
  ignoreFiles: ['_archived.scss'],
  //includes: ['@import "../styles/_colors.scss";'],
  includes: [],
  breaks: {
    fixedSize: {
      style: '.fixedSize',
      replace: [['toVw($vw', 'toPx($fs']],
      variables: ['$fs: ' + (1600 / 2400) + ';']
    }
  },
  output: "/opt/development/meportal-static/vue/src/generatedStyles/",
};

function padString(x, level) {
  var pad = new Array(level * 2 + 1).join(' ');
  return pad + x;
}

function replace(x, replacements) {
  
  let xx = x;
  replacements.forEach(r => {
    var previousIndex = 0;
    var index = 0;
    let result = [];
    do {
      index = xx.indexOf(r[0], previousIndex);
      if (index > -1) {
        result.push(xx.substring(previousIndex, index));
        result.push(r[1]);
        previousIndex = index + r[0].length;
      }
    } while (index > -1);
    if (previousIndex > 0) {
      result.push(xx.substr(previousIndex));
    }

    if (result.length > 0) {
      xx = result.join('');
    }
  });
  return xx;
}

let root = config.rootFolder;

class Style {

  constructor(style, level) {
    if (!level) {
      level = 1;
    }
    this.data = {
      style: style,
      children: [],
      isOpen: true,
      currentChildIndex: -1,
      styleLines: [],
      level: level
    };
  }

  isOpen() {
    return this.isOpen;
  }

  addChild(style) {
    
    if (this.data.currentChildIndex < 0) {
      this.data.children.push(new Style(style, this.data.level + 1));
      this.data.currentChildIndex = this.data.children.length - 1;
    } else {
      this.data.children[this.data.currentChildIndex].addChild(style);
    }
  }

  addStyleLine(styleLine) {
    if (this.data.currentChildIndex < 0) {
      this.data.styleLines.push(styleLine);
    } else {
      this.data.children[this.data.currentChildIndex].addStyleLine(styleLine);
    }
  }

  closeStyle() {
    if (this.data.currentChildIndex < 0) {
      this.data.isClosed = true;
      return true;
    } else {
      var childClosed = this.data.children[this.data.currentChildIndex].closeStyle();
      if (childClosed) {
        this.data.currentChildIndex = -1;
      }
      return false;
    }
  }

  writeStyle() {

    let outputLines = [];

    this.data.styleLines.forEach(styleLine => {
      outputLines.push(padString(styleLine, this.data.level));
    });
    
     this.data.children.forEach(child => {
       outputLines.push(...child.writeStyle());
    });

    let output = [];

    if (outputLines.length > 0) {

      var style = this.data.style.split('\n');
      output.push('');
      style.forEach((line, index) => {
        output.push(padString(line, this.data.level - 1) + (index == style.length - 1 ? " {" : ''));
      });

      output.push(...outputLines);
      output.push(padString("}", this.data.level - 1));
    }
    return output;
  }
}

//let copiedStyles = [];
globalStyles = createBreaks();

function createBreaks() {
  var style = {};
  Object.keys(config.breaks).forEach(key => {
    let item = config.breaks[key];
    style[key] = new Style(item.style);
    item.variables.forEach(z => {
      style[key].addStyleLine(z);
    });
  });
  return style;
}

function writeStyle(style, fileName, includes) {
  let output = [];
  if (includes) {
    output.push(...includes);
    output.push('');
  }
  Object.keys(style).forEach(key => {
    output.push(...style[key].writeStyle());
  });
  fs.writeFileSync(config.output + fileName + ".scss", output.join('\n'));
}

function parseFile(file, data) {

  let type = file.split(".").pop();
  let isVue = type === "vue";
  let startFound = !isVue;
  let ignoreBlock = 0;
  let stack = [];
  let styleAdded = false;
 
  var currentStyle = isVue ? createBreaks() : globalStyles;
  
  Object.keys(globalStyles).forEach(key => {
    let breakStyle = currentStyle[key];
    let breakConfig = config.breaks[key];

    data.forEach(line => {
      var include = false;
      if (!startFound) {
        startFound = line.trim().indexOf("<style") == 0;
      } else {
      
        let lineTrimmed = line.trim();
        let firstChar = lineTrimmed.substr(0, 1);
        let lastChar = lineTrimmed.charAt(lineTrimmed.length - 1)
        let z = lineTrimmed.indexOf('//');
        if (z > -1) {
          include = (lineTrimmed.substr(z) == "//!include");
          lineTrimmed = lineTrimmed.substr(0, z - 1);
        }
        if (lineTrimmed.length == 0) {
          //stack = [];
        }
        else {
          if (firstChar == "@" && lastChar == "{") {
            ignoreBlock++;
          } else {
            if (ignoreBlock > 0) {
              if (lineTrimmed == "}") {
                ignoreBlock--;
              }
            } else {
              if (firstChar == '$') {
                var variableLine = replace(lineTrimmed, breakConfig.replace);
                if (variableLine !== lineTrimmed) {
                  var n = lineTrimmed.indexOf(':');
                  var variableName = lineTrimmed.substr(0, n);
                  console.log("variableName: " + variableName);
                  if (!variables[variableName]) {
                    variables[variableName] = true;
                  }
                  breakStyle.addStyleLine(variableLine);
                }
              } else {

                if (lastChar == ',') {
                  stack.push(lineTrimmed);
                } else if (lineTrimmed.charAt(lineTrimmed.length - 1) == "{") {
                  
                  let x = lineTrimmed.slice(0, -1).trim();
                  stack.push(x);
                  breakStyle.addChild(stack.join('\n'));
                  stack = [];
                  
                } else if (lineTrimmed == "}") {
                  
                  breakStyle.closeStyle();
                  stack = [];
                  
                } else {

                  if (include) {
                    breakStyle.addStyleLine(replace(lineTrimmed, breakConfig.replace));
                    styleAdded = true;
                  } else {
                    var match = false;
                    var keys = Object.keys(variables);
                  
                    for (var i = 0; i < keys.length && !match; i++) {
                      match = lineTrimmed.indexOf(keys[i]) > -1;
                    }
                    if (match) {
                      console.log("found variable in line:");
                      styleAdded = true;
                      breakStyle.addStyleLine(replace(lineTrimmed, breakConfig.replace));
                      match = true;
                    }
                  
                    if (!match) {
                      var replaced = replace(lineTrimmed, breakConfig.replace);
                      if (replaced != lineTrimmed) {
                        styleAdded = true;
                        breakStyle.addStyleLine(replaced);
                      } else {
                        if (lineTrimmed.substr(0, 1) == ",") {
                          stack.push(lineTrimmed);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  });

  if (isVue && styleAdded) {
    var s = file.split('.');
    s.pop();
    writeStyle(currentStyle, s.pop());
  }
}

config.scan.forEach(subFolder => {
  let folder = root + "/" + subFolder;
  console.log("Folder: " + folder);
  let folderFiles = fs.readdirSync(folder);
  let parseFiles = folderFiles.filter(file => {

    let extension = file.split('.').pop();
    if (config.fileTypes.indexOf(extension) > -1 && config.ignoreFiles.indexOf(file) < 0) {
      return true;
    }
    return false;
  });

  parseFiles.forEach(file => {
    console.log("Reading: " + file);
    var textData = fs.readFileSync(folder + '/' + file, { encoding: 'utf-8' });
    parseFile(file, textData.split('\n'));
  });
});

writeStyle(globalStyles, 'breaks', config.includes);

