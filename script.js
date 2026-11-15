
"use strict";

// ======================================
// HAMBURGER MENU
// ======================================

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
}


// ======================================
// SERVICES DROPDOWN
// ======================================

const serviceToggle = document.getElementById("serviceToggle");
const serviceMenu = document.getElementById("serviceMenu");

if (serviceToggle && serviceMenu) {

    function closeServiceMenu() {
        serviceMenu.classList.remove("active");
        serviceToggle.classList.remove("active");
        serviceToggle.setAttribute("aria-expanded", "false");
    }

    serviceToggle.addEventListener("click", function () {

        serviceMenu.classList.toggle("active");
        serviceToggle.classList.toggle("active");

        const isOpen = serviceMenu.classList.contains("active");

        serviceToggle.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", function (event) {

        if (!event.target.closest(".service-dropdown")) {
            closeServiceMenu();
        }
    });

    serviceMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeServiceMenu);
    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeServiceMenu();
        }
    });
}


// ======================================
// GET A QUOTE DROPDOWN
// ======================================

const quoteToggle = document.getElementById("quoteToggle");
const quoteForm = document.getElementById("quoteForm");

if (quoteToggle && quoteForm) {

    quoteToggle.addEventListener("click", function () {
        quoteForm.classList.toggle("active");
    });
}


// ======================================
// ZARVETH INTERNATIONAL TRACKING SYSTEM
// ======================================


// 1. COUNTRY DATABASE

const countryData = `
Afghanistan|AF
Albania|AL
Algeria|DZ
Andorra|AD
Angola|AO
Antigua and Barbuda|AG
Argentina|AR
Armenia|AM
Australia|AU
Austria|AT
Azerbaijan|AZ
Bahamas|BS
Bahrain|BH
Bangladesh|BD
Barbados|BB
Belarus|BY
Belgium|BE
Belize|BZ
Benin|BJ
Bhutan|BT
Bolivia|BO
Bosnia and Herzegovina|BA
Botswana|BW
Brazil|BR
Brunei|BN
Bulgaria|BG
Burkina Faso|BF
Burundi|BI
Cabo Verde|CV
Cambodia|KH
Cameroon|CM
Canada|CA
Central African Republic|CF
Chad|TD
Chile|CL
China|CN
Colombia|CO
Comoros|KM
Congo (Republic)|CG
Costa Rica|CR
Cote d'Ivoire|CI
Croatia|HR
Cuba|CU
Cyprus|CY
Czechia|CZ
Democratic Republic of the Congo|CD
Denmark|DK
Djibouti|DJ
Dominica|DM
Dominican Republic|DO
Ecuador|EC
Egypt|EG
El Salvador|SV
Equatorial Guinea|GQ
Eritrea|ER
Estonia|EE
Eswatini|SZ
Ethiopia|ET
Fiji|FJ
Finland|FI
France|FR
Gabon|GA
Gambia|GM
Georgia|GE
Germany|DE
Ghana|GH
Greece|GR
Grenada|GD
Guatemala|GT
Guinea|GN
Guinea-Bissau|GW
Guyana|GY
Haiti|HT
Honduras|HN
Hungary|HU
Iceland|IS
India|IN
Indonesia|ID
Iran|IR
Iraq|IQ
Ireland|IE
Israel|IL
Italy|IT
Jamaica|JM
Japan|JP
Jordan|JO
Kazakhstan|KZ
Kenya|KE
Kiribati|KI
Kuwait|KW
Kyrgyzstan|KG
Laos|LA
Latvia|LV
Lebanon|LB
Lesotho|LS
Liberia|LR
Libya|LY
Liechtenstein|LI
Lithuania|LT
Luxembourg|LU
Madagascar|MG
Malawi|MW
Malaysia|MY
Maldives|MV
Mali|ML
Malta|MT
Marshall Islands|MH
Mauritania|MR
Mauritius|MU
Mexico|MX
Micronesia|FM
Moldova|MD
Monaco|MC
Mongolia|MN
Montenegro|ME
Morocco|MA
Mozambique|MZ
Myanmar|MM
Namibia|NA
Nauru|NR
Nepal|NP
Netherlands|NL
New Zealand|NZ
Nicaragua|NI
Niger|NE
Nigeria|NG
North Korea|KP
North Macedonia|MK
Norway|NO
Oman|OM
Pakistan|PK
Palau|PW
Palestine|PS
Panama|PA
Papua New Guinea|PG
Paraguay|PY
Peru|PE
Philippines|PH
Poland|PL
Portugal|PT
Qatar|QA
Romania|RO
Russia|RU
Rwanda|RW
Saint Kitts and Nevis|KN
Saint Lucia|LC
Saint Vincent and the Grenadines|VC
Samoa|WS
San Marino|SM
Sao Tome and Principe|ST
Saudi Arabia|SA
Senegal|SN
Serbia|RS
Seychelles|SC
Sierra Leone|SL
Singapore|SG
Slovakia|SK
Slovenia|SI
Solomon Islands|SB
Somalia|SO
South Africa|ZA
South Korea|KR
South Sudan|SS
Spain|ES
Sri Lanka|LK
Sudan|SD
Suriname|SR
Sweden|SE
Switzerland|CH
Syria|SY
Tajikistan|TJ
Tanzania|TZ
Thailand|TH
Timor-Leste|TL
Togo|TG
Tonga|TO
Trinidad and Tobago|TT
Tunisia|TN
Turkiye|TR
Turkmenistan|TM
Tuvalu|TV
Uganda|UG
Ukraine|UA
United Arab Emirates|AE
United Kingdom|GB
United States|US
Uruguay|UY
Uzbekistan|UZ
Vanuatu|VU
Vatican City|VA
Venezuela|VE
Vietnam|VN
Yemen|YE
Zambia|ZM
Zimbabwe|ZW
`.trim().split("\n").map(function (entry) {

    const [name, code] = entry.split("|");

    return { name, code };
});


