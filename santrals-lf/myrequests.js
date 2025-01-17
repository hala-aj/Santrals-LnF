
async function displayMyItems(){

    try {
      const response =  await fetch(`/myrequests.html`);

        if (response.ok) {
            const items = await response.json();

        items.forEach(item => {
           console.log(item);
            const formattedDate = new Date(item.date_lost).toLocaleDateString('en-CA');

            const itemId = item.itemID || 'Not Available';
            const itemName = item.item_name || 'Not Available';
            const itemDescription = item.item_description || 'Not Available';
            const category = item.category || 'Not Available';
            const dateLost = formattedDate || 'Not Available';
            const lastLocation = item.last_loc || 'Not Available';
            const itemStatus = item.item_status || 'Not Available';
            const returnStatus = item.return_status || 'Not Available';
            const dateFound = item.date_found || 'Not Available';
            const dateReturned = item.date_returned || 'Not Available';
            const foundLoc = item.found_loc || 'Not Available';

                var currentDate = new Date();
                //var image = imageInput.files.length > 0 ? imageInput.files[0] : null;
              //  imageUrl = image ? URL.createObjectURL(image) : null;
              var imageUrl;
                var newItem = document.createElement("li");
                newItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
                newItem.innerHTML = `
                    <div class="d-flex align-items-start">
                        <div>
                            <h5 class="mb-1">Item Name: ${itemName}, Date Added: ${currentDate.toLocaleDateString()}</h5>
                            <p class="mb-1" style="font-weight: normal;">Category: ${category}</p>
                        </div>
                    </div>
                    <div class="text-end">
                        <button class="btn btn-primary mt-2 view-details-btn" 
                                data-bs-toggle="modal" 
                                data-bs-target="#viewDetailsModal" 
                                data-item-name="${itemName}" 
                                data-category="${category}" 
                                data-item-id="${itemId}"
                                data-date-lost="${dateLost}" 
                                data-item-description="${itemDescription}"
                                data-last-location="${lastLocation}"
                                data-image-url="${item.image_url}"> 
                            View Details
                        </button>
                        <button class="btn btn-primary mt-2 view-status-btn" 
                        data-bs-toggle="modal" 
                        data-bs-target="#viewStatusModal"
                        data-item-status= "${itemStatus}"
                        data-return-status = "${returnStatus}"
                        data-date-found= "${dateFound}"
                        data-date-returned= "${dateReturned}"
                        data-found-loc= "${foundLoc}">
                    Item Status
                </button>
                    </div>
                `;
            
                newItem.dateLost = new Date(dateLost);
                newItem.dateFound = currentDate;
                newItem.dateTimeAdded = currentDate;
                requestList.appendChild(newItem);
            
        });
        } else {
            console.error('Error fetching item details:', response.statusText);
            
        }
    } catch (error) {
        console.error('Error fetching item details:', error.message);
    }
 }

