import fs from "fs";
import express from "express";

const PORT = 3000;
const app = express();
let temp1 = { title: "bu jang", description: "ajoyib" };
let temp2 = { title: "bu kino", description: "maladest" };

app.use(express.json());

let posts = fs.readFileSync(`${process.cwd()}/posts.json`, "utf-8");
posts = JSON.parse(posts);

app.get("/posts/all", (req, res) => {
  res.status(200).send(JSON.stringify(posts, null, 4));
});

app.get("/posts/single/:id", (req, res) => {
  let { id } = req.params;
  let temp = posts.find((user) => user.id == +id);
  console.log(temp);

  res
    .status(200)
    .send(
      JSON.stringify({ status: 200, message: "Ok", data: { temp } }, null, 4)
    );
});

app.get("/posts", (req, res) => {
  let { title, description, id } = req.query;
  const temp = posts.filter((user) =>
    title
      ? user.title == title
      : undefined || description
      ? user.description == description
      : undefined || id
      ? String(user.id) == id
      : undefined
  );
  console.log(temp);

  res.status(201).send(JSON.stringify(temp, null, 4));
});

app.post("/posts", (req, res) => {
  req.body = { id: Date.now(), ...req.body };
  posts.push(req.body);
  res.status(201).send({ message: "Query Ok", status: 201 });
  fs.writeFileSync(
    `${process.cwd()}/posts.json`,
    JSON.stringify(posts, null, 4),
    "utf-8"
  );
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((el) => el.id !== +id);
  fs.writeFileSync(
    `${process.cwd()}/posts.json`,
    JSON.stringify(posts, null, 4),
    "utf-8"
  );
});

app.put("/posts/:id", (req, res) => {
  let { id } = req.params;
  let body = req.body;
  let tempPost = posts.find((el) => el.id == +id);
  let { title, description } = body;
  let temp = {
    id: id,
    title:
      title == undefined
        ? tempPost.title
        : (tempPost.title = title),
    description:
      description == undefined
        ? tempPost.description
        : (tempPost.description = description),
  };
  posts = posts.filter((el) => el.id !== +id);
  posts.push(temp);
  fs.writeFileSync(
    `${process.cwd()}/posts.json`,
    JSON.stringify(posts, null, 4)
  );
  res
    .status(201)
    .send(
      JSON.stringify({ status: 200, message: "Ok", data: { ...temp } }, null, 4)
    );
});

app.listen(PORT, () => {
  console.log(`Server is runned on ${PORT}`);
});