// ======================================
// 2. GENERATE TWO TRACKING NUMBERS
// PER COUNTRY
// ======================================

const shipments = {};

countryData.forEach(function (country) {

    for (let i = 1; i <= 2; i++) {

        const trackingCode =
            `ZRV-${country.code}-${String(i).padStart(3, "0")}`;

        shipments[trackingCode] = {
            trackingNumber: trackingCode,
            origin: "London, United Kingdom",
            destination: country.name,
            countryCode: country.code
        };
    }
});


// ======================================
// 3. SHIPMENT PROGRESS STAGES
// ======================================

const trackingStages = [
    "Shipment Registered",
    "Package Picked Up",
    "Arrived at Origin Facility",
    "Departed London Facility",
    "International Transit",
    "Arrived at Destination Country",
    "Customs Clearance",
    "Out for Delivery",
    "Delivered"
];


// ======================================
// 4. TIME CONFIGURATION
// ======================================

const ONE_DAY = 24 * 60 * 60 * 1000;

const CYCLE_DURATION =
    trackingStages.length * ONE_DAY;


// ======================================
// 5. SAVE SHIPMENT START TIMES
// ======================================

function getShipmentStart(trackingNumber) {

    const storageKey = "zarvethShipmentStarts";

    let shipmentStarts = JSON.parse(
        localStorage.getItem(storageKey) || "{}"
    );

    if (!shipmentStarts[trackingNumber]) {

        shipmentStarts[trackingNumber] = Date.now();

        localStorage.setItem(
            storageKey,
            JSON.stringify(shipmentStarts)
        );
    }

    return shipmentStarts[trackingNumber];
}


// ======================================
// 6. FORMAT DATE ONLY
// ======================================

function formatDate(timestamp) {

    if (!timestamp) return "Awaiting update";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date(timestamp));
}


// ======================================
// 7. CALCULATE SHIPMENT PROGRESS
// ======================================

function calculateProgress(startTime) {

    const now = Date.now();

    const elapsed = Math.max(0, now - startTime);

    // Determine the current tracking cycle

    const cycleNumber = Math.floor(
        elapsed / CYCLE_DURATION
    );

    const cycleStart =
        startTime + (cycleNumber * CYCLE_DURATION);

    const elapsedInCycle =
        elapsed % CYCLE_DURATION;

    // Determine current stage

    const currentStage = Math.floor(
        elapsedInCycle / ONE_DAY
    );

    // Determine next scheduled update

    const nextUpdate =
        cycleStart + ((currentStage + 1) * ONE_DAY);

    return {
        currentStage,
        cycleNumber,
        cycleStart,
        nextUpdate,
        now
    };
}


// ======================================
// 8. DISPLAY TRACKING RESULTS
// ======================================

const trackingForm = document.getElementById("trackingForm");

const trackingNumberInput =
    document.getElementById("trackingNumber");

const trackingResult =
    document.getElementById("trackingResult");

