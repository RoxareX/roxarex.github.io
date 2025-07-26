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
    
    function handleCloudflareImages(container) {
        // Handle images with data-cfsrc (Cloudflare lazy loading)
        const cfImages = container.querySelectorAll('img[data-cfsrc]');
        cfImages.forEach(img => {
            const cfSrc = img.getAttribute('data-cfsrc');
            if (cfSrc) {
                img.setAttribute('src', cfSrc);
                img.style.display = '';
                img.style.visibility = 'visible';
                console.log(`Fixed Cloudflare image: ${cfSrc}`);
            }
        });
        
        // Extract images from noscript tags (fallback for disabled JS)
        const noscriptTags = container.querySelectorAll('noscript');
        noscriptTags.forEach(noscript => {
            const noscriptHTML = noscript.innerHTML;
            if (noscriptHTML.includes('<img')) {
                // Parse the noscript content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = noscriptHTML;
                const noscriptImg = tempDiv.querySelector('img');
                
                if (noscriptImg && noscriptImg.src) {
                    // Find the corresponding broken image and replace it
                    const parentElement = noscript.parentElement;
                    const brokenImg = parentElement.querySelector('img[data-cfsrc], img[style*="display:none"]');
                    
                    if (brokenImg) {
                        brokenImg.src = noscriptImg.src;
                        brokenImg.style.display = '';
                        brokenImg.style.visibility = 'visible';
                        brokenImg.removeAttribute('data-cfsrc');
                        console.log(`Fixed image from noscript: ${noscriptImg.src}`);
                    }
                }
            }
        });
        
        // Remove Cloudflare scripts that might interfere
        const cfScripts = container.querySelectorAll('script[src*="cloudflare"], script[src*="mirage"]');
        cfScripts.forEach(script => script.remove());
        
        // Remove inline Cloudflare scripts
        const inlineScripts = container.querySelectorAll('script[type="text/javascript"]');
        inlineScripts.forEach(script => {
            if (script.textContent.includes('__mirage') || script.textContent.includes('cloudflare')) {
                script.remove();
            }
        });
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
            
            // Handle Cloudflare lazy loading and mobile view issues
            handleCloudflareImages(artStationContainer);

            // Remove any existing placeholder text
            const placeholder = document.getElementById('portfolio-placeholder');
            if (placeholder) {
                placeholder.remove();
            }

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