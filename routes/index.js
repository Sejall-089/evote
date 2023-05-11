var express = require('express');
const pool = require('./pool');
var router = express.Router();

router.post('/vote',function(req,res){

  if(req.session.username)
  {
      var arr = req.body.votelist.split('#')
      var partyid = arr[0]
      var partyname = arr[1]
      var candidatename = arr[2]
      var voterid = arr[3]
      var votername = arr[4]
      pool.query('insert into evote.votinglist (voterid,votername,votedpartyname,votedcandidatename) values(?,?,?,?)',[voterid,votername,partyname,candidatename],function(error,result){
        if(error)
        {
            console.log(error);
            req.session.destroy();
            res.redirect('/')
        }
        else
        {
          req.session.destroy();
          res.redirect('/')
        }
  })
  }
  else
  {

  }
})


router.post('/checkuser',function(req,res){
  pool.query('select * from evote.votinglist where votername=?',[req.body.username],function(error,result){
    if(error)
    {
        console.log(error);
    }
    else
    {
        if(result.length>0)
          res.render('index',{msg:'already voted'})
         else
        {
          pool.query('select * from evote.user where username=?',[req.body.username],function(error,result){
            if(error)
            {
              console.log(error);
            }
            else
            {
               req.session.userid =  req.body.userid
               req.session.username = result[0].username
               if(result[0].userpassword==req.body.userpassword)
                res.redirect('/evm')
               else 
                res.render('index',{msg:'error'}) 
            }
          })
        }   
    }
  })
})

router.get('/evm',function(req,res){
  if(req.session.username)
    {
        pool.query('select * from evote.partylist',function(error,result){
          if(error)
          {
             console.log(error);
          }
          else
          {
              res.render('evm',{data:result,voterid:req.session.userid,votername:req.session.username})
          }
        })
    }
  else
    res.redirect('/')  
})

router.get('/logout',function(req,res){
  req.session.destroy()
  res.redirect('/')
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',msg:''});
});

module.exports = router;
