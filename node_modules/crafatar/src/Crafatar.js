const https = require("https")

module.exports = {

    /**
     *
     * @param {string} uuid The UUID of a player
     * @param {number?} size The size for avatars in pixels. `1 - 512`
     * @param {boolean?} overlay Apply the overlay to the avatar.
     * @param {string?} dflt The fallback to be used when the requested image cannot be served. You can use a `custom URL`, any `uuid`, or `MHF_Steve`/`MHF_Alex`
     */
    getAvatar(uuid, size, overlay, dflt) {
        let constructedURL = `https://crafatar.com/avatars/${uuid}`
        let changed = false
        if (size) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}size=${size}`
            changed = true
        }
        if (overlay) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}overlay`
            changed = true
        }
        if (dflt) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}default=${dflt}`
            changed = true
        }
        return constructedURL
    },

    /**
     *
     * @param {string} uuid The UUID of a player
     * @param {number?} scale The scale factor for renders. `1 - 10`
     * @param {boolean?} overlay Apply the overlay to the avatar.
     * @param {string?} dflt The fallback to be used when the requested image cannot be served. You can use a `custom URL`, any `uuid`, or `MHF_Steve`/`MHF_Alex`
     */
    getHead(uuid, scale, overlay, dflt) {
        let constructedURL = `https://crafatar.com/renders/head/${uuid}`
        let changed = false
        if (scale) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}scale=${scale}`
            changed = true
        }
        if (overlay) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}overlay`
            changed = true
        }
        if (dflt) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}default=${dflt}`
            changed = true
        }
        return constructedURL
    },

    /**
     *
     * @param {string} uuid The UUID of a player
     * @param {number?} size The size for avatars in pixels. `1 - 512`
     * @param {boolean?} overlay Apply the overlay to the avatar.
     * @param {string?} dflt The fallback to be used when the requested image cannot be served. You can use a `custom URL`, any `uuid`, or `MHF_Steve`/`MHF_Alex`
     */
    getBody(uuid, scale, overlay, dflt) {
        let constructedURL = `https://crafatar.com/renders/body/${uuid}`
        let changed = false
        if (scale) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}scale=${scale}`
            changed = true
        }
        if (overlay) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}overlay`
            changed = true
        }
        if (dflt) {
            constructedURL = `${constructedURL}${changed ? `&` : `?`}default=${dflt}`
            changed = true
        }
        return constructedURL
    },

    /**
     *
     * @param {string} uuid The UUID of a player
     * @param {string?} dflt The fallback to be used when the requested image cannot be served. You can use a `custom URL`, any `uuid`, or `MHF_Steve`/`MHF_Alex`
     */
    getSkin(uuid, dflt) {
        let constructedURL = `https://crafatar.com/skins/${uuid}`
        if (dflt) {
            constructedURL = `${constructedURL}?default=${dflt}`
        }
        return constructedURL
    },

    /**
     *
     * @param {string} uuid The UUID of a player
     * @param {string?} dflt The fallback to be used when the requested image cannot be served. You can use a `custom URL`, any `uuid`, or `MHF_Steve`/`MHF_Alex`
     */
    getCape(uuid, dflt) {
        let constructedURL = `https://crafatar.com/capes/${uuid}`
        if (dflt) {
            constructedURL = `${constructedURL}?default=${dflt}`
        }
        return constructedURL
    },

    /**
     *
     * @param {URL} url The url to download the file from
     */
    download(url) {
        return new Promise((resolve, reject) => {
            https.get(url.replace("http://", "https://"), (res) => {
                let buff = Buffer.from("")
                res.on("data", (chunk) => {
                    buff = Buffer.concat([buff, chunk])
                })
                res.on("end", () => {
                    resolve(buff)
                })
                res.on("err", (err) => {
                    reject(err)
                })
            })
        })
    }
}