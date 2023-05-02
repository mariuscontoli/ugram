import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ugram",
  description: "Create & share photos with friends you love",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/documentation/register' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Ugram?', link: '/guide/what-is-ugram' },
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'Documentation',
        items: [
          { text: 'Créer un compte', link: '/documentation/register' },
          { text: 'Se connecter', link: '/documentation/login' },
          { text: 'Page d\'accueil', link: '/documentation/home' },
          { text: 'Chercher des posts', link: '/documentation/search' },
          { text: 'Chercher des utilisateurs', link: '/documentation/search-users' },
          { text: 'Messages', link: '/documentation/message' },
          { text: 'Profil', link: '/documentation/profile' },
          { text: 'Créer un post', link: '/documentation/create' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GLO3112-classrooms/ugram-h2023-team-04' }
    ]
  }
})
