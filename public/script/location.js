function findMe(source) {
    if (!navigator.geolocation) {
        console.warn(`Geolocation is not supported by your browser`);
    } else {
        const success = (position) => {
            const {latitude, longitude} = position.coords;

            if (source === 'form') {
                const latElem = document.querySelector('#lat');
                const longELem = document.querySelector('#long');
                if (latElem && longELem) {
                    latElem.value = latitude;
                    longELem.value = longitude;
                    const findMeElem = document.querySelector('#findMe');
                    if (findMeElem) {
                        findMeElem.style.display = "none";
                    }
                    //* TODO: set addr using reverse geocoding
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
}