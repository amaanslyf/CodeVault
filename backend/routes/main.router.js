const express = require('express'); 
const userRouter=require('./user.router'); 
const repoRouter=require('./repo.router');
const issueRouter=require('./issue.router'); 


const mainRouter=express.Router(); 

mainRouter.use(userRouter); // Use the userRouter for user-related routes
mainRouter.use(repoRouter); // Use the repoRouter for repository-related routes
mainRouter.use(issueRouter); // Use the issueRouter for issue-related routes    



mainRouter.get('/', (req, res) => {
        res.send('Welcome to CodeVault API'); // server test
    });


    module.exports = mainRouter; 