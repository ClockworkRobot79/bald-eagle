function findMe(source) {
    if (!navigator.geolocation) {
        console.warn(`Geolocation is not supported by your browser`);
        return;
    }

    const success = (position) => {
        const {latitude, longitude} = position.coords;

        if (source === 'form') {
            // set addr using reverse geocoding
            const url = `/location/address?lat=${latitude}&long=${longitude}`;
            fetch(url).then(data => data.json()).then(res => {
                try {
                    const {street, city, state, postalCode} = res;
                    const addrElem = document.getElementById('address');
                    if (addrElem && street && city && state && postalCode) {
                        addrElem.value = `${street}, ${city} ${state} ${postalCode}`;
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

function validateForm() {
    // if the lat/long hidden fields aren't filled in, try to generate them from the address
    let latElem = document.getElementById('lat');
    let longElem = document.getElementById('long');
    if (isNaN(Number(latElem.value)) || isNaN(Number(longElem.value))) {
        // if there is no address, don't bother trying to get the lat/long
        const address = encodeURIComponent(document.getElementById('address').value);
        if (!address) {
            return true;
        }

        const url = `/location/latlong/${address}`;
        fetch(url).then(data => data.json()).then(res => {
            try {
                const {lat, lng} = res;
                if (lat && lng) {
                    latElem.value = lat;
                    longElem.value = lng;
                }
            } catch (err) {
                console.error(`Error geocoding address: ${err}`);
            }

            document.getElementById('restaurant').submit();
        });
        return false;
    }

    return true;
}

function invalidateLatLong() {
    try {
        document.getElementById('lat').value = undefined;
        document.getElementById('long').value = undefined;
    } catch(err) {
        console.error(`Failed to clear the lat/long fields: ${err}`);
    }
}
