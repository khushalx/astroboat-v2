const categories = [
  "Launches",
  "Discoveries",
  "ISRO",
  "NASA/ESA",
  "Space Tech",
  "Deep Space",
  "Skywatching"
];

const sourceConfig = Array.isArray(window.ASTROBOAT_SOURCES) ? window.ASTROBOAT_SOURCES : [];
const launchConfig = Array.isArray(window.ASTROBOAT_UPCOMING_LAUNCHES)
  ? window.ASTROBOAT_UPCOMING_LAUNCHES
  : [];
const bookmarkKey = "astroboat.bookmarks.v1";

const fetchTransport = {
  timeoutMs: 3500,
  makeUrls(source) {
    return [
      source.url,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`
    ];
  }
};

const sampleStories = [
  {
    title: "NASA prepares next Artemis hardware for lunar mission integration",
    source: "NASA",
    date: "2026-04-28",
    category: "NASA/ESA",
    summary: "Teams continue preparing flight systems tied to future Artemis missions, with focus on integrated checks before launch operations.",
    url: "https://www.nasa.gov/news/",
    featured: true
  },
  {
    title: "ISRO advances Gaganyaan crew module recovery readiness",
    source: "ISRO",
    date: "2026-04-27",
    category: "ISRO",
    summary: "Recovery planning and test operations remain central as India moves toward human spaceflight validation milestones.",
    url: "https://www.isro.gov.in/",
    featured: true
  },
  {
    title: "New exoplanet atmosphere study sharpens search for habitable worlds",
    source: "European Southern Observatory",
    date: "2026-04-26",
    category: "Discoveries",
    summary: "Astronomers refined atmospheric clues from a distant planet, improving how future observations separate noise from possible biosignature context.",
    url: "https://www.eso.org/public/news/",
    featured: true
  },
  {
    title: "Commercial launch provider targets rideshare mission to low Earth orbit",
    source: "Spaceflight Now",
    date: "2026-04-25",
    category: "Launches",
    summary: "A multi-payload launch is scheduled to carry Earth observation, communications, and technology demonstration satellites into orbit.",
    url: "https://spaceflightnow.com/"
  },
  {
    title: "Engineers test compact deep-space communication terminal",
    source: "NASA JPL",
    date: "2026-04-24",
    category: "Space Tech",
    summary: "A new communications package is being evaluated for higher data rates and smaller spacecraft footprints on future exploration missions.",
    url: "https://www.jpl.nasa.gov/news/"
  },
  {
    title: "April meteor activity offers a useful target for early morning observers",
    source: "Sky & Telescope",
    date: "2026-04-22",
    category: "Skywatching",
    summary: "Observers under dark skies may catch increased meteor activity before dawn, especially away from city light pollution.",
    url: "https://skyandtelescope.org/observing/"
  }
];

const state = {
  stories: [],
  activeCategory: "All",
  query: "",
  bookmarks: readBookmarks()
};

const els = {
  feedStatus: document.querySelector("#feed-status"),
  todayList: document.querySelector("#today-list"),
  categoryNav: document.querySelector("#category-nav"),
  newsGrid: document.querySelector("#news-grid"),
  launchList: document.querySelector("#launch-list"),
  searchInput: document.querySelector("#search-input"),
  categoryFilter: document.querySelector("#category-filter"),
  loadingState: document.querySelector("#loading-state"),
  errorState: document.querySelector("#error-state"),
  emptyState: document.querySelector("#empty-state")
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function readBookmarks() {
  try {
    const saved = JSON.parse(localStorage.getItem(bookmarkKey));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveBookmarks() {
  localStorage.setItem(bookmarkKey, JSON.stringify(state.bookmarks));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function formatLaunchDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(new Date(value));
}

function guessCategory(title, fallback) {
  const text = title.toLowerCase();
  if (/(launch|rocket|liftoff|mission|falcon|ariane|pslv|gslv|starship)/.test(text)) return "Launches";
  if (/(isro|gaganyaan|chandrayaan|aditya|pslv|gslv)/.test(text)) return "ISRO";
  if (/(webb|hubble|nasa|esa|artemis|jpl|orion)/.test(text)) return "NASA/ESA";
  if (/(exoplanet|galaxy|black hole|supernova|discover|astronomers|cosmic)/.test(text)) return "Discoveries";
  if (/(satellite|engine|communications|station|technology|hardware|copernicus|sentinel)/.test(text)) return "Space Tech";
  if (/(meteor|aurora|moon|eclipse|sky|comet|observing)/.test(text)) return "Skywatching";
  if (/(asteroid|mars|jupiter|saturn|deep|solar system)/.test(text)) return "Deep Space";
  return fallback;
}

function makeSummary(text) {
  const clean = String(text || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return "A new space update is available from the original source.";
  return clean.length > 145 ? `${clean.slice(0, 142).trim()}...` : clean;
}

function normalizeUrl(url, sourceUrl) {
  try {
    return new URL(url, sourceUrl).href.split("#")[0];
  } catch {
    return sourceUrl;
  }
}

function normalizeTitle(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b(the|a|an|to|of|for|and|in|on|with|by|from|new|latest)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleSimilarity(a, b) {
  const wordsA = new Set(normalizeTitle(a).split(" ").filter(Boolean));
  const wordsB = new Set(normalizeTitle(b).split(" ").filter(Boolean));
  if (!wordsA.size || !wordsB.size) return 0;

  let overlap = 0;
  wordsA.forEach((word) => {
    if (wordsB.has(word)) overlap += 1;
  });

  return overlap / Math.max(wordsA.size, wordsB.size);
}

function dedupeStories(stories) {
  return stories.reduce((unique, story) => {
    const storyUrl = normalizeUrl(story.url, story.url);
    const duplicateIndex = unique.findIndex((candidate) => {
      const sameUrl = normalizeUrl(candidate.url, candidate.url) === storyUrl;
      return sameUrl || titleSimilarity(candidate.title, story.title) >= 0.82;
    });

    if (duplicateIndex === -1) {
      unique.push({ ...story, url: storyUrl });
      return unique;
    }

    const existing = unique[duplicateIndex];
    if (Number(Boolean(story.featured)) > Number(Boolean(existing.featured)) || new Date(story.date) > new Date(existing.date)) {
      unique[duplicateIndex] = { ...story, url: storyUrl };
    }

    return unique;
  }, []);
}

function sortStories(stories) {
  return [...stories].sort((a, b) => {
    const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDelta) return featuredDelta;
    return new Date(b.date) - new Date(a.date);
  });
}

function normalizeStories(stories) {
  const normalized = stories
    .filter((story) => story.title && story.url)
    .map((story) => {
      const date = Number.isNaN(new Date(story.date).getTime()) ? new Date() : new Date(story.date);
      const category = story.category || guessCategory(story.title, "Discoveries");

      return {
        title: story.title.trim(),
        source: story.source || "Unknown source",
        date: date.toISOString(),
        category,
        summary: makeSummary(story.summary),
        url: story.url,
        featured: Boolean(story.featured)
      };
    });

  return sortStories(dedupeStories(normalized));
}

async function fetchTextUrl(url) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), fetchTransport.timeoutMs);
  let response;

  try {
    response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function fetchText(source) {
  let lastError;

  for (const url of fetchTransport.makeUrls(source)) {
    try {
      return await fetchTextUrl(url);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Unable to fetch ${source.name}: ${lastError?.message || "unknown error"}`);
}

function parseRssSource(xmlText, source) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error(`Invalid feed XML for ${source.name}`);

  const rssItems = Array.from(doc.querySelectorAll("item"));
  const atomItems = Array.from(doc.querySelectorAll("entry"));
  const items = rssItems.length ? rssItems : atomItems;

  return items.slice(0, 8).map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "Untitled space update";
    const description =
      item.querySelector("description")?.textContent ||
      item.querySelector("summary")?.textContent ||
      item.querySelector("content")?.textContent ||
      "";
    const linkNode = item.querySelector("link");
    const rawUrl = linkNode?.getAttribute("href") || linkNode?.textContent?.trim() || source.url;
    const date =
      item.querySelector("pubDate")?.textContent ||
      item.querySelector("published")?.textContent ||
      item.querySelector("updated")?.textContent ||
      new Date().toISOString();
    const category = guessCategory(title, source.category);

    return {
      title,
      source: source.name,
      date,
      category,
      summary: makeSummary(description),
      url: normalizeUrl(rawUrl, source.url)
    };
  });
}

