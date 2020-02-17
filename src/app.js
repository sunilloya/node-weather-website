const express = require('express');
const path = require('path')
const hbs = require('hbs')

const forecastutil = require('./utils/forecast')
const geocastutil = require('./utils/geocode')
const app = express();

const publicDirPath = path.join(__dirname, "../public");
const viewspath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials")
// console.log(publicDirPath);

app.set('view engine', 'hbs');
app.set('views', viewspath)
app.use(express.static(publicDirPath));
hbs.registerPartials(partialPath)

app.get('', (req, res) => {
    res.render('index', {
        title: "weather app",
        name: "Sunil"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: 'Sunil'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        name: 'Sunil'
    })
})

/* app.get('', (req, res) => {
    res.send("<h1>Home Page! Welcome express</h1>");
});

app.get('/help', (req, res) => {
    res.send({
        name: "Sunil",
        Location: "Pune"
    });
})
app.get('/about', (req, res) => {
    res.send('<h3>about express!!</h3>')
}); */
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'PLese provide address'
        })
    }
    console.log(req)
    let forecstdt;
    geocastutil(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({
                error: error
            })
        }

        forecastutil(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            // console.log("forecastData:::" + forecastData)
            res.send({
                address: req.query.address,
                forecast: forecastData,
                location: "San Fransis"
            });
        })
    })

});
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'No products found'
        })
    }
    res.send({
        products: []
    })

})
app.get('/help/*', (req, res) => {
    res.render("404", {
        title: '404 help',
        name: 'Sunil',
        errorMsg: "Help article not found"
    })
})
app.get('*', (req, res) => {
    res.render("404", {
        title: '404',
        name: 'Sunil',
        errorMsg: "Page not found"
    })
})
app.listen(3000, () => {
    console.log("Server is up and running");
})