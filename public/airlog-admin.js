/**
 * airlog-admin.js
 *
 * @author bigggge
 */

new Vue({
  el: '#app',

  data: {
    logs: [],
    errors: [],
    performance: {pageloadtime: 0, dns: 0, tcp: 0, ttfb: 0},
    filterText: '',
    show: true,
    showAll: true
  },

  created: function () {
    var socketUrl = window.location.href;
    var socket = io(socketUrl);
    var vm = this;
    vm.logWelcome();

    console.log();
    socket.on('log', function (data) {
      console.log.apply(console, data.content);
      vm.addLog(data);
    });
    socket.on('warn', function (data) {
      console.warn.apply(console, data.content);
      vm.addLog(data);
    });
    socket.on('error', function (data) {
      console.error.apply(console, data.content);
      vm.addLog(data);
    });
    socket.on('performance', function (data) {
      vm.addPerformance(data);
    });
  },

  computed: {
    filteredLogs: function () {
      var that = this;
      return this.logs.filter(function (log) {
        return JSON.stringify(log.content).toLowerCase().indexOf(that.filterText.toLowerCase()) >=
          0;
      });
    }
  },

  filters: {
    pretty: function (value) {
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
      return value;
    },
    timeformat: function (value) {
      var date = new Date(value);
      var delta = new Date() - date;

      if (delta <= 2000) {
        return '刚刚';
      }
      var units = null;
      var conversions = {
        '秒': 1000,   // ms    -> sec
        '分钟': 60,     // sec   -> min
        '小时': 60,     // min   -> hour
        '天': 24,     // hour  -> day
        '月': 30,     // day   -> month (roughly)
        '年': 12      // month -> year
      };
      for (var key in conversions) {
        if (delta < conversions[key]) {
          break;
        } else {
          units = key;
          delta = delta / conversions[key];
        }
      }
      delta = Math.floor(delta);
      return [delta, units, '前'].join('');
    }
  },

  methods: {
    logWelcome: function () {
      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var e = ['\n %c ♥ %c  %c AirLog %c  %c ' +
                 'https://github.com/bigggge/AirLog/ ' +
                 '%c  %c ♥\n\n',
                 'color: #ff0007;padding:5px 0;',// 爱心
                 'background: #ff3b6a; padding:5px 0;', // 间隔
                 'background: #ff6c87; padding:5px 0; color: #fff', // AirLog
                 'background: #ff3b6a; padding:5px 0;', // 间隔
                 'background: #ffc3dc; padding:5px 0;', // 网址
                 'background: #ff3b6a; padding:5px 0;', // 间隔
                 'color: #ff0007;padding:5px 0;']; // 爱心
        console.log.apply(console, e);
      } else {
        console.log('AirLog - https://github.com/bigggge/AirLog/ ');
      }
    },
    addLog: function (data) {
      data.show = true;
      data.showToggleButton = JSON.stringify(data.content).length > 100;
      data.title = data.content[0].toString().substring(0, 50);
      this.logs.unshift(data);
    },
    addPerformance: function (data) {
      this.performance = data.content;
    },
    clearLogs: function () {
      if (window.confirm('确认要清除所有记录吗')) {
        this.logs = [];
        this.filteredLogs = [];
      }
    },
    exportLogs: function () {
      var el = document.createElement('a');
      el.download = 'airlog-' + new Date().getTime() + '.json';
      el.style.display = 'none';
      var blob = new Blob([JSON.stringify(this.filteredLogs, null, 2)]);
      el.href = URL.createObjectURL(blob);
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
    toggleAll: function () {
      var vm = this;
      vm.showAll = !vm.showAll;
      vm.filteredLogs.forEach(function (t) {
        t.show = vm.showAll;
      });
    }
  }
});

Vue.config.devtools = true;


