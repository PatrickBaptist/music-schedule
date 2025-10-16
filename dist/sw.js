if (!self.define) {
  let e,
    i = {};
  const n = (n, s) => (
    (n = new URL(n + ".js", s).href),
    i[n] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = i), document.head.appendChild(e);
        } else (e = n), importScripts(n), i();
      }).then(() => {
        let e = i[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, o) => {
    const r =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (i[r]) return;
    let t = {};
    const d = (e) => n(e, r),
      c = { module: { uri: r }, exports: t, require: d };
    i[r] = Promise.all(s.map((e) => c[e] || d(e))).then((e) => (o(...e), t));
  };
}
define(["./workbox-1ea6f077"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "assets/index-TDtgpPdy.js", revision: null },
        {
          url: "googlea26af0397fc161b2.html",
          revision: "7a4d28bd773e64e5dc0a2a74fffc1fca",
        },
        { url: "index.html", revision: "a9a6e3586a3463c6615de5c7fe3e0333" },
        { url: "registerSW.js", revision: "1872c500de691dce40960bb85481de07" },
        { url: "logo-192.png", revision: "c38ad43e8c0fc65e06bf482879322e8d" },
        { url: "logo-512.png", revision: "d609db9246706155751ae8d8968080d7" },
        {
          url: "manifest.webmanifest",
          revision: "45e57e555cd2b5b29f5ffdd7d5314011",
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))
    ),
    e.registerRoute(
      /^https?.*/,
      new e.NetworkFirst({
        cacheName: "offline-cache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET"
    );
});
