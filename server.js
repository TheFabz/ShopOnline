var connectionString = 'mongodb+srv://fabz:admin@cluster0.pe6mh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
const express = require('express');
const mongo = require('mongodb');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoObjId = require('mongodb').ObjectID;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
var nodemailer = require('nodemailer');
app.use(bodyParser.json())
var shoppingCartArr = [];




MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Server logs message when server turns on successfully
    console.log('Connected to Database')

    //Connects to DB
    const db = client.db('online_store')

    //Connects to collection list-items
    const listCollection = db.collection('products')

    //Authenticates user / staff - Website main
    app.post('/login', (req, res, next) => {
      if (req.body.username == "admin" && req.body.password == "admin") {
        console.log("consumer has logged in")
        res.redirect('/main_page')
      }
      if (req.body.username == "root" && req.body.password == "root") {
        console.log("staff has logged in")
        res.redirect('/root_control')
      } else {
        res.redirect('/')
      }
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //ROOTUSER SIDE PLATFORM

    //Renders template in EJS file, ordere chronologically
    app.post('/root_search', (req, res) => {

      const userInput = req.body.input;

      console.log("Root searched for:" + userInput);

      listCollection.find({ product_name: { $regex: ".*" + userInput + ".*" } }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root_control', (req, res) => {
      listCollection.find().toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error))
    })

    //delete item from within web ui;
    app.get('/delete/:id', function (req, res) {
      let id = req.params.id;
      listCollection.deleteOne({ _id: new mongo.ObjectId(id) }, function (err, results) { });

      res.redirect('/root_control')
    });

    //updates existing item
    app.post('/edit/:id', async (req, res, next) => {
      let id = req.params.id;
      let updatedItem = { product_name: req.body.product_name, price: req.body.price, description: req.body.description, image_url: req.body.image_url, category: req.body.category };
      listCollection.updateOne({ "_id": mongoObjId(id) }, { $set: updatedItem });
      res.redirect('/root_control')
    });

    //POST that adds new items to collection
    app.post('/add_list_item', (req, res) => {

      listCollection.insertOne(req.body)
        .then(result => {
          console.log(result)
          res.redirect('/root_control')
        })
        .catch(error => console.error(error))
    })

    //Renders template in EJS file
    app.get('/root/computers', (req, res) => {
      listCollection.find({ category: "computer" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/audio', (req, res) => {
      listCollection.find({ category: "audio" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/keyboards', (req, res) => {
      listCollection.find({ category: "keyboard" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/laptops', (req, res) => {
      listCollection.find({ category: "laptop" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/smartphone', (req, res) => {
      listCollection.find({ category: "smartphone" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/health', (req, res) => {
      listCollection.find({ category: "health" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/home_decoration', (req, res) => {
      listCollection.find({ category: "decoration" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/office', (req, res) => {
      listCollection.find({ category: "office" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/video_games', (req, res) => {
      listCollection.find({ category: "video_games" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/tv_image', (req, res) => {
      listCollection.find({ category: "television" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/computer_mouse', (req, res) => {
      listCollection.find({ category: "mouse" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/beauty', (req, res) => {
      listCollection.find({ category: "beauty" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })
    //ROOTUSER PLATFORM END;


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //CUSTOMER SIDE PLATFORM

    //Adds selected item from shopping cart array
    app.post('/add_to_cart', (req, res) => {
      shoppingCartArr.push(req.body);
      res.redirect('/shopping_cart')
    })

    //Removes selected item from shopping cart array
    app.get('/remove_from_cart/:id', (req, res) => {

      for (let i = 0; i < shoppingCartArr.length; i++) {
        if (shoppingCartArr[i]._id === req.params.id) {
          shoppingCartArr.pop(shoppingCartArr[i])
        }
      }
      res.redirect('/shopping_cart')
    })

    //Renders template in EJS file
    app.get('/shopping_cart', (req, res) => {
      console.log(shoppingCartArr);
      res.render('shopping_cart.ejs', { shoppingCartArr: shoppingCartArr })
    })

    //Renders template in EJS file
    app.post('/search', (req, res) => {
      const userInput = req.body.input;
      console.log("User searched for:" + userInput);
      listCollection.find({ product_name: { $regex: ".*" + userInput + ".*" } }).toArray()
        .then(results => {
          if (results.length === 0) {
            res.sendFile(__dirname + '/not_found.html')
          } else {
            res.render('index.ejs', { items: results })
          }
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/main_page', (req, res) => {
      listCollection.find({}).toArray()
        .then(results => {
          shuffle(results);
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/computers', (req, res) => {
      listCollection.find({ category: "computer" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/keyboards', (req, res) => {
      listCollection.find({ category: "keyboard" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/laptops', (req, res) => {
      listCollection.find({ category: "laptop" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/health', (req, res) => {
      listCollection.find({ category: "health" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/home_decoration', (req, res) => {
      listCollection.find({ category: "decoration" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/office', (req, res) => {
      listCollection.find({ category: "office" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/video_games', (req, res) => {
      listCollection.find({ category: "video_games" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/tv_image', (req, res) => {
      listCollection.find({ category: "television" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/smartphone', (req, res) => {
      listCollection.find({ category: "smartphone" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/audio', (req, res) => {
      listCollection.find({ category: "audio" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/computer_mouse', (req, res) => {
      listCollection.find({ category: "mouse" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/beauty', (req, res) => {
      listCollection.find({ category: "beauty" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders product page in EJS file
    app.get('/product/:id', (req, res) => {

      let id = req.params.id;

      listCollection.find({ _id: new mongo.ObjectId(id) }).toArray()
        .then(results => {
          res.render('product_page.ejs', { items: results })
        }).catch(error => console.error(error))
    })

    //Renders recommended page in EJS file
    app.get('/recommended/:id', async (req, res) => {

      try {

        let id = req.params.id;
        const productCategory = await getCategoryById(id);
        const recommendationCategory = getRecommendationCategory(productCategory);
        //const lowerPriceFilter = (getPriceCategory(id)*0.5);

        listCollection.find({ category: recommendationCategory }).toArray()
          .then(results => {
            shuffle(results);
            res.render('recommended.ejs', { items: results })
          }).catch(error => console.error(error))
      } catch (error) {
        console.log("Failed to get a recommendation");
        res.sendFile(__dirname + '/not_found.html')
      }
    })

    // CUSTOMER SIDE PLATFORM END;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // GENERAL FUNCTIONALITY;

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    //returns obj category;
    async function getCategoryById(id) {
      const obj = await listCollection.findOne({ _id: new mongo.ObjectId(id) })
      return obj.category;
    }

    //returns obj price;
    async function getPriceById(id) {
      const obj = await listCollection.findOne({ _id: new mongo.ObjectId(id) })
      return parse.int(obj.price);
    }

    //basis for recommendation algorithm;
    function getRecommendationCategory(currentProductCategory) {

      switch (currentProductCategory) {
        case 'computer':
          relatedCategories = ['keyboard', 'mouse', 'office', 'audio']
          break;
        case 'laptop':
          relatedCategories = ['mouse', 'office', 'audio']
          break;
        case 'mouse':
          relatedCategories = ['laptop', 'computer', 'keyboard', 'office']
          break;
        case 'keyboard':
          relatedCategories = ['mouse', 'computer', 'office']
          break;
        case 'television':
          relatedCategories = ['office', 'video_game', 'audio']
          break;
        case 'video_games':
          relatedCategories = ['television', 'audio']
          break;
        case 'office':
          relatedCategories = ['computer', 'television', 'mouse', 'keyboard']
          break;
        case 'health':
          relatedCategories = ['beauty', 'decoration']
          break;
        case 'beauty':
          relatedCategories = ['health', 'decoration']
          break;
        case 'decoration':
          relatedCategories = ['television', 'office']
          break;
        case 'audio':
          relatedCategories = ['computer', 'laptop', 'television']
          break;
        case 'smartphone':
          relatedCategories = ['audio', 'office', 'laptop']
          break;
      }
      return relatedCategories[Math.floor(Math.random() * relatedCategories.length)];
    }

    //prints current items in db to terminal
    app.get('/test', (req, res) => {
      listCollection.find().toArray()
        .then(results => {
          console.log(results)
        })
        .catch(error => console.error(error))
    })

    //delete item from within web ui;
    app.get('/delete/:id', function (req, res) {
      let id = req.params.id;
      listCollection.deleteOne({ _id: new mongo.ObjectId(id) }, function (err, results) { });
      res.redirect('/root_control')
      res.json({ success: id })
    });

    //delete item API;
    app.delete('/api/delete/:id', function (req, res) {
      let id = req.params.id;
      listCollection.deleteOne({ _id: new mongo.ObjectId(id) }, function (err, results) { });
      res.json({ success: id })
    });

    //API that returns all items in collection
    app.get('/api/all_items', (req, res) => {
      listCollection.find().toArray()
        .then(results => {
          res.json({ items: results })
        })
        .catch(error => console.error(error))
    })

    // GENERAL FUNCTIONALITY;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  })


/** for use in cloud 
app.listen(process.env.PORT, function () {
  console.log('listening on 3000')
})
*/

//local use
app.listen(3001, function () {
  console.log('listening on 3001')
})

//start page, loads log-in screen;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
