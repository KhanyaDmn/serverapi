const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")

const app = express();


const PORT = 3001;

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.get('/profile', (req, res) => {
    res.send('connected')
})

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
})