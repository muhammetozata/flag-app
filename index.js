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
    res.send('Hello Flag App')
})

// ex: localhost:8000/question/countries
app.get('/question/:type', function(req, res) {
    
    var rand = Math.floor(Math.random() * 251);
    
    var refQuestion = db.firebaseConnect.ref(req.params.type)
    
    refQuery = refQuestion.orderByChild('index').startAt(rand).limitToFirst(4)

    refQuery.on('value', function(data) {
        res.json(data.val())
        refQuery.off('value')
    }, (err) => res.json({erro: err}))
})

app.get('/users/:nickname', (req,res) => {

    var refUser = db.firebaseConnect.ref('users')
    var refQuery = refUser.orderByChild('name').equalTo(req.params.nickname)

    refQuery.on('value', function(snapshot){

        res.json(snapshot.val())
        refUser.off('value')
    }, function(err){

        if(err.length>0) {
            res.json({error: true, message: err})
        }
        refUser.off('value')
    })
})


app.listen(port, () => console.log('App running on port ' + port))