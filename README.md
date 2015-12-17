# DecodedEpisode2

In decoded episode 2, we aim to show you a recipe that allows you to quickly get started with server side code. We'll take you on the journey from a simple purely client-side application to a server-driven application that collates information from multiple data sources. Let's get started!

You can see the current master of this sample live [here](http://decodedepisode2.azurewebsites.net). The site is linked up to this GitHub and is continuously deploying new builds every time a push is made. Pretty cool!

# How this repo works:#

This repo is set up using git tags to allow you to see each stage of development as we go along. Just check out the commit associated with each tag and you can see the app evolve as we go! If you're browsing on GitHub, you can check out each tag with the branch/tag dropdown on the top left. If you're viewing the repo locally, just use "git tag" to see all of the tags.

# Prerequisites:

You will need [node](http://www.nodejs.org "node") and an editor of your choice to view and edit code. I personally like [Visual Studio Code](https://code.visualstudio.com/), but use what's most comfortable for you.

This sample includes both TypeScript and the compiled JavaScript, so you can follow along either way. If you want to follow along with TypeScript, I highly recommend using typings to give your editor and compiler knowledge of the packages we'll be using in this sample.

The easiest way to pull typings into your project is with tsd, a tool that searches the DefinitelyTyped repository of typings and pulls them into your project. 

You can install tsd by typing:

	npm install tsd -g

Note the -g tag, which installs packages globally. You want to do this because your project doesn't specifically use tsd. It's just a package that you're using to make yourself a more productive programmer.

I've included the tsd.json that's relevant at each tag, so you can just run

	tsd install

and you will automatically download the relevant typings. If you're starting your own project, you'll instead want to run

	tsd init

which will create a new tsd.json and a blank tsd.d.ts (typing file) for you to get started.

## Part 1 - Good old HTML:  ##

Our solution starts with the "part1" tag on the repo. In this commit, we have some HTML, Bootstrap to help us out with styling, and some TypeScript for our client that populates the view with fake data. It's not really an application - yet. In order to make this real, we need to get some real data.

**Key technologies:**

- HTML
- TypeScript
- Bootstrap

## Part 2 - Adding in the server: ##

Setting up a server can seem intimidating. To show just how easy it is to get started with npm and node, we've split this section into two parts.

## Part 2A - Server "Hello World"

To get started with a server in node, you need to follow just a few steps:

    npm init

This sets up your package.json, which keeps track of your entry point and what packages you install from npm.

Next, you just need to create a simple TypeScript or JavaScript file - I made one called server.ts. We could build an API with pure javascript in node, but there are a lot of packages that make it much easier available on npm. Let's grab one now.

	npm install restify --save

Note the --save flag - this ensures that an entry is put into my package.json file so that anyone else who wants to run my application knows what packages I used and can install all of them with a simple "npm install".

If you're following along with TypeScript, be sure to install the typing, too!

	tsd install restify --save

Now that I have restify, I can whip up a simple server. After I write my TypeScript, I fire off a build process (either with the tooling built into Visual Studio Code or manually with tsc) and create a JavaScript file that node understands. Let's start the server. Navigate to the folder where your code lives and type:

	node server.js 

Try firing up your browser and hitting the endpoint at http://localhost:3000/hello - you should see a JSON object. We have a working server!

**Key technologies:**

- Node
- npm
- Restify

## Part 2B - Getting some REST: ##

Now that we have a working server, we can create a functional backend for the client that we made in Part 1. I happen to know about a list of the most starred packages on NPM on github - that would be a lot more interesting to see than "package1", "package2", etc. Let's pull that in and serve it up to our client.

Node does have native capabilities to make requests to other servers, but it can be a little verbose. Fortunately, the request library is here to save the day.

	npm install request --save

And if you're using TypeScript, you'll also want to pull in the typings for this library:

	tsd install request --save

Now we can just make a simple request to the repos URL, massage the data a bit, and send that data back to our client.

Now that we have real repos, wouldn't it be cool if we could pull in real contributors, too? We have a list of the top packages on npm, but we don't know much else about them. To get at it, we need to query the npm registry. While we could use the request API to query the registry, that would mean trawling through the NPM Registry docs to figure out exactly which endpoints we need to hit to get the data we want - not the most fun. Fortunately for us, there's a package on npm that allows you to query the npm registry directly!

	npm install npm-registry --save

For those of you following along with TypeScript, you may be expecting a tsd install to come next. Instead, let's try this:

	tsd query npm-registry

You'll see: Zero Results. What does that mean? Well, it just means there aren't any typings registered for that project. While it would be nice to have typings for that package, we can do without them (or you could make some typings for the project yourself, but we'll leave that for another day).

Using the npm registry, we're able to figure out the GitHub repository where the npm package sits and who owns it. Now we need to query the GitHub API to figure out the contributors to this repository so we know who to thank for all these cool tools! Again, we could use request to manually craft API calls, but again, npm comes to the rescue.

	npm install github --save

No typings for this one, either, my TypeScript friends.

Using the GitHub API, we're able to easily query for the top collaborators for this library and send those back to the client for display.

**Key technologies:**

- npm
- request package on npm
- npm-registry package on npm
- github package on npm

## Part 3 - Persistence

Now it's time to add persistence to the mix, courtesy of [MongoLabs](https://mongolab.com/) and [Microsoft Azure](https://azure.microsoft.com/). Now you can favorite a repo and have that preference persist across sessions! To do that, we pull in another package from npm ("mongodb") and used that to do some simple persistence to our free Mongo server.

	npm install mongodb --save

And yes, there are typings!

	tsd install mongodb --save

**Key technologies:**

- npm
- mongodb package on npm
- MongoLabs
- Microsoft Azure

## Part 4 - Authentication and Identity

Now we want to add in authentication to our application and ensure that your favorites are visible to you and you alone. To do that, we utilize the Open Source [KurveJS](https://github.com/MicrosoftDX/kurvejs) library to connect to Azure Active Directory. We also incorporate the user ID and client ID into the MongoDB documents to ensure that when we pull in a user, we only pull in favorites associated with that user.

**Key technologies:**

- KurveJS
- Azure Active Directory