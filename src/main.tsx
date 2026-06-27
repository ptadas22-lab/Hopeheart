import {StrictMode, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function ScrollResetWatcher() {
  useEffect(() => {
    let lastActiveScreenNode: Element | null = null;
    let observer: MutationObserver | null = null;

    const scrollToTop = () => {
      const viewport = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement | null;
      if (viewport) {
        viewport.scrollTo({top: 0, left: 0, behavior: 'auto'});
      }
      window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    };

    const attachObserver = () => {
      const screenHost = document.querySelector('.flex-1.flex.flex-col.w-full') as HTMLElement | null;
      if (!screenHost || observer) return;

      lastActiveScreenNode = screenHost.firstElementChild;
      observer = new MutationObserver(() => {
        const nextActiveScreenNode = screenHost.firstElementChild;
        if (nextActiveScreenNode && nextActiveScreenNode !== lastActiveScreenNode) {
          lastActiveScreenNode = nextActiveScreenNode;
          requestAnimationFrame(scrollToTop);
        }
      });
      observer.observe(screenHost, {childList: true});
    };

    attachObserver();
    const retryTimer = window.setInterval(attachObserver, 250);

    return () => {
      observer?.disconnect();
      window.clearInterval(retryTimer);
    };
  }, []);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScrollResetWatcher />
    <App />
  </StrictMode>,
);
