var connectionString = 'mongodb+srv://fabz:admin@cluster0.pe6mh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
const express = require('express');
const mongo = require('mongodb');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoObjId = require('mongodb').ObjectID;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var shoppingCartArr = [];


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Server logs message when server turns on successfully
    console.log('Connected to Database')
    //Connects to DB
    const db = client.db('online_store')
    //Connects to products collection;
    const listCollection = db.collection('products');
    //Connects to orders collection;
    const orderCollection = db.collection('orders')
    //Connects to reviews collection;
    const reviewCollection = db.collection('reviews')

    //Authenticates user / staff - Website main
    app.post('/login', (req, res, next) => {
      if (req.body.username == "admin" && req.body.password == "admin") {
        console.log("consumer has logged in")
        res.redirect('/main_page')
      }
      if (req.body.username == "fab" && req.body.password == "fab") {
        console.log("staff has logged in")
        res.redirect('/root_control')
      } else {
        res.redirect('/')
      }
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //ROOTUSER SIDE PLATFORM

    //Renders product page in EJS file
    app.get('/purchase_page/:order_number', (req, res) => {
      let id = req.params.order_number;
      orderCollection.find({ order_number: id }).toArray()
        .then(results => {
          res.render('purchase_page.ejs', { orders: results })
        }).catch(error => console.error(error))
    })

    //Renders template in EJS file, daily events
    app.get('/reviews_control/today', (req, res) => {

      let today = new Date().toISOString().slice(0, 10)

      reviewCollection.find({ date: today }).toArray()
        .then(results => {
          res.render('reviews_control.ejs', { reviews: results })
        })
        .catch(error => console.error(error));
    })

    //Renders template in EJS file, daily events
    app.get('/reviews_control/month', (req, res) => {

      let date = new Date();
      let month = "0" + parseInt(date.getMonth() + 1);
      let monthlyReviews = [];

      console.log(month)
      reviewCollection.find({}).toArray()
        .then(results => {

          for (var i = 0; i < results.length; i++) {
            if (results[i].date.slice(5, 7) == month) {
              monthlyReviews.push(results[i])
            }
          }
          res.render('reviews_control.ejs', { reviews: monthlyReviews })
        })
        .catch(error => console.error(error));
    })

    //Renders template in EJS file, daily events
    app.get('/reviews_control/year', (req, res) => {

      let date = new Date();
      let year = date.getFullYear();
      let yearlyReviews = [];

      reviewCollection.find({}).toArray()
        .then(results => {
          for (var i = 0; i < results.length; i++) {
            if (results[i].date.slice(0, 4) == year) {
              yearlyReviews.push(results[i])
            }
          }
          res.render('reviews_control.ejs', { reviews: yearlyReviews })
        })
        .catch(error => console.error(error));
    })

    //delete item from within web ui;
    app.get('/delete_review/:id', function (req, res) {
      let id = req.params.id;
      reviewCollection.deleteOne({ _id: mongoObjId(id) })
      res.redirect('/reviews_control')
    });

    //Renders template in EJS file
    app.get('/reviews_control', (req, res) => {
      reviewCollection.find().toArray()
        .then(results => {
          res.render('reviews_control.ejs', { reviews: results })
        }).catch(error => console.error(error))
    })

    //Renders template in EJS file
    app.get('/sales_overview', (req, res) => {
      orderCollection.find().toArray()
        .then(results => {
          res.render('sales_overview.ejs', { orders: results })
        }).catch(error => console.error(error))
    })

    //Renders template in EJS file, daily events
    app.get('/sales_overview/today', (req, res) => {

      let today = new Date().toISOString().slice(0, 10)

      orderCollection.find({ date: today }).toArray()
        .then(results => {
          res.render('sales_overview.ejs', { orders: results })
        })
        .catch(error => console.error(error));
    })

    //Renders template in EJS file, daily events
    app.get('/sales_overview/month', (req, res) => {

      let date = new Date();
      let month = "0" + parseInt(date.getMonth() + 1);
      let monthlyOrders = [];

      console.log(month)
      orderCollection.find({}).toArray()
        .then(results => {

          for (var i = 0; i < results.length; i++) {
            if (results[i].date.slice(5, 7) == month) {
              monthlyOrders.push(results[i])
            }
          }
          res.render('sales_overview.ejs', { orders: monthlyOrders })
        })
        .catch(error => console.error(error));
    })

    //Renders template in EJS file, daily events
    app.get('/sales_overview/year', (req, res) => {

      let date = new Date();
      let year = date.getFullYear();
      let yearlyOrders = [];


      orderCollection.find({}).toArray()
        .then(results => {

          for (var i = 0; i < results.length; i++) {
            if (results[i].date.slice(0, 4) == year) {
              yearlyOrders.push(results[i])
            }
          }

          res.render('sales_overview.ejs', { orders: yearlyOrders })

          for (var i = 0; i < yearlyOrders.length; i++) {
            yearlyOrders.pop(results[i]);
          }
        })
        .catch(error => console.error(error));
    })


    //Renders template in EJS file
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
          shuffle(results);
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error))
    })

    //delete item from within web ui;
    app.get('/delete/:id', function (req, res) {
      let id = req.params.id;
      listCollection.deleteOne({ _id: mongoObjId(id) })
      res.redirect('/root_control')
    });

    //updates existing item
    app.post('/edit/:id', async (req, res, next) => {
      let id = req.params.id;
      let updatedItem = { product_name: req.body.product_name, price: req.body.price, description: req.body.description, image_url: req.body.image_url, category: req.body.category };
      listCollection.updateOne({ "_id": mongoObjId(id) }, { $set: updatedItem });
      res.redirect('/' + 'root/' + req.body.category)
    });

    //POST that adds new items to collection
    app.post('/add_list_item', (req, res) => {
      listCollection.insertOne(req.body)
        .then(result => {
          console.log(result)

        })
      res.redirect('/' + 'root/' + req.body.category)
        .catch(error => console.error(error))
    })

    //Renders template in EJS file
    app.get('/root/computer', (req, res) => {
      listCollection.find({ category: "computer" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/computer_accessories', (req, res) => {
      listCollection.find({ category: "computer_accessories" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/smartphone_accessories', (req, res) => {
      listCollection.find({ category: "smartphone_accessories" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/bluetooth_speaker', (req, res) => {
      listCollection.find({ category: "bluetooth_speaker" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/headphones', (req, res) => {
      listCollection.find({ category: "headphones" }).toArray()
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
    app.get('/root/keyboard', (req, res) => {
      listCollection.find({ category: "keyboard" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/laptop', (req, res) => {
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
    app.get('/root/decoration', (req, res) => {
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
    app.get('/root/television', (req, res) => {
      listCollection.find({ category: "television" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/root/mouse', (req, res) => {
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


    //Renders template in EJS file
    app.get('/reviews_page/:id', (req, res) => {
      reviewCollection.find({ product_id: req.params.id }).toArray()
        .then(results => {
          shuffle(results);
          if (results.length === 0) {
            res.sendFile(__dirname + '/static_html_pages/no_reviews.html')
          }
          else {
            res.render('reviews_page.ejs', { reviewsArr: results })
          }
        }).catch(error => console.error(error));
    })


    //Adds review item from into reviews db;
    app.post('/write_review', (req, res) => {
      reviewCollection.insertOne(req.body)
        .then(result => {
          console.log(result)
          res.redirect("/reviews_page/" + req.body.product_id);
        })
        .catch(error => console.error(error))
    })


    //Adds selected item from shopping cart array
    app.post('/make_order', (req, res) => {
      orderCollection.insertOne(req.body)
        .then(result => {
          console.log(result)
          res.sendFile(__dirname + '/static_html_pages/thank_you.html')
        })
        .catch(error => console.error(error))

      for (var i = -1; i < shoppingCartArr.length + 1; i++) {
        shoppingCartArr.pop(shoppingCartArr[i]);
        console.log(shoppingCartArr[i])
      }

    })

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
            res.sendFile(__dirname + '/static_html_pages/not_found.html')
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
    app.get('/computer_accessories', (req, res) => {
      listCollection.find({ category: "computer_accessories" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/smartphone_accessories', (req, res) => {
      listCollection.find({ category: "smartphone_accessories" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/bluetooth_speaker', (req, res) => {
      listCollection.find({ category: "bluetooth_speaker" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/headphones', (req, res) => {
      listCollection.find({ category: "headphones" }).toArray()
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
        res.sendFile(__dirname + '/static_html_pages/not_found.html')
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
          relatedCategories = ['keyboard', 'mouse', 'audio', 'office', 'headphones', 'bluetooth_speaker', 'computer_accessories']
          break;
        case 'laptop':
          relatedCategories = ['mouse', 'office', 'headphones', 'bluetooth_speaker']
          break;
        case 'mouse':
          relatedCategories = ['laptop', 'computer', 'keyboard', 'office', 'computer_accessories']
          break;
        case 'keyboard':
          relatedCategories = ['mouse', 'computer', 'office', 'computer_accessories']
          break;
        case 'television':
          relatedCategories = ['office', 'video_game', 'audio']
          break;
        case 'video_games':
          relatedCategories = ['television', 'audio', 'headphones', 'decoration']
          break;
        case 'office':
          relatedCategories = ['computer', 'television', 'mouse', 'keyboard', 'computer_accessories', 'bluetooth_speaker']
          break;
        case 'health':
          relatedCategories = ['beauty']
          break;
        case 'beauty':
          relatedCategories = ['health']
          break;
        case 'decoration':
          relatedCategories = ['television', 'office', 'decoration', 'video_games']
          break;
        case 'audio':
          relatedCategories = ['computer', 'laptop', 'television', 'bluetooth_speaker']
          break;
        case 'smartphone':
          relatedCategories = ['headphones', 'bluetooth_speaker', 'smartphone_accessories']
          break;
        case 'smartphone_accessories':
          relatedCategories = ['headphones', 'smartphone', 'bluetooth_speaker']
          break;
        case 'computer_accessories':
          relatedCategories = ['computer', 'office', 'laptop', 'headphones']
          break;
        case 'headphones':
          relatedCategories = ['decoration', 'office', 'laptop', 'computer', 'computer_accessories', 'smartphone', 'smartphone_accessories']
          break;
        case 'bluetooth_speaker':
          relatedCategories = ['audio', 'office', 'laptop', ' computer', 'computer_accessories', 'smartphone', 'smartphone_accessories']
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
          console.log(results.length)
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
  res.sendFile(__dirname + '/static_html_pages/index.html')
})