require('./db/mongoose') //so that this runs
const express = require('express')
const Book = require('./models/book.js')
const request = require('request') 

const app = express()
const port = process.env.PORT || 3001

app.use(express.json()) //to parse incoming json to object.

//purchase a book
app.get('/books/purchase/:id', async(req, res1)=>{
    const id = req.params.id
    const url = 'http://127.0.0.1:3000/books/info/'+id
    console.log(url)
    request({url, json:true}, (req, res)=>{
        console.log(res.body)
        if(res.statusCode ==404){
            res1.status(404).send(res.body)
        }
        const count = res.body.numberOfItems
        if(count<=0){
             res1.status(404).send("This item is out of stock")
        }
        else{
             const decUrl = 'http://127.0.0.1:3000/books/count/'+id
             console.log(decUrl)
             request.patch(
                 //First parameter API to make post request
                 decUrl,

                //The second parameter, DATA which has to be sent to API
                { json: {
                    numberOfItems: count-1,
                    } 
                },
    
                 //The third parameter is a Callback function 
                (req, res2)=>{
                    if(res2.statusCode == 200){
                        res1.send("item purchased successfully")
                    }
                    else {res1.send(res2)}
                    
                }
            );
        }
   })
})

app.listen(port, ()=>{
    console.log('server is listening')
})