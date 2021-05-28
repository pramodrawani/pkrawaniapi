const express = require('express');
const app = express();
const port = process.env.PORT ||8080;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient
// const mongourl = "mongodb://localhost:27017"
 const mongourl = "mongodb+srv://pkr:mongo123@cluster0.edsjx.mongodb.net/edu_mar_intern?retryWrites=true&w=majority"  
let db;
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.urlencoded({extended:true}));;
app.use(express.json());


//default route

app.get('/',(req,res)=>{
    res.send('server from express2')
})

//list of city

app.get('/location',(req,res)=>{
    db.collection('location').find().toArray((err,result)=>{
        res.send(result)
    })
})

//restaurant details

app.get('/restaurant/:id',function(req,res){  
    var {id} = req.params;
     db.collection('restaurant').find({_id:id}).toArray((err,result) =>{
      res.send(result)
   })
})

//restaurant wrt to city

app.get('/restaurant',function(req,res){
     var condition ={};
     let sortcondition = {cost:1};
     if(req.query.sort){
         sortcondition = {cost:Number(req.query.sort)}
     }

     //meal+city

     if(req.query.city && req.query.mealtype){
         condition={$and:[{"type.mealtype":req.query.mealtype},{city:req.query.city}]}
     }

     //meal+cuisine

      else if(req.query.cuisine && req.query.mealtype){
          condition= {$and:[{"Cuisine.cuisine":req.query.cuisine},{"type.mealtype":req.query.mealtype}]}
      }

     //city

    else if(req.query.city){
      condition = ({city:req.query.city})
     }

     //cuisine 

        else if(req.query.cuisine){
        condition=({"Cuisine.cuisine":req.query.cuisine})
        }
        //mealtype

        else if(req.query.mealtype){
          condition=({"type.mealtype":req.query.mealtype})
        }

        //cost

        else if(req.query.lcost && req.query.hcost){
            condition={$and:[{cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}
        }

        db.collection('restaurant').find(condition).sort(sortcondition).toArray((err,result) =>{
           res.send(result)
    })
})


 

 //mealtype api
 app.get('/mealtype',(req,res)=>{
    db.collection('mealType').find().toArray((err,result)=>{
        res.send(result)
    })
})


//cuisine api
app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find().toArray((err,result)=>{
        res.send(result)
    })
})


//view booking
app.get('/orders',(req,res)=>{
    db.collection('bookings').find().toArray((err,result)=>{
        res.send(result)
    })
})

app.post('/placeOrder',(req,res)=>{
    db.collection('bookings').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send('data added:')
    })
})

MongoClient.connect(mongourl,(err,connection)=>{
    if(err) console.log(err);
    db = connection.db('edu_mar_intern')
})


app.listen(port,function(err){
    if(err) throw err;
    console.log(`server is running on port ${port}`)
})
