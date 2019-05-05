var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const util = require("util");
var multer = require("multer");
var realfs = require("fs");
var fs = require("graceful-fs");
const fsextra = require("fs-extra");
const path = require("path");
const glob = require("glob");

//tables
const Collegamento = require("../models/collegamento");
const Messaggio = require("../models/messaggio");
const Utente = require("../models/utente");
const Userdata = require("../models/userdata");
const Skill = require("../models/skill");
const Job = require("../models/job");
const Applier = require("../models/appliers");
const Async = require("async");

let chatident;
let lista;
let chatMessages;
let chatfound;
var password;
var username;
var accounts;
var chatlist = [];
var id;

fs.gracefulify(realfs);

//Set  Storage
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("profile");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

//Manage user data
router.get("/userdata", ensureAuthenticated, (req, res) => {
  let data = null;
  Userdata.findOne({
    where: { UTENTE_id: req.user.id }
  }).then(data => {
    let professione = req.user.Professione;
    let x = {
        professione,
        data: data
      }
    res.render("userdata", {x});
    })
});

router.post("/userdata", ensureAuthenticated, (req, res) => {
    let errors = [];
  if (req.user.Professione == "Recruiter") {
        let { lavoro, azienda, descrizione } = req.body;
        if (!lavoro) {
          errors.push({ text: "Please add your Job Position" });
        }
        if (!azienda) {
          errors.push({ text: "Please add your Company" });
        }
        if (!descrizione) {
          errors.push({ text: "Please add your Description" });
        }
        if (errors.length > 0) {
            let x=req.user.Professione;
            res.render("userdata", {
              errors,
              x,
              lavoro,
              azienda,
              descrizione
            });
        } else {
            Userdata.findOne({
              where: { UTENTE_id: req.user.id }
            }).then(data => {
              if (data) {
                data.update(
                    { Azienda: azienda, Lavoro: lavoro, Descrizione: descrizione },
                    {where: { UTENTE_id: req.user.id }}
                  ) 
              } else {
                Userdata.create({UTENTE_id: req.user.id, Azienda: azienda, Lavoro: lavoro, Descrizione: descrizione });
              }
            });
            res.redirect('profile');
    }
  }

  if (req.user.Professione == "Professor") {
    let {facolta, lavoro, azienda, descrizione} = req.body;
    if (!facolta) {
      errors.push({ text: "Please add your Course of Study" });
    }
    if (!lavoro) {
      errors.push({ text: "Please add your Job Position" });
    }
    if (!azienda) {
      errors.push({ text: "Please add your Company" });
    }
    if (!descrizione) {
      errors.push({ text: "Please add your Description" });
    }
    if (errors.length > 0) {
      let x=req.user.Professione;
      res.render("userdata", {
        errors,
        x,
        facolta,
        lavoro,
        azienda,
        descrizione
      });
    } else {
      Userdata.findOne({
        where: { UTENTE_id: req.user.id }
      }).then(data => {
        if (data) {
          data.update(
            { Facolta: facolta, Descrizione : descrizione, Azienda: azienda, Lavoro: lavoro },
            { where: { UTENTE_id: id } }
          )
      } else {
        Userdata.create({ UTENTE_id: req.user.id, Facolta : facolta, Azienda: azienda, Lavoro: lavoro, Descrizione : descrizione });    
        }
      });
      res.redirect('profile');
    }
  }

  if (req.user.Professione == "Student") {
    let {facolta, descrizione} = req.body;
    if (!facolta) {
      errors.push({ text: "Please add your Course of Study" });
    }
    if (!descrizione) {
      errors.push({ text: "Please add your Description" });
    }
    if (errors.length > 0) {
      let x=req.user.Professione;
      res.render("userdata", {
        errors,
        x,
        facolta,
        descrizione
      });
    } else {
      Userdata.findOne({
        where: { UTENTE_id: req.user.id }
      }).then(data => {
        if (data) {
          data.update(
            { Facolta: facolta, Descrizione: descrizione },
            { where: { UTENTE_id: id } }
          )
      } else {
        Userdata.create({ Facolta : facolta, UTENTE_id: req.user.id, Descrizione : descrizione });
        }
      });
      res.redirect('profile');
    }
  }
});

