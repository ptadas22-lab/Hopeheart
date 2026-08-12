import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';
import { parse } from 'url';
import { HOPEHEART_RESOURCES } from './src/services/maya/resourcesData';

const generateStaticApiPlugin = () => ({
  name: 'generate-static-api-plugin',
  buildStart() {
    const publicDir = path.resolve(__dirname, 'public');
    const apiDir = path.resolve(publicDir, 'api/maya');
    const resourcesDir = path.resolve(apiDir, 'resources');

    // Create directories if they don't exist
    fs.mkdirSync(resourcesDir, { recursive: true });

    // 1. Generate resources.json (lightweight metadata only)
    const lightweightList = HOPEHEART_RESOURCES.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      description: r.description,
      moods: r.moods,
      category: r.type,
      screen: r.screen
    }));

    fs.writeFileSync(
      path.resolve(apiDir, 'resources.json'),
      JSON.stringify({ resources: lightweightList }, null, 2)
    );

    // 2. Generate individual resource JSON files
    HOPEHEART_RESOURCES.forEach(r => {
      fs.writeFileSync(
        path.resolve(resourcesDir, `${r.id}.json`),
        JSON.stringify(r, null, 2)
      );
    });

    console.log('[Static API] Successfully generated static JSON files in public/api/maya/');
  }
});

const mayaApiPlugin = () => ({
  name: 'maya-api-plugin',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const parsedUrl = parse(req.url || '', true);
      const pathname = parsedUrl.pathname || '';

      if (pathname === '/api/maya/resources' || pathname === '/api/maya/resources/') {
        res.setHeader('Content-Type', 'application/json');
        
        const q = (parsedUrl.query.q as string || '').toLowerCase();
        const mood = (parsedUrl.query.mood as string || '').toLowerCase();
        const type = (parsedUrl.query.type as string || '').toLowerCase();

        let filtered = HOPEHEART_RESOURCES;

        if (q) {
          filtered = filtered.filter(r => 
            r.title.toLowerCase().includes(q) || 
            r.description.toLowerCase().includes(q)
          );
        }
        if (mood) {
          filtered = filtered.filter(r => 
            r.moods.some(m => m.toLowerCase() === mood)
          );
        }
        if (type) {
          filtered = filtered.filter(r => 
            r.type.toLowerCase() === type
          );
        }

        res.end(JSON.stringify({ resources: filtered }));
        return;
      }

      if (pathname.startsWith('/api/maya/resources/')) {
        const id = pathname.substring('/api/maya/resources/'.length);
        const resource = HOPEHEART_RESOURCES.find(r => r.id === id);

        res.setHeader('Content-Type', 'application/json');
        if (resource) {
          res.end(JSON.stringify(resource));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Resource not found' }));
        }
        return;
      }

      next();
    });
  },
  configurePreviewServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const parsedUrl = parse(req.url || '', true);
      const pathname = parsedUrl.pathname || '';

      if (pathname === '/api/maya/resources' || pathname === '/api/maya/resources/') {
        res.setHeader('Content-Type', 'application/json');
        
        const q = (parsedUrl.query.q as string || '').toLowerCase();
        const mood = (parsedUrl.query.mood as string || '').toLowerCase();
        const type = (parsedUrl.query.type as string || '').toLowerCase();

        let filtered = HOPEHEART_RESOURCES;

        if (q) {
          filtered = filtered.filter(r => 
            r.title.toLowerCase().includes(q) || 
            r.description.toLowerCase().includes(q)
          );
        }
        if (mood) {
          filtered = filtered.filter(r => 
            r.moods.some(m => m.toLowerCase() === mood)
          );
        }
        if (type) {
          filtered = filtered.filter(r => 
            r.type.toLowerCase() === type
          );
        }

        res.end(JSON.stringify({ resources: filtered }));
        return;
      }

      if (pathname.startsWith('/api/maya/resources/')) {
        const id = pathname.substring('/api/maya/resources/'.length);
        const resource = HOPEHEART_RESOURCES.find(r => r.id === id);

        res.setHeader('Content-Type', 'application/json');
        if (resource) {
          res.end(JSON.stringify(resource));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Resource not found' }));
        }
        return;
      }

      next();
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mayaApiPlugin(), generateStaticApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
