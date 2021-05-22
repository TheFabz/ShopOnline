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
    app.post('/login', async (req, res, next) => {
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
      res.redirect('/show-ordered')
      res.json({ success: id })
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

    //Renders template in EJS file, ordere chronologically
    app.get('/root/computers', (req, res) => {
      listCollection.find({ category: "computer" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/audio', (req, res) => {
      listCollection.find({ category: "audio" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/keyboards', (req, res) => {
      listCollection.find({ category: "keyboard" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/laptops', (req, res) => {
      listCollection.find({ category: "laptop" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/smartphone', (req, res) => {
      listCollection.find({ category: "smartphone" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/health', (req, res) => {
      listCollection.find({ category: "health" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/home_decoration', (req, res) => {
      listCollection.find({ category: "decoration" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/office', (req, res) => {
      listCollection.find({ category: "office" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/video_games', (req, res) => {
      listCollection.find({ category: "video_games" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/tv_image', (req, res) => {
      listCollection.find({ category: "television" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/computer_mouse', (req, res) => {
      listCollection.find({ category: "mouse" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/root/beauty', (req, res) => {
      listCollection.find({ category: "beauty" }).toArray()
        .then(results => {
          res.render('root_index.ejs', { items: results })
        }).catch(error => console.error(error));
    })
    //ROOTUSER PLATFORM END;


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //CUSTOMER SIDE PLATFORM

    //Renders template in EJS file, ordere chronologically
    app.get('/main_page', (req, res) => {
      listCollection.find({}).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/computers', (req, res) => {
      listCollection.find({ category: "computer" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/keyboards', (req, res) => {
      listCollection.find({ category: "keyboard" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/laptops', (req, res) => {
      listCollection.find({ category: "laptop" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/health', (req, res) => {
      listCollection.find({ category: "health" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/home_decoration', (req, res) => {
      listCollection.find({ category: "decoration" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/office', (req, res) => {
      listCollection.find({ category: "office" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/video_games', (req, res) => {
      listCollection.find({ category: "video_games" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/tv_image', (req, res) => {
      listCollection.find({ category: "television" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/smartphone', (req, res) => {
      listCollection.find({ category: "smartphone" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/audio', (req, res) => {
      listCollection.find({ category: "audio" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/computer_mouse', (req, res) => {
      listCollection.find({ category: "mouse" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file, ordere chronologically
    app.get('/beauty', (req, res) => {
      listCollection.find({ category: "beauty" }).toArray()
        .then(results => {
          res.render('index.ejs', { items: results })
        }).catch(error => console.error(error));
    })

    //Renders template in EJS file
    app.get('/product/:id', (req, res) => {

      let id = req.params.id;


      listCollection.find({ _id: new mongo.ObjectId(id) }).toArray()
        .then(results => {
          res.render('product_page.ejs', { items: results })
        }).catch(error => console.error(error))


      /** 
        const productCategory = await getCategoryById(id);

        listCollection.find({ category: getRecommendationCategory(getCategoryById(id)) }).toArray()
        .then(results => {
          res.render('product_page.ejs', { items: results })
         
        }).catch(error => console.error(error))

        console.log(getRecommendationCategory(getCategoryById(productCategory)))
        */


    })

    //Renders template in EJS file
    app.get('/recommended/:id', async (req, res) => {

      let id = req.params.id;

      const productCategory = await getCategoryById(id);

      let recommendationCategory = getRecommendationCategory(productCategory);

      listCollection.find({ category: recommendationCategory }).toArray()
        .then(results => {
          shuffle(results);
          res.render('recommended.ejs', { items: results })
        }).catch(error => console.error(error))

    })

    // CUSTOMER SIDE PLATFORM END;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    async function getCategoryById(id) {
      const obj = await listCollection.findOne({ _id: new mongo.ObjectId(id) })
      return obj.category;
    }

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
      res.redirect('/show-ordered')
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
