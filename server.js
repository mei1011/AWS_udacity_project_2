import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import { query, validationResult } from 'express-validator';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Get and delete image
  app.get( "/filteredimage", query('image_url').notEmpty().isURL({protocols: ['http','https','ftp']}), ( req, res ) => {
    const checkUrl = validationResult(req);
    if (checkUrl.errors.length > 0) {
      return res.status(400).send(`${checkUrl.errors[0].msg}`);
    }

    // filter image from URL
    filterImageFromURL(req.query.image_url).then((resolve) => {
      return res.status(200).sendFile(resolve)
    }).catch((error) => {
      console.log(error);
      return res.status(500).send(`${error}` )
    }).finally((resolve) => {
      if (resolve) {
        // delete image in local file
        deleteLocalFiles([resolve]);
      }
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", ( req, res ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
