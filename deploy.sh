#!/bin/bash

# Deploy on server
scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no travis-deploy@clemissa.info -P 274 dist/* /var/www/castellers-ui/