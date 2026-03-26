"use client"
import { useEffect } from 'react'

function replaceAll() {
  try {
    const safeReplaceString = (s: string) => {
      if (!s) return s
      let out = s
      if (!out.includes('_new-logo.png')) out = out.replace(/logo\.png/g, '_new-logo.png')
      if (!out.includes('_new-icon.png')) out = out.replace(/icon\.png/g, '_new-icon.png')
      return out
    }

    const replaceInUrl = (url: string) => safeReplaceString(url)

    document.querySelectorAll('img').forEach((img) => {
      const el = img as HTMLImageElement
      if (el.src && /logo\.png|icon\.png/.test(el.src)) {
        el.src = replaceInUrl(el.src)
      }
      if (el.srcset && /logo\.png|icon\.png/.test(el.srcset)) {
        el.srcset = replaceInUrl(el.srcset)
      }
    })

    document.querySelectorAll('source').forEach((s) => {
      const el = s as HTMLSourceElement
      if (el.src && /logo\.png|icon\.png/.test(el.src)) el.src = replaceInUrl(el.src)
      if (el.srcset && /logo\.png|icon\.png/.test(el.srcset)) el.srcset = replaceInUrl(el.srcset)
    })

    document.querySelectorAll('link').forEach((l) => {
      const el = l as HTMLLinkElement
      if (el.href && /logo\.png|icon\.png/.test(el.href)) el.href = replaceInUrl(el.href)
    })

    document.querySelectorAll<HTMLElement>('*').forEach((el) => {
      const bg = el.style.backgroundImage
      if (bg && /logo\.png|icon\.png/.test(bg)) {
        el.style.backgroundImage = safeReplaceString(bg)
      }
    })

    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList | undefined
      try { rules = (sheet as CSSStyleSheet).cssRules } catch { continue }
      if (!rules) continue
      for (const rule of Array.from(rules)) {
        const r = rule as CSSStyleRule
        if (r.cssText && /logo\.png|icon\.png/.test(r.cssText)) {
          try {
            const newCss = safeReplaceString(r.cssText)
            ;(sheet as CSSStyleSheet).deleteRule(Array.prototype.indexOf.call(rules, rule))
            ;(sheet as CSSStyleSheet).insertRule(newCss, Array.prototype.indexOf.call(rules, rule))
          } catch {}
        }
      }
    }
  } catch (e) {
    // swallow errors to avoid breaking page scripts
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

export default function ConsoleLogoToggle() {
  useEffect(() => {
    const isDark = () => {
      try {
        if (typeof document === 'undefined') return false
        const doc = document.documentElement
        if (doc.classList && doc.classList.contains('dark')) return true
        if (document.body && document.body.classList && document.body.classList.contains('dark')) return true
        try {
          if (localStorage.getItem('theme') === 'dark') return true
        } catch {}
        return false
      } catch {
        return false
      }
    }

    const observer = new MutationObserver(() => {
      try {
        if (isDark() && localStorage.getItem('newlogo') === 'True') replaceAll()
      } catch {}
    })
    try {
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    } catch {}
    ;(window as any).setNewLogo = () => {
      try {
        localStorage.setItem('newlogo', 'True')
        if (isDark()) {
          replaceAll()
        } else {
          // eslint-disable-next-line no-console
          console.log('newlogo set, but current theme is not dark — call replaceLogoAssets() after switching to dark or reload when dark.')
        }
        // eslint-disable-next-line no-console
        console.log('newlogo set to True and assets replaced.')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }
    ;(window as any).replaceLogoAssets = replaceAll
    ;(window as any).clearNewLogo = () => {
      try {
        localStorage.removeItem('newlogo')
        // eslint-disable-next-line no-console
        console.log('newlogo removed. Reload to restore originals.')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }

    if (typeof window !== 'undefined' && localStorage.getItem('newlogo') === 'True' && isDark()) {
      replaceAll()
    }

    return () => {
      try {
        delete (window as any).setNewLogo
        delete (window as any).replaceLogoAssets
        delete (window as any).clearNewLogo
        try { observer.disconnect() } catch {}
      } catch {}
    }
  }, [])

  return null
}
