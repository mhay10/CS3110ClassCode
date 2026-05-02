# Sprint Reflection 5

**Project:** Tennis Tournament Manager
**Author:** Maxwell Hay (solo project)

## Review of Set Sprint Goals

The goals I set for this sprint were:

- Create a bracket UI with score entry
- Implement automatic win detection when scores are entered

I completed the bracket UI with score entry portion and decided not to implement automatic win detection due to the numerous different scoring systems that tennis can use.  
Instead, the tournament manager manually selects the winner of each match using a checkbox.  
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
    - A notification is also sent on the update to users
- Bracket UI with score entry and winner selection

## Link to Deployed Application

The project can be visited at the domain: [https://maxwellhay.com](https://maxwellhay.com)

A new header tab called "Tournaments" has been added for easier access to a user's tournamets. The new management features have been added under the `/manage-tournament` route, in the _Manage Brackets_ tab. You will need to select a tournament from the selection/creation page to access the management page.

## Goals for Next Sprint

For this next sprint I hope to implement:

- Fix a bug where viewing brackets occaisionally stop the page responsiveness
- Add a simple match scheduling system
