'use strict';

const app = require('./server/server');

app.listen(process.env.PORT || 3000, () => {
    console.log("server online: 3000");
});