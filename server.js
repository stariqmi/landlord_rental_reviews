var express = require('express');
var elasticsearch = require('elasticsearch');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

var esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());


function createQuery(type, should) {
  var query = {
    index: 'addresses',
    type: type,
    body: {
      "query": {
        "bool": should
      }
    }
  };

  return query;
}

function createAddressQuery(query_params) {
  return createQuery(
    'address',
    {
      "should": [
        {
          "match": query_params
        },
        {
          "has_child": {
            "type": "review",
            "query": {"match_all": {}},
            "inner_hits": {
              "name": "reviews"
            }
          }
        }
      ],
      "minimum_should_match": 2
    }
  )
}

function ratingsSum(reviews) {
  return reviews.reduce(function(acc, review) {
    return acc + review._source.rating;
  }, 0);
}

function avgRating(reviews) {
  return ratingsSum(reviews) / reviews.length;
}

function parseAddresses(raw) {
  var hits = raw.hits.hits;
  var data = [];

  for (var i = 0; i < hits.length; i++) {
    var hit = hits[i];
    var source = Object.assign({}, hit._source);
    source.id = hit._id;
    source.total_reviews = hit.inner_hits.reviews.hits.total;

    source.avg_rating = avgRating(hit.inner_hits.reviews.hits.hits).toFixed(2);

    data.push(source);
  }

  return {addresses: data};
}

app.get('/addresses', function(req, res) {
  console.log('GET /addresses');

  var query_params = {};

  // Convert this into your own middleware
  Object.assign(query_params, req.body, req.query, req.params)

  var query = createAddressQuery(query_params)

  esClient.search(query)
  .then(
    function(body) {
      res.send(parseAddresses(body));
    },
    function(error) {
      res.send(error.message)
    }
  );

});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/address/new', function(req, res) {
  res.sendFile(__dirname + '/new_address.html');
})

app.post('/address/new', function(req, res) {
  esClient.index({
    index: 'addresses',
    type: 'address',
    body: req.body
  })
  .then(
    function(body) {
      res.send(body);
    },
    function(err) {
      //
    }
  )
});

app.get('/address/:id', function(req, res) {
  esClient.search({
    index: 'addresses',
    type: 'address',
    body: {
      query: {
        match: {
          '_id': req.params.id
        }
      }
    }
  })
  .then(
    function(body) {
      res.send(body);
    },
    function(error) {
      res.send(error.message)
    }
  );
})

app.get('/address/:id/reviews', function(req, res) {
  res.sendFile(__dirname + '/reviews.html');
});

app.get('/reviews/:id', function(req, res) {
  var query = {
    index: "addresses",
    type: "review",
    body: {
      "query": {
        "parent_id": {
          "type": "review",
          "id": req.params.id
        }
      },
      "aggs": {
        "avg_rating": {
          "avg": {
            "field": "rating"
          }
        }
      }
    }
  };

  esClient.search(query)
  .then(
    function(body) {
      res.send(body);
    },
    function(error) {
      res.send(error.message)
    }
  );
});

app.listen(3000, function() {
  console.log('listening on port 3000');
});
