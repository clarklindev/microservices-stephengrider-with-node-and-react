import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  //SENDS TO EVENT BUS
  // await axios.post('http://event-bus-srv:4005/events', {
  //   type: 'CommentCreated',
  //   data: {
  //     id: commentId,
  //     content,
  //     postId: req.params.id,
  //     status: 'pending'
  //   }
  // })

  res.status(201).send(comments);
});

app.post('/events', async (req, res)=>{
  console.log('received event: ', req.body.type);

  const {type, data} = req.body;

  if(type === 'CommentModerated'){  
    const {postId, id, status, content} = data;

    //find the comments by postId
    const comments = commentsByPostId[postId];

    //find comment in comments
    const comment = comments.find(comment => {
      return comment.id === id;
    })

    //update comment status
    comment.status = status;

    //send CommentUpdated event to event bus
    await axios.post(`http://event-bus-srv:4005/events`, {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content
      }
    })
  }
  
  res.send({});
});


app.listen(4001, () => {
  console.log('Listening on 4001');
});