//Homepage
router.get("/homepage", function(req, res) {
  res.render("homepage");
});

//Register
router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", (req, res) => {
  //var { nome, cognome,  email, password, password2} = req.body;
  const nome = req.body.nome;
  const cognome = req.body.cognome;
  const email = req.body.email;
  const pass = req.body.pass;
  const pass2 = req.body.pass2;
  const professione = req.body.professione;
  let errors = [];

  if (!pass) {
    errors.push({ text: "Please add a pass" });
  }
  if (!pass2) {
    errors.push({ text: "Please add a pass2" });
  }
  if (!nome) {
    errors.push({ text: "Please add a Name" });
  }
  if (!cognome) {
    errors.push({ text: "Please add a Surname" });
  }
  if (!email) {
    errors.push({ text: "Please add an email" });
  }
  if (!professione) {
    errors.push({ text: "Please add your Profession" });
  }
  if (pass != pass2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (pass.length < 6) {
    errors.push({ text: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      nome,
      cognome,
      email,
      pass,
      pass2,
      professione
    });
  } else {
    Utente.findOne({ where: { Email: { [Op.like]: "%" + email + "%" } } }).then(
      user => {
        if (user) {
          errors.push({ msg: "Email already registered" });
          res.render("register", {
            errors,
            nome,
            cognome,
            email,
            pass,
            pass2,
            professione
          });
        } else {
          //Hashing password
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(pass, salt, function(err, hash) {
              let Password = hash;
              let Nome = nome;
              let Cognome = cognome;
              let Email = email;
              let Professione = professione;
              Utente.create({
                Password,
                Nome,
                Cognome,
                Email,
                Professione
              })
                .then(Account => {
                  req.flash("success_msg", "You are now registered. LOGIN");
                  res.redirect("/users/login");
                })
                .catch(err => console.log(err));
            });
          });
        }
      }
    );
  }
});

//Login
router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/index",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//Logout
router.get("/logout", ensureAuthenticated, function(req, res, next) {
  req.logout();
  req.flash("success_msg", "LOGGED OUT");
  res.redirect("/users/login");
});

//Search 
router.get("/search", ensureAuthenticated, (req, res) => res.render("search"));
router.get("/searchres", ensureAuthenticated, (req, res) => {
  let { data, searchType } = req.query;
  if(searchType=='nome'){
  Utente.findAll({
    raw: true,
    attributes: ['id', 'Nome', 'Cognome', 'Email', 'Professione'],
    where: { Nome: { [Op.like]: "%" + data + "%" } }
  })
    .then(function(accounts) {
      res.render("account", { accounts });
    })
    .catch(err => console.log(err));
  }else {

    Skill.findAll({
      raw: true,
      where: {Nome: { [Op.like]: "%" + data + "%" }, Categoria : searchType}
     })
      .then(skills=>{
        Async.each(skills
        ,function(skill, callback){
          Utente.findOne({
            raw: true,
            where: { id: skill.idUTENTE }
          })
          .then(utente=>{
            skill.nome=utente.Nome;
            skill.cognome=utente.Cognome;
            skill.professione=utente.Professione;
            skill.email=utente.Email;
          callback();
          })
        }
        ,function(err){
          res.render('skill',{skills});
        })
        
      })
  }
  });

//Chat
router.get("/chatlist", ensureAuthenticated, (req, res) => {
  let mittente = req.user.id;
  findUsersChat(mittente).then(Chats => {
    chatlist = [];
    getChatData(Chats, mittente)
      .then(chatlist => {
        var obj = JSON.parse(chatlist);
        res.render("chatlist", { objects: obj });
      })
      .catch(err => console.log(err));
  });
});

async function findUsersChat(userid) {
  chatident = await Collegamento.findAll({
    raw: true,
    where: {
      [Op.or]: [{ Userone: userid }, { Usertwo: userid }]
    }
  })
    .then(function(idchatfound) {
      if (idchatfound) {
        return idchatfound;
      }
    })
    .catch(err => console.log(err));
  return chatident;
}

