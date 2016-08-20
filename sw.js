var cacheName = 'GWT-PWA';  
var filesToCache = [  
                     '/gwt-pwa/pwademo.html',  
                     '/gwt-pwa/pwademo.css',  
                     '/gwt-pwa/styles/app-theme.html',  
                     '/gwt-pwa/styles/shared-styles.html', 
                     '/gwt-pwa/dev-imports.html',
                     '/gwt-pwa/manifest.json', 
                     '/gwt-pwa/pwademo/bower_components/paper-drawer-panel/paper-drawer-panel.html',
                     '/gwt-pwa/pwademo/bower_components/iron-icons/iron-icons.html',
                     '/gwt-pwa/pwademo/bower_components/iron-icons/maps-icons.html',
                     '/gwt-pwa/pwademo/bower_components/iron-pages/iron-pages.html',
                     '/gwt-pwa/pwademo/bower_components/iron-selector/iron-selector.html',
                     '/gwt-pwa/pwademo/bower_components/paper-button/paper-button.html',
                     '/gwt-pwa/pwademo/bower_components/paper-icon-button/paper-icon-button.html',
                     '/gwt-pwa/pwademo/bower_components/paper-item/paper-item.html',
                     '/gwt-pwa/pwademo/bower_components/paper-material/paper-material.html',
                     '/gwt-pwa/pwademo/bower_components/paper-menu/paper-menu.html',
                     '/gwt-pwa/pwademo/bower_components/paper-scroll-header-panel/paper-scroll-header-panel.html',
                     '/gwt-pwa/pwademo/bower_components/paper-styles/typography.html',
                     '/gwt-pwa/pwademo/bower_components/paper-toast/paper-toast.html',
                     '/gwt-pwa/pwademo/bower_components/paper-toolbar/paper-toolbar.html',
                     '/gwt-pwa/pwademo/bower_components/paper-card/paper-card.html',
                     '/gwt-pwa/leaflet/leaflet.js',  
                     '/gwt-pwa/leaflet/leaflet.css',
                     '/gwt-pwa/image/mapicon.png',
                      '/gwt-pwa/pwademo/pwademo.nocache.js',
                      '/gwt-pwa/pwademo/A3DD6C55E113731240D24DE00CB02416.cache.js',
                       '/gwt-pwa/pwademo/deferredjs/1F2278A7BD2741D7BEEED226CE79BC93/1.cache.js',
                       '/gwt-pwa/pwademo/deferredjs/1F2278A7BD2741D7BEEED226CE79BC93/2.cache.js',
                       '/gwt-pwa/pwademo/deferredjs/1F2278A7BD2741D7BEEED226CE79BC93/3.cache.js'];

self.addEventListener('install', function(e) {  
  console.log('[ServiceWorker] Install');  
  e.waitUntil(  
    caches.open(cacheName).then(function(cache) {  
      console.log('[ServiceWorker] Caching app shell');  
      return cache.addAll(filesToCache);  
    })  
  );  
});


self.addEventListener('activate', function(e) {  
	  console.log('[ServiceWorker] Activate');  
	  e.waitUntil(  
	    caches.keys().then(function(keyList) {  
	      return Promise.all(keyList.map(function(key) {  
	        console.log('[ServiceWorker] Removing old cache', key);  
	        if (key !== cacheName) {  
	          return caches.delete(key);  
	        }  
	      }));  
	    })  
	  );  
	});

self.addEventListener('fetch', function(e) {  
	  console.log('[ServiceWorker] Fetch', e.request.url);  
	  e.respondWith(  
	    caches.match(e.request).then(function(response) {  
	      return response || fetch(e.request);  
	    })  
	  );  
	});