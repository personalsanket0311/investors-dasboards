import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: { default: '3D Bharat Deal Desk', template: '%s · 3D Bharat Deal Desk' },
  description: 'Investor and corporate dashboard with a simulated backend.',
};

// Sets the theme before first paint so dark mode never flashes white.
const themeScript = `try{var t=localStorage.getItem('dealdash:theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <StoreProvider><AppShell>{children}</AppShell></StoreProvider>
      </body>
    </html>
  );
}
