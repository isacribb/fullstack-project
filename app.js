const express    = require('express')
const exphbs     = require('express-handlebars')
const app        = express()
const db         = require('./db/connection')
const bodyParser = require('body-parser')
const path       = require('path')
const { engine } = require('express-handlebars');
const Job        = require('./models/Job')
const Sequelize = require('sequelize')
const Op         = Sequelize.Op;



const PORT = 3012;

app.listen(PORT, function() {
    console.log(`o express está rodando na porta ${PORT}`)
})

// body parser
app.use(bodyParser.urlencoded({extended: false}))

// handle bars
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')
app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: "main"}));

// static folder
app.use(express.static(path.join(__dirname, 'public')))

//db connection
db
    .authenticate()
    .then(() =>{
        console.log('conectou ao banco com sucesso')
    })
    .catch(err => {
        console.log('erro ao conectar ao banco', err)
    })

// routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query  = '%'+search+'%'; // PH -> PHP, Word -> Wordpress, press -> Wordpress
  
    if(!search) {
      Job.findAll({order: [
        ['createdAt', 'DESC']
      ]})
      .then(jobs => {
    
        res.render('index', {
          jobs
        });
    
      })
      .catch(err => console.log(err));
    } else {
      Job.findAll({
        where: {title: {[Op.like]: query}},
        order: [
          ['createdAt', 'DESC']
      ]})
      .then(jobs => {
        console.log(search);
        console.log(search);
    
        res.render('index', {
          jobs, search
        });
    
      })
      .catch(err => console.log(err));
    }
  
    
  });
  
  // jobs routes
  app.use('/jobs', require('./routes/jobs'));