function parseLinkListSource(htmlText, source) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const links = Array.from(doc.querySelectorAll("a[href]"));
  const sourceHost = new URL(source.url).host;

  return links
    .map((link) => ({
      title: link.textContent.replace(/\s+/g, " ").trim(),
      url: normalizeUrl(link.getAttribute("href"), source.url)
    }))
    .filter((item) => {
      if (!item.title || item.title.length < 18) return false;
      const hostMatches = new URL(item.url).host === sourceHost;
      return hostMatches && /(press|update|news|release|mission|launch|space|isro|gaganyaan|chandrayaan|aditya)/i.test(`${item.title} ${item.url}`);
    })
    .slice(0, 8)
    .map((item) => {
      const category = guessCategory(item.title, source.category);
      return {
        title: item.title,
        source: source.name,
        date: new Date().toISOString(),
        category,
        summary: "A source update was detected. Astroboat is showing the headline and original link only.",
        url: item.url
      };
    });
}

async function fetchSource(source) {
  if (!source.enabled) return [];
  const text = await fetchText(source);
  if (source.type === "rss") return parseRssSource(text, source);
  if (source.type === "link-list") return parseLinkListSource(text, source);
  throw new Error(`Unsupported source type: ${source.type}`);
}

async function loadStories() {
  const enabledSources = sourceConfig.filter((source) => source.enabled);
  els.loadingState.classList.remove("is-hidden");
  els.errorState.classList.add("is-hidden");
  els.feedStatus.textContent = `Checking ${enabledSources.length} sources`;

  try {
    const results = await Promise.allSettled(enabledSources.map(fetchSource));
    const liveStories = results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);

    if (!liveStories.length) throw new Error("No live source stories available");

    state.stories = normalizeStories(liveStories);
    els.feedStatus.textContent = `${state.stories.length} stories from ${enabledSources.length} sources`;
  } catch {
    state.stories = normalizeStories(sampleStories);
    els.errorState.classList.remove("is-hidden");
    els.feedStatus.textContent = "Showing sample fallback stories";
  } finally {
    els.loadingState.classList.add("is-hidden");
    render();
  }
}

