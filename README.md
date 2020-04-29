# Digg-Scraper

Digg Scraper is an Node.js based application that pulls article info from http://www.digg.com and displays it in a simple card format. It also allows users to save articles and comments on them to a Mongo database.

## Deployment
You can view Digg Scraper by [Clicking Here](https://digg-scraper.herokuapp.com/)

## Overview

The view of the page is related to it's database. So visiting the application can display either two things.

- Previous articles scraped from another user

- A cleared page with no articles shown

Either way, if articles are scraped, users have the option to save them to a separate database for viewing at a later time. Once saved the user has the option to delete them as well.

Users also have the option to create notes (header and body) for each saved article. Once created, these notes are saved to a separate database for viewing in their own modal popup. Also in this modal popup is the option to delete individual notes.

