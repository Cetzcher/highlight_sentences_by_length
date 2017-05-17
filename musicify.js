// ==UserScript==
// @name         Musicify
// @namespace   pRi
// @description Adds a download button for instagram images
// @include     https://*
// @include     http://*
// @version     1.001
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    var style =
    "#toggleMusicify{" +
      "position: fixed;" +
      "top: 0px;" +
      "left: 0px;" +
      "z-index: 9999;" +
      "background-color: #8FE8E0;" +
      "padding: 7px 10px;" +
      "margin: 10px;" +
      "border-radius: 6px;" +
      "border: 1px black solid;" +
      "box-shadow: 6px 6px 8px #888888;" +
      "font-size: 14pt" +
    "}\n" +
    "#MusicifyInput{" +
      'box-sizing:border-box; ' +
      'width: 100%;' +
      'height:100%' +
    "}\n" +
    "#MusicifyPanel{" +
      "position: fixed;" +
      "top: 45px;" +
      "left: 0px;" +
      "height: 820px;" +
      "width: 450px;" +
      "z-index: 9999;" +
      "background-color: white;" +
      "margin: 10px;" +
      "border-radius: 6px;" +
      "border: 1px black solid;" +
    "}\n" +
    "#colored{" +
      "margin: 8px;" +
      "font-size: 12pt; " +
    "}\n" +
    "#colored > span{" +
      "margin-left: 20px;" +
      "margin-right: 20px;" +
      "margin-top: 5px;" +
      "margin-bottom: 10px;" +
      "padding: 4px;" +
    "}\n" +
    ".Mdivs{" +
      "margin-top: 35px;" +
      "width: 420px;" +
      "border: 1px solid black;" +
      "height: 340px;" +
    "}";

    var contains = function(needle) {
      // Per spec, the way to identify NaN is that it is not equal to itself
      var findNaN = needle !== needle;
      var indexOf;

      if(!findNaN && typeof Array.prototype.indexOf === 'function') {
          indexOf = Array.prototype.indexOf;
      } else {
          indexOf = function(needle) {
              var i = -1, index = -1;

              for(i = 0; i < this.length; i++) {
                  var item = this[i];

                  if((findNaN && item !== item) || item === needle) {
                      index = i;
                      break;
                  }
              }

              return index;
      };
    }

    return indexOf.call(this, needle) > -1;
  };

    document.head.innerHTML += "<style>" + style + "</style>";
    var colors =
    [
      "#9BEFC7" /*1 word*/,
      "#81EFBA" /*2 words*/,
      "#56EFA5" /*3 words*/,
      "#2DEF91" /*4 words*/,
      "#13EF85" /*5 words*/,
      "#8FE8E0" /*6 words*/,
      "#7DE8DF" /*7 words*/,
      "#66E8DD" /*8 words*/,
      "#4AE8DA" /*9 words*/,
      "#37E8D9" /*10 words*/,
      "#17E8D6" /*11 words*/,
      "#CEB752" /*12 words*/,
      "#CEB237" /*13 words*/,
      "#CEAF23" /*14 words*/,
      "#CEAA0C" /*15 words*/,
      "#E2C026" /*16 words*/,
      "#91556F" /*17 words*/,
      "#914868" /*18 words*/,
      "#914164" /*19 words*/,
      "#A3426C" /*20 words*/,
      "#A33565" /*21 words*/,
      "#AA3F4D" /*22 words*/,
      "#AA3343" /*23 words*/,
      "#AA293A" /*24 words*/,
      "#C12E42" /*25 words*/
    ];

    var word_sep = [" ", "\t", "\n"];
    var sentenceEnd = [";", "."];

    function countWords(text)
    {
      var cnt = 0;
      for(var i = 0; i < text.length; i++)
      {
        if(contains.call(word_sep, text[i]))
          cnt += 1;
      }
      return cnt;
    }

    function clearElem(elem)
    {
      for(var i = 0; i < elem.children.length; i++)
        elem.removeChild(elem.children[i]);
    }


    function colorText(text)
    {
      var sentence = "";
      var sentences = [];

      for(var i = 0; i < text.length; i++)
      {
        sentence += text[i];
        if(contains.call(sentenceEnd ,text[i]))
        {
          sentences.push(sentence);
          sentence = "";
        }
      }
      sentences.push(sentence);

      var rt = document.createElement("div");
      rt.setAttribute("id", "colored");

      for(var i = 0; i < sentences.length; i++)
      {
        var elem = document.createElement("div");
        var color = "red";
        var wcnt = countWords(sentences[i]);
        if(wcnt < colors.length)
        {
          color = colors[wcnt];
        }
        elem.setAttribute("style", "background-color:" + color);
        elem.innerHTML = sentences[i];
        rt.appendChild(elem);
      }
      return rt;
    }


    function togglePanel()
    {
      var btn = document.getElementById("toggleMusicify");
      if(btn.getAttribute("data-state") === "false")
      {
        btn.setAttribute("data-state", "true");
        createPanel();
      }
      else
      {
        var panel = document.getElementById("MusicifyPanel");
        document.body.removeChild(panel);
        btn.setAttribute("data-state", "false");
      }
    }

    function createOutputPanel()
    {
      var panel = document.createElement("div");
      panel.setAttribute("id", "MusicifyOut");
      return panel;
    }

    function createInputPanel()
    {
      var panel = document.createElement("div");
      var area = document.createElement("textarea");
      area.setAttribute("id", "MusicifyInput");

      var inputFn = (function(ta)
      {
        return function()
        {
          var out = document.getElementById("MusicifyOut");
          clearElem(out);
          out.appendChild(colorText(ta.value));
        };})(area);

      panel.appendChild(area);
      panel.addEventListener("input", inputFn);
      return panel;
    }

    function createPanel()
    {
      var div = document.createElement("div");
      div.setAttribute("id", "MusicifyPanel");
      div.innerHTML = "<span>Enter text below and the text will be colored</span>";

      var outP = createOutputPanel();
      outP.setAttribute("class", "Mdivs");
      var inP = createInputPanel();
      inP.setAttribute("class", "Mdivs");
      div.appendChild(outP);
      div.appendChild(inP);
      document.body.appendChild(div);
    }

    function createToggleButton()
    {
      // create a toggle button on the upper left.
      var button = document.createElement("div");
      button.setAttribute("id", "toggleMusicify");
      button.setAttribute("data-state", "false");
      button.innerHTML = "<a style='color:#000;'> Toggle Musicify </a>";
      button.addEventListener("click", togglePanel);
      document.body.appendChild(button);
    }

    createToggleButton();

    // Your code here...
})();
