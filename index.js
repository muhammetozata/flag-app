const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const db = require('./db')

const app = express()

const port = 8000

app.set('view engine', 'ejs')
app.use(express.static('views'))
app.set('views', __dirname + '/views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'))

app.get('/', function(req, res) {
    res.render('home.ejs')
})

app.post('/', function(req, res) {
    
    var newID = db.add('users', req.body)

    console.log(newID)

    res.json({message: 'Successed!!', data: req.body })

    // res.render('results.ejs', { data: breakfast })
})

app.get('/users', function(req, res) {
    
    res.json(db.get('users'))
})

app.delete('/users/:id', function(req, res) {
    
    var result = db.remove('users', req.params.id)

    console.log(result)
})


app.listen(port, () => console.log('App running on port ' + port))