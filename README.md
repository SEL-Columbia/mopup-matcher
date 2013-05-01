# Nigeria Baseline Mopup Assistant
This tool is designed to assist the data clean up effort for the Nigeria TAs. 

# Deployment
Mongo should be running, with the appropriate data (in the right data structure). @modilabs team members should have a dump as necessary.

Otherwise, install node (http://nodejs.org), and then:

    git clone [URL]
    cd mopup-seed
    npm install
    node .

This will run the mopup app on port 3000. You can also use `node server.js`. Then, browse to something like:

    http://localhost:3000/500/health 

You can replace the 500 with another lga_id.

To run the tests

- You must have karma installed globally in your node installation

    $ npm install -g karma

- Unit tests

    $ karma start test/config/unit.conf.js

- End to end tests

    $ karma start test/config/e2e.conf.js
