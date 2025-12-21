// Service Worker for Kilimanibistro Caterers PWA
const CACHE_NAME = 'kilimanibistro-v2.0';
const APP_VERSION = '2.0.0';

// Core assets to cache immediately
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/services.html',
    '/gallery.html',
    '/about.html',
    '/contact.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/Images/logo.jpeg',
    '/Images/logo-192.png',
    '/Images/logo-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap'
];

// Image assets to cache (catering images)
const IMAGE_ASSETS = [
    '/Images/catering%202.jpg',
    '/Images/catering%203.jpg',
    '/Images/catering%204.jpg',
    '/Images/catering-setup.jpg',
    '/Images/cater%201.jpeg',
    '/Images/cater02.jpeg',
    '/Images/cater%2003.jpeg',
    '/Images/cater04.jpeg',
    '/Images/cater06.jpeg',
    '/Images/cater07.jpeg',
    '/Images/cater08.jpeg',
    '/Images/kcb%20logo.png',
    '/Images/amref%20logo.png',
    '/Images/UoN_Logo.png',
    '/Images/KENASlogoOne.png',
    '/Images/cms-africa-.jpg',
    '/Images/kavi-logo.webp',
    '/Images/sndbx%20logo.png',
    '/Images/wilde%20digital%20Logo.jpg'
];

