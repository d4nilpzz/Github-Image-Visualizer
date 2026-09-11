(function () {
  "use strict";

  const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|bmp|ico|svg|avif)$/i;
  const PROCESSED_ATTR = "data-gtv-processed";
  const SMALL_IMAGE_THRESHOLD = 32;

  function blobHrefToRawUrl(href) {
    try {
      const url = new URL(href, location.origin);
      const parts = url.pathname.split("/").filter(Boolean);
      const blobIdx = parts.indexOf("blob");
      if (blobIdx === -1 || blobIdx < 2) return null;

      const owner = parts[0];
      const repo = parts[1];
      const branch = parts[blobIdx + 1];
      const filePath = parts.slice(blobIdx + 2).join("/");
      if (!owner || !repo || !branch || !filePath) return null;

      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    } catch (e) {
      return null;
    }
  }

  function findFileLink(row) {
    return row.querySelector(
      'a.Link--primary[href*="/blob/"], a.js-navigation-open[href*="/blob/"]'
    );
  }

  function processRow(row) {
    if (row.hasAttribute(PROCESSED_ATTR)) return;
    row.setAttribute(PROCESSED_ATTR, "1");

    const link = findFileLink(row);
    if (!link) return;

    const filename = link.getAttribute("title") || link.textContent.trim();
    if (!IMAGE_EXT_RE.test(filename)) return;

    const rawUrl = blobHrefToRawUrl(link.getAttribute("href"));
    if (!rawUrl) return;

    row.classList.add("gtv-image-row");

    const icons = row.querySelectorAll("svg.octicon-file");
    icons.forEach((icon) => makeThumbnail(icon, rawUrl));
  }

  function makeThumbnail(icon, rawUrl) {
    const wrapper = document.createElement("span");
    wrapper.className = "gtv-thumb-wrapper";

    const img = document.createElement("img");
    img.className = "gtv-thumb";
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = "";
    img.src = rawUrl;

    img.addEventListener("load", () => {
      if (
        img.naturalWidth > 0 &&
        img.naturalWidth <= SMALL_IMAGE_THRESHOLD &&
        img.naturalHeight <= SMALL_IMAGE_THRESHOLD
      ) {
        img.classList.add("gtv-pixelated");
      }
    });

    img.addEventListener("error", () => {
      wrapper.replaceWith(icon);
    });

    wrapper.appendChild(img);
    icon.replaceWith(wrapper);
  }

  function scan(root) {
    const scope = root || document;
    scope
      .querySelectorAll(
        `tr.react-directory-row:not([${PROCESSED_ATTR}]), tr.js-navigation-item:not([${PROCESSED_ATTR}])`
      )
      .forEach(processRow);
  }

  scan();

  let scheduled = false;
  const observer = new MutationObserver((mutations) => {
    if (scheduled) return;
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          scan();
        });
        break;
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("turbo:load", () => scan());
  document.addEventListener("pjax:end", () => scan());
})();
