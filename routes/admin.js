var express = require('express');
const pool = require('./pool');
var router = express.Router();
const nodemailer = require("nodemailer");

/* GET users listing. */
router.get('/getcandidates', function (req, res) {
    if (req.session.adminid) {
        pool.query('select * from evote.partylist', function (error, result) {
            if (error) {
                console.log(error);
                res.status(500).json([])
            } else {

                res.status(200).json(result)
            }
        })
    } else
        res.redirect('/')
})

router.post('/addpartycandidate', function (req, res) {
    if (req.session.adminid) {
        console.log(req.body);
        pool.query('insert into evote.partylist (partyid,partyname,candidatename) values(?,?,?)', [req.body.partyid, req.body.partyname, req.body.candidatename], function (error, result) {
            if (error) {
                console.log(error);
            } else {
                res.render('addpartycandidate', {
                    msg: 'party added Successfully'
                })
            }
        })
    } else
        res.redirect('/')
})

router.get('/getusers', function (req, res) {
    if (req.session.adminid) {
        pool.query('select * from evote.user', function (error, result) {
            if (error) {
                console.log(error);
                res.status(500).json([])
            } else {
                res.status(200).json(result)
            }
        })
    } else
        res.redirect('/')
})

router.post('/adduser', function (req, res) {
    console.log(req.body);
    if (req.session.adminid) {
        console.log(req.body);
        pool.query('insert into evote.user (userpassword,useraddress,username,userage) values(?,?,?,?)', [req.body.adminpassword, req.body.useraddress, req.body.username, req.body.userage], function (error, result) {
            if (error) {
                console.log("error");
                console.log(error);
            } else {
                async function main() {
                    // Generate test SMTP service account from ethereal.email
                    

                    // create reusable transporter object using the default SMTP transport
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        auth: {
                            user: 'naveenmittal590@gmail.com',
                            pass: 'dgttsdheuozkshso'
                        }
                    });

                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                        from: 'naveenmittal590@gmail.com', // sender address
                        to: `${req.body.username}`, // list of receivers
                        subject: "Your Voting Id", // Subject line
                        // text: "Hello world?", // plain text body
                        html: `<p>Hello ${req.body.username}</p>
                            <br>
                            Your Voter password:${req.body.confirmpassword}
                        `, // html body
                    });

                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

                }
                main().catch(console.error);


                res.render('adduser', {
                    msg: 'user added Successfully'
                })
            }
        })
    } else
        res.redirect('/')
})


router.post('/checkadmin', function (req, res) {
    pool.query('select * from evote.admin where adminid=?', [req.body.adminemail], function (error, result) {
        if (error) {
            console.log(error);
            res.redirect('/admin/adminlogin')
        } else {
            if (result.length == 1 && result[0].adminpassowrd == req.body.adminpassowrd) {
                req.session.adminid = req.body.adminemail
                res.redirect('/admin/admindashboard')
            } else {
                res.render('adminlogin', {
                    msg: 'error'
                })
            }

            res.render('adminlogin', {
                msg: ''
            })
        }
    })
})

router.get('/getvotingstatus', function (req, res) {
    if (req.session.adminid) {
        pool.query('SELECT votedpartyname,count(voterid) as votes FROM evote.votinglist group by votedpartyname;', function (error, result) {
            if (error) {
                console.log(error);

                res.status(500).json([])
            } else {
                res.status(200).json(result)
            }

        })
    } else
        res.redirect('/')
})

router.get('/showaddpartycandidate', function (req, res) {
    if (req.session.adminid)
        res.render('addpartycandidate', {
            msg: ''
        })
    else
        res.redirect('/')
})

router.get('/showadduser', function (req, res) {
    if (req.session.adminid)
        res.render('adduser', {
            msg: ''
        })
    else
        res.redirect('/')
})


router.get('/admindashboard', function (req, res) {
    if (req.session.adminid)
        res.render('admindashboard', {
            adminemail: req.session.adminemail
        })
    else
        res.redirect('/')
})

router.get('/adminlogout', function (req, res) {
    req.session.destroy()
    res.redirect('/')
})

router.get('/adminlogin', function (req, res, next) {
    res.render('adminlogin', {
        msg: ''
    })
});

module.exports = router;