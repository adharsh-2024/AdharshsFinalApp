/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const ToDoItem = require('../models/ToDoItem')
const axios = require("axios");

/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}


router.post("/showmonthlyData",
  async (req,res,next) => {
    try {
      const datafeature = req.body.datafeature
      const datatype = req.body.datatype
      const startyear = req.body.startyear
      const endyear = req.body.endyear
      const country = req.body.country
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"+datafeature+"/"+datatype+"/"+startyear+"/"+endyear+"/"+country
      const searchname = req.body.datasearchname
      console.log(url)
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      console.log("here it is god")
      console.log(res.locals.results)

      const todo = new ToDoItem(
        {searchname:searchname,
          country:country,
          startYear:startyear,
          endYear:endyear,
          frequency:datafeature,
          feature:datatype,
         createdAt: new Date(),
         userId: req.user._id
        })
          await todo.save();

      if (datatype == "pr") {
        console.log( "It is pr")
          if (datafeature == "mavg")
          {
            res.locals.feature = "Monthly Average Precipitation"
              res.render('showClimateDataMonthly')
          }
          else if (datafeature == "annualavg")

         {
            res.locals.feature = "Annual Average Precipitation"
              res.render('showClimateDataAnnual')
          }

          else if (datafeature == "manom")

         {
              res.locals.feature = "Monthly Anamoly Precipitation"
                res.render('showClimateDataMonthly')
          }

          else if (datafeature == "annualanom")

         {
            res.locals.feature = "Annual Anamoly Precipitation"
            res.render('showClimateDataAnnual')
          }



      }

      else {
        if (datafeature == "mavg")
        {
          res.locals.feature = "Monthly Average Temperature"
            res.render('showClimateDataMonthly')
        }
        else if (datafeature == "annualavg")

       {
          res.locals.feature = "Annual Average Temperature"
            res.render('showClimateDataAnnual')
        }

        else if (datafeature == "manom")

       {
            res.locals.feature = "Monthly Anamoly Temperature"
              res.render('showClimateDataMonthly')
        }

        else if (datafeature == "annualanom")

       {
          res.locals.feature = "Annual Anamoly Temperature"
          res.render('showClimateDataAnnual')
        }

    }



    } catch(error){
      next(error)
    }
})

router.post("/showmonthlyDataforChart",
  async (req,res,next) => {
    try {
      const datafeature = req.body.datafeature
      const datatype = req.body.datatype
      const startyear = req.body.startyear
      const endyear = req.body.endyear
      const country = req.body.country
      const url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"+datafeature+"/"+datatype+"/"+startyear+"/"+endyear+"/"+country
      const searchname = req.body.datasearchname
      console.log(url)
      const result = await axios.get(url)
      console.dir(result.data)
      console.log('results')
      res.locals.results = result.data
      console.log("here it is god")
      console.log(res.locals.results)

      const todo = new ToDoItem(
        {searchname:searchname,
          country:country,
          startYear:startyear,
          endYear:endyear,
          frequency:datafeature,
          feature:datatype,
         createdAt: new Date(),
         userId: req.user._id
        })
          await todo.save();

      if (datatype == "pr") {
        console.log( "It is pr")

            res.locals.feature = "Monthly Average Precipitation"
              res.render('showClimateDataMonthlyChart')
          }






      else {


          res.locals.feature = "Monthly Average Temperature"
            res.render('showClimateDataMonthlyChart')




    }



    } catch(error){
      next(error)
    }
})




router.get('/climate',
  isLoggedIn,
  async (req, res, next) => {

     res.render('climatedataform');
});

router.get('/climatechart',
  isLoggedIn,
  async (req, res, next) => {

     res.render('climatechartform');
});

// get the value associated to the key
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.items = await ToDoItem.find({userId:req.user._id})
      console.log(res.locals.items)
     res.render('toDoList');
});



/* add the value in the body to the list associated to the key */
router.post('/save',
  isLoggedIn,
  async (req, res, next) => {
      const todo = new ToDoItem(
        {searchname:req.body.item,
          country:"ACE",
          startYear:"1930",
          endYear:"2020",
          frequency:"Montly",
          feature:"Precipitation",
         createdAt: new Date(),
         userId: req.user._id
        })
      await todo.save();
      //res.render("todoVerification")
      res.redirect('/todo')
});





router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /todo/remove/:itemId")
      await ToDoItem.remove({_id:req.params.itemId});
      res.redirect('/todo')
});

router.get('/makeComplete/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /todo/makeComplete/:itemId")
      const todo = await ToDoItem.findOne({_id:req.params.itemId});
      todo.completed = true;
      await todo.save()
      //res.locals.todo = todo
      //res.render('completionConfirm')
      res.redirect('/todo')
});

router.get('/switchComplete/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /todo/switchComplete/:itemId")
      const todo = await ToDoItem.findOne({_id:req.params.itemId});
      todo.completed = !todo.completed;
      await todo.save()
      //res.locals.todo = todo
      //res.render('completionConfirm')
      res.redirect('/todo')
});





module.exports = router;
