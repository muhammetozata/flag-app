const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const db = require('./db')

const axios = require('axios')

const app = express()

const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'))


app.get('/', function(req, res) {
    
})


app.get('/question/:type', function(req, res) {
    
    var rand = Math.floor(Math.random() * 251);
    
    var refQuestion = db.firebaseConnect.ref(req.params.type)
    
    refQuery = refQuestion.orderByChild('index').startAt(rand).limitToFirst(4)

    refQuery.on('value', function(data) {
        res.json(data.val())
        refQuery.off('value')
    }, (err) => res.json({erro: err}))
})

app.post('/', function(req, res) {
    
    var newID = db.add('users', req.body)

    console.log(newID)

    res.json({message: 'Successed!!', data: req.body })

})

app.get('/users', function(req, res) {
    
    res.json(db.get('users'))
})

app.delete('/users/:id', function(req, res) {
    
    var result = db.remove('users', req.params.id)

    console.log(result)
})


app.listen(port, () => console.log('App running on port ' + port))