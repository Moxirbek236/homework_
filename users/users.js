import fs from "fs";
import express from "express";

const PORT = 3000;
const app = express();
app.use(express.json());

let users = fs.readFileSync(`${process.cwd()}/users.json`, "utf-8");
users = JSON.parse(users);
app.get("/users/all", (req, res) => {
  res.status(200).send(JSON.stringify(users, null, 4));
});

app.get("/users/single/:id", (req, res) => {
  let { id } = req.params;
  let temp = users.find((user) => user.id == +id);
  console.log(temp);

  res
    .status(200)
    .send(
      JSON.stringify({ status: 200, message: "Ok", data: { temp } }, null, 4)
    );
});

app.get("/users", (req, res) => {
  let { name, age, isAdmin } = req.query;
  const user = users.filter((user) =>
    name
      ? user.name == name
      : undefined || age
      ? user.age == age
      : undefined || isAdmin
      ? String(user.isAdmin) == isAdmin
      : undefined
  );
  console.log(user);

  res.status(201).send(JSON.stringify(user, null, 4));
});

app.post("/users", (req, res) => {
  req.body = { id: Date.now(), ...req.body };
  users.push(req.body);
  res.status(201).send({ message: "Query Ok", status: 201 });
  fs.writeFileSync(
    `${process.cwd()}/users.json`,
    JSON.stringify(users, null, 4),
    "utf-8"
  );
});

app.delete("/users/:id", (req, res) => {
  let { id } = req.params;
  users = users.filter((el) => el.id !== +id);
  fs.writeFileSync(
    `${process.cwd()}/users.json`,
    JSON.stringify(users, null, 4),
    "utf-8"
  );
});

app.put("/posts/:id", (req, res) => {
  let { id } = req.params;
  let body = req.body;
  let tempPost = posts.find((el) => el.id == +id);
  let { name, lastName, age } = body;
  let temp = {
    id: id,
    name:
      name == undefined
        ? tempPost.name
        : (tempPost.name = name),
    lastName:
      lastName == undefined
        ? tempPost.lastName
        : (tempPost.lastName = lastName),
    age:
      age == undefined
        ? tempPost.age
        : (tempPost.age = age),
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
