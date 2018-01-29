const express =require('express');
const hbs=require('hbs');
const fs= require('fs');

const port =process.env.PORT || 3000;  //HEROKU PORT SETUP LEC-15
var app=express();

hbs.registerPartials(__dirname+'/views/partials');
//handlebars view engines for express
//pass the key value pair
app.set('view engine','hbs');

//register middleware using app.use();

app.use((req,res,next)=>{
  var now=new Date().toString();
  var log=now+':'+req.method+' '+req.url;

  console.log(log);
  fs.appendFile('server.log',log+'\n',(err)=>{
    if(err){
      console.log('unable to append to server.log');
    }
  });
  next();
});
//using next() we can have as many middleware registered as we like to the express app
//next() is also used to tell express when middleware is done. current middleware cant move to next mware until next() is encountered only after which it can continue
//if your middleware dosent call next() ,the handlers for each request are never gonna fired
//req.method() & req.url() are methods available in request module of express api ref

/*app.use((req,res,next)=>{
  res.render('maintainance.hbs');
});*/

app.use(express.static(__dirname+'/public')); //middleware to teach express how to read from static directory

hbs.registerHelper('getCurrentYear',()=>{   //helper fn. to render date
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt',(text)=>{   //helper function to convert text to uppercase
  return text.toUpperCase();
});

app.get('/',(req,res)=>{
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'welcome to my website'
  });
    //res.send('<h1>Hello Express!</h1>');
    /*res.send({
        name:'Andrew',
        likes:[
          'Biking',
          'Cities'
        ]
    });*/
});

app.get('/about',(req,res)=>{
   res.render('about.hbs',{
     pageTitle: 'About page'
   });
});
app.get('/projects',(req,res)=>{
   res.render('projects.hbs',{
     pageTitle: 'Projects'
   });
});


//bad --send back json with error errorMessage
app.get('/bad',(req,res)=>{
    res.send({
        errorMessage:'Unable to handle request'
    });
});

app.listen(port,()=>{
    console.log('you are listening to port no.'+port);
});
