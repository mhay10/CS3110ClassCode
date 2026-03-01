# Sprint Reflection - 2/28/2025

**Project:** Tennis Tournament Manager
**Author:** Maxwell Hay

## Review of Set Sprint Goals

The goals I set for this sprint were:

- Get a simple NodeJS server
- Design a MongoDB scheme for the data
- Create a basic welcome homepage on the frontend

I completed all of my set goals and went a little further to meet assignments in class.
Currently the project has the following:

- NGINX reverse proxy with SSL certificates
- NodeJS hosted server
- A MongoDB-style schema
  - **NOTE:** I decided to use a local database version called [NestDB](https://github.com/JamesMGreene/nestdb) in an attempt to simplify things.
- Basic welcome homepage and about page on frontend
- Tournament creation and selection forms demonstrating POST and GET requests respectively
  - **NOTE:** Currently these requests do not interact with the database and only send text-based responses

## Link to Deployed Application

The project can be visited at the domain: [maxwellhay.com](maxwellhay.com) I have configured NGINX to serve the main project by default. However, if you wish to view assignments, you can go to `maxwellhay.com/assignment<number>/` as long as the folder exists in this repo.

**NOTE:** I have merged as many assignments into the semester project.

## Goals for Next Sprint

For this next sprint of the project, I hope to implement the following:

- Integration of tournament selection API calls with database
- Player addition/management for each bracket in a tournament
- Beginning of a main tournament management page
