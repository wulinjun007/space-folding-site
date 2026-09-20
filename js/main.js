/* 空间折叠设计手册 · 交互脚本 */
(function () {
  'use strict';

  /* ---------- 移动端导航 ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  /* ---------- 当前页高亮 ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('current');
  });

  /* ---------- 滚动揭示 ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.card, .kp, .think, .case, .diagram, .demo, .pitfall')
      .forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---------- 检查清单：localStorage 持久化 ---------- */
  document.querySelectorAll('ul.checklist[data-store]').forEach(function (ul) {
    var key = 'sfc:' + ul.dataset.store;
    var boxes = ul.querySelectorAll('input[type="checkbox"]');
    var barCount = ul.parentElement.querySelector('[data-count]');
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { saved = []; }

    function refresh() {
      var done = 0;
      boxes.forEach(function (c) { if (c.checked) done++; });
      if (barCount) barCount.textContent = done + ' / ' + boxes.length;
    }
    function persist() {
      var states = [];
      boxes.forEach(function (c) { states.push(c.checked); });
      try { localStorage.setItem(key, JSON.stringify(states)); } catch (e) {}
    }

    boxes.forEach(function (c, i) {
      if (saved[i]) c.checked = true;
      c.addEventListener('change', function () { refresh(); persist(); });
    });
    refresh();

    var reset = ul.parentElement.querySelector('.checklist-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        boxes.forEach(function (c) { c.checked = false; });
        persist(); refresh();
      });
    }
  });

  /* ---------- 状态演示：按钮切换 SVG 状态 ---------- */
  document.querySelectorAll('[data-demo]').forEach(function (demo) {
    var states = demo.querySelectorAll('.state');
    var btns = demo.querySelectorAll('.demo-ctl button');
    var caption = demo.querySelector('.demo-caption');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.dataset.state;
        btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        states.forEach(function (s) { s.classList.toggle('active', s.classList.contains(target)); });
        if (caption && btn.dataset.note) {
          caption.innerHTML = '<b>' + btn.textContent.trim() + '</b> — ' + btn.dataset.note;
        }
      });
    });
  });

  /* ---------- 时序时间轴：点击片段显示说明 ---------- */
  document.querySelectorAll('.tl-track').forEach(function (track) {
    var note = track.parentElement.querySelector('.tl-note');
    track.querySelectorAll('.tl-seg').forEach(function (seg) {
      seg.addEventListener('click', function () {
        track.querySelectorAll('.tl-seg').forEach(function (s) { s.classList.remove('active'); });
        seg.classList.add('active');
        if (note && seg.dataset.note) {
          note.innerHTML = '<b>' + seg.textContent.trim().split(' ')[0] + '</b> — ' + seg.dataset.note;
        }
      });
    });
  });
})();
