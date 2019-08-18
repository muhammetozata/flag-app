const admin = require('firebase-admin')

var serviceAccount = require("./serviceAccountKey.json")

// admin.initializeApp(functions.config())

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://flag-app-bcbd3.firebaseio.com"
})

var database = admin.database()
 
exports.firebaseConnect = database

// Realtime Firebase 
exports.getKey = (ref) => database.ref(ref).push().getKey()


exports.get = function(ref, refId = null) {

    return functions.https.onRequest((req, res) => {
        var refData = admin.database().ref('users').on('value', (data) => {
            res.json(data.val())
        })
        console.log(refData);
    })
}


// Realtime Firebase Add
exports.add = function(ref, data, customRefId = null) {

    if (customRefId != null) {
        var ref = database.ref(ref + '/' + customRefId)
        .set(data);
    } else {
        var ref = database.ref(ref)
        .push(data);
    }
        
    ref.then(function(row) {

        return {error: false, data: row}
    })
    .catch(function(error) {

        return {error: true, message: error}
    })

    // res.json({message: 'successed', newId: result.value})
}

// Realtime Firebase Update
exports.update = function(ref, refId, data) {
    
    database.ref(ref + '/' + refId).set(data)
    .then(function(){
        
        console.log('Update successed')
    })
    .catch(function(error){
        
        console.log('Not Update :' + error)
    })
}

// Realtime Firebase Remove
exports.remove = function(ref, refId) {

    database.ref(ref + '/' + refId)
        .remove(function(){

            console.log('Removed: ' + ref)
        })
        .catch(function(error) {

            console.log('Not Removed: ' + ref)
        })
}