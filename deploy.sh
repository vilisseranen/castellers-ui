#!/bin/bash

# Deploy on server
scp -r -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -P 274 dist/* travis-deploy@clemissa.info:/var/www/castellers-ui/
