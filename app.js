const express       = require('express');
const exphbs        = require('express-handlebars')
const app           = express();
const path          = require('path');
const db            = require('./db/connection');
const bodyParser    = require('body-parser');
const job           = require('./models/Job');
const Job           = require('./models/Job');
const sequelize     = require('sequelize');
const Op            = sequelize.Op;

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`o express está rodando na porta ${PORT}`);
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db
    .authenticate()
    .then(() => {
        console.log('conectou ao banco de dados com sucesso');
    })
    .catch(err => {
        console.log('ocorreu um erro ao conectar', err);
    });

// routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query  = '%'+search+'%'; // PH -> PHP, Word -> Wordpress funcionamento da busca.

    if (!search) {
        Job.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        })
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
            ]
        })
            .then(jobs => {
                res.render('index', {
                    jobs, search
                });
            });
    }

});

// jobs routes
app.use('/jobs', require('./routes/jobs'));