document.addEventListener("DOMContentLoaded", function () {

   displayMyItems();
   
    var viewDetailsModal = new bootstrap.Modal(document.getElementById('viewDetailsModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    var viewStatusModal = new bootstrap.Modal(document.getElementById('viewStatusModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    var requestList = document.getElementById('requestList');
    var sortByDateLost = document.getElementById('sortByDateLost');
    var sortByDateFound = document.getElementById('sortByDateFound');

    var imageUrl;
    var originalItemList = Array.from(requestList.children);

    function renderRequestList(items) {
        requestList.innerHTML = "";
        items.forEach(item => {
            requestList.appendChild(item.cloneNode(true));
        });
    }
    
    sortByDateLost.addEventListener('click', function () {
        sortItems('dateLost');
    });

    sortByDateFound.addEventListener('click', function () {
        sortItems('dateTimeAdded');
    });

    requestList.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-details-btn')) {
            var dateLost = event.target.dataset.dateLost;
            var itemDescription = event.target.dataset.itemDescription;
            var lastLocation = event.target.dataset.lastLocation;
            var item_id = event.target.dataset.itemId;
            const imageUrl = event.target.dataset.imageUrl;
    
            var imageTag = imageUrl ? `<img src="${imageUrl}" alt="Item Image" class="img-fluid">` : '<p>No image available</p>';

            
            console.log("Item ID:", item_id);
            console.log('Last Location:', lastLocation);
            console.log('Date Lost:', dateLost);
            console.log('Item Description:', itemDescription);
            
            document.getElementById('detailsImageContainer').innerHTML = imageTag;
            document.getElementById('viewDetailsItemId').textContent = `Item ID: ${item_id}`;
            document.getElementById('viewDetailsLastLocation').textContent = `Last Location: ${lastLocation}`;
            document.getElementById('viewDetailsDateLost').textContent = `Date Lost: ${dateLost}`;
            document.getElementById('viewDetailsItemDescription').textContent = `Item Description: ${itemDescription}`;

            var imageView = document.getElementById('detailsImageContainer');
            imageView.innerHTML = imageUrl ? `<img src="${imageUrl}" alt="Item Image" class="img-fluid">` : '<p>No image available</p>';

            viewDetailsModal.show(); 

            originalItemList = Array.from(requestList.children);
        }
    });

    requestList.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-status-btn')) {
            console.log(event.target.dataset);
            const itemId = event.target.dataset.itemId;
            const itemStatus = event.target.dataset.itemStatus;
            const returnStatus = event.target.dataset.returnStatus;
            const dateFound = event.target.dataset.dateFound;
            const dateReturned = event.target.dataset.dateReturned;
            const foundLoc = event.target.dataset.foundLoc;
    
            console.log(itemStatus, returnStatus, dateFound, dateReturned, foundLoc);

            document.getElementById('viewItemStatus').textContent = `Item Status: ${itemStatus}`;
            document.getElementById('viewReturnStatus').textContent = `Return Status: ${returnStatus}`;
            document.getElementById('viewDateFound').textContent = `Date Found: ${dateFound}`;
            document.getElementById('viewDateReturned').textContent = `Date Returned: ${dateReturned}`;
            document.getElementById('viewFoundLoc').textContent = `Location Found: ${foundLoc}`;
            viewStatusModal.show();
    
            originalItemList = Array.from(requestList.children);
        }
    });


    document.getElementById('searchBtn').addEventListener('click', function () {
        performSearch();
    });

    document.getElementById('searchInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

        if (!searchTerm) {
            renderRequestList(originalItemList);
        } else {
            var filteredItems = originalItemList.filter(item =>
                item.textContent.toLowerCase().includes(searchTerm)
            );
            renderRequestList(filteredItems);
        }

        document.getElementById('searchInput').value = '';
    }
    function sortItems(sortCriterion) {
        var items = Array.from(requestList.children);

        items.sort(function (a, b) {
            var dateA = a[sortCriterion];
            var dateB = b[sortCriterion];

            return dateB - dateA;
        });

        items.forEach(function (item) {
            requestList.removeChild(item);
        });

        items.forEach(function (item) {
            requestList.appendChild(item);
        });
    }

});

/*
document.addEventListener("DOMContentLoaded", function () {
    var darkmode = document.getElementById("darkModeBtn");
    if (darkmode) {
        darkmode.onclick = function() {
            document.body.classList.toggle("dark-theme");
        };
    }
});
*/

//new shi
const darkModeCookie = document.cookie.split('; ').find(row => row.startsWith('darkMode='));
if (darkModeCookie) {
    const isDarkMode = darkModeCookie.split('=')[1] === 'true';
    document.body.classList.toggle("dark-theme", isDarkMode);
}

var darkmode = document.getElementById("darkModeBtn");
    if (darkmode) {
        darkmode.onclick = function() {
            document.body.classList.toggle("dark-theme");
            setDarkModePreference(document.body.classList.contains("dark-theme"));
        };
    }

function setDarkModePreference(isDarkMode) {
    document.cookie = `darkMode=${isDarkMode}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function logout(){
    var form = $('<form action="/logout" method="POST"></form>');
    $('body').append(form);
    form.submit().remove()
}