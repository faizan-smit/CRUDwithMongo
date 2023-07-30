
import express from 'express';
import { nanoid } from 'nanoid'
import {client} from './../../mongodb.mjs'
let router = express.Router();
const dbName = "CRUD-DB";
const db = client.db(dbName);
const col = db.collection("posts");

// not recommended at all - server should be stateless
let posts = [
    {
        id: nanoid(),
        title: "express()",
        text: "By Sir Inzamam Malik"
    }
]

// POST    /api/v1/post
router.post('/post', async (req, res, next) => {
    console.log('This is create post request', new Date());

    if (
        (req.body.title.trim().length == 0) || (req.body.text.trim().length == 0)
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

    // posts.push({
    //     id: nanoid(),
    //     title: req.body.title,
    //     text: req.body.text,
    // })

    try{
                await client.connect();
                console.log("Connected to Atlas");
                let personDocument = {

                    id: nanoid(),
                    title: req.body.title,
                    text: req.body.text,

                };

                const p = await col.insertOne(personDocument);

                res.send('Post created');

                await client.close();
                console.log("Disconnected Atlas");


        }


        catch{

            console.log('Error in posting');
            
             }
})
// GET     /api/v1/posts
router.get('/posts', async(req, res, next) => {
    console.log('This is all posts request!', new Date());
    // res.send(posts);
    try {
            await client.connect();
            console.log("Connected to Atlas");
            const cursor = col.find({});
            let results = await cursor.toArray()
            console.log("results: ", results);
            res.send(results);
            await client.close();
            console.log("Disconnected Atlas");
    }
    catch{

        console.log('Error in posting');
        
         }
})

// GET     /api/v1/post/:postId
router.get('/post/:postId', (req, res, next) => {
    console.log('this is specific post request!', new Date());

    if (!req.params.postId) {
        res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
    }

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === req.params.postId) {
            res.send(posts[i]);
            return;
        }
    }
    res.send('Post not found with ID ' + req.params.postId);
})

// PUT     /api/v1/post/:userId/:postId
router.put('/post/edit/:postId', (req, res, next) => {
    console.log('This is edit! request', new Date());
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

    res.send('Post Edited successfully');
})
// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/delete/:postId', (req, res, next) => {
    console.log('This is delete! request', new Date());

    posts.forEach((post, index) => {

        if (post.id === req.params.postId) {

            posts.splice(index, 1);

            return

        }

    })

    
    res.send('Post deleted successfully');
})

export default router