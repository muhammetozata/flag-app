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

// ex: localhost:8000/users
app.get('/user/:id', async (req, res) => {
    const users = await db.get('users', req.params.id)
    res.json(users)
})

// ex: localhost:8000/question/countries
app.get('/question/:type', async function(req, res) {
    
    var rand = Math.floor(Math.random() * 251);
    
    var refQuestion = db.firebaseConnect.ref(req.params.type)
    
    refQuery = refQuestion.orderByChild('index').startAt(rand).limitToFirst(4)

    refQuery.on('value', (data) => {

        res.json(data.val())
        refQuery.off('value')
    }, 
    (err) => res.json({erro: err}))
})

app.get('/users/:nickname', (req,res) => {

    var refUser = db.firebaseConnect.ref('users')
    var refQuery = refUser.orderByChild('name').equalTo(req.params.nickname)

    refQuery.on('value', (snapshot) => {

        res.json(snapshot.val())
        refUser.off('value')
    }, 
    (err) => {

        if(err.length>0) {

            res.json({error: true, message: err})
        }
        refUser.off('value')
    })
})

app.post('/users/:id', (req, res) => {


    if (req.body.level != '' && req.body.heart != '' && req.body.score != '' + req.body.level != '') 
    {

        var updataData = {}
        var refUser = db.firebaseConnect.ref('users/'+ req.params.id + '/levels/' + req.body.level)

        refUser.update({
            'heart' : parseInt(req.body.heart),
            'score' : parseInt(req.body.score),
        }, (err) => {

            if (err) 
            {
                res.json({error: true, message: err})
            } else {
                res.json({message: 'Updated'})
            }
            
        })
    } else {
        res.status(404).json({err: true, message: 'Not Found !!'})
    }
    
})

app.listen(port, () => console.log('App running on port ' + port))