// Install event - cache core assets immediately
self.addEventListener('install', event => {
    console.log(`[Service Worker] Installing version ${APP_VERSION}`);
    
    event.waitUntil(
        (async () => {
            try {
                // Open the cache
                const cache = await caches.open(CACHE_NAME);
                
                // Cache core assets
                await cache.addAll(CACHE_STRATEGIES.core.map(asset => asset.url));
                
                // Skip waiting to activate immediately
                self.skipWaiting();
                
                console.log(`[Service Worker] Core assets cached for ${CACHE_NAME}`);
            } catch (error) {
                console.error('[Service Worker] Install failed:', error);
            }
        })()
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating new version');
    
    event.waitUntil(
        (async () => {
            try {
                // Get all cache names
                const cacheNames = await caches.keys();
                
                // Delete old caches
                await Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
                
                // Take control of all clients
                await self.clients.claim();
                
                console.log(`[Service Worker] ${CACHE_NAME} is now active`);
            } catch (error) {
                console.error('[Service Worker] Activation failed:', error);
            }
        })()
    );
});

// Cache strategies for different types of requests
const CACHE_STRATEGIES = {
    core: [
        { url: '/', strategy: 'network-first' },
        { url: '/index.html', strategy: 'network-first' },
        { url: '/services.html', strategy: 'network-first' },
        { url: '/gallery.html', strategy: 'network-first' },
        { url: '/about.html', strategy: 'network-first' },
        { url: '/contact.html', strategy: 'network-first' },
        { url: '/styles.css', strategy: 'stale-while-revalidate' },
        { url: '/script.js', strategy: 'stale-while-revalidate' },
        { url: '/manifest.json', strategy: 'cache-first' },
        { url: '/Images/logo.jpeg', strategy: 'cache-first' },
        { url: '/Images/logo-192.png', strategy: 'cache-first' },
        { url: '/Images/logo-512.png', strategy: 'cache-first' },
        { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', strategy: 'stale-while-revalidate' },
        { url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap', strategy: 'stale-while-revalidate' }
    ],
    images: [
        { pattern: /\.(jpg|jpeg|png|gif|webp)$/, strategy: 'cache-first' }
    ],
    api: [
        { pattern: /\/api\//, strategy: 'network-first' }
    ]
};

// Fetch event - handle all requests with appropriate strategy
self.addEventListener('fetch', event => {
    // Skip non-GET requests and chrome-extension requests
    if (event.request.method !== 'GET' || 
        event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    // Check if request is for our domain
    if (!event.request.url.startsWith(self.location.origin) &&
        !event.request.url.includes('cdnjs.cloudflare.com') &&
        !event.request.url.includes('fonts.googleapis.com') &&
        !event.request.url.includes('fonts.gstatic.com')) {
        return;
    }
    
    // Determine cache strategy based on request
    const strategy = determineCacheStrategy(event.request);
    
    event.respondWith(
        (async () => {
            try {
                switch (strategy) {
                    case 'cache-first':
                        return await cacheFirstStrategy(event.request);
                    case 'network-first':
                        return await networkFirstStrategy(event.request);
                    case 'stale-while-revalidate':
                        return await staleWhileRevalidateStrategy(event.request);
                    case 'network-only':
                        return await fetch(event.request);
                    default:
                        return await networkFirstStrategy(event.request);
                }
            } catch (error) {
                console.error('[Service Worker] Fetch failed:', error);
                
                // Return offline page if available
                const cache = await caches.open(CACHE_NAME);
                const offlineResponse = await cache.match('/offline.html');
                if (offlineResponse) {
                    return offlineResponse;
                }
                
                // Return a simple offline message
                return new Response('You are offline. Please check your internet connection.', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain' }
                });
            }
        })()
    );
});

// Determine cache strategy based on request
function determineCacheStrategy(request) {
    const url = request.url;
    
    // Check core assets
    const coreAsset = CACHE_STRATEGIES.core.find(asset => asset.url === url);
    if (coreAsset) return coreAsset.strategy;
    
    // Check patterns
    for (const category in CACHE_STRATEGIES) {
        if (category !== 'core') {
            const assets = CACHE_STRATEGIES[category];
            for (const asset of assets) {
                if (asset.pattern && asset.pattern.test(url)) {
                    return asset.strategy;
                }
            }
        }
    }
    
    // Default strategy for HTML pages
    if (url.endsWith('.html') || 
        url === self.location.origin + '/' ||
        url.includes(self.location.origin + '/')) {
        return 'network-first';
    }
    
    // Default for other assets
    return 'stale-while-revalidate';
}

// Cache First Strategy
async function cacheFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        // Update cache in background if online
        if (navigator.onLine) {
            fetchAndCache(request, cache);
        }
        return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
    }
    return networkResponse;
}

// Network First Strategy
async function networkFirstStrategy(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        throw new Error('Network response not ok');
    } catch (error) {
        // Fall back to cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    
    // Return cached response immediately
    const cachedResponse = await cache.match(request);
    
    // Update cache in background
    if (navigator.onLine) {
        fetchAndCache(request, cache).catch(console.error);
    }
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // If no cache, fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
    }
    return networkResponse;
}

// Helper function to fetch and cache
async function fetchAndCache(request, cache) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
    } catch (error) {
        console.warn('[Service Worker] Failed to update cache:', error);
    }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-forms') {
        console.log('[Service Worker] Syncing form submissions');
        event.waitUntil(syncFormSubmissions());
    }
    
    if (event.tag === 'sync-images') {
        console.log('[Service Worker] Syncing images');
        event.waitUntil(syncImages());
    }
});

// Sync form submissions
async function syncFormSubmissions() {
    try {
        const db = await openFormDatabase();
        const forms = await getAllForms(db);
        
        for (const form of forms) {
            try {
                const response = await fetch(form.url, {
                    method: 'POST',
                    headers: form.headers || {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form.data)
                });
                
                if (response.ok) {
                    await deleteForm(db, form.id);
                    console.log(`[Service Worker] Form ${form.id} synced successfully`);
                }
            } catch (error) {
                console.error(`[Service Worker] Failed to sync form ${form.id}:`, error);
            }
        }
    } catch (error) {
        console.error('[Service Worker] Sync forms failed:', error);
    }
}

