# Sprint Reflection 2

**Project:** Tennis Tournament Manager  
**Author:** Maxwell Hay (solo project)

## Review of Set Sprint Goals

The goals I set for this sprint were:

- Integrate tournament API calls with the database
- Add player management for each bracket in a tournament
- Begin developing the main tournament management page

I completed all of my set goals and went slightly further to meet assignments in class.  
Currently, the project has the following:

- NGINX reverse proxy with SSL certificates
- NodeJS-hosted server
- A NestDB database with each tournament as a document
- Basic welcome homepage and about page on frontend
- Tournament creation and selection forms demonstrating POST and GET requests, respectively
    - These requests now interact with the database to manage tournament documents
- Player addition/removal form for each tournament bracket showing UPDATE and DELETE requests, respectively
    - I intend to refactor this form to be more user friendly

## Link to Deployed Application

The project can be visited at the domain: [https://maxwellhay.com](https://maxwellhay.com)

The new features have been added mainly under the `/manage-tournament` route. You will need to select a tournament from the selection/creation page to access the management page.

## Goals for Next Sprint

For this next sprint of the project, I hope to implement the following:

- Login system for users to manage their tournaments
- Generate matches for each bracket in a tournament
    - I will likely focus only on generating the matches and not displaying them in a bracket format
- Refactor the player management form to be more user friendly
- Add capability to remove tournaments from the database
