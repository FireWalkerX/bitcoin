(function() {
  var Size, availableRows, container, daysPerRow, init, languidResize, markOffScreenRows, maxDayHeight, model, onResize, onScroll, previousScrollY, render, resetElements, rows, size, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  model = require('./calendar.model');

  languidResize = require('common/behaviors/languid-resize');

  _ = require('lodash');

  maxDayHeight = 100;

  size = null;

  container = null;

  daysPerRow = 7;

  rows = {};

  availableRows = [];

  previousScrollY = 0;

  Size = function() {
    this.dayWidth = Math.floor((1 / daysPerRow) * container.offsetWidth);
    this.dayHeight = Math.min(this.dayWidth, maxDayHeight);
    this.cols = daysPerRow;
    this.topOffset = container.offsetTop;
    this.rows = Math.ceil(window.innerHeight / this.dayHeight);
    return console.log(this);
  };

  init = function() {
    container = document.createElement('div');
    container.className = 'calendar';
    document.body.appendChild(container);
    languidResize.on(onResize);
    window.onscroll = onScroll;
    return _.defer(function() {
      onResize();
      return render();
    });
  };

  resetElements = function() {
    var day, dayOfWeek, i, row, _i, _results;
    container.innerHTML = '';
    i = 0;
    _results = [];
    while (i++ < size.rows * 2) {
      row = document.createElement('ol');
      row.className = 'row';
      row.style.height = "" + size.dayHeight + "px";
      for (dayOfWeek = _i = 1; _i <= 7; dayOfWeek = ++_i) {
        day = document.createElement('li');
        day.className = "day-" + dayOfWeek;
        row.appendChild(day);
      }
      availableRows.push(row);
      _results.push(container.appendChild(row));
    }
    return _results;
  };

  render = function() {
    var end, idx, row, scrollY, start, visibleRange, _i, _j, _len, _results;
    scrollY = window.scrollY;
    start = Math.floor((scrollY - size.topOffset) / size.dayHeight);
    end = start + Math.ceil((window.innerHeight + size.topOffset) / size.dayHeight);
    if (scrollY > previousScrollY) {
      end += size.rows - 1;
    } else {
      start -= size.rows - 1;
    }
    previousScrollY = scrollY;
    visibleRange = (function() {
      _results = [];
      for (var _i = start; start <= end ? _i <= end : _i >= end; start <= end ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    for (idx in rows) {
      row = rows[idx];
      if (__indexOf.call(visibleRange, idx) < 0) {
        availableRows.push(row);
        delete rows[idx];
      }
    }
    for (_j = 0, _len = visibleRange.length; _j < _len; _j++) {
      idx = visibleRange[_j];
      if (idx < 0) {
        continue;
      }
      row = availableRows.pop();
      if (!row) {
        console.warn("No row available for " + idx, availableRows);
        continue;
      }
      row.style.top = "" + (idx * size.dayHeight) + "px";
      rows[idx] = row;
    }
    return console.log('render()', {
      visible: "" + (end - start) + ": [" + start + "-" + end + "]",
      available: availableRows.length,
      rendered: Object.keys(rows),
      domRows: container.children.length
    });
  };

  markOffScreenRows = function(visibleRange) {};

  onResize = function() {
    size = new Size();
    return resetElements();
  };

  onScroll = render;

  module.exports = {
    init: init
  };

}).call(this);
