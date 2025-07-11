// Main

// Search
function searchDorms() {
    const location = document.getElementById('locationFilter').value;
    const distance = document.getElementById('distanceFilter').value;
    const price = document.getElementById('priceFilter').value;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (distance) params.append('distance', distance);
    if (price) params.append('price', price);
    
    // Redirect to listing page with filters
    const queryString = params.toString();
    const url = queryString ? `pages/listing.html?${queryString}` : 'pages/listing.html';
    window.location.href = url;
}

// Filter
function applyFilters() {
    const location = document.getElementById('locationFilter').value;
    const distance = document.getElementById('distanceFilter').value;
    const price = document.getElementById('priceFilter').value;
    const amenity = document.getElementById('amenityFilter').value;
    
    const dorms = document.querySelectorAll('.dorm');
    let visibleCount = 0;
    
    dorms.forEach(dorm => {
        let showDorm = true;
        
        // Get dorm data attributes
        const dormLocation = dorm.getAttribute('data-location');
        const dormDistance = dorm.getAttribute('data-distance');
        const dormPrice = parseInt(dorm.getAttribute('data-price'));
        const dormAmenities = dorm.getAttribute('data-amenities') || '';
        
        // Filter by location
        if (location && dormLocation !== location) {
            showDorm = false;
        }
        
        // Filter by distance
        if (distance && dormDistance !== distance) {
            showDorm = false;
        }
        
        // Filter by price
        if (price && dormPrice) {
            if (price.includes('+')) {
                const minPrice = parseInt(price.replace('+', ''));
                if (dormPrice < minPrice) showDorm = false;
            } else {
                const [minPrice, maxPrice] = price.split('-').map(p => parseInt(p));
                if (dormPrice < minPrice || dormPrice > maxPrice) showDorm = false;
            }
        }
        
        // Filter by amenities
        if (amenity && !dormAmenities.includes(amenity)) {
            showDorm = false;
        }
        
        // Show or hide dorm with animation
        if (showDorm) {
            dorm.style.display = 'flex';
            dorm.style.opacity = '1';
            visibleCount++;
        } else {
            dorm.style.display = 'none';
            dorm.style.opacity = '0';
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
}

// Clear
function clearFilters() {
    // Clear hidden select elements
    document.getElementById('locationFilter').value = '';
    document.getElementById('distanceFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('amenityFilter').value = '';
    
    // Reset custom dropdowns
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(function(customSelect) {
        const selected = customSelect.querySelector('.select-selected');
        const items = customSelect.querySelector('.select-items');
        const firstOption = items.querySelector('div[data-value=""]');
        
        if (firstOption) {
            selected.textContent = firstOption.textContent;
            selected.setAttribute('data-value', '');
            
            // Remove previous selections
            items.querySelectorAll('div').forEach(item => item.classList.remove('same-as-selected'));
            firstOption.classList.add('same-as-selected');
        }
    });
    
    applyFilters();
}

// Results count
function updateResultsCount(count) {
    const resultsElement = document.getElementById('resultsCount');
    if (resultsElement) {
        if (count === 0) {
            resultsElement.textContent = 'No dorms match your criteria';
            resultsElement.style.color = '#dc3545';
        } else if (count === 1) {
            resultsElement.textContent = 'Showing 1 dorm';
            resultsElement.style.color = '#28a745';
        } else {
            resultsElement.textContent = `Showing ${count} dorms`;
            resultsElement.style.color = '#28a745';
        }
    }
}

// Filters from URL
function applyFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set filter values from URL
    const location = urlParams.get('location');
    const distance = urlParams.get('distance');
    const price = urlParams.get('price');
    
    if (location) document.getElementById('locationFilter').value = location;
    if (distance) document.getElementById('distanceFilter').value = distance;
    if (price) document.getElementById('priceFilter').value = price;
    
    // Apply the filters
    applyFilters();
}

// Smooth scroll
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Lazy load
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Custom dropdown
function initCustomDropdowns() {
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(function(customSelect) {
        const selected = customSelect.querySelector('.select-selected');
        const items = customSelect.querySelector('.select-items');
        const filterType = customSelect.getAttribute('data-filter');
        
        // Click on the selected item
        selected.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSelect();
            items.classList.toggle('select-hide');
            selected.classList.toggle('select-arrow-active');
        });
        
        // Click on dropdown items
        const selectItems = items.querySelectorAll('div');
        selectItems.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Update selected text
                selected.textContent = this.textContent;
                selected.setAttribute('data-value', this.getAttribute('data-value'));
                
                // Remove previous selection
                selectItems.forEach(si => si.classList.remove('same-as-selected'));
                this.classList.add('same-as-selected');
                
                // Close dropdown
                items.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');
                
                // Update filters based on type
                updateFilterValue(filterType, this.getAttribute('data-value'));
                
                // Apply filters
                if (typeof applyFilters === 'function') {
                    applyFilters();
                }
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', closeAllSelect);
}

function closeAllSelect() {
    const selectItems = document.querySelectorAll('.select-items');
    const selectSelected = document.querySelectorAll('.select-selected');
    
    selectItems.forEach(item => item.classList.add('select-hide'));
    selectSelected.forEach(selected => selected.classList.remove('select-arrow-active'));
}

function updateFilterValue(filterType, value) {
    // Update hidden select values for compatibility with existing filter system
    switch(filterType) {
        case 'location':
            const locationFilter = document.getElementById('locationFilter');
            if (locationFilter) locationFilter.value = value;
            break;
        case 'distance':
            const distanceFilter = document.getElementById('distanceFilter');
            if (distanceFilter) distanceFilter.value = value;
            break;
        case 'price':
            const priceFilter = document.getElementById('priceFilter');
            if (priceFilter) priceFilter.value = value;
            break;
        case 'amenity':
            const amenityFilter = document.getElementById('amenityFilter');
            if (amenityFilter) amenityFilter.value = value;
            break;
        case 'university':
            const universityFilter = document.getElementById('signupUniversity');
            if (universityFilter) universityFilter.value = value;
            break;
    }
}

// Burger menu
function toggleBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerDropdown = document.querySelector('.burger-dropdown');
    
    if (!burgerDropdown) {
        createBurgerDropdown();
    } else {
        burgerDropdown.classList.toggle('show');
    }
    
    burgerMenu.classList.toggle('active');
}

// Burger dropdown
function createBurgerDropdown() {
    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'burger-dropdown';
    
    // Define menu items (removed login-required items)
    const menuItems = [
        { label: 'Home', href: getRelativePath('index.html'), public: true },
        { label: 'Listing', href: getRelativePath('pages/listing.html'), public: true },
        { label: 'About', href: getRelativePath('pages/about.html'), public: true },
        { label: 'Selected Dorms', href: getRelativePath('pages/profile.html'), public: true }
    ];
    
    // Create menu HTML
    dropdown.innerHTML = menuItems.map(item => {
        return `<a href="${item.href}" class="burger-menu-item">${item.label}</a>`;
    }).join('');
    
    // Add to page
    document.body.appendChild(dropdown);
    
    // Show dropdown
    setTimeout(() => dropdown.classList.add('show'), 10);
}

// Rel path
function getRelativePath(path) {
    const currentPath = window.location.pathname;
    const isInPages = currentPath.includes('/pages/');
    
    if (isInPages) {
        // We're in pages folder, need to go up one level for index.html
        if (path === 'index.html') {
            return '../index.html';
        } else if (path.startsWith('pages/')) {
            return path.replace('pages/', '');
        }
        return path;
    } else {
        // We're in root folder
        return path;
    }
}

// Tab name
function getTabName(label) {
    switch(label) {
        case 'Selected Dorms': return 'selected';
        case 'My Applications': return 'applications';
        case 'My Reviews': return 'reviews';
        case 'Settings': return 'settings';
        default: return 'selected';
    }
}

// Open tab
function openProfileTab(tabName) {
    // Store the tab to open in localStorage
    localStorage.setItem('openProfileTab', tabName);
}

// Close burger
function closeBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerDropdown = document.querySelector('.burger-dropdown');
    
    if (burgerDropdown) {
        burgerDropdown.classList.remove('show');
    }
    if (burgerMenu) {
        burgerMenu.classList.remove('active');
    }
    
    // Remove the dropdown after animation
    setTimeout(() => {
        if (burgerDropdown && !burgerDropdown.classList.contains('show')) {
            burgerDropdown.remove();
        }
    }, 300);
}

// Close burger outside
document.addEventListener('click', function(e) {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerDropdown = document.querySelector('.burger-dropdown');
    
    if (burgerDropdown && !burgerMenu.contains(e.target) && !burgerDropdown.contains(e.target)) {
        burgerDropdown.classList.remove('show');
        burgerMenu.classList.remove('active');
        setTimeout(() => {
            if (burgerDropdown && !burgerDropdown.classList.contains('show')) {
                burgerDropdown.remove();
            }
        }, 300);
    }
});

// Init on load
document.addEventListener('DOMContentLoaded', function() {
    // Show loading state
    const listing = document.querySelector('.listing');
    if (listing) {
        // Initialize dorm cards with proper styling
        const dorms = document.querySelectorAll('.dorms-grid .dorm');
        dorms.forEach((dorm, index) => {
            dorm.style.opacity = '0';
            dorm.style.transform = 'translateY(20px)';
            setTimeout(() => {
                dorm.style.transition = 'all 0.5s ease';
                dorm.style.opacity = '1';
                dorm.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Apply filters if on listing page
    if (window.location.pathname.includes('listing.html')) {
        // Initialize filters first
        setTimeout(() => {
            applyFiltersFromURL();
        }, 500);
    }
    
    // Initialize lazy loading
    initLazyLoading();
    // Initialize custom dropdowns
    initCustomDropdowns();
    
    // Initialize Select Dorm buttons
    initSelectDormButtons();
    
    const burgerMenu = document.querySelector('.burger-menu');
    if (burgerMenu) {
        burgerMenu.addEventListener('click', toggleBurgerMenu);
    }
});

// Select dorm btns
function initSelectDormButtons() {
    const selectButtons = document.querySelectorAll('.select-btn');
    selectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract comprehensive dorm information from the page
            const dormDetails = extractDormDetails();
            

            
            // Store selected dorm directly in localStorage
            const selectedDorms = JSON.parse(localStorage.getItem('selectedDorms') || '[]');
            const newDorm = {
                id: Date.now().toString(),
                ...dormDetails,
                selectedDate: new Date().toISOString()
            };
            
            selectedDorms.push(newDorm);
            localStorage.setItem('selectedDorms', JSON.stringify(selectedDorms));
            
            // Show success notification
            showNotification('Dorm selected! Redirecting to your selected dorms...', 'success');
            
            // Redirect to profile page after a brief delay
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        });
    });
}

// Extract dorm
function extractDormDetails() {
    // Get dorm name from the page title (h2) for detail pages
    let dormName = document.querySelector('h2')?.textContent;
    
    // Clean up the dorm name if it contains extra text
    if (dormName) {
        // Remove " - Dorm Details" or similar suffixes
        if (dormName.includes(' - ')) {
            dormName = dormName.split(' - ')[0];
        }
        // Remove " Dorm Details" suffix if present
        dormName = dormName.replace(/ Dorm Details$/i, '');
        // Remove "DormScout" if present
        dormName = dormName.replace(/DormScout/i, '').trim();
    }
    
    // Fallback to a default if we couldn't extract the name
    dormName = dormName || 'Selected Dorm';
    
    // Extract price information
    let price = 'Contact for pricing';
    const leftSection = document.querySelector('.left p');
    if (leftSection) {
        const priceMatch = leftSection.textContent.match(/(\d+k?-?\d*k?)\/month/i);
        if (priceMatch) {
            price = priceMatch[1] + '/month';
        }
    }
    
    // Extract capacity information
    let capacity = 'Multiple occupancy';
    if (leftSection) {
        const capacityMatch = leftSection.textContent.match(/(\d+\s*-?\s*\d*)\s*Person/i);
        if (capacityMatch) {
            capacity = capacityMatch[1] + ' Person Rooms';
        }
    }
    
    // Extract location information
    let location = 'Manila';
    let address = 'Manila';
    let distance = 'Near university';
    const locationInfo = document.querySelector('.location-info');
    if (locationInfo) {
        const addressP = locationInfo.querySelector('p:first-child');
        const distanceP = locationInfo.querySelector('p:nth-child(2)');
        
        if (addressP) {
            address = addressP.textContent.replace('Address:', '').trim();
            // Extract general location from address
            if (address.includes('Recto')) location = 'Recto Avenue, Manila';
            else if (address.includes('Morayta')) location = 'Morayta Street, Manila';
            else if (address.includes('University Belt')) location = 'University Belt, Manila';
            else if (address.includes('Sampaloc')) location = 'Sampaloc, Manila';
            else if (address.includes('Quiapo')) location = 'Quiapo, Manila';
            else location = address;
        }
        
        if (distanceP) {
            distance = distanceP.textContent.replace('Distance to University:', '').trim();
        }
    }
    
    // Extract amenities
    let amenities = [];
    const amenityList = document.querySelectorAll('.amenities ul li');
    amenityList.forEach(li => {
        amenities.push(li.textContent.trim());
    });
    
    // Extract description
    let description = '';
    if (leftSection) {
        const lines = leftSection.textContent.split('\n').map(line => line.trim()).filter(line => line);
        // Skip the first line (price) and join the rest
        description = lines.slice(1).join(', ');
    }
    
    // Determine image based on dorm name
    let image = '../images/DormScout Logo.png';
    const buildingImg = document.querySelector('.building-img');
    if (buildingImg && buildingImg.src) {
        image = buildingImg.src.replace(window.location.origin, '');
    }
    
    return {
        name: dormName,
        price: price,
        capacity: capacity,
        location: location,
        address: address,
        distance: distance,
        amenities: amenities,
        description: description,
        image: image
    };
}

// Notify
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Popstate
window.addEventListener('popstate', function() {
    if (window.location.pathname.includes('listing.html')) {
        applyFiltersFromURL();
    }
});
