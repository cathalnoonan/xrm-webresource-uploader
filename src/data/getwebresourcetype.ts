import { WebResourceType } from ".";

// TODO: Separate source maps to separate function
export function getWebResourceType(filepath: string, includeSourceMaps: boolean = false): WebResourceType {
    const lower = filepath.toLowerCase()

    if (lower.endsWith('.htm') || lower.endsWith('.html')) {
        return WebResourceType.HTML
    }

    // TODO: Separate source maps to separate function
    else if (lower.endsWith('.css') || (includeSourceMaps && lower.endsWith('.css.map'))) {
        return WebResourceType.CSS
    }

    // TODO: Separate source maps to separate function
    else if (lower.endsWith('.js') || (includeSourceMaps && lower.endsWith('.js.map'))) {
        return WebResourceType.JS
    }

    else if (lower.endsWith('.xml')) {
        return WebResourceType.XML
    }
    
    else if (lower.endsWith('.png')) {
        return WebResourceType.PNG
    }

    else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
        return WebResourceType.JPG
    }

    else if (lower.endsWith('.gif')) {
        return WebResourceType.GIF
    }

    else if (lower.endsWith('.svg')) {
        return WebResourceType.SVG
    }

    // Silverlight = 8,
    // XSL = 9,
    // ICO = 10,
    // RESX = 12,

    return null;
}