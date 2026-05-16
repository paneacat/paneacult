const CACHE = "paneacult-v2";

self.addEventListener(
  "install",
  e => {

    e.waitUntil(

      caches.open(CACHE).then(cache => {

        return cache.addAll([

          "/",
          "/index.html",

          "/css/base.css",
          "/css/components.css",
          "/css/home.css",
          "/css/mobile.css",

          "/js/ui.js",
          "/js/components.js",
          "/js/slider.js",

          "/manifest.json",

          "/img/logo.webp"

        ]);

      })

    );

  }
);


self.addEventListener(
  "fetch",
  e => {

    e.respondWith(

      caches.match(e.request).then(res => {

        return res || fetch(e.request);

      })

    );

  }
);
