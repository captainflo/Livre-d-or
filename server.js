//charge le module express et bodyParser et sauvegarder dans une variable express
let express = require('express')
let bodyParser = require('body-parser')
let app = express()

var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});


// *** MOTEUR TEMPLATE *** //
app.set('view engine', 'ejs') //for use ejs

// *** MIDLEWARE *** //
//quel dossier sert a distribuer les fichier static
app.use('/assets', express.static('public'))
//utiliser le midleware de bodyParser (paser en form)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())// parser en Json


// *** ROUTE *** //
app.get('/', function(request, response){
  response.render('pages/index', {test: 'salut'})// rendre la vue
})

// lorsque tu vas en post sur la page d'accueil  tu vas lancer une fonction
//  qui prend en paramètre la requete et la reponse
app.post('/', function(request, response){
    if (request.body.message === undefined || request.body.message === ''){
      response.redirect('/')
    }
})

//server listen (localhost:8080)
app.listen(8080)
