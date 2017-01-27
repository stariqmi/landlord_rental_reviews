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


function createQuery(type, should, limit) {
  var query = {
    index: 'addresses',
    type: type,
    body: {
      "size": limit,
      "sort": [{"_doc": "desc"}],
      "query": {
        "bool": should
      }
    }
  };


  return query;
}

function createAddressQuery(query_params, limit) {

  var landlord_name_query = {
    "has_child": {
      "type": "review",
      "query": {
        "match_phrase_prefix": {
          "owner_name": query_params.full_addr
        }
      },
      "inner_hits": {
        "name": "reviews"
      }
    }
  };

  var should = [
    {
      "match_phrase_prefix": query_params
    }
  ]

  if (query_params.full_addr) {
    should.push(landlord_name_query);
  }

  return createQuery(
    'address',
    {
      "should": should
    },
    limit || 10
  )
}

function ratingsSum(reviews) {
  return reviews.reduce(function(acc, review) {
    return acc + review._source.rating;
  }, 0);
}

function avgRating(reviews) {
  return parseFloat(ratingsSum(reviews)) / reviews.length;
}

function parseAddresses(raw) {
  var hits = raw.hits.hits;
  var data = [];

  for (var i = 0; i < hits.length; i++) {
    var hit = hits[i];
    var source = Object.assign({}, hit._source);
    source.id = hit._id;
    source.inner_hits = hit.inner_hits || false;
    // source.total_reviews = hit.inner_hits.reviews.hits.total;

    // source.avg_rating = avgRating(hit.inner_hits.reviews.hits.hits).toFixed(1);

    data.push(source);
  }

  return {addresses: data};
}

// ElasticSearch query func
app.get('/addresses', function(req, res) {
  var query_params = {};

  // Convert this into your own middleware
  Object.assign(query_params, req.body, req.query, req.params)

  var limit = query_params.limit || 100;
  delete query_params.limit;

  var query = createAddressQuery(query_params, limit);

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
      res.send({error: 'Unable to create location/address/propery'});
    }
  )
});

app.post('/address/:id/reviews/new', function(req, res) {
  esClient.index({
    index: 'addresses',
    type: 'review',
    parent: req.params.id,
    body: req.body
  })
  .then(
    function(body) {
      res.send(body);
    },
    function(err) {
      res.send({error: 'Unable to add review'});
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

// ElasticSearch query func
app.get('/reviews/:id', function(req, res) {

  var from = req.query.from || 0;

  var query = {
    index: "addresses",
    type: "review",
    body: {
      "from": from,
      "sort": [{"_doc": "desc"}],
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
      console.log('/reviews/' + req.params.id + ' was successful');
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
