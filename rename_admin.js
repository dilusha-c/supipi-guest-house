const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/lib/auth.ts',
  'src/app/admin/settings/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/login/page.tsx',
  'src/app/admin/layout.tsx',
  'src/app/admin/guests/page.tsx',
  'src/app/admin/gallery/page.tsx',
  'src/app/admin/finance/page.tsx',
  'src/app/api/bookings/route.ts'
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replacements
  // We want to replace "/admin" exactly, and "/admin/something"
  // But NOT "/api/admin"
  
  // Replace direct "/admin" and "/admin/"
  content = content.replace(/"\/admin"/g, '"/123@supipiadmin-re"');
  content = content.replace(/"\/admin\//g, '"/123@supipiadmin-re/');
  
  // In lib/auth.ts
  if (file.includes('auth.ts')) {
    // just to be safe
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
}
