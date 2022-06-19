const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');
const { render } = require('express/lib/response');


//express
const app = express();

//connect to mongodb
const dbURI = 'mongodb+srv://netninja:test1234@nodetuts.lkgqi.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI , {useNewUrlParser: true , useUnifiedTopology: true})
    .then((result)=> app.listen(3000))
    .catch((err)=> console.log(err))
//register view engine
app.set('view engine' , 'ejs');

 //middleware static files
 app.use(express.static('public'));
 app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

//mongoose and mongo sandbox routes
app.get('/add-blog', (req,res)=>{
    const blog = new Blog({
        title: 'new blog2',
        snippet: 'about my blog',
        body: 'more about my blog'
    });

    blog.save()
        .then(()=>{
            res.send(result)
        })
        .catch((err)=>{
            console.log(err);
        });
});

app.get('/single-blog', (req,res)=>{
    Blog.findById('6284f3da72d6b962556112ed')
        .then((result)=>{
            res.send(result)
        })
        .catch((err)=>{
            console.log(err);
        });
});

app.get('/all-blogs', (req,res)=>{
    Blog.find()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        });
});

app.delete('/blogs/:id' , (req,res)=> {
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result =>{
            res.json({redirect: '/blogs'})
        })
        .catch(err=>{
            console.log(err);
        })
})

 app.get('/' , (req , res)=> {
    res.redirect('/blogs');
 });

 //blog routes
app.get('/blogs' , (req,res)=>{
    Blog.find().sort({createdAt: -1})
        .then((result)=>{
            res.render('index' , {title: 'All Blogs', blogs:result});
        })
        .catch((err)=>{
            console.log(err);
        });
} );

app.post('/blogs' , (req,res)=>{
    // req.body 
    // console.log(req.body);
    const blog = new Blog(req.body);
    blog.save()
        .then((result)=>{
            res.redirect('/blogs');
        })
        .catch((err)=>{
            console.log(err);
        });
});

app.get('/blogs/:id' , (req,res)=>{
    const id = req.params.id.trim();
    console.log(id);
    Blog.findById(id)
        .then((result)=>{
            res.render('details' , {blog:result , title: 'Blog details'})
            console.log('yes');
        })
        .catch((err)=>{
            console.log(err);
        });
});

 app.get('/about' , (req , res)=> {
    res.render('about' , {title: 'About'});
 });
app.get('/blogs/create' , (req,res)=>{
    res.render('create' , {title: 'Create'});
});
 app.use((req ,res)=> {
    res.status(404).render('404' , {title: 'Error'});
 });