function isBookmarked(url) {
  return state.bookmarks.includes(url);
}

function storyCard(story, classes = "") {
  const bookmarked = isBookmarked(story.url);

  return `
    <article class="story-card ${classes}">
      <div class="story-meta">
        <span class="category-pill">${escapeHtml(story.category)}</span>
        <span>${escapeHtml(story.source)}</span>
        <span>${formatDate(story.date)}</span>
      </div>
      <h3>${escapeHtml(story.title)}</h3>
      <p class="summary">${escapeHtml(story.summary)}</p>
      <div class="card-actions">
        <a class="read-link" href="${escapeHtml(story.url)}" target="_blank" rel="noopener noreferrer">Read Original</a>
        <button class="bookmark-button${bookmarked ? " is-saved" : ""}" type="button" data-url="${escapeHtml(story.url)}">
          ${bookmarked ? "Saved" : "Bookmark"}
        </button>
      </div>
    </article>
  `;
}

function renderToday(stories) {
  const todayStories = stories.slice(0, 3);
  const [lead, ...sideStories] = todayStories;

  if (!lead) {
    els.todayList.innerHTML = "";
    return;
  }

  els.todayList.innerHTML = `
    ${storyCard(lead, "today-lead")}
    <div class="today-side">
      ${sideStories.map((story) => storyCard(story, "today-compact")).join("")}
    </div>
  `;
}

function getFilteredStories() {
  const query = state.query.trim().toLowerCase();

  return state.stories.filter((story) => {
    const matchesCategory = state.activeCategory === "All" || story.category === state.activeCategory;
    const haystack = `${story.title} ${story.category} ${story.source}`.toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function renderGrid(stories) {
  els.emptyState.classList.toggle("is-hidden", stories.length > 0);
  els.newsGrid.innerHTML = stories.slice(0, 18).map((story) => storyCard(story)).join("");
}

function renderCategoryNav() {
  els.categoryNav.innerHTML = ["All", ...categories]
    .map(
      (category) => `
        <button class="category-button${category === state.activeCategory ? " is-active" : ""}" type="button" data-category="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>
      `
    )
    .join("");
}

function renderLaunches() {
  els.launchList.innerHTML = launchConfig
    .map(
      (launch) => `
        <article class="launch-card">
          <div>
            <span class="status-pill">${escapeHtml(launch.status)}</span>
            <h3>${escapeHtml(launch.mission)}</h3>
            <p>${escapeHtml(launch.provider)}</p>
          </div>
          <time datetime="${escapeHtml(launch.date)}">${formatLaunchDate(launch.date)}</time>
          ${launch.url ? `<a class="read-link" href="${escapeHtml(launch.url)}" target="_blank" rel="noopener noreferrer">Details</a>` : ""}
        </article>
      `
    )
    .join("");
}

function render() {
  const filteredStories = getFilteredStories();
  renderToday(state.stories);
  renderGrid(filteredStories);
  renderCategoryNav();
}

function initFilters() {
  els.categoryFilter.innerHTML = ["All", ...categories]
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");

  els.categoryFilter.addEventListener("change", (event) => {
    state.activeCategory = event.target.value;
    render();
  });

  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  els.categoryNav.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.activeCategory = button.dataset.category;
    els.categoryFilter.value = state.activeCategory;
    render();
    document.querySelector("#feed").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".bookmark-button[data-url]");
    if (!button) return;

    const url = button.dataset.url;
    if (isBookmarked(url)) {
      state.bookmarks = state.bookmarks.filter((savedUrl) => savedUrl !== url);
    } else {
      state.bookmarks = [...state.bookmarks, url];
    }

    saveBookmarks();
    render();
  });

  renderCategoryNav();
  renderLaunches();
}

initFilters();
loadStories();
