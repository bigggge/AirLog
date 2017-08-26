/**
 * airlog-server.js
 *
 * @author bigggge
 */

(function () {

  var jsFileName = 'airlog-client.js';
  var reportPath = 'report';
  var LEVEL = {
    DEFAULT: 'default',
    ERROR: 'error'
  };

  var host = window.location.host;
  var reportUrl = '';
  var level = LEVEL.DEFAULT;

  init();

  function init () {
    var el = document.getElementById('airlog');
    if (!el) {
      return console.error('[AirLog warn]: Cannot find element: #airlog');
    }
    level = el.getAttribute('al-level') || LEVEL.DEFAULT;
    if (level !== LEVEL.DEFAULT && level !== LEVEL.ERROR) {
      return console.error('[AirLog warn]: al-level value must be \'default\' or \'error\'');
    }
    reportUrl = el.src.replace(jsFileName, reportPath);
  }

  // Report to server
  function report (type, data) {
    data.timestamp = new Date().getTime();
    if (level === LEVEL.DEFAULT || (level === LEVEL.ERROR && type === 'error')) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', reportUrl);
      xhr.setRequestHeader('Content-Type', 'application/json');
      var d = JSON.stringify({
        type: type,
        data: data
      });
      xhr.send(d);
    }
  }

  // Overwrite console.log
  console.log = overwrite(console.log, 'log');
  console.warn = overwrite(console.warn, 'warn');
  console.error = overwrite(console.error, 'error');

  function overwrite (originLog, name) {
    return function () {
      report(name, {
        host: host,
        content: [].slice.call(arguments)
      });
      originLog.apply(console, arguments);
    };
  }

  function getPerformanceData () {
    if (!window.performance) return;

    var t = window.performance.timing;
    var data = {};
    data.t = performance.timing;
    data.pageloadtime = t.loadEventStart - t.navigationStart;
    data.dns = t.domainLookupEnd - t.domainLookupStart;
    data.tcp = t.connectEnd - t.connectStart;
    data.ttfb = t.responseStart - t.navigationStart;

    return data;
  }

  window.onload = function () {
    setTimeout(function () {
      var data = getPerformanceData();
      report('performance', {
        host: host,
        content: data
      });
    }, 0);
  };

  /**
   *
   * @param message 错误信息（字符串）
   * @param source 发生错误的脚本URL（字符串）
   * @param lineno 发生错误的行号（数字）
   * @param colno 发生错误的列号（数字）
   * @param error Error对象（对象）
   */
  window.onerror = function (message, source, lineno, colno, error) {
    report('error', {
      content: [message],
      source: source,
      host: host,
      lineno: lineno,
      colno: colno
    });
  };

})();
