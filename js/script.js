document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     FOOTER YEAR
  ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     MOBILE NAV TOGGLE
  ========================================================= */
  const tabToggle = document.getElementById('tab-toggle');
  const tabLinks = document.getElementById('tab-links');

  if (tabToggle && tabLinks) {
    tabToggle.addEventListener('click', () => {
      const isOpen = tabLinks.classList.toggle('open');
      tabToggle.setAttribute('aria-expanded', String(isOpen));
    });
    tabLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        tabLinks.classList.remove('open');
        tabToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     ACTIVE NAV LINK ON SCROLL
  ========================================================= */
  const navAnchors = Array.from(document.querySelectorAll('.tab-links a[href^="#"]'));
  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = navAnchors.find(a => a.getAttribute('href') === `#${id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(sec => navObserver.observe(sec));
  }

  /* =========================================================
     SCROLL REVEALS
  ========================================================= */
  const revealTargets = document.querySelectorAll(
    '.about-copy, .id-badge, .skill-panel, .proc-table, .project-card, .commit-line, .contact-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* =========================================================
     SKILL BARS — animate width on view
  ========================================================= */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const inner = entry.target.querySelector('span');
        if (inner) {
          const target = inner.style.width;
          inner.style.setProperty('--target', target);
          entry.target.classList.add('filled');
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => {
    const inner = bar.querySelector('span');
    if (inner) {
      inner.dataset.finalWidth = inner.style.width;
      inner.style.width = '0';
    }
    skillObserver.observe(bar);
  });

  // re-apply real widths once "filled" class is added (CSS var trick fallback)
  const skillFillObserver = new MutationObserver(() => {
    document.querySelectorAll('.skill-bar.filled span').forEach(inner => {
      if (inner.dataset.finalWidth) inner.style.width = inner.dataset.finalWidth;
    });
  });
  document.querySelectorAll('.skill-bar').forEach(bar => {
    skillFillObserver.observe(bar, { attributes: true, attributeFilter: ['class'] });
  });

  /* =========================================================
     TERMINAL
  ========================================================= */
  const log = document.getElementById('terminal-log');
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');

  const NAME_ART = `Sean Owiti — Full-Stack Developer / Technical Lead / Nairobi, KE`;

  const COMMANDS = {
    help: () => [
      'available commands:',
      '  whoami       who is this, really',
      '  about        the short version',
      '  skills       core technologies',
      '  experience   current roles',
      '  projects     things I have shipped',
      '  education    ongoing coursework',
      '  contact      how to reach me',
      '  github       open my GitHub profile',
      '  sudo <any>   try it',
      '  clear        clear the screen'
    ],
    whoami: () => [
      'sean — CEO & Technical Team Lead, Technical Tutor, IT Technician/Lab Assistant',
      'based in Nairobi, Kenya. currently pursuing a Diploma in Information Technology.'
    ],
    about: () => [
      'Full-stack developer and startup CEO who still writes production code.',
      'I build retail systems, campus platforms, and local-AI tools for real problems.',
      'scroll to the "about" section, or run: goto about'
    ],
    skills: () => [
      'frontend : React, HTML5, CSS3, Responsive Design',
      'backend  : Python (Flask), Node.js, MySQL, REST APIs',
      'ai       : Local LLM integration, Ollama, Llama 3',
      'infra    : Ubuntu CLI, WSL, Git/GitHub, hardware diagnostics'
    ],
    experience: () => [
      '01  CEO & Technical Team Lead      — Startup Enterprise     (Jun 2025 – present)',
      '02  Technical Tutor, Web Dev       — Independent            (May 2026 – present)',
      '03  IT Technician / Lab Assistant  — PAC University         (ongoing)'
    ],
    projects: () => [
      '- Intelligent Inventory Management System   (React / Flask / Local AI)',
      '- BridgeCode Platform                        (React / Node.js)',
      '- HealthLink Nexus                           (Cloud Architecture)',
      '- Personal Portfolio Platform                (HTML5 / CSS3)'
    ],
    education: () => [
      'Diploma in Information Technology — PAC University (ongoing)',
      'Certificate in Information Technology — PAC University (2025)'
    ],
    contact: () => [
      'email : owitisean2025@gmail.com',
      'phone : +254 115 162 996',
      'github: github.com/WiziardSean',
      'base  : Tena Estate, Nairobi, Kenya'
    ],
    github: () => {
      window.open('https://github.com/WiziardSean', '_blank', 'noopener');
      return ['opening github.com/WiziardSean ...'];
    },
    clear: () => { log.innerHTML = ''; return null; },
    ls: () => ['about/  skills/  experience/  projects/  education/  contact/'],
    date: () => [new Date().toString()],
  };

  const SECTION_IDS = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];

  function printLine(text, cls) {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    log.appendChild(p);
  }

  function printCmdEcho(cmd) {
    const p = document.createElement('p');
    p.className = 'line-cmd';
    p.textContent = cmd;
    log.appendChild(p);
  }

  function scrollLogToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function runCommand(raw) {
    const cmdRaw = raw.trim();
    if (!cmdRaw) return;
    printCmdEcho(cmdRaw);

    const lower = cmdRaw.toLowerCase();
    const [word, ...rest] = lower.split(/\s+/);

    if (word === 'goto' && SECTION_IDS.includes(rest[0])) {
      const target = document.getElementById(rest[0]);
      if (target) {
        printLine(`navigating to #${rest[0]} ...`, 'line-accent');
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 250);
      }
      return;
    }

    if (word === 'sudo') {
      printLine(`Nice try. This terminal runs on trust, not root.`, 'line-error');
      if (rest.join(' ').includes('make-coffee')) {
        printLine('brewing... ☕ — coffee not found. try tea instead.', 'line-accent');
      }
      return;
    }

    if (SECTION_IDS.includes(word) && rest.length === 0 && COMMANDS[word]) {
      const lines = COMMANDS[word]();
      if (lines) lines.forEach(l => printLine(l));
      const target = document.getElementById(word);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 200);
      }
      return;
    }

    if (COMMANDS[word]) {
      const lines = COMMANDS[word]();
      if (lines) lines.forEach(l => printLine(l));
      return;
    }

    printLine(`command not found: ${word} — type "help" for a list`, 'line-error');
  }

  function bootSequence() {
    const bootLines = [
      { text: `> connecting to ${window.location.hostname || 'sean-portfolio'} ...`, delay: 120 },
      { text: '> connection established.', delay: 320 },
      { text: NAME_ART, delay: 480, cls: 'line-accent' },
      { text: 'type "help" to see available commands, or just scroll.', delay: 620 },
    ];
    bootLines.forEach(({ text, delay, cls }) => {
      setTimeout(() => printLine(text, cls), delay);
    });
    setTimeout(scrollLogToBottom, 700);
  }

  if (log && input) {
    bootSequence();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = input.value;
        input.value = '';
        runCommand(value);
        scrollLogToBottom();
      }
    });

    body.addEventListener('click', () => input.focus());

    document.querySelectorAll('.hint-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.fill;
        input.value = cmd;
        input.focus();
        runCommand(cmd);
        input.value = '';
        scrollLogToBottom();
      });
    });
  }

  /* =========================================================
     NAV COMMAND SHORTCUT (clicking nav also "types" a command, subtle touch)
  ========================================================= */
  document.querySelectorAll('.tab-links a[data-cmd]').forEach(link => {
    link.addEventListener('click', () => {
      // purely cosmetic: no-op, native anchor scroll handles navigation
    });
  });

});
