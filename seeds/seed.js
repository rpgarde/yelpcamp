const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useUnifiedTopology:true
})

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',() => {
    console.log('Database Connected')
})

// randomly pulls an element from an array
const sample = (array) => array[Math.floor(Math.random()*array.length)]

const seedDb = async() => {
    // clear db 
    await Campground.deleteMany({})
    // loop over random cities / descriptors
    for(let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random())*1000
        const price = Math.floor((Math.random()*20)+10)
        const c = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price:price,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda sed soluta rerum tenetur hic asperiores odit velit dolorum itaque sit vitae nihil animi ipsum distinctio voluptatum enim, doloremque labore veniam!'
        })
        await c.save()
    }
    console.log('DATABASE SEEDED')
}

seedDb().then(()=>mongoose.connection.close())