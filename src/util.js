export function getInjectWeinreContent(host, port) {
  const src = `http://${host}:${port}/target/target-script-min.js#anonymous`;
  const injectContent = [
    '// weinre',
    '(function() {',
    '  if (typeof window === "undefined") { return };',
    '  window.onload = function() {',
    '    var id = "webpack-weinre-plugin-script";',
    '    if (document.getElementById(id)) { return; }',
    '    var el = document.createElement("script");',
    '    el.id = id;',
    '    el.async = true;',
    `    el.src = "${src}";`,
    '    document.body.appendChild(el);',
    '  }',
    '}());',
    '',
  ].join('\n');

  return injectContent;
}
