const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground.js')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useUnifiedTopology:true
})

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',() => {
    console.log('Database Connected')
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))


app.get('/',(req,res) => {
    res.render('home')
})

app.get('/campgrounds',async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new',async(req,res)=> {
    res.render('campgrounds/new')
})

app.post('/campgrounds',async(req,res)=> {
    // console.log(req.body)
    const campground = new Campground(req.body.campground);
    console.log(campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id',async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
})

// Render form to edit
app.get('/campgrounds/:id/edit',async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
})

// Edit the campground
app.put('/campgrounds/:id',async (req,res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete campground
app.delete('/campgrounds/:id',async (req,res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    console.log('Successfuly deleted')
    res.redirect(`/campgrounds`)
})

app.get('/makecampground',async (req,res)=>{
    const camp = new Campground({title:'My Backyard'})
    await camp.save();
    res.send(camp)
})

app.listen(3000, () => {
    console.log('Now listening on port 3000')
})