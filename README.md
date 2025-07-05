# kPhotos

kPhotos is an alternative to Google Photos, developed with Nuxt 3 and Vue.js. This application allows you to manage your files, photos, and videos intuitively and securely by accessing the Infomaniak Api.

## Demo

![Preview](/public/preview.gif)

## Questions

### Is this projet affiliated with Infomaniak?

No, kPhotos is an independent project and is not affiliated with Infomaniak. It is developed as a side project, alternative interface for managing files (photos & videos) on the Infomaniak platform.

### Why can't I access kPhotos using Infomaniak's OAuth2?

Infomaniak's OAuth2 does not provide the necessary scopes required for this application to function properly. Therefore, you must use a personal token by generating it from your Infomaniak account with the required scopes (`user_info` and `drive`) to access kPhotos.

## Prerequisites

- **Required token scopes:** user_info & drive

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or another package manager like Yarn, pnpm, or Bun.

## Features

- **Drive access**
- **File display:** View your files with details such as size, type, and modification date. Unlike the kDrive web application, this app retrieves all media from the drive (as the mobile app does) to display them in full, regrouped by dates.
- **Download:** Easily download your images and videos.
- **Advanced filters:** Filter your files by type, date, relevance, or order.
- **Dark mode:** Switch between light and dark themes.
- **Security:** The token is stored server-side as httpOnly.

## Incoming features

- **Share:** Share files with others.
- **Preferences:** Save preferences, such as default drive, filters etc..
- ~~**Access specific folders:** Access specific folders within your drive (not using /search).~~
- **Select:** Select multiple files for batch actions.
- **Favorites:** Mark files as favorites for easy access.
- **Delete:** Delete files from your drive.
- **Edit:** Edit files directly within the app.
- ~~**Zoom:** Zoom in on images for a closer look.~~
- **Multilingual support:** Interface available in multiple languages.
- **Accessibility:** Improved accessibility features for better usability.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mateocarciu/kPhotos.git
```

```bash
cd kPhotos
```

```bash
yarn install
```

Start the development server:

```bash
yarn dev
```

Build for production:

```bash
yarn build
```

Preview the production build locally:

```bash
yarn preview
```

## Bugs ?

### Known Issues

- **Reversed Videos in Google Chrome:** Videos played in QuickTime within Google Chrome appear reversed. A quick fix involves applying a `transform` property.

- **Date Validation Error:** When filtering by custom dates using the parameters `modified_after=1746309600` and `modified_before=1746482400`, the following error occurs:

  ```json
  {
    "result": "error",
    "error": {
      "code": "validation_failed",
      "description": "Validation failed",
      "errors": [
        {
          "code": "validation_rule_before",
          "description": "The modified before must be a date before tomorrow.",
          "context": {
            "attribute": "modified_before"
          }
        }
      ]
    }
  }
  ```

  Example:

  ```bash
  date -r 1746309600
  Sun May 4 00:00:00 CEST 2025

  date -r 1746482400
  Tue May 6 00:00:00 CEST 2025
  ```

  Ensure that the `modified_before` parameter is set to a date earlier than tomorrow.

- **Set-Cookie Issue:** When setting the `secure` attribute of cookies to `true` in production, the cookies fail to work in Safari and Chrome, even if the site uses HTTPS. This might be related to domain configuration (`nuxt.dev`). As a temporary workaround, the `secure` attribute is set to `false`.
