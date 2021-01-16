const express = require('express');
const app = express()

app.listen(3000, () => {
    console.log('CoCo Web server running on port 3000');
})

// GET METHOD 핸들러
app.get('/status', (req, res) => res.send('Server is on'));

// POST METHOD 핸들러
