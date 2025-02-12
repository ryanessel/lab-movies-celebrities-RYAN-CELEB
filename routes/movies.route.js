const router = require("express").Router();
const Celeb = require("../models/Celebrity.model");
const Movie = require('../models/Movie.model');
const User = require('../models/User.model');



router.get(`/movies`, (req, res, next) => {
    // console.log(res.render(`./celebrities/celebrities`));
    Movie.find()
    .then(allMoviesDb => {
        // console.log("Got all movies", allMoviesDb);
 
    


        res.render('./movies/movies', { movies: allMoviesDb});
        
    })
    .catch(error => {
        console.log(`Error on movie get`, error);
 
        next(error);
    })
 
 
   });




router.get(`/movies/create`, (req, res) =>{
    // res.render(`movies/new-movie.hbs`)
    
    Celeb.find()
    .then(allCelebsDb => {
        console.log("Got all celebs", allCelebsDb);
 
        res.render('./movies/new-movie.hbs', { celebs: allCelebsDb});
        
    })
    .catch(error => {
        console.log(`Error on movie get`, error);
 
        next(error);
    })



    })
 
    router.post('/movies/create', (req, res, next) => {
       console.log({entireFormInput: req.body});// req.body is the thing catching the data sent from the html form method POST
       const {title, genre, plot, cast} = req.body;
       // adds new book to database from the form
       Movie.create({title, genre, plot, cast})
           // .then(newBookForDb => console.log(`New book created: ${newBookForDb.title}`))
          
           //Celeb.findByIdAndUpdate()
          
           .then(() => {
               res.redirect(`/movies`)
           })
           .catch(error => {
               next(error)
           });
   
     });



     router.get('/movies/:Id', (req, res, next)=>{
        Movie.findById(req.params.Id).populate('cast')
        .then(theMovie=>{
            console.log({TESTTTTTT: theMovie})



            res.render('movies/movie-details', theMovie)
        })
        .catch((err)=>{
            console.log(err);
        })
    })


  
    
    router.post('/movies/:id/delete', (req, res, next)=>{

        Movie.findByIdAndRemove(req.params.id)
        .then((response)=>{
            res.redirect('/movies');
        })
        .catch((err)=>{
            console.log(err);
        })
    
    });


    router.get('/movies/:id/edit', (req, res, next) => {
        Movie.findById(req.params.id).populate('cast')
        .then(theMovie=>{
            console.log({TESTTTTTT: theMovie})



            
        
        Celeb.find()
        .then(allCelebsDb => {
            console.log("Got all celebs", allCelebsDb);
     
            res.render('movies/edit-movie', {movie: theMovie, celebs: allCelebsDb})
        })
        })

     
        .catch(err => {console.log({err})})
    })
    











    

    // router.get(`/movies/:id/edit`, (req, res, next) => {
    //     Movie.findById(req.params.id)
    //     .then(() => {

    //     })

    //     Celeb.find()
    //     .then((celebFromDb) => {
    //         res.render(`movies/edit-movie`, {celebs: celebFromDb})
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })


    // })



    router.post('/movies/:id', (req, res, next)=>{

        Movie.findByIdAndUpdate( req.params.id, {
            title: req.body.title,
            genre: req.body.genre,
            plot: req.body.plot,
            cast: req.body.cast
           

        })
        
        
        
        .then((response)=>{
    
            res.redirect(`/movies/${req.params.id}`);
    
        }).catch((err)=>{
            console.log(err);
        })
    
    
    })
// TRYING TO SEND LIEKD MOVIED ID's TO CURRENT SESSION UESER likedMovie ARRAY
    router.post(`/like/:id`, (req, res, next) => {

       



      let movieId = req.params.id

  

      
         
        User.findByIdAndUpdate(req.session.currentUser._id, {
            
            
            $addToSet: {likedMovies: movieId},//addToSet to array only once.
         
            // likedMovies: req.body.likedMovies = [req.params.id]
        })
        .then(response => {
            console.log(response)
            console.log(response.likedMovies)
        })
        // .then(user => {
        //     user.likedMovies = user.likedMovies.push(movieId)
        //     console.log(user.likedMovies.length)
        //     console.log(user)
        // })
       

        console.log({注意likedMovie: req.params.id})// clicking like gives movie id (needs to be passed to the User.moviesliked array)
        res.redirect(`/movies`)
    })
  

  module.exports = router;