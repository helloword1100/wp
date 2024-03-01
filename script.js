let http = new XMLHttpRequest();
let search = document.getElementById('search');
let properties = [];
let searchroom = document.getElementById('searchRooms');
let searchlocations = document.getElementById('searchlocations');
let searchit = document.getElementById('searchit');
let searchlocation = document.getElementById('searchlocation');
let buyit = document.getElementById('rent');
let save_dialog = document.getElementById('save_dialog');
let category = document.getElementById('category_');
let price_from = document.getElementById('price_from');
let price_to = document.getElementById('price_to');
let searchlocation_ = document.getElementById('searchlocation_');
let rooms_from = document.getElementById('rooms_from');
let rooms_to = document.getElementById('rooms_to');
let year_from = document.getElementById('year_from');
let year_to = document.getElementById('year_to');
let reset1 = document.getElementById('reset1');
let reset2 = document.getElementById('reset2');
let lowest_highest_room_filter = document.getElementById('lowest_highest_room_filter');

let currentPage = 1;
const postsPerPage = 10;

lowest_highest_room_filter.addEventListener('change', function() {
    let option = lowest_highest_room_filter.value;
    if (option === "lowest") {
        sortByLowestPrice();
    } else if (option === "highest") {
        sortByHighestPrice();
    } else if (option === "lowestroom") {
        sortByLowestRooms();
    } else if (option === "highestroom") {
        sortByHighestRooms();
    } else if (option === "top") {
        filterTopOffers();
    }
});

function filterTopOffers() {
    let filteredProperties = properties.filter(property => {
        return property && property.listing && property.listing.listingType && property.listing.listingType.type === "TOP";
    });
    displayPropertiesWithPagination(filteredProperties);
}

function sortByLowestPrice() {
    properties.sort((a, b) => {
        let priceA = a.listing.prices.buy ? a.listing.prices.buy.price || a.listing.prices.rent.gross : Infinity;
        let priceB = b.listing.prices.buy ? b.listing.prices.buy.price || b.listing.prices.rent.gross : Infinity;
        return priceA - priceB;
    });
    displayPropertiesWithPagination(properties);
}

function sortByHighestPrice() {
    properties.sort((a, b) => {
        let priceA = a.listing.prices.buy ? a.listing.prices.buy.price || a.listing.prices.rent.gross : -Infinity;
        let priceB = b.listing.prices.buy ? b.listing.prices.buy.price || b.listing.prices.rent.gross : -Infinity;
        return priceB - priceA;
    });
    displayPropertiesWithPagination(properties);
}

function sortByLowestRooms() {
    properties.sort((a, b) => {
        let roomsA = a.listing.characteristics && a.listing.characteristics.numberOfRooms ? parseFloat(a.listing.characteristics.numberOfRooms) : Infinity;
        let roomsB = b.listing.characteristics && b.listing.characteristics.numberOfRooms ? parseFloat(b.listing.characteristics.numberOfRooms) : Infinity;
        return roomsA - roomsB;
    });
    displayPropertiesWithPagination(properties);
}

function sortByHighestRooms() {
    properties.sort((a, b) => {
        let roomsA = a.listing.characteristics && a.listing.characteristics.numberOfRooms ? parseFloat(a.listing.characteristics.numberOfRooms) : Infinity;
        let roomsB = b.listing.characteristics && b.listing.characteristics.numberOfRooms ? parseFloat(b.listing.characteristics.numberOfRooms) : Infinity;
        return roomsB - roomsA;
    });
    displayPropertiesWithPagination(properties);
}

reset1.addEventListener('click', function () {
    reset2.click();
});

save_dialog.addEventListener('click', function () {
    searchByRoomsRange();
    searchByYearRange();
});

function searchByYearRange() {
    let selectedYearFrom = parseInt(year_from.value);
    let selectedYearTo = parseInt(year_to.value);
    let filteredProperties = properties.filter(property => {
        if (property && property.listing && property.listing.characteristics && property.listing.characteristics.yearBuilt) {
            let yearBuilt = parseInt(property.listing.characteristics.yearBuilt);
            return yearBuilt >= selectedYearFrom && yearBuilt <= selectedYearTo;
        }
        return false;
    });
    displayPropertiesWithPagination(filteredProperties);
}

function searchByRoomsRange() {
    let selectedRoomsFrom = parseFloat(rooms_from.value);
    let selectedRoomsTo = parseFloat(rooms_to.value);
    let filteredProperties = properties.filter(property => {
        if (property && property.listing && property.listing.characteristics && property.listing.characteristics.numberOfRooms) {
            let numberOfRooms = parseFloat(property.listing.characteristics.numberOfRooms);
            return numberOfRooms >= selectedRoomsFrom && numberOfRooms <= selectedRoomsTo;
        }
        return false;
    });
    displayPropertiesWithPagination(filteredProperties);
}

