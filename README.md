# Scraped

## Description

Create an app that accomplishes the following:

Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:

Headline - the title of the article

Summary - a short summary of the article

URL - the url to the original article

Feel free to add more content to your database (photos, by lines, and so on).

Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

Using Mongo / Mongoose:

Overview

In the late 90s and early 2000s, developers began to explore database options that allowed their web applications to handle unstructured data to meet the growing and ever-changing demands of users and address the limitations of the relational model. While these alternative databases existed for decades prior, they didn’t receive the label NoSQL until this time period.

The structure of a NoSQL database is something other than a table. There are several different types of NoSQL databases, such as key-value and graph. In this unit I learned MongoDB, a document-oriented NoSQL database. MongoDB documents correspond to a row, or record, in SQL, but unlike rows, documents are analogous to JSON objects. I can see why MongoDB is a popular choice for Node.js developers!

Rather than object-relational mapping, we will implement object-document mapping, or ODM, with Mongoose.js.

Key Topics
NoSQL
MongoDB
Object-document mapping
Mongoose.js
CRUD

All The News That's Fit To Scrape
In this assignment, I will create a web app that lets users view and leave comments on the latest news. But I'm not going to actually write any articles; instead, I will flex my Mongoose and Cheerio muscles to scrape news from another site.

Helpful Links:

NoSQL
MongoDB Website
Robo 3T Website
MongoJS Documentation
Mongoose Documentation
