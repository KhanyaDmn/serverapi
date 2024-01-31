const express = require("express")
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/profile', (req, res) => {
    res.send('connected')
})

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
})