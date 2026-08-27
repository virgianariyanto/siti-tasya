import React from 'react'

export function getSocialPlatform(name = '', url = '', icon = '') {
  const lowerName = (name || '').toLowerCase().trim()
  const lowerUrl = (url || '').toLowerCase().trim()
  const lowerIcon = (icon || '').toLowerCase().trim()

  if (lowerIcon) {
    if (lowerIcon.includes('instagram') || lowerIcon === 'ig') return 'instagram'
    if (lowerIcon.includes('linkedin') || lowerIcon === 'in') return 'linkedin'
    if (lowerIcon.includes('behance') || lowerIcon === 'be') return 'behance'
    if (lowerIcon.includes('twitter') || lowerIcon === 'x' || lowerIcon.includes('x.com')) return 'x'
    if (lowerIcon.includes('youtube') || lowerIcon === 'yt') return 'youtube'
    if (lowerIcon.includes('tiktok') || lowerIcon === 'tt') return 'tiktok'
    if (lowerIcon.includes('artstation') || lowerIcon === 'art') return 'artstation'
    if (lowerIcon.includes('dribbble') || lowerIcon === 'dr') return 'dribbble'
    if (lowerIcon.includes('github') || lowerIcon === 'gh') return 'github'
    if (lowerIcon.includes('discord') || lowerIcon === 'dc') return 'discord'
    if (lowerIcon.includes('bluesky') || lowerIcon === 'bs') return 'bluesky'
    if (lowerIcon.includes('pinterest') || lowerIcon === 'pin') return 'pinterest'
    if (lowerIcon.includes('facebook') || lowerIcon === 'fb') return 'facebook'
    if (lowerIcon.includes('whatsapp') || lowerIcon === 'wa') return 'whatsapp'
    if (lowerIcon.includes('threads')) return 'threads'
    if (lowerIcon.includes('mail') || lowerIcon.includes('email')) return 'mail'
  }

  if (lowerName.includes('instagram') || lowerUrl.includes('instagram.com')) return 'instagram'
  if (lowerName.includes('linkedin') || lowerUrl.includes('linkedin.com')) return 'linkedin'
  if (lowerName.includes('behance') || lowerUrl.includes('behance.net')) return 'behance'
  if (lowerName.includes('twitter') || lowerName === 'x' || lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'x'
  if (lowerName.includes('youtube') || lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube'
  if (lowerName.includes('tiktok') || lowerUrl.includes('tiktok.com')) return 'tiktok'
  if (lowerName.includes('artstation') || lowerUrl.includes('artstation.com')) return 'artstation'
  if (lowerName.includes('dribbble') || lowerUrl.includes('dribbble.com')) return 'dribbble'
  if (lowerName.includes('github') || lowerUrl.includes('github.com')) return 'github'
  if (lowerName.includes('discord') || lowerUrl.includes('discord.gg') || lowerUrl.includes('discord.com')) return 'discord'
  if (lowerName.includes('bluesky') || lowerUrl.includes('bsky.app')) return 'bluesky'
  if (lowerName.includes('pinterest') || lowerUrl.includes('pinterest.com')) return 'pinterest'
  if (lowerName.includes('facebook') || lowerUrl.includes('facebook.com')) return 'facebook'
  if (lowerName.includes('whatsapp') || lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp.com')) return 'whatsapp'
  if (lowerName.includes('threads') || lowerUrl.includes('threads.net')) return 'threads'
  if (lowerName.includes('email') || lowerName.includes('mail') || lowerUrl.startsWith('mailto:')) return 'mail'

  return 'link'
}

export default function SocialIcon({ name = '', url = '', icon = '', className = 'w-6 h-6', fallbackLabel = '' }) {
  const platform = getSocialPlatform(name, url, icon)

  switch (platform) {
    case 'instagram':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0-.02-3.36 1.68 1.68 0 0 0 .02 3.36m1.39 9.74V9.93H5.07v8.57h2.78z" />
        </svg>
      )
    case 'behance':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 576 512">
          <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-92-127.3-92H0v369.5h154.5c86.4 0 134.4-44.2 134.4-109.9 0-43.2-22.6-76.3-56.9-93.6zm-136-93.6h48.3c34.3 0 52.6 12.3 52.6 39.5 0 26.6-18.4 39.5-52.6 39.5H96v-79zm51.7 220.5H96v-87.4h52.7c36.7 0 57.2 14.7 57.2 43.7 0 28.5-20.5 43.7-58.2 43.7zm285.8-212.7H318.5V114h115.2v37.4zm50.6 150.3c0-70-39.7-120.4-111.9-120.4-74.5 0-117.8 53.6-117.8 123.6 0 71.9 44.9 122.9 120.9 122.9 57.7 0 97.4-29.2 109.1-79.6h-49.7c-7.4 19.6-26.6 32.1-57.9 32.1-41.9 0-66.7-25.5-68.8-63h175.7c.3-4.7.4-9.9.4-15.6zm-176.2-22.1c4.2-34.8 26.3-55.9 63.8-55.9 35.8 0 58.2 21.1 61.9 55.9h-125.7z" />
        </svg>
      )
    case 'x':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.37 6.37 0 0 0-6.05 6.35 6.36 6.36 0 0 0 10.87 4.5 6.3 6.3 0 0 0 1.87-4.5V8.55a8.28 8.28 0 0 0 5.08 1.75V6.85a4.84 4.84 0 0 1-2.52-.16z" />
        </svg>
      )
    case 'artstation':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.772 17.065l1.642 2.843c.477.828 1.357 1.342 2.31 1.342h11.998l-2.455-4.185H1.772zm7.643-4.858l3.784-6.446 3.743 6.446H9.415zm13.882 4.095L17.75 6.388c-.46-.789-1.3-1.288-2.213-1.306l-4.148-.082 10.155 17.26h2.72c1.036 0 1.742-.99 1.31-1.958l-2.277-3.999z" />
        </svg>
      )
    case 'dribbble':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
          <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
          <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
        </svg>
      )
    case 'github':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    case 'discord':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      )
    case 'bluesky':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099z" />
        </svg>
      )
    case 'pinterest':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.057.24-.188.291-.434.175-1.62-.754-2.634-3.12-2.634-5.021 0-4.088 2.97-7.844 8.567-7.844 4.498 0 7.994 3.205 7.994 7.489 0 4.469-2.817 8.064-6.728 8.064-1.314 0-2.549-.683-2.973-1.49l-.809 3.085c-.293 1.12-1.087 2.524-1.618 3.392 1.132.35 2.339.542 3.593.542 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 0C5.396 0 .012 5.385.012 12.02c0 2.119.553 4.185 1.604 6.007L0 24l6.167-1.618c1.761.96 3.747 1.465 5.864 1.465 6.634 0 12.018-5.385 12.018-12.02C24.049 5.385 18.665 0 12.031 0zm.019 21.84c-1.815 0-3.593-.488-5.143-1.41l-.369-.219-3.821 1.002 1.02-3.725-.24-.382a9.987 9.987 0 0 1-1.534-5.087c0-5.529 4.498-10.026 10.027-10.026 2.678 0 5.197 1.044 7.09 2.937a9.983 9.983 0 0 1 2.934 7.089c0 5.53-4.498 10.027-10.024 10.027zm5.496-7.513c-.301-.151-1.782-.88-2.059-.98-.276-.101-.477-.151-.678.151-.2.301-.778.98-.954 1.181-.176.2-.352.226-.653.076-.301-.151-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.201-.301.301-.502.101-.2.05-.377-.025-.527-.075-.151-.678-1.633-.929-2.235-.245-.587-.494-.507-.678-.517-.176-.01-.377-.01-.578-.01-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.913 1.23 3.114.151.2 2.124 3.243 5.145 4.548.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.076-.126-.277-.201-.578-.352z" />
        </svg>
      )
    case 'threads':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.004 0C5.372 0 0 5.372 0 12.004c0 6.633 5.372 12.004 12.004 12.004 6.633 0 12.004-5.371 12.004-12.004C24.008 5.372 18.637 0 12.004 0zm5.836 12.87c-.074.896-.34 1.63-.797 2.197-.456.568-1.09.856-1.902.856-.84 0-1.483-.265-1.928-.795-.444-.53-.667-1.3-.667-2.311 0-.96.22-1.706.66-2.238.44-.532 1.074-.798 1.902-.798.814 0 1.442.266 1.884.798.442.532.667 1.278.667 2.238v.053zm-3.328-1.788c-.37 0-.66.12-.87.36-.21.24-.315.6-.315 1.08 0 .47.105.82.315 1.05.21.23.5.345.87.345.38 0 .68-.115.89-.345.21-.23.32-.58.32-1.05 0-.48-.11-.84-.32-1.08-.21-.24-.51-.36-.89-.36z" />
        </svg>
      )
    case 'mail':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      )
    case 'link':
    default:
      if (fallbackLabel) {
        return <span className="font-bold text-sm">{fallbackLabel.slice(0, 2)}</span>
      }
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      )
  }
}
