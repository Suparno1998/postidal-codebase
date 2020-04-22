const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const fs = require('fs');
const { isEmpty } = require('../../helpers/upload-helper');
const {userAuthenticated} = require('../../helpers/authentication')


router.all('/*', userAuthenticated,(req,res,next)=>{
	req.app.locals.layout = 'admin';
	next();
});

router.get('/',(req,res)=>{
	Post.find({})
	.populate('Category')
	.then(posts=>{
		res.render('admin/posts/index',{posts:posts});
	});
});

router.get('/create',(req,res)=>{
	Category.find({}).then(categories => {
		res.render('admin/posts/create',{categories: categories});
	});
});

 
router.get('/my-posts', (req, res)=>{
    Post.find({user: req.user.id})
        .populate('Category')
        .then(posts=>{
            res.render('admin/posts/my-posts', {posts: posts});
        });
});


router.post('/create',(req,res)=>{

	let filename = 'Koala.jpg';

	if(!isEmpty(req.files)){
		let file = req.files.file;
		filename = Date.now()+'-'+file.name;
		file.mv('./public/uploads/'+filename,(err)=>{
			if(err) throw err;
		});
		console.log('not empty');
	}
	else{
		console.log('empty');
	}

	let allowComments = true;
	if(req.body.allowComments){
		allowComments = true;
	}else{
		allowComments = false;
	}

	const post = new Post({
		user:req.user.id,
		title: req.body.title,
		status: req.body.status,
		allowComments: allowComments,
		Category: req.body.category,
		body: req.body.body,
		file:filename
	});
	post.save().then(savedPost=>{		
		req.flash('success_message', `Post ${savedPost.title} was CREATED succesfully`);	
		res.redirect('/admin/posts/my-posts');

	});	
});

router.get('/edit/:id',(req,res) =>{
	Post.findOne({_id:req.params.id}).then(post=>{
		Category.find({}).then(categories => {
			res.render('admin/posts/edit',{post:post, categories: categories});
		});
	});
});

router.put('/edit/:id',(req,res) =>{
	Post.findOne({_id:req.params.id}).then(post=>{
		let allowComments = true;
			if(req.body.allowComments){
				allowComments = true;
			}else{
				allowComments = false;
			}
		post.user = req.user.id;
		post.title = req.body.title;
		post.status = req.body.status;
		post.allowComments = allowComments;
		post.Category = req.body.category;
		post.body = req.body.body;

		if(!isEmpty(req.files)){
			let file = req.files.file;
			filename = Date.now()+'-'+file.name;
			post.file = filename;
			file.mv('./public/uploads/'+filename,(err)=>{
				if(err) throw err;
			});
			console.log('not empty');
		}
		else{
			console.log('empty');
		}

		post.save().then(savedPost=>{
			if(savedPost){
				req.flash('success_message', `Post ${savedPost.title} was UPDATED succesfully`);
				res.redirect('/admin/posts/my-posts');
			}
		});		
	});
});

router.delete('/:id', (req, res)=>{

    Post.findOne({_id: req.params.id})
        .populate('comments')
        .then(post =>{ 
            fs.unlink('./public/uploads/' + post.file, (err)=>{

                if(!post.comments.length < 1){
                      post.comments.forEach(comment=>{
                      comment.remove();
                   });
                }
                post.remove().then(postRemoved=>{
                    req.flash('success_message', 'Post was successfully deleted');
                    res.redirect('/admin/posts/my-posts');
                });
            });
     });
});

module.exports = router;                               