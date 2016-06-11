(function() {
  var theme = document.body.classList.contains("dark") ? "dark" : "light";
  var codemirrorDiv = document.getElementById('codemirror');
  if (codemirrorDiv) {
    window.editor = CodeMirror.fromTextArea(codemirrorDiv, {
      lineNumbers: true,
      mode: 'javascript',
      scrollbarStyle: 'null',
      theme: theme === 'dark' ? 'monokai' : 'default'
    });
  }

  // var codemirrorDiv2 = document.getElementById('codemirror2');
  // if (codemirrorDiv2) {
  //   window.editor = CodeMirror.fromTextArea(codemirrorDiv2, {
  //     lineNumbers: true,
  //     mode: 'javascript',
  //     scrollbarStyle: 'null',
  //     theme: theme === 'dark' ? 'monokai' : 'default'
  //   });
  // }
  //
  // var codemirrorDiv3 = document.getElementById('codemirror3');
  // if (codemirrorDiv3) {
  //   window.editor = CodeMirror.fromTextArea(codemirrorDiv3, {
  //     lineNumbers: true,
  //     mode: 'javascript',
  //     scrollbarStyle: 'null',
  //     theme: theme === 'dark' ? 'monokai' : 'default'
  //   });
  // }

  var btn = document.querySelector("#showcode");
  if (btn) {
    btn.addEventListener("click", function(event) {
      document.querySelector(".manual").classList.toggle("visible");
    });
  }
  // var btn2 = document.querySelector("#showcode2");
  // if (btn2) {
  //   btn2.addEventListener("click", function(event) {
  //     document.querySelector(".manual").classList.toggle("visible");
  //   });
  // }
  // var btn3 = document.querySelector("#showcode3");
  // if (btn3) {
  //   btn3.addEventListener("click", function(event) {
  //     document.querySelector(".manual").classList.toggle("visible");
  //   });
  // }

  window.highlightLine = function highlightLine(lineNumber) {
      //Line number is zero based index
      var actualLineNumber = lineNumber - 1;
      //Set line css class
      window.editor.addLineClass(actualLineNumber, 'background', 'line-highlight');
  }
})();
