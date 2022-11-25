export var dev_template = `
<html>
  <head>
    <meta charset='utf-8'> 
    <title>{error}</title>
    <style>{style}</style>
  </head>
  <body>
    <div id="wrapper">
      <h1>{title}</h1>
      <h2><em>{statusCode}</em> {error}</h2>
      <ul id="stacktrace">{stack}</ul>
    </div>
  </body>
  <HR>
  <footer>
    Copyright 2020 GRMS cetacea.jp
  </footer>
</html>
`
export var prd_template = `
<html>
  <head>
    <meta charset='utf-8'> 
    <title>GRMS ERROR</title>
    <style>{style}</style>
  </head>
  <body>
    <img class="logo" height="30px" src="/assets/images/Hokushin.jp.png">
    <div id="wrapper">
      <h2 class="explain">内部エラーが発生しました。</h2>
      <div class="instruction">{html}</div>
    </div>
  </body>
  <HR>
  <footer>
    Copyright 2020 GRMS 
  </footer>
</html>
    `
export var ope_template = `
<html>
  <head>
    <meta charset='utf-8'> 
    <title>GRMS ERROR</title>
    <style>{style}</style>
  </head>
  <body>
    <img class="logo" height="30px" src="/assets/images/Hokushin.jp.png">
    <div id="wrapper">
    <h2 class="explain">{title}</h2>
      <div class="instruction">{html}</div>
    </div>
  </body>
  <HR>
  <footer>
    Copyright 2020 GRMS
  </footer>
</html>
`

export var STYLESHEET = `
* {
  margin: 0;
  padding: 0;
  outline: 0;
}
body {
  padding: 80px 100px;
  font: 13px "Helvetica Neue", "Lucida Grande", "Arial";
  background: #ECE9E9 -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#ECE9E9));
  background: #ECE9E9 -moz-linear-gradient(top, #fff, #ECE9E9);
  background-repeat: no-repeat;
  color: #555;
  -webkit-font-smoothing: antialiased;
}
h1, h2 {
  font-size: 22px;
  color: #343434;
}
h1 em, h2 em {
  padding: 0 5px;
  font-weight: normal;
}
h1 {
  font-size: 60px;
}
h2 {
  margin-top: 10px;
}
h2.explain {
  font-size: 30px;
}
.instruction {
  font-size: 16px;
  padding: 20px 10px;
}

#wrapper {
   margin-left: 20px;
}

ul li {
  list-style: none;
}
#stacktrace {
  margin-left: 60px;
}

footer {
  float: right;
}
`
