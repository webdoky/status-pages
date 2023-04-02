import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import LayoutHeader from './layoutHeader';
import LayoutFooter from './layoutFooter';

interface Params {
  children: React.ReactNode;
}

export default function Layout({ children }: Params) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setHeaderHeight(headerRef.current ? headerRef.current.offsetHeight : 0);
    };

    window.addEventListener('resize', handleResize);

    // initial header height
    setHeaderHeight(headerRef.current ? headerRef.current.offsetHeight : 0);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="font-sans antialiased text-ui-typo bg-ui-background">
        <div className="flex flex-col justify-start min-h-screen">
          <header
            ref={headerRef}
            className="sticky top-0 z-10 w-full border-b bg-ui-background border-ui-border"
          >
            <LayoutHeader />
          </header>

          <main className="container relative flex flex-wrap justify-start flex-1 w-full bg-ui-background">
            <div className={classNames('w-full pb-24')}>{children}</div>
          </main>

          <footer className="border-t border-ui-border">
            <LayoutFooter />
          </footer>
        </div>
      </div>
    </>
  );
}
