const DETAILS_MAX_LENGTH = 200;

const tabList = [].slice.call(document.querySelectorAll("#new_signup_tabs button"));
var activeTab = 0;
const tabContent = [].slice.call(document.querySelectorAll(".create-new-signup .tab-pane"));
const numTabs = tabContent.length;

const form = document.getElementsByClassName("create-new-signup")[0];

const addSlotBtn = document.getElementsByClassName("add-slot-btn")[0];
const slotsDiv = document.getElementsByClassName("slots-div")[0];
var slotCount = slotsDiv.length;

addSlotBtn.addEventListener('click', function(event) {
    event.preventDefault();
    addEmptySlot();
});

const fakeNextBtn = document.getElementsByClassName("signup-fake-next-button")[0];
fakeNextBtn.addEventListener('click', function(event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Manually trigger the modal if form is valid
    var modalElement = document.getElementById('lockSignupType');
    var modal = new bootstrap.Modal(modalElement);
    modal.show();    
});

const nextBtns = [].slice.call(document.getElementsByClassName("signup-next-btn"));
nextBtns.forEach(function (nextBtn) {
    nextBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        activeTab = Math.min(activeTab + 1, numTabs-1);
        updateTabs();
    });
});

const backBtns = [].slice.call(document.getElementsByClassName("signup-back-btn"));
backBtns.forEach(function (backBtn) {
    backBtn.addEventListener('click', function(event) {
        event.preventDefault();
        activeTab = Math.max(activeTab - 1, 0);
        updateTabs();
    });
});

function updateTabs() {
    /* Makes sure that the correct tab is being displayed. */
    for (i = 0; i < numTabs; i++) {
        var tabTrigger = new bootstrap.Tab(tabList[i])
        if (i === activeTab) {
            tabList[i].classList.remove("disabled");
            tabList[i].classList.add("active");
            tabTrigger.show();

            tabContent[i].classList.add("active");
            tabContent[i].classList.add("show");
        } else {
            tabList[i].classList.add("disabled");
            tabList[i].classList.remove("active");

            tabContent[i].classList.remove("active");
            tabContent[i].classList.remove("show");
        }
    }
}

function addEmptySlot() {
    // Create a new div element with class 'slot'
    const newSlot = document.createElement("div");
    newSlot.className = "slot";

    const trashBtn = document.createElement("button");
    trashBtn.type = "button";
    trashBtn.classList.add("btn");
    trashBtn.classList.add("btn-danger");
    trashBtn.classList.add("slot-trash-icon-button");
    trashBtn.addEventListener('click', function(event) {
        let parentSlot = event.target.closest('.slot');
        if (parentSlot) { parentSlot.remove(); }
    });

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("bi");
    trashIcon.classList.add("bi-trash");
    trashBtn.appendChild(trashIcon);

    // Create label and input elements for 'Location'
    const locationLabel = document.createElement("label");
    locationLabel.setAttribute("for", `slot${slotCount}-location`);
    locationLabel.className = "slot-location-label";
    locationLabel.textContent = "Location: ";

    const locationInput = document.createElement("input");
    locationInput.type = "text";
    locationInput.name = `slot${slotCount}-location`;
    locationInput.id = `slot${slotCount}-location`;
    locationInput.placeholder = "Enter a location...";
    locationInput.className = "slot-location-input";

    // Create label and textarea elements for 'Details'
    const detailsLabel = document.createElement("label");
    detailsLabel.setAttribute("for", `slot${slotCount}-details`);
    detailsLabel.className = "slot-details-label";
    detailsLabel.textContent = "Details: ";

    const detailsTextarea = document.createElement("textarea");
    detailsTextarea.name = `slot${slotCount}-details`;
    detailsTextarea.id = `slot${slotCount}-details`;
    // detailsTextarea.cols = 40;
    // detailsTextarea.rows = 5;
    detailsTextarea.maxLength = DETAILS_MAX_LENGTH;
    detailsTextarea.className = "slot-details-input";
    detailsTextarea.placeholder = "Enter in details here...";

    // Create label and input elements for 'Date'
    const dateLabel = document.createElement("label");
    dateLabel.setAttribute("for", `slot${slotCount}-date`);
    dateLabel.className = "slot-date-label";
    dateLabel.textContent = "Date: ";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = `slot${slotCount}-date`;
    dateInput.id = `slot${slotCount}-date`;
    dateInput.className = "slot-date-input";
    dateInput.required = true;

    // Create label and select elements for 'Day'
    const dayLabel = document.createElement("label");
    dayLabel.setAttribute("for", `slot${slotCount}-day`);
    dayLabel.className = "slot-day-label";
    dayLabel.textContent = "Day: ";

    const daySelect = document.createElement("select");
    daySelect.name = `slot${slotCount}-day`;
    daySelect.id = `slot${slotCount}-day`;
    daySelect.className = "slot-day-input";
    daySelect.required = true;

    const days = ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"];
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach((day, index) => {
        const option = document.createElement("option");
        option.value = day;
        option.textContent = dayNames[index];
        daySelect.appendChild(option);
    });

    // Create label and input elements for 'Time'
    const timeLabel = document.createElement("label");
    timeLabel.setAttribute("for", `slot${slotCount}-time`);
    timeLabel.className = "slot-time-label";
    timeLabel.textContent = "Time: ";

    const timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.name = `slot${slotCount}-time`;
    timeInput.id = `slot${slotCount}-time`;
    timeInput.className = "slot-time-input";
    timeInput.required = true;

    // Append all the created elements to the new slot div
    newSlot.appendChild(trashBtn);

    newSlot.appendChild(locationLabel);
    newSlot.appendChild(locationInput);
    newSlot.appendChild(document.createElement("br"));

    newSlot.appendChild(detailsLabel);
    newSlot.appendChild(detailsTextarea);
    newSlot.appendChild(document.createElement("br"));

    newSlot.appendChild(dateLabel);
    newSlot.appendChild(dateInput);
    newSlot.appendChild(document.createElement("br"));

    newSlot.appendChild(dayLabel);
    newSlot.appendChild(daySelect);
    newSlot.appendChild(document.createElement("br"));

    newSlot.appendChild(timeLabel);
    newSlot.appendChild(timeInput);

    // Append the new slot to the slotsDiv
    slotsDiv.appendChild(newSlot);

    // Increment the slot counter
    slotCount++;
}

document.addEventListener("DOMContentLoaded", function(event) {
    updateTabs();
});