let trackingRefresh;


// DISPLAY SHIPMENT INFORMATION

function displayTracking(trackingNumber) {

    const shipment = shipments[trackingNumber];

    if (!shipment) {

        trackingResult.innerHTML = `
            <h2>Tracking Number Not Found</h2>

            <p>
                Please check your tracking number and try again.
            </p>
        `;

        return;
    }

    const startTime = getShipmentStart(trackingNumber);

    const progress = calculateProgress(startTime);

    const currentStage = progress.currentStage;

    const progressPercentage = Math.round(
        ((currentStage + 1) / trackingStages.length) * 100
    );


    // GENERATE TRACKING TIMELINE

    let timelineHTML = "";

    trackingStages.forEach(function (stage, index) {

        let statusClass = "pending";

        let stageDate = "Awaiting update";

        const stageTimestamp =
            progress.cycleStart + (index * ONE_DAY);

        if (index < currentStage) {

            statusClass = "completed";

            stageDate = formatDate(stageTimestamp);

        } else if (index === currentStage) {

            statusClass = "current";

            stageDate = formatDate(stageTimestamp);
        }

        timelineHTML += `

            <div class="tracking-step ${statusClass}">

                <span class="tracking-dot"></span>

                <div class="tracking-step-info">

                    <h4>${stage}</h4>

                    <p>${stageDate}</p>

                </div>

            </div>

        `;
    });


    // DISPLAY SHIPMENT DETAILS

    trackingResult.innerHTML = `

        <div class="tracking-card">

            <div class="tracking-heading">

                <h2>Shipment Details</h2>

                <span class="tracking-status">
                    ${trackingStages[currentStage]}
                </span>

            </div>


            <h3>${shipment.trackingNumber}</h3>


            <div class="tracking-route">

                <div>

                    <small>SHIPMENT FROM</small>

                    <h4>London, UK 🇬🇧</h4>

                </div>


                <div>

                    <small>SHIPMENT TO</small>

                    <h4>${shipment.destination}</h4>

                </div>

            </div>


            <div class="tracking-progress">

                <div class="progress-heading">

                    <h4>Shipment Progress</h4>

                    <span>${progressPercentage}%</span>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${progressPercentage}%"
                    ></div>

                </div>

            </div>


            <div class="tracking-timeline">

                ${timelineHTML}

            </div>


            <div class="tracking-update">

                <p>

                    <strong>Current date:</strong>

                    ${formatDate(progress.now)}

                </p>


                <p>

                    <strong>Next scheduled update:</strong>

                    ${formatDate(progress.nextUpdate)}

                </p>


                <p>

                    <strong>Tracking cycle:</strong>

                    ${progress.cycleNumber + 1}

                </p>

            </div>

        </div>

    `;
}


// ======================================
// 9. HANDLE TRACKING FORM SUBMISSION
// ======================================

if (trackingForm && trackingNumberInput && trackingResult) {

    trackingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const trackingNumber =
            trackingNumberInput.value.trim().toUpperCase();

        trackingResult.hidden = false;


        // VALIDATE TRACKING NUMBER

        if (!shipments[trackingNumber]) {

            trackingResult.innerHTML = `

                <h2>Tracking Number Not Found</h2>

                <p>
                    We couldn't find shipment:
                    <strong>${trackingNumber}</strong>
                </p>

                <p>
                    Please verify your tracking number.
                </p>

            `;

            clearInterval(trackingRefresh);

            return;
        }


        // DISPLAY TRACKING INFORMATION

        displayTracking(trackingNumber);


        // REFRESH PROGRESS EVERY MINUTE

        clearInterval(trackingRefresh);

        trackingRefresh = setInterval(function () {

            displayTracking(trackingNumber);

        }, 60000);

    });

}


// ======================================
// 10. GENERATE COUNTRY TRACKING DIRECTORY
// ======================================

const trackingCodeList =
    document.getElementById("trackingCodeList");

if (trackingCodeList) {

    trackingCodeList.innerHTML = countryData.map(function (country) {

        return `

            <div class="country-code-item">

                <h4>${country.name}</h4>

                <p>ZRV-${country.code}-001</p>

                <p>ZRV-${country.code}-002</p>

            </div>

        `;

    }).join("");
}


// ======================================
// 11. DATABASE SUMMARY
// ======================================

console.log("Countries:", countryData.length);

console.log(
    "Generated tracking numbers:",
    Object.keys(shipments).length
);
