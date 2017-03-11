var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config={
    user:'kalaichelvan98',
    database:'kalaichelvan98',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password: 'db-kalaichelvan98-15956'
};
var app = express();
app.use(morgan('combined'));
var articles={
    'article-one':{
        title:'article-one|kalaichelvan',
        heading:'article-one',
        date:'sep 05-2016',
        content:`
        <p>
           This is my first Article.This is my first Article.This is my first Article.This is my first Article.
        </p>`
        },
    'article-two':{
        title:'article-two|kalaichelvan',
        heading:'article-two',
        date:'sep 06-2016',
        content:`
        <p>
           This is my second Article.This is my second Article.
        </p>`
    },
    'article-three':{
        title:'article-three|kalaichelvan',
        heading:'article-three',
        date:'sep 07-2016',
        content:`
        <p>
           This is my third Article.
        </p>`
    },
};
function createTemplate (data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
    var htmltemplate=`
    <html>
    <head>
       <title> 
       ${title}
       </title>
    </head>
    <body>
        <div class="container">
        <div>
        <a href='/'>Home</a>
        </div>
        <hr/>
        <h3>
        ${heading}
        </h3>
        <div>
        ${data}
        </div>
        <div>
        ${content}
        </div>
        </body>
</html>
`;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool = new Pool(config);
app.get('/test_db',function(req,res){
    //make a select request 
    //return the response with the results
    pool.query('SELECT * FROM test',function(err,result){
       if(err){
           res.status(500).send(err.toString());}
           else{
               res.send(JSON.stringify(result.rows));
           }
       
    });
});
var counter=0;
app.get('/counter',function(req,res){
   counter=counter+1;
   res.send(counter.toString());
});
var names=[];
app.get('/submit-name',function(req,res){
   var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});
app.get('/article/:articleName',function(req,res){
   pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName +"'", function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }
       else{
           if(result.rows.length===0){
               res.status(404).send('Article Not Found');
           }
           else{
               var articeData = result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
   } );
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
