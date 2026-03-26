# Sprint Reflection 3

**Project:** Tennis Tournament Manager  
**Author:** Maxwell Hay (solo project)

## Review of Set Sprint Goals

The goals I set for this sprint were:

- Create a login system for users to manage their tournaments
- Refactor the player management UI to be more user friendly
- Add the capability to manage tournaments including deletion
- If there was time, generate match structure for each bracket

I completed most of my set goals but was not able to complete match structure generation.  
Currently, the project has the following:

- NGINX reverse proxy with SSL certificates
- NodeJS-hosted server
- A NestDB database with each tournament as a document
- Basic welcome homepage and about page on frontend
- Login page before being able to select any tournaments
- Tournament creation and selection forms demonstrating POST and GET requests, respectively
- Tournament management UI for renaming or deleting tournament
- Player addition/removal form for each tournament bracket showing UPDATE and DELETE requests, respectively
  - Upgraded UI to be more intuitive to remove players

## Link to Deployed Application

The project can be visited at the domain: [https://maxwellhay.com](https://maxwellhay.com)

The new features have been added mainly under the `/manage-tournament` route and in the page header. You will need to select a tournament from the selection/creation page to access the management page.

## Goals for Next Sprint

For this next sprint of the project, I hope to implement the following:

- Generate matches for each bracket
- Displaying matches for each bracket
- Score entry and automatic winner decider if there is time