async function getChatData(chats, mittente) {
  for (let i = 0; i < chats.length; i++) {
    if (chats[i].Userone == mittente) {
      await Utente.findOne({
        raw: true,
        where: { id: chats[i].Usertwo }
      })
        .then(function(trovato) {
          chatlist.push(trovato);
        })
        .catch(err => console.log(err));
    } else {
      await Utente.findOne({
        raw: true,
        where: { id: chats[i].Userone }
      })
        .then(function(trovato) {
          chatlist.push(trovato);
        })
        .catch(err => console.log(err));
    }
  }
  jsonStr = JSON.stringify(chatlist);
  return jsonStr;
}

router.post("/chat", ensureAuthenticated, (req, res) => {
  let { destID, destName } = req.body;
  let userone = req.user.id;
  let userChat = null;
  let usertwo = parseInt(destID);
  findTwoUsersChat(userone, usertwo).then(IDchat => {
    if (IDchat) {
      getChatMessages(IDchat).then(userChat => {
        let x = {
          mittente: { nome: req.user.Nome, id: userone, collegamento: IDchat },
          destinatario: { nome: destName, id: usertwo },
          chat: userChat
        };
        res.render("chat", { x });
      });
    } else {
      Collegamento.create({
        Userone : userone,
        Usertwo : usertwo
      })
        .then(Account => {
          findTwoUsersChat(userone, usertwo).then(IDchat => {
            let x = {
              mittente: { nome: req.user.Nome, id: userone, collegamento: IDchat },
              destinatario: { nome: destName, id: usertwo },
              chat: userChat
            };
            res.render("chat", { x });
          })
        })
        .catch(err => console.log(err));
    }
  });
});

async function findTwoUsersChat(Userone, Usertwo) {
  chatident = await Collegamento.findOne({
    raw: true,
    where: {
      [Op.or]: [
        { Userone: Userone, Usertwo: Usertwo },
        { Userone: Usertwo, Usertwo: Userone }
      ]
    }
  })
    .then(chatfound => {
      if (chatfound) return chatfound.id;
      else return null;
      
    })
    .catch(err => console.log(err));
  return chatident;
}

async function getChatMessages(idchat) {
  chatMessages = await Messaggio.findAll({
    raw: true,
    where: { COLLEGAMENTO_id: idchat }
  })
    .then(function(messagesFound) {
      return messagesFound;
    })
    .catch(err => console.log(err));
  return chatMessages;
}

//Homepage
router.get("/index", ensureAuthenticated, (req, res) => {
  let jobs = null;
  let variable = [];
  Job.findAll().then(jobs => {
    Async.each(jobs, getUserInfo, renderPage);
    function getUserInfo(job, callback) {
      Utente.findOne({
        raw: true,
        attributes: ["Nome", "Cognome"],
        where: { id: job.Creatore }
      }).then(data => {
        Applier.findOne({
          where: {
            idUtente: req.user.id,
            idJob: job.id
          }
        }).then(alreadyapplied => {
          if (alreadyapplied == null) {job.alreadyapplied = false;}
          else {job.alreadyapplied = true;}
          job.Nome = data.Nome;
          job.Cognome = data.Cognome;
          variable.push(job);
          console.log(variable);
          callback();
        });
      });
    }
  });
  function renderPage() {
    let x = {
      position: variable
    };
    res.render("index", { x });
  }
});

router.get("/profile", ensureAuthenticated, (req, res) => {
  var x;
  let image = null;
  let data = null;
  let skill = null;
  glob("./public/profile/" + req.user.id + "/profile.*", (err, matches) => {
    if (err) {
      console.log(err);
    } else {
      if (matches.length == 0) {
        console.log("Image not found");
      } else {
        trovato = true;
        image = "../" + matches[0].slice(9);
      }
    }
  });
  Userdata.findOne({
    where: { UTENTE_id: req.user.id }
  }).then(data => {
    Skill.findAll({
      raw: true,
      where: { idUTENTE: req.user.id }
    }).then(skill => {
      Job.findAll({ raw: true, where: { Creatore: req.user.id } }).then(
        position => {
          x = {
            personal:{profile:true},
            utente: {
              id: req.user.id,
              nome: req.user.Nome,
              cognome: req.user.Cognome,
              email: req.user.Email,
              professione: req.user.Professione,
              Profilo: image
            },
            Skill: skill,
            Data: data,
            Position: position
          };
          res.render("profile", { x });
        }
      );
    });
  });
});

