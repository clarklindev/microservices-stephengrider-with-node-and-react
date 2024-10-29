import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app
  .post("/events", async (req, res) => {

    try{
      //req.body will contain event
      const { type, data } = req.body;

      if (type === "CommentCreated") {
        const status = data.content.includes("orange") ? "rejected" : "approved";

        await axios.post("http://event-bus-srv:4005/events", {
          type: "CommentModerated",
          data: {
            id: data.id,
            postId: data.postId,
            status,
            content: data.content,
          },
        });
      }
      res.send({});
    }
    catch(err){
      console.log(err.message);
    }
});

app.listen(4003, () => {
  console.log("listening on 4003");
});
