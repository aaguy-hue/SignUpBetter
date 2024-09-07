const DETAILS_MAX_LENGTH = 200;

const tabs = document.querySelectorAll('.nav-link');
const tabList = [].slice.call(document.querySelectorAll("#new_signup_tabs button"));
const tabContent = [].slice.call(document.querySelectorAll(".create-new-signup .tab-pane"));
const numTabs = tabContent.length;

const form = document.getElementsByClassName("create-new-signup")[0];

const addSlotBtn = document.getElementsByClassName("add-slot-btn")[0];
const slotsDiv = document.getElementsByClassName("slots-div")[0];
const slotsCollection = slotsDiv.getElementsByClassName("slot");

const sections = {
    "general-info-tab": document.getElementById("general-info"),
    "slots-tab": document.getElementById("slots"),
    "settings-tab": document.getElementById("settings")
};

var activeTab = 0;

let slotIds = [];

addSlotBtn.addEventListener('click', function(event) {
    event.preventDefault();
    addEmptySlot();
});


function collectSlotData() {
    const slotData = [];
    slotIds.forEach(id => {
        const slot = document.getElementById(id);
        if (slot) {
            const data = {
                id: id,
                location: slot.querySelector(`#${id}-location`)?.value || '',
                amt: slot.querySelector(`#${id}-amt`)?.value || '',
                details: slot.querySelector(`#${id}-details`)?.value || '',
                date: slot.querySelector(`#${id}-date`)?.value || '',
                day: slot.querySelector(`#${id}-day`)?.value || '',
                time: slot.querySelector(`#${id}-time`)?.value || ''
            };
            slotData.push(data);
        }
    });
    return slotData;
}


form.addEventListener('submit', function(event) {
    if (!validateForm()) {
        return;
    }

    const slotData = collectSlotData();
    const formData = new FormData(event.target);
    slotData.forEach(slot => {
        for (const [key, value] of Object.entries(slot)) {
            formData.append(`${slot.id}-${key}`, value);
        }
    });
});

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function getActiveTabId() {
    let activeTabId = null;
    tabs.forEach(tab => {
        if (tab.classList.contains('active')) {
            activeTabId = tab.id;
        }
    });
    return activeTabId;
}

function validateForm() {
    const tabId = getActiveTabId();
    const section = sections[tabId]
    const inputs = section.querySelectorAll('input, textarea');
    
    for (i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }

    switch (tabId) {
        case "slots-tab":

            if (slotsCollection.length < 1) {
                alert("Please add at least one slot!");
                return false;
            }

            const isScheduling = document.getElementById("signup_type_scheduling").checked;

            for (i = 0; i < slotsCollection.length; i++) {
                const slot = slotsCollection[i];
                
                if (isScheduling) {
                    // Validate scheduling-specific fields
                    const time = slot.querySelector(".slot-time-input");
                    const date = slot.querySelector(".slot-date-input");
                    const day = slot.querySelector(".slot-day-input");

                    if (!time.value && !date.value && !day.value) {
                        time.setCustomValidity("Please enter a time, date, or day.");
                        day.setCustomValidity("Please enter a time, date, or day.");
                        date.setCustomValidity("Please enter a time, date, or day.");
                        time.reportValidity();
                        day.reportValidity();
                        date.reportValidity();
                        return false;
                    }
                    time.setCustomValidity("");
                    date.setCustomValidity("");
                    day.setCustomValidity("");
                } else {
                    const name = slot.querySelector(".slot-name");

                    if (!name.value) {
                        name.setCustomValidity("Please enter a name for the slot.");
                        name.reportValidity();
                        return false;
                    }
                }
            }
        
        case "general-info-tab":
            // placeholder for now
        
        case "settings-tab":
            // no special logic needed here
    }

    return true;
}

const fakeNextBtn = document.getElementsByClassName("signup-fake-next-button")[0];
fakeNextBtn.addEventListener('click', function(event) {
    event.preventDefault();
    if (!validateForm()) {
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
        if (!validateForm()) {
            return;
        }
        
        activeTab = Math.min(activeTab + 1, numTabs-1);
        updateTabs(activeTab);
    });
});