function searchByPriceRange() {
    let selectedPriceFrom = parseInt(price_from.value);
    let selectedPriceTo = parseInt(price_to.value);
    let filteredProperties = properties.filter(property => {
        let price = 0;
        if (property && property.listing && property.listing.prices) {
            if (property.listing.offerType === "RENT" && property.listing.prices.rent) {
                price = property.listing.prices.rent.gross;
            } else if (property.listing.offerType === "BUY" && property.listing.prices.buy) {
                price = property.listing.prices.buy.gross;
            }
            return price >= selectedPriceFrom && price <= selectedPriceTo;
        }
        return false;
    });
    displayPropertiesWithPagination(filteredProperties);
}

function search_location() {
    let selectedStreet = searchlocation_.value.trim().toLowerCase();
    let filteredProperties = properties.filter(property => {
        return property && property.listing && property.listing.address && property.listing.address.street && property.listing.address.street.toLowerCase() === selectedStreet;
    });
    displayPropertiesWithPagination(filteredProperties);
}

function generateOptions(selectElement) {
    let options = [];
    for (let i = 500; i < 10000; i += 100) {
        let option = document.createElement('option');
        if (i > 2000 && i < 3000) {
            i += 100;
            option.textContent = i + " CHF";
            options.push(option);
        } else if (i >= 3000 && i < 6000) {
            i += 400;
            option.textContent = i + " CHF";
            options.push(option);
        } else if (i >= 6000) {
            i += 900;
            option.textContent = i + " CHF";
            options.push(option);
        } else {
            option.textContent = i + " CHF";
            options.push(option);
        }
    }
    options.forEach(option => {
        selectElement.appendChild(option);
    });
}

generateOptions(price_from);
generateOptions(price_to);
generateOptions(search);

search.addEventListener('input', function () {
    countprice();
});

searchlocation.addEventListener('change', function () {
    checktotallocations();
});

searchlocation.addEventListener('input', function () {
    let userInput = searchlocation.value.trim().toLowerCase();
    let filteredOptions = [];
    if (userInput.length > 0) {
        filteredOptions = properties.filter(property => {
            return property && property.listing && property.listing.address && property.listing.address.street &&
                   property.listing.address.street.toLowerCase().includes(userInput);
        }).map(property => property.listing.address.street);
    }
    populateDropdown(filteredOptions);
});

function populateDropdown(options) {
    searchlocations.innerHTML = '';
    options.forEach(optionText => {
        let option = document.createElement('option');
        option.textContent = optionText;
        searchlocations.appendChild(option);
    });
}

searchroom.addEventListener('change', function () {
    countrooms();
});

http.open('get', 'properties.json', true);
http.send();

http.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
        properties = JSON.parse(this.response);
        displayPropertiesWithPagination(properties);
    }
}

function searchByLocation() {
    let selectedStreet = searchlocation.value.trim().toLowerCase();
    let filteredProperties = properties.filter(property => {
        return property && property.listing && property.listing.address && property.listing.address.street && property.listing.address.street.toLowerCase() === selectedStreet;
    });
    displayPropertiesWithPagination(filteredProperties);
}

function searchbuy() {
    let filteredProperties = properties.filter(property => {
        return property && property.listing && property.listing.offerType && property.listing.offerType === "BUY";
    });
    displayPropertiesWithPagination(filteredProperties);
}

function searchProperties() {
    let query = search.value.trim().toLowerCase();
    let selectedPrice = parseInt(search.value);
    let filteredProperties = [];
    
    if (isNaN(selectedPrice)) {
        filteredProperties = properties.filter(property => {
            return property && property.listing && property.listing.listingType && property.listing.listingType.type === "TOP";
        });
    } else {
        filteredProperties = properties.filter(property => {
            if (property && property.listing && property.listing.prices) {
                let price = 0;
                if (property.listing.offerType === "RENT" && property.listing.prices.rent) {
                    price = property.listing.prices.rent.gross;
                } else if (property.listing.offerType === "BUY" && property.listing.prices.buy) {
                    price = property.listing.prices.buy.gross;
                }
                return price >= selectedPrice;
            }
            return false;
        });
    }
    displayPropertiesWithPagination(filteredProperties);
}

