# Sprint Reflection 4

**Project:** Tennis Tournament Manager  
**Author:** Maxwell Hay (solo project)

## Review of Set Sprint Goals

The goals I set for this sprint were:

- Generate matches for each bracket
- Display matches for each bracket
- Create bracket UI with automatic win detection if there was time

I completed most of my set goals but was not able to fully create a bracket UI with win detection.  
Currently, the project has the following:

- NGINX reverse proxy with SSL certificates
- NodeJS-hosted server
- A NestDB database with each tournament as a document
- Basic welcome homepage and about page on frontend
- Login page before being able to select any tournaments
- Tournament creation and selection forms demonstrating POST and GET requests, respectively
- Tournament management UI for renaming or deleting tournament
- Player addition/removal form for each tournament bracket showing UPDATE and DELETE requests, respectively
- Guest View page for non-admin users to see bracket scores
- Automatic refreshing when an admin makes updates to the tournament
  - This includes when it was last updated and by which user
- JSON view of each bracket matches
  - This will be where the bracket UI eventually goes

## Link to Deployed Application

The project can be visited at the domain: [https://maxwellhay.com](https://maxwellhay.com)

A new header tab called "Guest View" has been added for regular users to view brackets. The new management features have been added under the `/manage-tournament` route. You will need to select a tournament from the selection/creation page to access the management page.

## Goals for Next Sprint

For this next sprint of the project, I hope to implement:

- A simple score entry UI in a bracket format
- Automatic win detection once scores have been entered