const backBtns = [].slice.call(document.getElementsByClassName("signup-back-btn"));
backBtns.forEach(function (backBtn) {
    backBtn.addEventListener('click', function(event) {
        event.preventDefault();

        activeTab = Math.max(activeTab - 1, 0);
        updateTabs(activeTab);
    });
});

function updateTabs(activeTab) {
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
    const isScheduling = document.getElementById("signup_type_scheduling").checked;

    var defaultLocation = "";
    var defaultDate = "";
    var defaultDay = "";
    var defaultTime = "";
    if (slotsCollection.length > 0) {
        const lastSlot = slotsCollection[slotsCollection.length-1];
        defaultLocation = lastSlot.querySelector(".slot-location-input").value;

        if (isscheduling) {
            defaultDate = lastSlot.querySelector(".slot-date-input").value;
            defaultDay = lastSlot.querySelector(".slot-day-input").value;
            defaultTime = lastSlot.querySelector(".slot-time-input").value;
        }
    }

    const slotId = generateUniqueId();
    slotIds.push(slotId);

    // Create a new div element with class 'slot'
    const newSlot = document.createElement("div");
    newSlot.classList.add("slot");
    newSlot.id = `slot${slotId}`;

    const trashBtn = document.createElement("button");
    trashBtn.type = "button";
    trashBtn.classList.add("btn");
    trashBtn.classList.add("btn-danger");
    trashBtn.classList.add("slot-trash-icon-button");
    trashBtn.addEventListener('click', function(event) {
        let parentSlot = event.target.closest('.slot');
        if (parentSlot) {
            parentSlot.remove();
            slotIds = slotIds.filter(id => id !== parentSlot.id); // remove the slot id
        }
    });
    
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("bi");
    trashIcon.classList.add("bi-trash");
    trashBtn.appendChild(trashIcon);

    // Create label and input elements for 'Location'
    const locationLabel = document.createElement("label");
    locationLabel.setAttribute("for", `slot${slotId}-location`);
    locationLabel.classList.add("slot-location-label");
    locationLabel.textContent = "Location: ";

    const locationInput = document.createElement("input");
    locationInput.type = "text";
    locationInput.name = `slot${slotId}-location`;
    locationInput.id = `slot${slotId}-location`;
    locationInput.value = defaultLocation;
    locationInput.placeholder = "Enter a location (optional)";
    locationInput.classList.add("slot-location-input");
    locationInput.classList.add("form-control");

    // Create label and input elements for 'Signup Amount'
    const signupAmtLabel = document.createElement("label");
    signupAmtLabel.setAttribute("for", `slot${slotId}-amt`);
    signupAmtLabel.classList.add("slot-amt-label");
    signupAmtLabel.textContent = "How many people can sign up for each slot?";
    signupAmtLabel.required = true;

    const signUpAmtLabelTooltip = document.createElement("span");
    signUpAmtLabelTooltip.setAttribute("data-bs-toggle", "tooltip");
    signUpAmtLabelTooltip.setAttribute("data-bs-placement", "right");
    signUpAmtLabelTooltip.setAttribute("title", "Set this to zero if you want infinite people to be able to sign up.");
    
    const tooltipLogo = document.createElement("i");
    tooltipLogo.classList.add("bi");
    tooltipLogo.classList.add("bi-question-circle");

    signUpAmtLabelTooltip.appendChild(tooltipLogo);
    signupAmtLabel.appendChild(signUpAmtLabelTooltip);

    const signupAmtInput = document.createElement("input");
    signupAmtInput.type = "number";
    signupAmtInput.name = `slot${slotId}-amt`;
    signupAmtInput.id = `slot${slotId}-amt`;
    signupAmtInput.min = 0;
    signupAmtInput.max = 100;
    signupAmtInput.value = parseInt(document.getElementById("signup_slot_amt_default").value);
    signupAmtInput.classList.add("form-control");
    signupAmtInput.classList.add("required");
    signupAmtInput.required = true;

    // Create label and textarea elements for 'Details'
    const detailsLabel = document.createElement("label");
    detailsLabel.setAttribute("for", `slot${slotId}-details`);
    detailsLabel.classList.add("slot-details-label");
    detailsLabel.textContent = "Details: ";

    const detailsTextarea = document.createElement("textarea");
    detailsTextarea.name = `slot${slotId}-details`;
    detailsTextarea.id = `slot${slotId}-details`;
    // detailsTextarea.cols = 40;
    // detailsTextarea.rows = 5;
    detailsTextarea.maxLength = DETAILS_MAX_LENGTH;
    detailsTextarea.classList.add("slot-details-input");
    detailsTextarea.classList.add("form-control");
    detailsTextarea.placeholder = "Enter in details here (optional)";

    let dateLabel, dateInput;
    let dayLabel, dayDropdown;
    let timeLabel, timeInput;
    let nameLabel, nameInput;
    if (isScheduling) {
        // Create label and input elements for 'Date'
        dateLabel = document.createElement("label");
        dateLabel.setAttribute("for", `slot${slotId}-date`);
        dateLabel.classList.add("slot-date-label");
        dateLabel.textContent = "Date: ";
        
        dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.name = `slot${slotId}-date`;
        dateInput.id = `slot${slotId}-date`;
        dateInput.value = defaultDate;
        dateInput.classList.add("form-control");
        dateInput.classList.add("slot-date-input");
        
        // Create label and select elements for 'Day'
        dayLabel = document.createElement("label");
        dayLabel.setAttribute("for", `slot${slotId}-day`);
        dayLabel.classList.add("slot-day-label");
        dayLabel.textContent = "Day: ";
        
        dayDropdown = document.createElement("select");
        dayDropdown.name = `slot${slotId}-day`;
        dayDropdown.id = `slot${slotId}-day`;
        dayDropdown.classList.add("slot-day-input");
        dayDropdown.classList.add("form-select");

        const optiondef = document.createElement("option");
        optiondef.value = "";
        optiondef.disabled = true;
        optiondef.selected = true;
        optiondef.textContent = " -- select a day -- ";
        dayDropdown.appendChild(optiondef);
        
        const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        dayNames.forEach((day, index) => {
            const option = document.createElement("option");
            option.value = day;
            option.textContent = day;
            dayDropdown.appendChild(option);
        });
        
        dateInput.addEventListener('change', function() {
            const dayOfWeek = new Date(this.value).toLocaleDateString('en-US', { weekday: 'long' });
            dayDropdown.value = dayOfWeek;
        });
        dayDropdown.value = defaultDay;
        
        timeLabel = document.createElement("label");
        timeLabel.setAttribute("for", `slot${slotId}-time`);
        timeLabel.classList.add("slot-time-label");
        timeLabel.textContent = "Time: ";

        timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.name = `slot${slotId}-time`;
        timeInput.id = `slot${slotId}-time`;
        timeInput.value = defaultTime;
        timeInput.classList.add("slot-time-input");
        timeInput.classList.add("form-control");
    } else {
        nameLabel = document.createElement("label");
        nameLabel.setAttribute("for", `slot${slotId}-name`);
        nameLabel.classList.add("slot-name-label");
        nameLabel.classList.add("required");
        nameLabel.textContent = "Slot Name: ";

        nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.required = true;
        nameInput.name = `slot${slotId}-name`;
        nameInput.id = `slot${slotId}-name`;
        nameInput.classList.add("slot-name-input");
        nameInput.classList.add("form-control");
    }

    // Append all the created elements to the new slot div
    newSlot.appendChild(trashBtn);

    newSlot.appendChild(locationLabel);
    newSlot.appendChild(locationInput);
    newSlot.appendChild(document.createElement("br"));

    newSlot.appendChild(signupAmtLabel);
    newSlot.appendChild(signupAmtInput);
    newSlot.appendChild(document.createElement("br"));

    newSlot.appendChild(detailsLabel);
    newSlot.appendChild(detailsTextarea);
    newSlot.appendChild(document.createElement("br"));

    if (isScheduling) {
        newSlot.appendChild(dateLabel);
        newSlot.appendChild(dateInput);
        newSlot.appendChild(document.createElement("br"));

        newSlot.appendChild(dayLabel);
        newSlot.appendChild(dayDropdown);
        newSlot.appendChild(document.createElement("br"));

        newSlot.appendChild(timeLabel);
        newSlot.appendChild(timeInput);
    } else {
        newSlot.appendChild(nameLabel);
        newSlot.appendChild(nameInput);
    }

    // Append the new slot to the slotsDiv
    slotsDiv.appendChild(newSlot);
}

document.addEventListener("DOMContentLoaded", function(event) {
    updateTabs(0);
});