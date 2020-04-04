function findMe(source, key) {
    if (!navigator.geolocation) {
        console.warn(`Geolocation is not supported by your browser`);
        return;
    }

    const success = (position) => {
        const {latitude, longitude} = position.coords;

        if (source === 'form') {
            // set addr using reverse geocoding
            const url = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${latitude},${longitude}`;
            fetch(url).then(data => data.json()).then(res => {
                try {
                    const {street, adminArea5, adminArea3, postalCode} = res.results[0].locations[0];
                    const addrElem = document.getElementById('address');
                    if (addrElem) {
                        addrElem.value = `${street}, ${adminArea5} ${adminArea3} ${postalCode}`;
                    }
                } catch (err) {
                    console.error(`Error getting address: ${err}`);
                }
            });

            const latElem = document.getElementById('lat');
            const longELem = document.getElementById('long');
            if (latElem && longELem) {
                latElem.value = latitude;
                longELem.value = longitude;
                const findMeElem = document.getElementById('findMe');
                if (findMeElem) {
                    findMeElem.style.display = "none";
                }
            }
        } else if (source === 'url') {
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.has('lat') && !urlParams.has('long')) {
                window.location.replace(`${window.location.href}?lat=${latitude}&long=${longitude}`);
            }
        }
    };

    const error = () => {
        console.warn(`Unable to retrieve your location`);
    };

    navigator.geolocation.getCurrentPosition(success, error);
}

function validateForm(key) {
    let latElem = document.getElementById('lat');
    let longElem = document.getElementById('long');
    if (latElem.value === '' || longElem.value === '') {
        const address = encodeURIComponent(document.getElementById('address').value);
        const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${address}`;
        fetch(url).then(data => data.json()).then(res => {
            try {
                const {lat, lng} = res.results[0].locations[0].latLng;
                latElem.value = lat;
                longElem.value = lng;
            } catch (err) {
                console.error(`Error geocoding address: ${err}`);
            }
            document.getElementById('restaurant').submit();
        });
        return false;
    }

    return true;
}