// Sync images in background
async function syncImages() {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        for (const imageUrl of IMAGE_ASSETS) {
            try {
                const response = await fetch(imageUrl);
                if (response.ok) {
                    await cache.put(imageUrl, response.clone());
                    console.log(`[Service Worker] Image ${imageUrl} cached`);
                }
            } catch (error) {
                console.warn(`[Service Worker] Failed to cache image ${imageUrl}:`, error);
            }
        }
    } catch (error) {
        console.error('[Service Worker] Sync images failed:', error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    console.log('[Service Worker] Push received');
    
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        console.error('[Service Worker] Failed to parse push data:', error);
        data = {
            title: 'Kilimanibistro Caterers',
            body: 'New update available',
            icon: '/Images/logo-192.png'
        };
    }
    
    const options = {
        body: data.body || 'New update from Kilimanibistro',
        icon: data.icon || '/Images/logo-192.png',
        badge: '/Images/logo-192.png',
        image: data.image || '/Images/catering-setup.jpg',
        vibrate: [100, 50, 100, 50, 100],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now()
        },
        actions: data.actions || [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Kilimanibistro Caterers',
            options
        )
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification clicked:', event.action);
    
    event.notification.close();
    
    event.waitUntil(
        (async () => {
            const clients = await self.clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            });
            
            const url = event.notification.data?.url || '/';
            
            // If a window is already open, focus it
            for (const client of clients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Otherwise open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })()
    );
});

// Notification close event
self.addEventListener('notificationclose', event => {
    console.log('[Service Worker] Notification closed');
});

// Periodically update content in background
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
        console.log('[Service Worker] Periodic sync for content update');
        event.waitUntil(updateContent());
    }
});

async function updateContent() {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Update HTML pages
        const pages = [
            '/',
            '/index.html',
            '/services.html',
            '/gallery.html',
            '/about.html',
            '/contact.html'
        ];
        
        for (const page of pages) {
            try {
                const response = await fetch(page);
                if (response.ok) {
                    await cache.put(page, response.clone());
                    console.log(`[Service Worker] Updated ${page}`);
                }
            } catch (error) {
                console.warn(`[Service Worker] Failed to update ${page}:`, error);
            }
        }
    } catch (error) {
        console.error('[Service Worker] Periodic sync failed:', error);
    }
}

// Database helper functions
async function openFormDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('form-submissions', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('forms')) {
                const store = db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp');
            }
        };
    });
}

async function getAllForms(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['forms'], 'readonly');
        const store = transaction.objectStore('forms');
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

async function deleteForm(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['forms'], 'readwrite');
        const store = transaction.objectStore('forms');
        const request = store.delete(id);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

// Store form submission in IndexedDB
async function storeFormSubmission(formData) {
    try {
        const db = await openFormDatabase();
        const transaction = db.transaction(['forms'], 'readwrite');
        const store = transaction.objectStore('forms');
        
        const submission = {
            url: '/api/contact',
            data: formData,
            timestamp: Date.now(),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        await store.add(submission);
        
        // Register sync event
        if ('sync' in self.registration) {
            await self.registration.sync.register('sync-forms');
        }
        
        console.log('[Service Worker] Form submission stored for sync');
    } catch (error) {
        console.error('[Service Worker] Failed to store form submission:', error);
    }
}

// Precache images on install
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PRECACHE_IMAGES') {
        event.waitUntil(syncImages());
    }
    
    if (event.data && event.data.type === 'STORE_FORM') {
        event.waitUntil(storeFormSubmission(event.data.formData));
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                console.log('[Service Worker] Cache cleared');
            })
        );
    }
});

// Log service worker status
console.log(`[Service Worker] Version ${APP_VERSION} loaded`);

// Send ready message to clients
self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'SW_READY',
                    version: APP_VERSION
                });
            });
        })
    );
});

// Handle messages from clients
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLAIM_CLIENTS') {
        self.clients.claim();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_INFO') {
        event.waitUntil(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                const keys = await cache.keys();
                
                event.ports[0].postMessage({
                    cacheName: CACHE_NAME,
                    cacheSize: keys.length,
                    version: APP_VERSION
                });
            })()
        );
    }
});