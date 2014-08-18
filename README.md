#Six Degrees of Wikipedia
===========
## Goals
Wikipedia holds all the information in the history of ever.  Hypermedia connects all the pages.  But how is it all connected?

This project takes in a wikipedia page, find all the pages that link to it, all the pages that link to those, etc., then displays it all out to the user so we can see just how interesting the world really is.

I am using this project as a testbed to work with D3 transitions, socket.io and continue practicing with Node.

## New Dev Setup
1. `git pull` this repo.  I use [a common git strategy](http://nvie.com/posts/a-successful-git-branching-model/) so the master branch will be my latest stable release
1. Ensure you have [node](http://nodejs.org/), [npm](https://www.npmjs.org/), and [redis](redis.io/) installed.
1. run `npm install` to manage/install your dependencies.
1. `cd wikipedia_test && node server.js` and *you're good to go!* 