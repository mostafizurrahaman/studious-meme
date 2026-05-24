'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import noticeImage from '@/assets/notice.png';

const NOTICE_DISMISSED_KEY = 'malamal_notice_popup_dismissed';
const NOTICE_STORE_EVENT = 'malamal-notice-popup-change';

// subscribeToNoticeStore function
function subscribeToNoticeStore(onStoreChange: () => void) {
  addEventListener('storage', onStoreChange);
  addEventListener(NOTICE_STORE_EVENT, onStoreChange);

  return () => {
    removeEventListener('storage', onStoreChange);
    removeEventListener(NOTICE_STORE_EVENT, onStoreChange);
  };
}

// getNoticeSnapshot function
function getNoticeSnapshot() {
  return localStorage.getItem(NOTICE_DISMISSED_KEY) !== 'true';
}

// getServerNoticeSnapshot function
function getServerNoticeSnapshot() {
  return false;
}

// NoticePopup component
export function NoticePopup() {
  const open = useSyncExternalStore(
    subscribeToNoticeStore,
    getNoticeSnapshot,
    getServerNoticeSnapshot,
  );

  // closeNotice function
  function closeNotice() {
    localStorage.setItem(NOTICE_DISMISSED_KEY, 'true');
    dispatchEvent(new Event(NOTICE_STORE_EVENT));
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4 py-8 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Notice"
    >
      <div className="relative max-h-[calc(100vh-4rem)] overflow-hidden rounded-lg shadow-2xl sm:max-h-[calc(100vh-5rem)]">
        <button
          type="button"
          onClick={closeNotice}
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-background/95 text-foreground shadow-md transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close notice"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <Image
          src={noticeImage}
          alt="Notice"
          height={400}
          width={800}
          className="h-auto max-h-[calc(100vh-4rem)] w-auto max-w-[calc(100vw-2rem)] object-contain sm:max-h-[calc(100vh-5rem)]"
          priority
          sizes="(max-width: 768px) calc(100vw - 32px), 768px"
        />
      </div>
    </div>
  );
}
