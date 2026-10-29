/**
 * =======================================================
 * SEARA INVENTORY SYSTEM - VERSION 1.5.6
 * Service Worker: Offline Cache & Background Fetch
 * =======================================================
 */

const CACHE_NAME = 'seara-inventory-v1.5.6';

// ไฟล์แกนหลักที่ต้องแคชสำหรับรันแอปแบบ Offline
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon.png'
];

self.addEventListener('install', (event) => {
  // บังคับให้ Service Worker ตัวใหม่ทำงานทันที ไม่ต้องรอปิดแท็บ
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // เข้าควบคุมหน้าเว็บทั้งหมดทันที
  self.clients.claim();
});

// data.json วิ่งตรงออก Network เสมอ ไม่กักแคช เพื่อให้ได้ข้อมูลสต็อกสดใหม่
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('data.json') || event.request.url.includes('v_check')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
