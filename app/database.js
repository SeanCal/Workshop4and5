import React from 'react';
import ReactDOM from 'react-dom';

var initialData = {
  //The "user" collection. contains all of the users in our facebook system.
  "users": {
    "1": {
      "_id": 1,
      "fullName": "Someone",
      "feed": 1
    },
    "2": {
      "_id": 21,
      "fullName": "Someone Else",
      "feed": 2
    },
    "3": {
      "_id": 3,
      "fullName": "Another Person",
      "feed": 3
    },
    //This is "You"!
    "4": {
      "_id": 4,
      "fullName": "John Vilk",
      "feed": 4
    }
  },
  //The 'feedItems' collection. contains all of the feed items on our facebook system
  "feedItems": {
    "1": {
      "_id": 1,
      //a list of users that liked the post. here, 2 and 3 liked this post.
      "likeCounter": [
        2, 3
      ],
      //the type and contents of this feed item. this item happens to be a status Update
      "type": "statusUpdate",
      "contents": {
        //id of the user that posted the ststus update.
        "author": 1,
        //1/24/16 3:48 EST converted to unix time
        //# of miliseconds since jan 1 1970 utc
        //https://en.wikipedia.org/wiki/unix_time
        "postDate": 1453668480000,
        "location": "Austin, TX",
        "contents": "ugh."
      },
      //list of comments on the post
      "comments": [
        {
          //the author of the comment
          "author": 2,
          //the contents of the comment
          "contents": "hope everything is ok!",
          //the date the comment was posted. 1/24/16 22:00 EST
          "postDate": 1453690800000
        },
        {
          "author": 3,
          "contents": "sending hugs your way",
          "postDate": 1453690800000
        }
      ]
    }
  },
  //"feeds" collection. Feeds for each FB user.
  "feeds": {
    "4": {
      "_id": 4,
      //listing feeditems in the feed
      "contents": [1]
    },
    "3": {
      "_id": 3,
      "contents": []
    },
    "2": {
      "_id": 2,
      "contents": []
    },
    "1": {
      "_id": 1,
      "contents": []
    }
  }
};

var data = JSON.parse(localStorage.getItem('facebook_data'));
if (data === null) {
  data = JSONClone(initialData);
}

/**
 * A dumb cloning routing. Serializes a JSON object as a string, then
 * deserializes it.
 */
function JSONClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Emulates reading a "document" from a NoSQL database.
 * Doesn't do any tricky document joins, as we will cover that in the latter
 * half of the course. :)
 */
export function readDocument(collection, id) {
  // Clone the data. We do this to model a database, where you receive a
  // *copy* of an object and not the object itself.
  return JSONClone(data[collection][id]);
}

/**
 * Emulates writing a "document" to a NoSQL database.
 */
export function writeDocument(collection, changedDocument) {
  var id = changedDocument._id;
  // Store a copy of the object into the database. Models a database's behavior.
  data[collection][id] = JSONClone(changedDocument);
  // Update our 'database'.
  localStorage.setItem('facebook_data', JSON.stringify(data));
}

/**
 * Adds a new document to the NoSQL database.
 */
export function addDocument(collectionName, newDoc) {
  var collection = data[collectionName];
  var nextId = Object.keys(collection).length;
  while (collection[nextId]) {
    nextId++;
  }
  newDoc._id = nextId;
  writeDocument(collectionName, newDoc);
  return newDoc;
}

/**
 * Reset our browser-local database.
 */
export function resetDatabase() {
  localStorage.setItem('facebook_data', JSON.stringify(initialData));
  data = JSONClone(initialData);
}

/**
 * Reset database button.
 */
class ResetDatabase extends React.Component {
  render() {
    return (
      <button className="btn btn-default" type="button" onClick={() => {
        resetDatabase();
        window.alert("Database reset! Refreshing the page now...");
        document.location.reload(false);
      }}>Reset Mock DB</button>
    );
  }
}

ReactDOM.render(
  <ResetDatabase />,
  document.getElementById('fb-db-reset')
);
