import type { NavItem } from '@/types'

export const navigationItems: NavItem[] = [
  { id: 1, title: 'Početna', href: '/' },
  { id: 2, title: 'Editor', href: '/editor' },
  { id: 3, title: 'Kako funkcionira', href: '/how-it-works' },
  { id: 4, title: 'Dostava', href: '/shipping' },
]

export const footerLinks = {
  support: [
    { title: 'Praćenje narudžbe', href: '/track-order' },
    { title: 'Dostava', href: '/shipping' },
    { title: 'Učitaj dizajn', href: '/load-design' },
  ],
  legal: [
    { title: 'Uslovi korištenja', href: '/legal/terms' },
    { title: 'Politika privatnosti', href: '/legal/privacy' },
    { title: 'Kolačići', href: '/legal/cookies' },
  ],
}
