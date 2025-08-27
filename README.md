# My Next.js App

This is a Next.js application created with TypeScript. Below are the instructions for setting up and deploying the project on GitHub Pages.

## Getting Started

### Prerequisites

- Node.js (version 12.0 or later)
- npm (comes with Node.js)

### Installation

1. **Create the Next.js Project**:
   Run the following command to create a new Next.js project with TypeScript:
   ```
   npx create-next-app my-nextjs-app --typescript
   ```

2. **Navigate to the Project Directory**:
   ```
   cd my-nextjs-app
   ```

3. **Set Up the Project Structure**:
   Create the necessary folders and files as per the provided structure. Add the code for the components and pages as needed.

### Configuration for GitHub Pages

1. **Update `next.config.js`**:
   Modify the `next.config.js` file to include the `basePath` and `assetPrefix` settings for GitHub Pages:
   ```javascript
   module.exports = {
     basePath: '/my-nextjs-app',
     assetPrefix: '/my-nextjs-app/',
   };
   ```

2. **Add Build and Export Scripts**:
   Update the `package.json` file to include the following scripts:
   ```json
   "scripts": {
     "build": "next build",
     "export": "next export"
   }
   ```

### Build and Export the Project

Run the following commands to build and export the project:
```
npm run build
npm run export
```
This will generate the static files in the `out` directory.

### Deploy to GitHub Pages
# nutrivell.ai
1. **Create a New Repository**:
   Create a new repository on GitHub.

   ```
   git add out
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix out origin gh-pages
   ```

### Access Your Application

Your application should now be accessible at:
```
https://<username>.github.io/my-nextjs-app
``` 

## License

This project is licensed under the MIT License.