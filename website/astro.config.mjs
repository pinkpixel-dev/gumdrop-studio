// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://gumdropstudio.app',
  integrations: [
    starlight({
      title: 'Gumdrop Studio',
      logo: {
        src: './public/logo.png',
        alt: 'Gumdrop Studio',
      },
      description: 'A fun pixel art creation app with dual-layer canvas — available as a web app and native Linux desktop app.',
      social: {
        github: 'https://github.com/pinkpixel-dev/gumdrop-studio',
      },
      favicon: '/favicon.png',
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Welcome', link: '/' },
            { label: 'Installation', link: '/getting-started/installation/' },
            { label: 'Quick Start', link: '/getting-started/quick-start/' },
          ],
        },
        {
          label: 'User Guide',
          items: [
            { label: 'Drawing Tools', link: '/guides/tools/' },
            { label: 'Canvas & Zoom', link: '/guides/canvas/' },
            { label: 'Colors & Alpha', link: '/guides/colors/' },
            { label: 'Projects', link: '/guides/projects/' },
            { label: 'Exporting Your Art', link: '/guides/exporting/' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Keyboard Shortcuts', link: '/reference/keyboard-shortcuts/' },
          ],
        },
      ],
    }),
  ],
});
