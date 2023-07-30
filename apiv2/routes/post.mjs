
import express from 'express';
import { nanoid } from 'nanoid'
let router = express.Router()

// not recommended at all - server should be stateless
let posts = [
    {
        id: nanoid(),
        title: "Java Script",
        text: "By Sir Inzamam Malik"
    }
]

// POST    /api/v2/post
router.post('/post', (req, res, next) => {
    console.log('this is signup!', new Date());

    if (
        !req.body.title
        || !req.body.text
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }

    posts.push({
        id: nanoid(),
        title: req.body.title,
        text: req.body.text,
    })

    res.send('post created');
})
// GET     /api/v2/posts
router.get('/posts', (req, res, next) => {
    console.log('this is signup!', new Date());
    res.send(posts);
})

// GET     /api/v2/post/:postId
router.get('/post/:postId', (req, res, next) => {
    console.log('this is signup!', new Date());

    if (isNaN(req.params.postId)) {
        res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
    }

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === Number(req.params.postId)) {
            res.send(posts[i]);
            return;
        }
    }
    res.send('post not found with id ' + req.params.postId);
})

// PUT     /api/v2/post/:userId/:postId
router.put('/post/edit/:postId', (req, res, next) => {
    console.log('this is edit!', new Date());
    if (
        (req.body.title.trim().length == 0) || (req.body.text.trim().length == 0) ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }
    posts.forEach(post => {

        if(post.id === req.params.postId){
            post.title = req.body.title;
            post.text = req.body.text;
            
            return
        }
    
    });

    res.send('post created');
})
// DELETE  /api/v2/post/:userId/:postId
router.delete('/post/delete/:postId', (req, res, next) => {
    console.log('this is delete!', new Date());

    posts.forEach((post, index) => {

        if (post.id === req.params.postId) {

            posts.splice(index, 1);

            return

        }

    })

    
    res.send('deleted successfully');
})

export default router