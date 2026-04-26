"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs text-nebulosity/50 sm:flex-1">
            &copy; 2026 Kredance. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-3 sm:flex-1">
            {/* Threads */}
            <Link
              href="https://www.threads.com/@itskredance"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads"
              className="h-8 w-8 rounded-full bg-nebulosity/5 flex items-center justify-center hover:bg-nebulosity/10 transition-colors"
            >
              <svg className="h-3.5 w-3.5 text-nebulosity/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.286 3.27-.853 1.058-2.037 1.636-3.517 1.718-1.124.062-2.17-.16-3.028-.645-1.026-.58-1.65-1.472-1.755-2.51-.095-.936.274-1.81 1.04-2.46.674-.572 1.583-.912 2.706-.988.828-.058 1.686.015 2.553.209.02-.145.032-.296.035-.453.017-.77-.09-1.466-.318-2.067-.275-.726-.714-1.285-1.306-1.665-.6-.385-1.32-.578-2.14-.575-1.17.005-2.108.39-2.788 1.147-.685.762-1.05 1.833-1.084 3.181l-2.114-.033c.046-1.796.58-3.24 1.588-4.29 1.03-1.074 2.42-1.633 4.132-1.66h.262c1.213.027 2.263.332 3.12.91.88.593 1.542 1.424 1.967 2.47.36.884.551 1.873.57 2.938.512.163.986.37 1.413.627 1.118.673 1.975 1.633 2.481 2.78.82 1.86.904 4.54-1.156 6.555-1.794 1.756-4.029 2.526-7.233 2.549zM9.99 15.78c.08.79.593 1.42 1.41 1.743.596.235 1.3.327 2.04.283 1.058-.059 1.896-.46 2.492-1.2.424-.525.748-1.216.965-2.058-.916-.253-1.856-.373-2.79-.32-.856.049-1.54.28-1.977.664-.39.342-.543.712-.518 1.063l.378-.175z" />
              </svg>
            </Link>

            {/* LinkedIn */}
            <Link
              href="https://www.linkedin.com/company/kredanceco"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="h-8 w-8 rounded-full bg-nebulosity/5 flex items-center justify-center hover:bg-nebulosity/10 transition-colors"
            >
              <svg className="h-3.5 w-3.5 text-nebulosity/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>

            {/* Instagram */}
            <Link
              href="https://www.instagram.com/itskredance/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="h-8 w-8 rounded-full bg-nebulosity/5 flex items-center justify-center hover:bg-nebulosity/10 transition-colors"
            >
              <svg className="h-3.5 w-3.5 text-nebulosity/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>

            {/* Facebook */}
            <Link
              href="https://www.facebook.com/share/17xH5nMuWH/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="h-8 w-8 rounded-full bg-nebulosity/5 flex items-center justify-center hover:bg-nebulosity/10 transition-colors"
            >
              <svg className="h-3.5 w-3.5 text-nebulosity/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
          </div>

          {/* Legal links */}
          <div className="flex items-center justify-end gap-3 text-[11px] text-nebulosity/40 sm:flex-1">
            <Link href="/privacy" className="hover:text-nebulosity/70 transition-colors">
              Privacy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-nebulosity/70 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
