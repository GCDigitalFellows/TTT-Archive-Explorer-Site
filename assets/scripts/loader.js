/* Load the complete reading corpus before enabling search. Word-analysis and people data
 * load when their respective views open, then remain cached for that session.
 * The manifest describes JSON reconstruction and script order. It performs no
 * analysis. A failed initial load leaves the page disabled and offers a clean reload,
 * so incomplete text cannot silently produce incomplete search results.
 */
"use strict";
// Share one request per data group. Commit the fields together only after all
// files pass validation. Failed requests are removed so an explicit retry works.
function createDeferredArchiveData(data, groups, assemble) {
  const requests = new Map();
  function ensure(name) {
    if (requests.has(name)) return requests.get(name);
    if (!Object.hasOwn(groups, name))
      return Promise.reject(new Error("Unknown archive data group"));
    const request = Promise.all(
      Object.entries(groups[name]).map(async ([key, recipe]) => [
        key,
        await assemble(recipe),
      ]),
    )
      .then((entries) => {
        Object.assign(data, Object.fromEntries(entries));
        return data;
      })
      .catch((error) => {
        requests.delete(name);
        throw error;
      });
    requests.set(name, request);
    return request;
  }
  return { data, ensure };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createDeferredArchiveData };
}

// Node tests import the shared request logic above without starting a browser.
if (typeof document !== "undefined")
  (() => {
    const base = new URL("../../", document.currentScript.src);
    const manifestHash = document.currentScript.dataset.manifestSha256;
    const root = document.getElementById("welcoming-prototype");
    const status = document.getElementById("archive-loading-status");
    const retry = document.getElementById("archive-loading-retry");
    retry.addEventListener("click", () => location.reload());

    function asset(path) {
      const url = new URL(path, base);
      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
        throw new Error("Archive asset outside the release directory");
      }
      return url;
    }

    async function json(path, expectedHash) {
      const response = await fetch(asset(path), { cache: "no-cache" });
      if (!response.ok)
        throw new Error(`Archive request failed (${response.status}): ${path}`);
      const bytes = await response.arrayBuffer();
      // Refuse a mix of files from different releases or a damaged download.
      // The source tree’s manifest and each data recipe carry the expected hash.
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      const actualHash = Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
      if (actualHash !== expectedHash)
        throw new Error(`Archive checksum mismatch: ${path}`);
      return JSON.parse(new TextDecoder().decode(bytes));
    }

    async function assemble(recipe) {
      if (recipe.file) return json(recipe.file, recipe.sha256);
      if (recipe.fields) {
        const entries = await Promise.all(
          Object.entries(recipe.fields).map(async ([key, child]) => [
            key,
            await assemble(child),
          ]),
        );
        return Object.fromEntries(entries);
      }
      if (recipe.items) return Promise.all(recipe.items.map(assemble));
      if (recipe.merge) {
        const result = {};
        for (const part of await Promise.all(recipe.merge.map(assemble))) {
          for (const [key, value] of Object.entries(part)) {
            if (Object.hasOwn(result, key))
              throw new Error("Duplicate archive data key");
            result[key] = value;
          }
        }
        return result;
      }
      if (recipe.concat) return (await Promise.all(recipe.concat.map(assemble))).flat();
      throw new Error("Unknown archive data recipe");
    }

    async function start() {
      const manifest = await json("data/manifest.json", manifestHash);
      if (manifest.version !== 2)
        throw new Error("Unsupported archive manifest version");
      const fields = manifest.documents["wp-data"].fields;
      const deferredKeys = new Set(Object.values(manifest.deferred).flat());
      const initialRecipe = {
        fields: Object.fromEntries(
          Object.entries(fields).filter(([key]) => !deferredKeys.has(key)),
        ),
      };
      const documents = await Promise.all(
        Object.entries(manifest.documents).map(async ([id, recipe]) => [
          id,
          await assemble(id === "wp-data" ? initialRecipe : recipe),
        ]),
      );
      const saved = Object.fromEntries(documents);
      const byId = new Map(saved["wp-data"].posts.map((post) => [post.id, post]));
      if (
        byId.size !== manifest.postOrder.length ||
        byId.size !== saved["wp-data"].posts.length
      )
        throw new Error("Archive post coverage mismatch");
      saved["wp-data"].posts = manifest.postOrder.map((id) => {
        if (!byId.has(id)) throw new Error("Missing archive post");
        return byId.get(id);
      });
      for (const [id, value] of Object.entries(saved)) {
        document.getElementById(id).textContent = JSON.stringify(value);
      }
      const deferredGroups = Object.fromEntries(
        Object.entries(manifest.deferred).map(([name, keys]) => [
          name,
          Object.fromEntries(keys.map((key) => [key, fields[key]])),
        ]),
      );
      window.ArchiveData = createDeferredArchiveData(
        saved["wp-data"],
        deferredGroups,
        assemble,
      );
      // Keep measurable layout for chart initialization while controls remain
      // unavailable until every script has initialized successfully.
      root.hidden = false;
      root.inert = true;
      root.style.visibility = "hidden";
      // Existing classic scripts rely on their declared order. Runtime errors
      // must also stop startup, even if the browser fetched the script correctly.
      let initializationError;
      const capture = (event) => {
        initializationError = event.error || new Error(event.message);
      };
      window.addEventListener("error", capture);
      try {
        for (const entry of manifest.scripts) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = asset(entry.file);
            script.integrity = entry.integrity;
            script.onload = () =>
              initializationError ? reject(initializationError) : resolve();
            script.onerror = () =>
              reject(new Error(`Could not load script: ${entry.file}`));
            document.body.append(script);
          });
        }
      } finally {
        window.removeEventListener("error", capture);
      }
      root.inert = false;
      root.style.visibility = "";
      document.getElementById("archive-loading").remove();
      root.querySelector("#wp-active-heading")?.focus();
    }

    start().catch((error) => {
      root.hidden = true;
      console.error(error);
      status.textContent =
        "The archive could not finish loading. Check your connection and try again. Downloaded modular copies need a local web server.";
      retry.hidden = false;
    });
  })();