function searchrooms() {
    let filteredProperties = [];
    let rooms = parseFloat(document.getElementById('searchRooms').value);
    filteredProperties = properties.filter(property => {
        return property && property.listing && property.listing.characteristics && property.listing.characteristics.numberOfRooms >= rooms;
    });
    displayPropertiesWithPagination(filteredProperties);
}

function countlocations() {
    let selectedPrice = parseInt(search.value);
    let filteredProperties = [];
    filteredProperties = properties.filter(property => {
        if (property && property.listing && property.listing.prices) {
            let price = 0;
            if (property.listing.offerType === "RENT" && property.listing.prices.rent) {
                price = property.listing.prices.rent.gross;
            } else if (property.listing.offerType === "BUY" && property.listing.prices.buy) {
                price = property.listing.prices.buy.gross;
            }
            return price >= selectedPrice;
        }
        return false;
    });
    checktotalcount(filteredProperties);
}

function countrooms() {
    let filteredProperties = [];
    let rooms = parseFloat(document.getElementById('searchRooms').value);
    filteredProperties = properties.filter(property => {
        return property && property.listing && property.listing.characteristics && property.listing.characteristics.numberOfRooms >= rooms;
    });
    checktotalcount(filteredProperties);
}

function countprice() {
    let filteredProperties = [];
    filteredProperties = properties.filter(property => {
        if (property && property.listing && property.listing.prices) {
            let price = 0;
            if (property.listing.offerType === "RENT" && property.listing.prices.rent) {
                price = property.listing.prices.rent.gross;
            } else if (property.listing.offerType === "BUY" && property.listing.prices.buy) {
                price = property.listing.prices.buy.gross;
            }
            return price >= selectedPrice;
        }
        return false;
    });
    checktotalcount(filteredProperties);
}

function checktotalcount(properties) {
    let totalCount = properties.length;
    searchit.innerHTML = `<i class="fa fa-search" aria-hidden="true"></i> ${totalCount} Results `;
}

function checktotallocations() {
    let selectedStreet = searchlocation.value.trim().toLowerCase();
    let filteredProperties = properties.filter(property => {
        return property && property.listing && property.listing.address && property.listing.address.street && property.listing.address.street.toLowerCase() === selectedStreet;
    });
    checktotalcount(filteredProperties);
}

searchit.addEventListener('click', function () {
    let inputValue = searchlocation.value.trim().toLowerCase();
    if (inputValue !== '') {
        searchByLocation();
    } else {
        searchrooms();
    }
    if (!locationClicked && !roomsClicked) {
        searchProperties();
    }
    
});

