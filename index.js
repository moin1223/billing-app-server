const express = require('express')
const app = express()
const cors =require('cors');
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json())
const port = 5000

// app.get('/', (req, res) => {
//   res.send('I am running yeshhhhh')
// })


//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bghwt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const billingCollection = client.db(`${process.env.DB_NAME}`).collection("billing-list");
  //get
  app.get('/billing-list',(req,res)=>{
    billingCollection.find()
      .toArray((err,items)=>{
          res.send(items)
        
      })

  })

  //add

  app.post('/add-billing',(req,res)=>{
      

    const newbill= req.body;
    billingCollection.insertOne(newbill)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
 
   })

   //Edit

   app.patch('/update/:id', (req, res) => {
    const updateBill=req.body;
    billingCollection.updateOne({_id:ObjectId(req.params.id)},
    {
        $set:{fullName:req.body.fullName,email:req.body.email,phone:req.body.phone,paidAmount:req.body.paidAmount,}
    }
    
    )
    .then(result=>{
        console.log(result)
        res.send(!!result.modifiedCount)
    })
        
  })

  //delete

  app.delete('/deleteBilling/:id', (req, res) => {
    billingCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
        res.send(result.deletedCount > 0);
       
    })
  
  })



})





app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(process.env.PORT || port)