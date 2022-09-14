const express = require("express");
const res = require("express/lib/response");
const { sendFile } = require("express/lib/response");

const app = express();

app.use(express.urlencoded({ extended: true }));

const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");

let db;
MongoClient.connect(
  "mongodb+srv://0168:1234@cluster0.kbpf2gc.mongodb.net/Cluster0?retryWrites=true&w=majority",
  function (err, client) {
    if (err) return console.log(err);

    db = client.db("todoapp");

    // db.collection('post').insertOne({1123: '123',name:'213' ,_id :'post'},function(err,result){
    //     console.log('저장완료')
    // });

    app.listen(8080, function () {
      console.log("listening on 8080");
    });
  }
);

// 누군가 /pet 으로 방문하면 pet관련된 안내문을 띄워주자

app.get("/pet", function (req, res) {
  res.send("펫용품 사이트입니다.");
});

// /beauty URL로 접속하면 안내문을 띄워줘야함

app.get("/beauty", function (req, res) {
  res.send("이곳은 뷰티용품 쇼핑 페이지입니다.");
});

app.get("/beauty/hand", function (req, res) {
  res.send("이곳은 핸드크림 쇼핑 페이지입니다.");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", function (req, res) {
  res.send("전송완료");

  db.collection("count").findOne({ name: "postname" }, function (err, result) {
    console.log(result.totalPost);

    let allpost = result.totalPost;

    db.collection("post").insertOne(
      { _id: allpost + 1, mainname: req.body.title, newdate: req.body.date },
      function (req, res) {
        console.log("저장완료");
        db.collection("count").updateOne(
          { name: "postname" },
          { $inc: { totalPost: 1 } },
          function (err, result) {
            if (err) {
              return console.log(err);
            }
          }
        );
      }
    );
  });
  // +count 라는 콜렉션에 있는 totalpost 라는 항목도 1 증가시켜야함
});
// /list 로 get 요청으로 접속하면
// 실제 db에 저장된 데이터들로예쁘게 꾸며진html을 보여줌

app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (err, result) {
      console.log(result);
      res.render("list.ejs", { postz: result });
    });
});

app.delete("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = parseInt(req.body._id);

  db.collection("post").deleteOne(req.body, function (err, result) {
    console.log("Deleted successfully");
    res.status(200).send({ message: "Deleted successfully" });
  });
});

app.get("/detail/:id", function (req, res) {
  db.collection("post").findOne({ _id: parseInt(req.params.id) }, function (err, result) {
    console.log(result);

    res.render("detail.ejs", { data: result });
  });
});
