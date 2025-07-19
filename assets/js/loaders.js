function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

function loadArtStationPortfolio() {
    // Only load ArtStation portfolio on the 3dmodels.html page
    const currentPage = window.location.pathname;
    if (!currentPage.includes('3dmodels.html')) {
        return; // Exit early if not on 3dmodels.html
    }
    
    console.log('Loading ArtStation portfolio for 3D models page...');
    
    // Try multiple CORS proxy services
    const proxies = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/'
    ];
    
    const targetUrl = 'https://roxarex.artstation.com';
    
    async function tryProxy(proxyIndex = 0) {
        if (proxyIndex >= proxies.length) {
            console.warn('All proxy attempts failed, showing fallback content');
            showFallbackContent();
            return;
        }
        
        const proxyUrl = proxies[proxyIndex];
        const fullUrl = proxyIndex === 0 ? proxyUrl + encodeURIComponent(targetUrl) : proxyUrl + targetUrl;
        
        try {
            console.log(`Trying proxy ${proxyIndex + 1}: ${proxyUrl}`);
            const response = await fetch(fullUrl);
            
            let htmlContent;
            if (proxyIndex === 0) {
                const data = await response.json();
                htmlContent = data.contents;
            } else {
                htmlContent = await response.text();
            }
            
            // Check if we got a Cloudflare challenge page
            if (htmlContent.includes('cf_challenge') || htmlContent.includes('challenge-platform')) {
                console.warn(`Proxy ${proxyIndex + 1} returned Cloudflare challenge, trying next proxy...`);
                tryProxy(proxyIndex + 1);
                return;
            }
            
            // Create a temporary DOM element to parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Find the .square_grid div
            const squareGrid = doc.querySelector('.square_grid');
            
            if (squareGrid) {
                console.log('Successfully found .square_grid content');
                insertPortfolioContent(squareGrid.outerHTML);
            } else {
                console.warn('No .square_grid element found, trying next proxy...');
                tryProxy(proxyIndex + 1);
            }
            
        } catch (error) {
            console.error(`Proxy ${proxyIndex + 1} failed:`, error);
            tryProxy(proxyIndex + 1);
        }
    }
    
    function insertPortfolioContent(content) {
        const portfolioSection = document.querySelector('#portfolio');
        if (portfolioSection) {
            // Create a container for the ArtStation content
            const artStationContainer = document.createElement('div');
            artStationContainer.className = 'artstation-portfolio';
            artStationContainer.innerHTML = content;
            
            // Fix relative URLs in the content
            const links = artStationContainer.querySelectorAll('a[href]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/')) {
                    // Convert relative URL to absolute ArtStation URL
                    const absoluteUrl = 'https://roxarex.artstation.com' + href;
                    link.setAttribute('href', absoluteUrl);
                    console.log(`Fixed URL: ${href} -> ${absoluteUrl}`);
                }
            });
            
            // Fix relative image sources as well
            const images = artStationContainer.querySelectorAll('img[src]');
            images.forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.startsWith('/')) {
                    // Convert relative URL to absolute ArtStation URL
                    const absoluteUrl = 'https://roxarex.artstation.com' + src;
                    img.setAttribute('src', absoluteUrl);
                    console.log(`Fixed image URL: ${src} -> ${absoluteUrl}`);
                }
            });
            
            // Insert after the portfolio title
            const portfolioTitle = portfolioSection.querySelector('h1');
            if (portfolioTitle && portfolioTitle.nextSibling) {
                portfolioSection.insertBefore(artStationContainer, portfolioTitle.nextSibling);
            } else {
                portfolioSection.appendChild(artStationContainer);
            }
        }
    }
    
    function showFallbackContent() {
        const portfolioSection = document.querySelector('#portfolio');
        if (portfolioSection) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = 'portfolio-fallback';
            fallbackDiv.innerHTML = `
                <div class="text-center">
                    <h3 class="mb-3">3D Portfolio</h3>
                    <p class="text-muted mb-4">Due to security restrictions, please visit my ArtStation directly to view my 3D models and artwork.</p>
                    <a href="https://roxarex.artstation.com" target="_blank" class="btn btn-primary">
                        <i class="ti-external-link"></i> View on ArtStation
                    </a>
                    <div class="mt-4">
                        <p class="small text-muted">
                            <i class="ti-info-alt"></i> This page showcases my 3D modeling work, game assets, and digital art projects.
                        </p>
                    </div>
                </div>
            `;
            
            const portfolioTitle = portfolioSection.querySelector('h1');
            if (portfolioTitle && portfolioTitle.nextSibling) {
                portfolioSection.insertBefore(fallbackDiv, portfolioTitle.nextSibling);
            } else {
                portfolioSection.appendChild(fallbackDiv);
            }
        }
    }
    
    // Start trying proxies
    tryProxy();
}

// Load navbar and ArtStation portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadArtStationPortfolio();
});