router.get("/changeprofile", ensureAuthenticated, (req, res) => {
  let x = {
    utente: {
      id: req.user.id
    }
  };
  id = x.utente.id;
  res.render("changeprofile", x);
});

router.post("/changeprofile", ensureAuthenticated, (req, res) => {
  upload(req, res, err => {
    if (err) {
      req.flash("error_msg", err);
      res.redirect("/users/changeprofile");
    } else {
      if (req.file == undefined) {
        req.flash("error_msg", "Error: No file Selected!");
        res.redirect("/users/changeprofile");
      } else {
        req.flash("success_msg", "Image uploaded");
        res.redirect("/users/changeprofile");
        var path = "./public/profile/" + id;
        if (fsextra.existsSync(path)) {
          fsextra.removeSync(path);
        }
        if (err) console.log(err);
        else console.log("Deleted old folder");
        glob("./public/uploads/profile.*", (err, matches) => {
          if (err) console.log(err);
          else {
            console.log("renaming folder...");
            fs.renameSync("./public/uploads", "./public/profile/" + id);
            if (err) console.log(err);
            else {
              fs.mkdir("./public/uploads", err => {
                if (err) console.log(err);
                else
                  console.log(
                    "------------------FOLDER RECREATED---------------------------"
                  );
              });
            }
          }
        });
      }
    }
  });
});

router.post("/guestprofile", ensureAuthenticated, (req, res) => {

  let {id} = req.body;

  if(parseInt(id)===req.user.id){
    res.redirect("profile");
  }else{
    let x;
    let { nome, cognome, professione, email } = req.body;
    let image = null;
    let data = null;
    let skill = null;
    glob("./public/profile/" + id + "/profile.*", (err, matches) => {
      if (err) {
        console.log(err);
      } else {
        if (matches.length == 0) {
          console.log("Image not found");
        } else {
          trovato = true;
          image = "../" + matches[0].slice(9);
        }
      }
    });
    Userdata.findOne({
      where: { UTENTE_id: id }
    }).then(data => {
      Skill.findAll({
        raw: true,
        where: { idUTENTE: id }
      }).then(skill => {
        Job.findAll({
          raw: true,
          where: { Creatore: id }
        }).then(job => {
          for (let i = 0; i < job.length; i++) {
            Applier.findOne({
              where: {
                idUtente: req.user.id,
                idJob: job[i].id
              }
            }).then(alreadyapplied => {
              if (alreadyapplied == null) job[i].alreadyapplied = false;
              else job[i].alreadyapplied = true;
            });
          }
          x = {
            personal: {
              profile: false
            },
            utente: {
              id: id,
              nome: nome,
              cognome: cognome,
              email: email,
              professione: professione,
              Profilo: image
            },
            Data: data,
            Skill: skill,
            Position: job
          };
          res.render("guestprofile", { x });
        });
      });
    });
  }
});

router.post("/skill", (req, res) => {
  let { Nome, Categoria } = req.body;
  let idUTENTE = req.user.id;
  Skill.create({
    Nome,
    Categoria,
    idUTENTE
  });
  res.redirect("profile");
});

router.post("/newjob", (req, res) => {
  let { Titolo, Luogo, Informazioni } = req.body;
  let Creatore = req.user.id;
  Job.create({
    Titolo,
    Informazioni,
    Luogo,
    Creatore
  });
  res.redirect("profile");
});

router.post("/applynow", (req, res) => {
  let idUtente = req.user.id;
  let { idJob } = req.body;
  Applier.findOne({
    where: { idUtente: idUtente, idJob: idJob }
  }).then(application => {
    if (application == null) {
      Applier.create({
        idUtente,
        idJob
      });
    }
    res.redirect("index");
  });
});

module.exports = router;
