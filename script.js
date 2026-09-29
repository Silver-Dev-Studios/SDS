/* SDS site script */
(function () {
  'use strict';

  var NEWS = [
    {
      id: 'identities-launch',
      date: '2025-08-14',
      type: 'product',
      title: 'identities.dev has launched',
      excerpt: 'After months of tinkering, we shipped identities.dev - our profile-making website built to be a link-in-bio with more room to be yourself.',
      body: 'After months of tinkering, we finally shipped identities.dev. Our goal was simple: a link-in-bio profile with more customization than the usual platforms - more room to show who you actually are. The first public build is live today. Profiles are public by default, editable in seconds, and every page is a tiny work of art. We have big plans for where this goes next. Launch build of identities.dev. Profile editor with live preview. Custom link cards, themes, and styling presets. Head over to identities-dev.com to make your own.',
      tags: ['Product', 'Launch']
    },
    {
      id: 'sds-welcome',
      date: '2025-08-01',
      type: 'studio',
      title: 'Welcome to Silver Dev Studios',
      excerpt: 'Introducing the studio behind the projects - small team, obsessive attention to detail, and everything hand-built.',
      body: 'Silver Dev Studios (SDS) is the small team behind the projects you will find on this site. We make profiles, tools, and little web experiences - each one hand-built. This site is the studio front door: products live under the Products tab, and all announcements, releases, and behind-the-scenes posts now surface right here in News. If you ever had a profile that felt more like a username than a person - that is the exact problem we are here to solve.',
      tags: ['Studio', 'Announcement']
    },
    {
      id: 'identities-beta',
      date: '2025-07-18',
      type: 'product',
      title: 'identities.dev enters beta',
      excerpt: 'Private beta kicked off with a small crew - themes, custom links, and profile pages that actually feel like you.',
      body: 'Before the public launch, we ran a small private beta of identities.dev. The goal was to prove that a profile page could feel less like a sterile form, and more like a page you would actually want someone to visit. Beta invited a handful of early profile makers. Ship focus: live editing, custom link cards, and page themes. Every bug found helped shape the public build. The beta directly shaped everything we launched in August - thanks to everyone who poked, prodded, and broke things.',
      tags: ['Product', 'Beta']
    },
    {
      id: 'studio-focus',
      date: '2025-06-30',
      type: 'studio',
      title: 'What SDS is actually building toward',
      excerpt: 'A quick look at the studio philosophy: small tools, real personality, and none of the usual platform bloat.',
      body: 'Most profile and link-in-bio products chase the same playbook: maximize accounts, minimize personality. We think that is backwards. Our north star is identities.dev - a product where customization is not a premium tier, it is the point. What we build tends to be small in scope, big on craft, and allergic to bloat. Expect more tools from SDS that share that philosophy: a handful of opinions, a lot of polish, and nothing that gets in the way of expressing who you are.',
      tags: ['Studio', 'Philosophy']
    }
  ];

  var CFG = {
    duration: 1200,
    threshold:  0.4
  };

  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var newsList = document.getElementById('news-list');
  var newsCount = document.getElementById('news-count');
  var modal = document.getElementById('news-modal');
  var modalTitle = document.getElementById('modal-title');
  var modalDate = document.getElementById('modal-date');
  var modalTags = document.getElementById('modal-tags');
  var modalBody = document.getElementById('modal-body');
  var year = document.getElementById('year');

  var panelMap = {};
  panels.forEach(function (p) { panelMap[p.dataset.panel] = p; });
  var activeTab = 'home';

  function setPanel(name) {
    if (!panelMap[name]) name = 'home';
    panels.forEach(function (p) {
      p.hidden = true;
      p.classList.remove('is-active');
    });
    var target = panelMap[name];
    target.hidden = false;
    target.classList.add('is-active');
    activeTab = name;

    tabButtons.forEach(function (btn) {
      var isActive = btn.dataset.panel === name;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });

    history.replaceState(null, '', '#' + name);
    var label = name === 'home' ? 'SDS - Silver Dev Studios' : 'SDS - ' + name.charAt(0).toUpperCase() + name.slice(1);
    document.title = label;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setPanel(btn.dataset.panel); });
    btn.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var i = tabButtons.indexOf(btn);
      var next = e.key === 'ArrowRight' ? (i + 1) % tabButtons.length : (i - 1 + tabButtons.length) % tabButtons.length;
      tabButtons[next].focus();
      setPanel(tabButtons[next].dataset.panel);
    });
  });

  function routeFromHash() {
    var name = window.location.hash.replace('#', '');
    if (panelMap[name]) setPanel(name);
  }

  window.addEventListener('hashchange', routeFromHash);

  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    var start = performance.now();
    function frame(now) {
      var t = Math.min((now - start) / CFG.duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function formatDate(isoStr) {
    return new Date(isoStr + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function tagClass(type) {
    return type === 'product' ? 'type-product' : 'type-studio';
  }

  function renderNews() {
    newsCount.textContent = String(NEWS.length);
    newsList.innerHTML = '';
    var sorted = NEWS.slice().sort(function (a, b) { return +new Date(b.date + "T00:00:00Z") - +new Date(a.date + "T00:00:00Z"); });
    sorted.forEach(function (item, index) {
      var card = document.createElement('article');
      card.className = 'news-card' + (index === 0 ? ' featured' : '');
      card.tabIndex =  0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Read news: ' + item.title);

      var time = document.createElement('time');
      time.dateTime = item.date;
      time.textContent = formatDate(item.date);

      var tagsDiv = document.createElement('div');
      tagsDiv.className = 'news-tags';
      item.tags.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'tag ' + tagClass(item.type);
        span.textContent = tag;
        tagsDiv.appendChild(span);
      });

      var title = document.createElement('h3');
      title.textContent = item.title;

      var excerpt = document.createElement('p');
      excerpt.textContent = item.excerpt;

      var more = document.createElement('span');
      more.className = 'read-more';
      more.textContent = 'Read more ->';

      card.appendChild(time);
      card.appendChild(tagsDiv);
      card.appendChild(title);
      card.appendChild(excerpt);
      card.appendChild(more);
      card.addEventListener('click', function () { openModal(item); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(item); }
      });
      newsList.appendChild(card);
    });
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function openModal(item) {
    modalTitle.textContent = item.title;
    modalDate.textContent = formatDate(item.date).toUpperCase();
    modalTags.innerHTML = '';
    item.tags.forEach(function (tag) {
      var span = document.createElement('span');
      span.className = 'tag ' + tagClass(item.type);
      span.textContent = tag;
      modalTags.appendChild(span);
    });
    modalBody.innerHTML = "<p>" + String(item.body).replace(/([.!?])(?=[A-Z])/g, "$1 ") + "</p>";
    modal.querySelector('.modal-close').focus();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  modal.addEventListener('click', function (e) {
    if (e.target.matches('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  year.textContent = String(new Date().getFullYear());
  renderNews();
  routeFromHash();

  var heroObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && (!activeTab || activeTab === 'home')) {
        document.querySelectorAll('.metric-num').forEach(countUp);
        heroObserver.disconnect();
      }
    });
  }, { threshold: CFG.threshold });
  heroObserver.observe(document.querySelector('.hero-metrics'));

  function setStatus(card, state, label) {
    card.classList.toggle("is-up", state === "up");
    card.classList.toggle("is-down", state === "down");
    card.classList.toggle("is-checking", state === "checking");
    var labelEl = card.querySelector(".status-label");
    if (labelEl) labelEl.textContent = label;
  }

  function runStatusChecks() {
    var statusCards = document.querySelectorAll("[data-status-card]");
    if (!statusCards.length) return;

    setStatus(statusCards[1], "up", "OPERATIONAL");
    setStatus(statusCards[2], "up", "OPERATIONAL (" + NEWS.length + " ITEMS)");

    fetch("https://identities-dev.com", { method: "GET", mode: "no-cors", cache: "no-store" })
      .then(function () { setStatus(statusCards[0], "up", "REACHABLE"); })
      .catch(function () { setStatus(statusCards[0], "down", "UNREACHABLE"); });
  }
  runStatusChecks();
})();
