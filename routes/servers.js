import { Router } from 'express';
import * as fs from 'fs';
import db from '../db/users.json' assert { type: "json" };

const router = Router();

class User {
  constructor(name, pass) {
    this.id = db.users.length;
    this.name = name;
    this.password = pass;
    this.options = {
      volume: '50',
      language: 'en'
    };
    this.achives = {
      youdidit: 'false',
      blackspot: 'false',
      pirate: 'false',
      whatabottle: 'false',
      undying: 'false',
    };
  }
}

router.get('/userGet/:name&:pass', (req, res) => {
  const user = db.users.find((user) => user.name === req.params.name);
  if (user && (user.password === req.params.pass))
    res.json(user);
  else
    res.status(400).send();
});

router.get('/userReg/:name&:pass', (req, res) => {
  const user = db.users.find((user) => user.name === req.params.name);
  if (!user) {
    const newUser = new User(req.params.name, req.params.pass);
    db.users.push(newUser);
    fs.writeFile('./db/users.json', JSON.stringify(db), 'utf-8',
      (err, data) => {
        if (err) throw err;
        console.log(data);
      });
    res.json(newUser);
    res.status(200).send()
  }
  else
    res.status(400).send();
});

router.post('/pushUser/:id', (req, res) => {
  const user = req.body;
  db.users[user.id] = user;
  fs.writeFile('./db/users.json', JSON.stringify(db), 'utf-8',
    (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  res.status(201).send();
});

router.get('/getLeaders', (req, res) => {
  const leaders = [];
    db.users.forEach((user) => {
      let points = 0;
      for (const key in user.achives) {
        if (user.achives[key] === 'true') points++;
      }
      leaders.push([user.name, points]);
    })
    leaders.sort((a, b) => b[1] - a[1]);
    res.json(leaders);
});

export default router;
