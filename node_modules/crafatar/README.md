# Crafatar-JS
npm crafatar is a simple to use URL constructor for crafatar.com

## Construct URLS
```js
const Crafatar = require("crafatar")

// Get the face of a player's skin
Crafatar.getAvatar("4f2e2e779461440abdd597be814952ae")

// Get the 3D Rendered model of a player's head
Crafatar.getHead("4f2e2e779461440abdd597be814952ae")

// Get the 3D Rendered model of a player's full body
Crafatar.getBody("4f2e2e779461440abdd597be814952ae")

// Get the player's skin
Crafatar.getSkin("4f2e2e779461440abdd597be814952ae")

// Get the player's cape
Crafatar.getCape("4f2e2e779461440abdd597be814952ae")
```

## Download the image files
```js
const fs = require("fs")

const headURL = Crafatar.getHead("4f2e2e779461440abdd597be814952ae")
Crafatar.download(headURL).then((buff) => {
    fs.writeFileSync("./crafatar3DHead.png", buff)
})
```