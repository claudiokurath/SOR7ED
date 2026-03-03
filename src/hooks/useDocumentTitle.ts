import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useDocumentTitle() {
    const location = useLocation();

    useEffect(() => {
        let title = 'SOR7ED | ADHD-Friendly Tools';

        // Change titles according to navigation
        switch (location.pathname) {
            case '/':
                // don't repeat the title on home tab
                title = 'SOR7ED';
                break;
            case '/tools':
                title = 'TOOLS | SOR7ED';
                break;
            case '/blog':
                title = 'BLOG | SOR7ED';
                break;
            case '/about':
                title = 'ABOUT | SOR7ED';
                break;
            case '/vault':
                title = 'VAULT | SOR7ED';
                break;
            default:
                if (location.pathname.startsWith('/tool/')) {
                    title = 'TOOL | SOR7ED';
                } else if (location.pathname.startsWith('/blog/')) {
                    title = 'ARTICLE | SOR7ED';
                }
                break;
        }

        document.title = title;
    }, [location]);
}
