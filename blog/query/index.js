import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
/*:

//example of post 
post === {
  'ghgu443': {
    id: 'ghgu443',
    title : "post title",
    comments: [
      {
        id: 'klfjfs3',
        content: "comment!"
      }
    ]
  }
}
*/


app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if(type === 'CommentUpdated'){
    const {id, content, postId, status} = data;
    const post = posts[postId];
    
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });
    
    //update the actual content
    comment.status = status;
    comment.content = content;

  }
  console.log(posts);
  res.send({});
});

app.listen(4002, () => {
  console.log('Listening on 4002');
});