function displayPropertiesWithPagination(properties) {
    let output = "";
    let totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, totalCount);
    searchit.innerHTML = `<i class="fa fa-search" aria-hidden="true"></i> ${totalCount} Results `;
    document.querySelector('.products').innerHTML = '';
    for (let i = startIndex; i < endIndex; i++) {
        let property = properties[i];
        if (property && property.listing && property.listing.prices && property.listing.prices.buy) {
            let price = property.listing.prices.buy.price || property.listing.prices.rent.gross;
            let type = property.listingType.type;
            if (property.listing.localization && property.listing.localization.de && property.listing.localization.de.attachments && property.listing.localization.de.attachments.length > 0) {
                attachments = property.listing.localization.de.attachments;
                let imageUrl = attachments[0].url;
                let title = property.listing.localization.de.text.title;
                let description = property.listing.localization.de.text.description;
                let describe = description;
                if (property.listing.characteristics && property.listing.address && description) {
                    let number_of_rooms = property.listing.characteristics.numberOfRooms;
                    let space = property.listing.characteristics.livingSpace;
                    let street = property.listing.address.street;
                    let rooms = number_of_rooms;
                    let thestreet = street;
                    let living = space;
                    let availableFrom = property.listing.availableFrom || 'null';
                    let numberOfFloors = property.listing.characteristics.numberOfFloors || property.listing.characteristics.floor || 'null';
                    let year = property.listing.characteristics.yearBuilt || " null";
                    let features = [];
                    if (property.listing.characteristics.arePetsAllowed) features.push('<i class="fas fa-paw"></i> Pets allowed');
                    if (property.listing.characteristics.hasBalcony) features.push('<i class="fas fa-bars"></i> Balcony / Terrace');
                    if (property.listing.characteristics.hasWashingMachine) features.push('<i class="fas fa-washing-machine"></i> Washing machine');
                    if (property.listing.characteristics.quietNeighborhood) features.push('<i class="fas fa-volume-mute"></i> Quiet neighborhood');
                    if (property.listing.characteristics.hasParking) features.push('<i class="fas fa-parking"></i> Parking space');
                    if (property.listing.characteristics.hasCableTv) features.push('<i class="fas fa-tv"></i> Cable TV');
                    if (property.listing.characteristics.hasElevator) features.push('<i class="fas fa-elevator"></i> Elevator');
                    if (property.listing.characteristics.hasGarage) features.push('<i class="fas fa-car"></i> Garage');
                    let featuresHTML = features.map(feature => `
                        <div class="feature">
                            ${feature}
                        </div>
                    `).join('');
                    let reference = property.listing.externalIds.refObject;
                    let DURL = property.DURL || '';
                    function extractEndId(url) {
                        const parts = url.split('/');
                        return parts[parts.length - 1];
                    }
                    DURL = extractEndId(DURL);
                    let contactNumber = property.listing.lister.phone || 'null';
                    let contactName = property.listing.lister.contacts && property.listing.lister.contacts.inquiry && property.listing.lister.contacts.inquiry.givenName || 'null';
                    if (contactNumber && contactName) {
                        contactInfoHTML = `
                            <div class="contact_info">
                                <p>Contact Number: ${contactNumber}</p>
                                <p>Contact Name: ${contactName}</p>
                            </div>
                        `;
                    }
                    let imageUrls = property.listing.localization.de.attachments.map(attachment => attachment.url);
                    let encodedImageUrls = encodeURIComponent(JSON.stringify(imageUrls));
                    output += `
                    <div class="clickable-post">
                        <a class="container_post" href="post-details.html?title=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&describe=${encodeURIComponent(describe)}&imageUrl=${encodeURIComponent(encodedImageUrls)}&rooms=${encodeURIComponent(rooms)}&living=${encodeURIComponent(living)}&thestreet=${encodeURIComponent(thestreet)}&availableFrom=${encodeURIComponent(availableFrom)}&numberOfFloors=${encodeURIComponent(numberOfFloors)}&year=${encodeURIComponent(year)}&featuresHTML=${encodeURIComponent(featuresHTML)}&reference=${encodeURIComponent(reference)}}&DURL=${encodeURIComponent(DURL)}&contactName=${encodeURIComponent(contactName)}&contactNumber=${encodeURIComponent(contactNumber)}">
                            <div class="product">
                            
                                <div id="carouselExample${i}" class="carousel slide" data-ride="carousel">
                                    <div class="carousel-inner">
                                    
                                        ${attachments.map((att, index, array) => `
                                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                <img class="d-block w-100" src="${att.url}" alt="Slide ${index + 1}>
">
<p class="total_images_count">${index + 1} / ${array.length}</p>
                                            </div>
                                        `).join('')}
                                        
                                    </div>
                                    <a class="carousel-control-prev" href="#carouselExample${i}" role="button" data-slide="prev"><i class="fas fa-chevron-left"></i></a>
                                   
                                             
                                    <a class="carousel-control-next" href="#carouselExample${i}" role="button" data-slide="next">
                                    <i class="fas fa-chevron-right" ></i>
                                    </a>
                                   
                                </div>
                                <div class="meta_data">
                                    <div class="price_and_type">
                                        <p class="price">
                                            <h4>CHF ${price}.- / month</h4>
                                        </p>
                                        
                                    </div>
                                    <div class="number_rooms_and_space">
                                        <span><b>${number_of_rooms}</b> rooms</span>
                                        <span><b>${space}㎡</b> living space</span>
                                    </div>
                                    <div class="address"><i class="fa fa-map-marker" aria-hidden="true"></i> ${street}</div>
                                    <p class="title">"<b>${title}</b>"</p>
                                    <p class="description">${truncateWithBr(description, 150)}</p>
                                </div>
                            </div>
                        </a>
                    </div>`;
                }
            }
        }
    }
     // Display pagination buttons
    output += `
        <div class="pagination">
            <button onclick="previousPage()" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <button onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        </div>
    `;
    
    document.querySelector('.products').innerHTML += output;
}

function truncateWithBr(text, maxLength) {
    let result = "";
    let remainingLength = maxLength;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "<") {
            let endIndex = text.indexOf(">", i);
            if (endIndex !== -1) {
                result += text.substring(i, endIndex + 1);
                i = endIndex;
            }
        } else {
            result += text[i];
            remainingLength--;
            if (remainingLength === 0) {
                result += " ...";
                break;
            }
        }
    }
    return result;
}

function nextPage() {
    currentPage++;
    displayPropertiesWithPagination(properties);
}

function previousPage() {
    currentPage--;
    displayPropertiesWithPagination(properties);
}
