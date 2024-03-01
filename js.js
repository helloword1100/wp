// Retrieve title, price, and image URL from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const price = urlParams.get('price');
const describe = urlParams.get('describe');
const rooms = urlParams.get('rooms');
const living = urlParams.get('living');
const thestreet = urlParams.get('thestreet');
const availableFrom = urlParams.get('availableFrom');
const numberOfFloors = urlParams.get('numberOfFloors');
const year = urlParams.get('year');
let output = document.getElementById('post-details');
const featuresHTML = urlParams.get('featuresHTML');
const reference = urlParams.get('reference');
const DURL = urlParams.get('DURL');
const contactName = urlParams.get('contactName');
const contactNumber = urlParams.get('contactNumber');


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Get the image URLs from the URL parameter
var imageUrlParam = getParameterByName('imageUrl');
var imageUrls = [];

// Decode the JSON string and parse it into an array
if (imageUrlParam) {
    imageUrls = JSON.parse(decodeURIComponent(imageUrlParam));
}



let display;
if (numberOfFloors === "null") {
    display = "none";
} else {
    display = "block";
}
// Display title, price, and image on the page
output.innerHTML += `

    <div id="gallery_wrap" class="gallery_wrap">
<a class="carousel-control-prev description_arrow_left" href="#carouselExample" role="button" data-slide="prev">    
<i class="fas fa-chevron-left"></i>
    </a>
        <div id="carouselExample" class="carousel slide custom_div_carousal" data-ride="carousel">
        
            <div class="carousel-inner">
            
                ${imageUrls.map((url, index) =>
                    `
                    <div class="carousel-item ${index === 0 ? 'active' : ''} custom_div">
                        <img class="d-block w-100 custom_carousal_img" src="${url}" alt="Slide ${index + 1}">
                    </div>
                `).join('')}
            </div>
           
           
        </div> 
       
    <a class=" carousel-control-next custom_right" href="#carouselExample" role="button" data-slide="next">    
    <i class="fas fa-chevron-right" ></i>
    </a>
    </div>
    <div class="main_content">
<h1 class="house_title ">"${title}"</h1>
<div class="house_details">
    <span class="house_rent">
        <label>Rent</label>
        <p><b>CHF ${price}.- / month</b></p>
    </span>
    <span class="house_rooms">
        <label>Rooms</label>
        <p><b>${rooms}</b></p>
    </span>
    <span class="house_space">
        <label>Living space</label>
        <p><b>${living} ㎡</b></p>
    </span>
</div>
<hr class="custom_hr">
<div class="house_location">
    <h2><b>Location</b></h2>
    <p><b>${thestreet}</b></p>
</div>
<div class="house_cost">
    <h2>Costs</h2>
    <table>
        <tr>
            <td>Net rent</td>
            <td>CHF 2,700.–</td>
        </tr>
        <tr>
            <td>Additional expenses</td>
            <td>CHF 390.–</td>
        </tr>
        <tr>
            <td>Rent</td>
            <td>CHF ${price}.–</td>
        </tr>
    </table>
</div>
<h2 class="main_info">Main information</h2>
<table class="main-info-table">
    <tr>
        <td>Available from</td>
        <td>${availableFrom}</td>
    </tr>
    <tr>
        <td>Type</td>
        <td>Apartment</td>
    </tr>
    <tr>
        <td>No. of rooms</td>
        <td>${rooms}</td>
    </tr>
    <tr class="${display}">
        <td>No of floors</td>
        <td>${numberOfFloors}</td>
    </tr>
    <tr>
        <td>Surface living</td>
        <td>${living} ㎡</td>
    </tr>
    <tr>
        <td>Last refurbishment</td>
        <td>2024</td>
    </tr>
    <tr>
        <td>Year built</td>
        <td>${year}</td>
    </tr>
</table>
<div class="features">
    <h2>Features and furnishings</h2>
    ${featuresHTML}
</div>

<div class="description">
<h2>Description</h2>
<p>${describe}</p>
</div>

<div class="home_advertisor_contact">
    <h2>Advertisers</h2>
    <h2>Contact</h2>
    ${contactName && contactNumber ? `
        <p>${contactName}</p>
        <button id="see-number-btn" class="see_number"><i class="fa fa-phone" aria-hidden="true"></i> See Number</button>
    ` : ''}
    <table class="listing_info_table">
        <tr>
            <td>Listing ID</td>
            <td>${DURL}</td>
        </tr>
        <tr>
            <td>Reference</td>
            <td>${reference}</td>
        </tr>
    </table>
</div>
</div>
`;

// Add event listener to "See Number" button
const seeNumberBtn = document.getElementById('see-number-btn');
if (seeNumberBtn) {
    seeNumberBtn.addEventListener('click', () => {
        seeNumberBtn.innerHTML = `${contactNumber}`;
    });
}
